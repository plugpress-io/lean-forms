/**
 * Dashboard Home Page
 * Main dashboard overview and quick actions
 */

import React from 'react';
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { 
  BarChart3, 
  Users, 
  Mail, 
  Shield, 
  TrendingUp, 
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

// UI Components
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';

const Dashboard = ({ navigate }) => {
  const { forms, entries, settings } = useSelect((select) => ({
    forms: select('lean-forms/admin').getForms(),
    entries: select('lean-forms/admin').getEntries(),
    settings: select('lean-forms/admin').getSettings(),
  }));

  // Mock stats for now
  const stats = [
    {
      title: __('Total Forms', 'lean-forms'),
      value: forms?.length || 0,
      icon: Mail,
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: __('Total Entries', 'lean-forms'),
      value: entries?.length || 0,
      icon: Users,
      change: '+8%',
      changeType: 'positive'
    },
    {
      title: __('Active Features', 'lean-forms'),
      value: Object.values(settings).filter(Boolean).length || 0,
      icon: CheckCircle,
      change: '+2',
      changeType: 'neutral'
    },
    {
      title: __('Spam Blocked', 'lean-forms'),
      value: 0,
      icon: Shield,
      change: '0%',
      changeType: 'neutral'
    }
  ];

  const quickActions = [
    {
      title: __('View Entries', 'lean-forms'),
      description: __('Manage form submissions', 'lean-forms'),
      icon: Users,
      action: () => navigate('entries'),
      primary: true
    },
    {
      title: __('Configure Features', 'lean-forms'),
      description: __('Enable/disable features', 'lean-forms'),
      icon: CheckCircle,
      action: () => navigate('features'),
      primary: false
    }
  ];

  return (
    <div className="space-y-6">
      
      <div className="">
        <h1 className="text-3xl font-bold tracking-tight">
          {__('Dashboard', 'lean-forms')}
        </h1>
        <p className="text-muted-foreground mt-2">
          {__('Welcome to Lean Forms. Here\'s what\'s happening with your forms.', 'lean-forms')}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="bg-white rounded-lg border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  stat.changeType === 'positive' 
                    ? 'bg-green-100 text-green-800' 
                    : stat.changeType === 'negative'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {stat.change}
                </span>
                <span className="ml-2 text-muted-foreground">
                  {__('from last month', 'lean-forms')}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-xl font-semibold mb-4">
          {__('Quick Actions', 'lean-forms')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <div
                key={action.title}
                className="flex items-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={action.action}
              >
                <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{action.title}</h3>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                </div>
                <Button 
                  variant={action.primary ? 'default' : 'outline'} 
                  size="sm"
                >
                  {__('Go', 'lean-forms')}
                </Button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-xl font-semibold mb-4">
          {__('Recent Activity', 'lean-forms')}
        </h2>
        <div className="space-y-4">
          {entries && entries.length > 0 ? (
            entries.slice(0, 5).map((entry, index) => (
              <div key={entry.id || index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                <div className="flex items-center">
                  <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <Mail className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {__('New form submission', 'lean-forms')}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {entry.created ? new Date(entry.created).toLocaleDateString() : __('Recently', 'lean-forms')}
                    </p>
                  </div>
                </div>
                <Badge variant={entry.status === 'new' ? 'default' : 'secondary'}>
                  {entry.status || 'new'}
                </Badge>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {__('No recent activity. Form submissions will appear here.', 'lean-forms')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
