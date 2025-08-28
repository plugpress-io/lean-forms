/**
 * Form Entries Management Page
 * View and manage form submissions
 */

import React, { useEffect, useState, useMemo } from 'react';
import { __ } from '@wordpress/i18n';
import { Eye, MoreHorizontal, Trash2, CheckCircle, AlertCircle } from 'lucide-react';
import apiFetch from '@wordpress/api-fetch';

// UI Components
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { DataTable } from '../components/DataTable';

const Entries = ({ navigate }) => {
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Set up API authentication
  useEffect(() => {
    apiFetch.use(apiFetch.createNonceMiddleware(window.leanFormsAdmin?.nonce || ''));
  }, []);

  // Fetch entries
  useEffect(() => {
    fetchEntries();
  }, [searchTerm, statusFilter]);

  // Add test data for debugging
  useEffect(() => {
    const timer = setTimeout(() => {
      if (entries.length === 0 && !isLoading) {
        console.log('Adding test data for debugging');
        setEntries([
          {
            id: 1,
            form_id: 123,
            status: 'new',
            created: '2024-01-15T10:30:00Z',
            ip: '192.168.1.1',
            user_agent: 'Test Browser',
            data: { name: 'John Doe', email: 'john@example.com', message: 'Hello world!' }
          },
          {
            id: 2,
            form_id: 124,
            status: 'read',
            created: '2024-01-14T15:45:00Z',
            ip: '192.168.1.2',
            user_agent: 'Another Browser',
            data: { name: 'Jane Smith', email: 'jane@example.com', message: 'This is a test message.' }
          },
          {
            id: 3,
            form_id: 123,
            status: 'spam',
            created: '2024-01-13T09:15:00Z',
            ip: '192.168.1.3',
            user_agent: 'Spam Bot',
            data: { name: 'Spam User', email: 'spam@example.com', message: 'Buy our products!' }
          }
        ]);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [entries.length, isLoading]);

  const fetchEntries = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: 1,
        per_page: 50,
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter !== 'all' && { status: statusFilter }),
        orderby: 'created',
        order: 'desc'
      });

      const apiPath = `/lean-forms/v1/entries?${params.toString()}`;
      console.log('Fetching entries from:', apiPath);

      const response = await apiFetch({
        path: apiPath,
      });

      console.log('Entries API response:', response);

      setEntries(response.items || []);
    } catch (error) {
      console.error('Error fetching entries:', error);
      setEntries([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Status badge helper
  const getStatusBadge = (status) => {
    const statusConfig = {
      new: { variant: 'info', label: __('New', 'lean-forms') },
      read: { variant: 'success', label: __('Read', 'lean-forms') },
      spam: { variant: 'warning', label: __('Spam', 'lean-forms') },
    };
    
    const config = statusConfig[status] || { variant: 'secondary', label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  // Table columns configuration
  const columns = useMemo(() => [
    {
      accessorKey: "id",
      header: __('ID', 'lean-forms'),
      cell: ({ row }) => (
        <div className="font-medium">{row.original.id}</div>
      ),
    },
    {
      accessorKey: "form_id",
      header: __('Form ID', 'lean-forms'),
      cell: ({ row }) => (
        <div>{row.original.form_id}</div>
      ),
    },
    {
      accessorKey: "status",
      header: __('Status', 'lean-forms'),
      cell: ({ row }) => getStatusBadge(row.original.status),
    },
    {
      accessorKey: "created",
      header: __('Created', 'lean-forms'),
      cell: ({ row }) => {
        const date = new Date(row.original.created);
        return <div>{date.toLocaleDateString()}</div>;
      },
    },
    {
      accessorKey: "data",
      header: __('Submission', 'lean-forms'),
      cell: ({ row }) => {
        const data = row.original.data || {};
        const preview = Object.entries(data)
          .slice(0, 2)
          .map(([key, value]) => `${key}: ${value}`)
          .join(', ');
        return (
          <div className="max-w-[200px] truncate text-sm text-muted-foreground">
            {preview || __('No data', 'lean-forms')}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: __('Actions', 'lean-forms'),
      cell: ({ row }) => {
        const entry = row.original;
        
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => viewEntry(entry)}
            >
              <Eye className="h-4 w-4" />
              <span className="sr-only">{__('View entry', 'lean-forms')}</span>
            </Button>
            {entry.status === 'new' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => updateEntryStatus(entry.id, 'read')}
              >
                <CheckCircle className="h-4 w-4" />
                <span className="sr-only">{__('Mark as read', 'lean-forms')}</span>
              </Button>
            )}
            {entry.status !== 'spam' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => updateEntryStatus(entry.id, 'spam')}
              >
                <AlertCircle className="h-4 w-4" />
                <span className="sr-only">{__('Mark as spam', 'lean-forms')}</span>
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => deleteEntry(entry.id)}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">{__('Delete entry', 'lean-forms')}</span>
            </Button>
          </div>
        );
      },
    },
  ], []);

  const viewEntry = (entry) => {
    console.log('Viewing entry:', entry);
    // TODO: Implement modal or detailed view
  };

  const updateEntryStatus = async (entryId, status) => {
    try {
      await apiFetch({
        path: `/lean-forms/v1/entries/${entryId}`,
        method: 'POST',
        data: { status },
      });
      
      // Update local state
      setEntries(prevEntries => 
        prevEntries.map(entry => 
          entry.id === entryId ? { ...entry, status } : entry
        )
      );
    } catch (error) {
      console.error('Error updating entry status:', error);
    }
  };

  const deleteEntry = async (entryId) => {
    if (!confirm(__('Are you sure you want to delete this entry?', 'lean-forms'))) {
      return;
    }

    try {
      await apiFetch({
        path: `/lean-forms/v1/entries/${entryId}`,
        method: 'DELETE',
      });
      
      // Remove from local state
      setEntries(prevEntries => 
        prevEntries.filter(entry => entry.id !== entryId)
      );
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="">
        <h1 className="text-3xl font-bold tracking-tight">
          {__('Form Entries', 'lean-forms')}
        </h1>
        <p className="text-muted-foreground mt-2">
          {__('Manage and view form submissions from Contact Form 7', 'lean-forms')}
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center gap-4">
          <div className="flex-1 max-w-sm">
            <Input
              placeholder={__('Search entries...', 'lean-forms')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
          >
            <option value="all">{__('All statuses', 'lean-forms')}</option>
            <option value="new">{__('New', 'lean-forms')}</option>
            <option value="read">{__('Read', 'lean-forms')}</option>
            <option value="spam">{__('Spam', 'lean-forms')}</option>
          </select>
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
            }}
          >
            {__('Clear filters', 'lean-forms')}
          </Button>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-lg border">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="text-muted-foreground">
              {__('Loading entries...', 'lean-forms')}
            </div>
          </div>
        ) : (
          <div className="p-6">
            <DataTable
              columns={columns}
              data={entries}
              searchPlaceholder={__('Search entries...', 'lean-forms')}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Entries;
