import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
    try {
        const supabase = createRouteHandlerClient({ cookies });

        // Get user session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get request data
        const body = await request.json();
        const {
            title,
            description,
            company_id,
            category,
            difficulty,
            estimated_duration,
            sections = [],
            settings = {},
            tags = [],
            is_ai_generated = false,
            ai_generation_prompt
        } = body;

        // Validate required fields
        if (!title || !company_id) {
            return NextResponse.json(
                { error: 'Title and company_id are required' },
                { status: 400 }
            );
        }

        // Check user permissions
        const { data: userData } = await supabase
            .from('users')
            .select('role, company_id')
            .eq('id', session.user.id)
            .single();

        if (!userData || !['manager', 'admin', 'super_admin'].includes(userData.role)) {
            return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
        }

        if (userData.company_id !== company_id && userData.role !== 'super_admin') {
            return NextResponse.json({ error: 'Cannot create modules for other companies' }, { status: 403 });
        }

        // Create module
        const { data: module, error: moduleError } = await supabase
            .from('modules')
            .insert({
                title,
                description,
                company_id,
                created_by: session.user.id,
                category: category || 'other',
                difficulty: difficulty || 'beginner',
                estimated_duration: estimated_duration || 30,
                settings,
                tags,
                is_ai_generated,
                ai_generation_prompt,
                status: 'draft',
                is_published: false,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            })
            .select('*')
            .single();

        if (moduleError) {
            console.error('Error creating module:', moduleError);
            return NextResponse.json({ error: 'Failed to create module' }, { status: 500 });
        }

        // Create sections if provided
        if (sections.length > 0) {
            const sectionsToInsert = sections.map((section: any, index: number) => ({
                module_id: module.id,
                type: section.type,
                title: section.title || `Section ${index + 1}`,
                order_index: section.order_index || index,
                content: section.content || {},
                settings: section.settings || {},
                is_ai_generated: section.is_ai_generated || false,
                is_required: section.is_required !== false,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }));

            const { error: sectionsError } = await supabase
                .from('module_sections')
                .insert(sectionsToInsert);

            if (sectionsError) {
                console.error('Error creating sections:', sectionsError);
                // Don't fail the whole request, just log the error
            }
        }

        // Log activity
        await supabase.from('activity_logs').insert({
            company_id,
            user_id: session.user.id,
            action: 'module_created',
            resource_type: 'module',
            resource_id: module.id,
            details: {
                title,
                category,
                is_ai_generated,
                sections_count: sections.length
            }
        });

        // Track AI generation if applicable
        if (is_ai_generated && ai_generation_prompt) {
            await supabase.from('ai_generations').insert({
                company_id,
                user_id: session.user.id,
                module_id: module.id,
                generation_type: 'module_creation',
                prompt: ai_generation_prompt,
                generated_content: { module, sections },
                ai_service: 'openai',
                was_used: true
            });
        }

        return NextResponse.json({
            success: true,
            module: {
                ...module,
                sections: sections.length
            }
        });

    } catch (error) {
        console.error('Unexpected error creating module:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
} 