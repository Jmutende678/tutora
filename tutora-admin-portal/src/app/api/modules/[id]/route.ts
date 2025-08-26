import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// GET module by ID
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const supabase = createRouteHandlerClient({ cookies });

        // Get user session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const moduleId = params.id;

        // Get module with sections and user data
        const { data: module, error: moduleError } = await supabase
            .from('modules')
            .select(`
        *,
        module_sections(
          id,
          type,
          title,
          order_index,
          content,
          settings,
          is_ai_generated,
          is_required,
          created_at,
          updated_at,
          quiz_questions(
            id,
            type,
            question,
            order_index,
            options,
            correct_answer,
            explanation,
            points,
            is_required,
            is_ai_generated
          )
        ),
        users!modules_created_by_fkey(
          id,
          name,
          email
        ),
        module_assignments(
          id,
          user_id,
          status,
          progress,
          assigned_at,
          completed_at,
          users(name, email)
        )
      `)
            .eq('id', moduleId)
            .single();

        if (moduleError || !module) {
            return NextResponse.json({ error: 'Module not found' }, { status: 404 });
        }

        // Check user permissions
        const { data: userData } = await supabase
            .from('users')
            .select('role, company_id')
            .eq('id', session.user.id)
            .single();

        if (!userData) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Check if user can access this module
        if (userData.company_id !== module.company_id && userData.role !== 'super_admin') {
            return NextResponse.json({ error: 'Access denied' }, { status: 403 });
        }

        return NextResponse.json({ success: true, module });

    } catch (error) {
        console.error('Error fetching module:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// UPDATE module
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const supabase = createRouteHandlerClient({ cookies });

        // Get user session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const moduleId = params.id;
        const body = await request.json();

        // Get existing module to check permissions
        const { data: existingModule, error: fetchError } = await supabase
            .from('modules')
            .select('company_id, created_by')
            .eq('id', moduleId)
            .single();

        if (fetchError || !existingModule) {
            return NextResponse.json({ error: 'Module not found' }, { status: 404 });
        }

        // Check user permissions
        const { data: userData } = await supabase
            .from('users')
            .select('role, company_id')
            .eq('id', session.user.id)
            .single();

        if (!userData) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Check if user can edit this module
        const canEdit = userData.role === 'super_admin' ||
            (userData.company_id === existingModule.company_id &&
                ['manager', 'admin'].includes(userData.role));

        if (!canEdit) {
            return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
        }

        // Prepare update data
        const updateData = {
            ...body,
            updated_at: new Date().toISOString()
        };

        // Remove read-only fields
        delete updateData.id;
        delete updateData.created_at;
        delete updateData.created_by;
        delete updateData.company_id;

        // Update module
        const { data: updatedModule, error: updateError } = await supabase
            .from('modules')
            .update(updateData)
            .eq('id', moduleId)
            .select('*')
            .single();

        if (updateError) {
            console.error('Error updating module:', updateError);
            return NextResponse.json({ error: 'Failed to update module' }, { status: 500 });
        }

        // Log activity
        await supabase.from('activity_logs').insert({
            company_id: existingModule.company_id,
            user_id: session.user.id,
            action: 'module_updated',
            resource_type: 'module',
            resource_id: moduleId,
            details: {
                title: updatedModule.title,
                changes: Object.keys(body)
            }
        });

        return NextResponse.json({ success: true, module: updatedModule });

    } catch (error) {
        console.error('Error updating module:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// DELETE module
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const supabase = createRouteHandlerClient({ cookies });

        // Get user session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const moduleId = params.id;

        // Get existing module to check permissions
        const { data: existingModule, error: fetchError } = await supabase
            .from('modules')
            .select('company_id, created_by, title')
            .eq('id', moduleId)
            .single();

        if (fetchError || !existingModule) {
            return NextResponse.json({ error: 'Module not found' }, { status: 404 });
        }

        // Check user permissions
        const { data: userData } = await supabase
            .from('users')
            .select('role, company_id')
            .eq('id', session.user.id)
            .single();

        if (!userData) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Check if user can delete this module
        const canDelete = userData.role === 'super_admin' ||
            (userData.company_id === existingModule.company_id &&
                ['admin'].includes(userData.role)) ||
            (userData.company_id === existingModule.company_id &&
                userData.id === existingModule.created_by);

        if (!canDelete) {
            return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
        }

        // Check if module has active assignments
        const { data: assignments } = await supabase
            .from('module_assignments')
            .select('id')
            .eq('module_id', moduleId)
            .eq('status', 'in_progress');

        if (assignments && assignments.length > 0) {
            return NextResponse.json(
                { error: 'Cannot delete module with active assignments' },
                { status: 400 }
            );
        }

        // Delete module (cascade will handle sections and questions)
        const { error: deleteError } = await supabase
            .from('modules')
            .delete()
            .eq('id', moduleId);

        if (deleteError) {
            console.error('Error deleting module:', deleteError);
            return NextResponse.json({ error: 'Failed to delete module' }, { status: 500 });
        }

        // Log activity
        await supabase.from('activity_logs').insert({
            company_id: existingModule.company_id,
            user_id: session.user.id,
            action: 'module_deleted',
            resource_type: 'module',
            resource_id: moduleId,
            details: {
                title: existingModule.title
            }
        });

        return NextResponse.json({ success: true, message: 'Module deleted successfully' });

    } catch (error) {
        console.error('Error deleting module:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
} 