'use client';

import React, { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  SparklesIcon,
  BookOpenIcon,
  UsersIcon,
  ClockIcon,
  BarChart3Icon
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Module {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  estimated_duration: number;
  status: string;
  is_published: boolean;
  is_ai_generated: boolean;
  created_at: string;
  updated_at: string;
  created_by: string;
  users?: {
    name: string;
    email: string;
  };
  module_sections?: Array<{
    id: string;
    type: string;
    title: string;
  }>;
  module_assignments?: Array<{
    id: string;
    status: string;
    progress: number;
    users: {
      name: string;
    };
  }>;
}

export default function ModulesPage() {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const supabase = createClientComponentClient();

  // Categories for filtering
  const categories = [
    'all', 'safety', 'compliance', 'soft_skills', 'technical',
    'sales', 'customer_service', 'leadership', 'onboarding', 'other'
  ];

  const statuses = ['all', 'draft', 'published', 'archived'];

  useEffect(() => {
    fetchModules();

    // Set up real-time subscription for modules
    const moduleSubscription = supabase
      .channel('modules-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'modules' },
        (payload) => {
          console.log('Module change detected:', payload);
          fetchModules(); // Refresh the list

          if (payload.eventType === 'INSERT') {
            toast.success(`New module "${payload.new.title}" created!`);
          } else if (payload.eventType === 'UPDATE') {
            toast.success(`Module "${payload.new.title}" updated!`);
          } else if (payload.eventType === 'DELETE') {
            toast.success('Module deleted!');
          }
        }
      )
      .subscribe();

    // Set up real-time subscription for module sections
    const sectionSubscription = supabase
      .channel('sections-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'module_sections' },
        (payload) => {
          console.log('Section change detected:', payload);
          fetchModules(); // Refresh to get updated section counts
        }
      )
      .subscribe();

    return () => {
      moduleSubscription.unsubscribe();
      sectionSubscription.unsubscribe();
    };
  }, []);

  const fetchModules = async () => {
    try {
      setLoading(true);

      // Get current user's company
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: userData } = await supabase
        .from('users')
        .select('company_id, role')
        .eq('id', user.id)
        .single();

      if (!userData) return;

      // Fetch modules with related data
      let query = supabase
        .from('modules')
        .select(`
          *,
          users!modules_created_by_fkey(
            name,
            email
          ),
          module_sections(
            id,
            type,
            title
          ),
          module_assignments(
            id,
            status,
            progress,
            users(name)
          )
        `)
        .order('updated_at', { ascending: false });

      // Filter by company (unless super admin)
      if (userData.role !== 'super_admin') {
        query = query.eq('company_id', userData.company_id);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching modules:', error);
        toast.error('Failed to fetch modules');
        return;
      }

      setModules(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to fetch modules');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteModule = async (moduleId: string, moduleTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${moduleTitle}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/modules/${moduleId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Module deleted successfully');
        fetchModules();
      } else {
        toast.error(result.error || 'Failed to delete module');
      }
    } catch (error) {
      console.error('Error deleting module:', error);
      toast.error('Failed to delete module');
    }
  };

  const getFilteredModules = () => {
    return modules.filter(module => {
      const categoryMatch = filterCategory === 'all' || module.category === filterCategory;
      const statusMatch = filterStatus === 'all' ||
        (filterStatus === 'published' && module.is_published) ||
        (filterStatus === 'draft' && !module.is_published) ||
        module.status === filterStatus;

      return categoryMatch && statusMatch;
    });
  };

  const getCategoryDisplayName = (category: string) => {
    const names: Record<string, string> = {
      'all': 'All Categories',
      'safety': 'Safety Training',
      'compliance': 'Compliance',
      'soft_skills': 'Soft Skills',
      'technical': 'Technical Training',
      'sales': 'Sales Training',
      'customer_service': 'Customer Service',
      'leadership': 'Leadership',
      'onboarding': 'Onboarding',
      'other': 'Other'
    };
    return names[category] || category;
  };

  const getStatusColor = (module: Module) => {
    if (module.is_published) return 'bg-green-100 text-green-800';
    if (module.status === 'draft') return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      'beginner': 'bg-blue-100 text-blue-800',
      'intermediate': 'bg-orange-100 text-orange-800',
      'advanced': 'bg-red-100 text-red-800',
      'expert': 'bg-purple-100 text-purple-800'
    };
    return colors[difficulty] || 'bg-gray-100 text-gray-800';
  };

  const getCompletionRate = (module: Module) => {
    if (!module.module_assignments || module.module_assignments.length === 0) return 0;

    const completed = module.module_assignments.filter(a => a.status === 'completed').length;
    return Math.round((completed / module.module_assignments.length) * 100);
  };

  const filteredModules = getFilteredModules();

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Training Modules</h1>
          <p className="text-gray-600 mt-1">
            Manage your training content and track learner progress
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={() => window.open('/admin/modules/analytics', '_blank')}
            variant="outline"
            className="flex items-center gap-2"
          >
            <BarChart3Icon className="w-4 h-4" />
            Analytics
          </Button>

          <Button
            onClick={() => setShowCreateDialog(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <PlusIcon className="w-4 h-4" />
            Create Module
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Modules</p>
                <p className="text-2xl font-bold text-gray-900">{modules.length}</p>
              </div>
              <BookOpenIcon className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Published</p>
                <p className="text-2xl font-bold text-gray-900">
                  {modules.filter(m => m.is_published).length}
                </p>
              </div>
              <EyeIcon className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">AI Generated</p>
                <p className="text-2xl font-bold text-gray-900">
                  {modules.filter(m => m.is_ai_generated).length}
                </p>
              </div>
              <SparklesIcon className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Assignments</p>
                <p className="text-2xl font-bold text-gray-900">
                  {modules.reduce((sum, m) => sum + (m.module_assignments?.length || 0), 0)}
                </p>
              </div>
              <UsersIcon className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="flex gap-2">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {getCategoryDisplayName(category)}
              </option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            {statuses.map(status => (
              <option key={status} value={status}>
                {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="text-sm text-gray-600">
          {filteredModules.length} of {modules.length} modules
        </div>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModules.map((module) => (
          <Card key={module.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
                    {module.title}
                  </CardTitle>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {module.description || 'No description provided'}
                  </p>
                </div>

                {module.is_ai_generated && (
                  <SparklesIcon className="w-5 h-5 text-purple-600 ml-2 flex-shrink-0" />
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge className={getStatusColor(module)}>
                  {module.is_published ? 'Published' : 'Draft'}
                </Badge>
                <Badge className={getDifficultyColor(module.difficulty)}>
                  {module.difficulty}
                </Badge>
                <Badge variant="outline">
                  {getCategoryDisplayName(module.category)}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <ClockIcon className="w-4 h-4" />
                    {module.estimated_duration} min
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpenIcon className="w-4 h-4" />
                    {module.module_sections?.length || 0} sections
                  </div>
                </div>

                {module.module_assignments && module.module_assignments.length > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      {module.module_assignments.length} assignments
                    </span>
                    <span className="font-medium text-gray-900">
                      {getCompletionRate(module)}% completed
                    </span>
                  </div>
                )}

                <div className="text-xs text-gray-500">
                  Created by {module.users?.name || 'Unknown'} •{' '}
                  {new Date(module.created_at).toLocaleDateString()}
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(`/admin/modules/${module.id}`, '_blank')}
                    className="flex-1"
                  >
                    <EyeIcon className="w-4 h-4 mr-1" />
                    View
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(`/admin/modules/${module.id}/edit`, '_blank')}
                    className="flex-1"
                  >
                    <PencilIcon className="w-4 h-4 mr-1" />
                    Edit
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteModule(module.id, module.title)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredModules.length === 0 && (
        <div className="text-center py-12">
          <BookOpenIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No modules found</h3>
          <p className="text-gray-600 mb-6">
            {filterCategory !== 'all' || filterStatus !== 'all'
              ? 'Try adjusting your filters or create a new module.'
              : 'Get started by creating your first training module.'}
          </p>
          <Button
            onClick={() => setShowCreateDialog(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Create Your First Module
          </Button>
        </div>
      )}

      {/* Real-time sync indicator */}
      <div className="fixed bottom-4 right-4">
        <div className="bg-green-100 text-green-800 px-3 py-2 rounded-full text-xs font-medium flex items-center gap-2">
          <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
          Live sync with Flutter app
        </div>
      </div>
    </div>
  );
} 