/**
 * Entries Page using WordPress DataViews
 */

import React, { useEffect, useState, useMemo } from 'react';
import { useSelect, useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { DataViews } from '@wordpress/dataviews/wp';
import { Badge, Button, Modal, Panel, PanelBody, PanelRow } from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';

const EntriesPage = ({ navigate }) => {
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [paginationInfo, setPaginationInfo] = useState({
    totalItems: 0,
    totalPages: 1,
  });
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // DataViews view state
  const [view, setView] = useState({
    type: 'table',
    search: '',
    filters: [],
    page: 1,
    perPage: 20,
    sort: {
      field: 'created',
      direction: 'desc',
    },
    fields: ['id', 'form_id', 'status', 'created', 'actions'],
    layout: {},
  });

  // Set up API authentication
  useEffect(() => {
    apiFetch.use(apiFetch.createNonceMiddleware(window.leanFormsAdmin?.nonce || ''));
  }, []);

  // Fetch entries when view changes
  useEffect(() => {
    fetchEntries();
  }, [view.page, view.perPage, view.search, view.filters, view.sort]);

  // Add some test data for debugging
  useEffect(() => {
    // Add test data if no entries are loaded after 3 seconds
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
            data: { name: 'Test User', email: 'test@example.com' }
          },
          {
            id: 2,
            form_id: 124,
            status: 'read',
            created: '2024-01-14T15:45:00Z',
            ip: '192.168.1.2',
            user_agent: 'Another Browser',
            data: { name: 'Another User', email: 'another@example.com' }
          }
        ]);
        setPaginationInfo({
          totalItems: 2,
          totalPages: 1,
        });
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [entries.length, isLoading]);

  const fetchEntries = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: view.page,
        per_page: view.perPage,
        ...(view.search && { search: view.search }),
        ...(view.sort.field && { 
          orderby: view.sort.field,
          order: view.sort.direction 
        }),
      });

      // Add filters
      view.filters.forEach(filter => {
        if (filter.field === 'status' && filter.value) {
          params.append('status', filter.value);
        }
        if (filter.field === 'form_id' && filter.value) {
          params.append('form_id', filter.value);
        }
      });

      const apiPath = `/lean-forms/v1/entries?${params.toString()}`;
      console.log('Fetching entries from:', apiPath);

      const response = await apiFetch({
        path: apiPath,
      });

      console.log('Entries API response:', response);

      setEntries(response.items || []);
      setPaginationInfo({
        totalItems: response.total || 0,
        totalPages: response.pages || 1,
      });
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

  // DataViews fields configuration
  const fields = useMemo(() => [
    {
      id: 'id',
      label: __('ID', 'lean-forms'),
      type: 'integer',
      enableSorting: true,
      enableHiding: false,
    },
    {
      id: 'form_id',
      label: __('Form ID', 'lean-forms'),
      type: 'integer',
      enableSorting: true,
      filterBy: {
        operators: ['is'],
      },
    },
    {
      id: 'status',
      label: __('Status', 'lean-forms'),
      render: ({ item }) => getStatusBadge(item.status),
      elements: [
        { value: 'new', label: __('New', 'lean-forms') },
        { value: 'read', label: __('Read', 'lean-forms') },
        { value: 'spam', label: __('Spam', 'lean-forms') },
      ],
      filterBy: {
        operators: ['is', 'isAny'],
      },
      enableSorting: false,
    },
    {
      id: 'created',
      label: __('Created', 'lean-forms'),
      type: 'datetime',
      render: ({ item }) => {
        return new Date(item.created).toLocaleDateString();
      },
      enableSorting: true,
    },
    {
      id: 'actions',
      label: __('Actions', 'lean-forms'),
      render: ({ item }) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="secondary"
            size="small"
            onClick={() => viewEntry(item)}
          >
            {__('View', 'lean-forms')}
          </Button>
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
  ], []);

  // DataViews actions
  const actions = useMemo(() => [
    {
      id: 'view',
      label: __('View', 'lean-forms'),
      isPrimary: true,
      icon: 'visibility',
      callback: (items) => {
        if (items.length === 1) {
          viewEntry(items[0]);
        }
      },
    },
    {
      id: 'mark-read',
      label: __('Mark as Read', 'lean-forms'),
      icon: 'yes',
      isEligible: (item) => item.status === 'new',
      supportsBulk: true,
      callback: (items) => {
        items.forEach(item => updateEntryStatus(item.id, 'read'));
      },
    },
    {
      id: 'mark-spam',
      label: __('Mark as Spam', 'lean-forms'),
      icon: 'warning',
      isEligible: (item) => item.status !== 'spam',
      isDestructive: true,
      supportsBulk: true,
      callback: (items) => {
        items.forEach(item => updateEntryStatus(item.id, 'spam'));
      },
    },
    {
      id: 'delete',
      label: __('Delete', 'lean-forms'),
      icon: 'trash',
      isDestructive: true,
      supportsBulk: true,
      callback: (items) => {
        if (confirm(__('Are you sure you want to delete these entries?', 'lean-forms'))) {
          items.forEach(item => deleteEntry(item.id));
        }
      },
    },
  ], []);

  const viewEntry = (entry) => {
    setSelectedEntry(entry);
    setIsModalOpen(true);
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

  const onChangeView = (newView) => {
    setView(newView);
  };

  return (
    <div className="entries-page" style={{ 
      backgroundColor: 'white',
      minHeight: '100vh',
      margin: 0,
      padding: '20px'
    }}>
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-gray-900 m-0 mb-2">
          {__('Form Entries', 'lean-forms')}
        </h1>
        <p className="text-gray-600">
          {__('Manage and view form submissions from Contact Form 7', 'lean-forms')}
        </p>
      </div>

      {/* Debug Info */}
      <div className="mb-4 p-4 bg-gray-100 rounded">
        <p><strong>Debug Info:</strong></p>
        <p>Loading: {isLoading ? 'Yes' : 'No'}</p>
        <p>Entries count: {entries.length}</p>
        <p>Total items: {paginationInfo.totalItems}</p>
        <p>API URL: /lean-forms/v1/entries</p>
      </div>

      {entries.length === 0 && !isLoading ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">
            {__('No form entries found.', 'lean-forms')}
          </p>
          <p className="text-gray-400 text-sm">
            {__('Form submissions will appear here once you receive them.', 'lean-forms')}
          </p>
        </div>
      ) : (
        <DataViews
          data={entries}
          fields={fields}
          view={view}
          onChangeView={onChangeView}
          actions={actions}
          isLoading={isLoading}
          paginationInfo={paginationInfo}
          defaultLayouts={{
            table: {},
            grid: {},
            list: {},
          }}
        />
      )}

      {/* Entry Detail Modal */}
      {isModalOpen && selectedEntry && (
        <Modal
          title={__('Entry Details', 'lean-forms')}
          onRequestClose={() => setIsModalOpen(false)}
          size="large"
        >
          <div className="space-y-4">
            <Panel>
              <PanelBody title={__('Basic Information', 'lean-forms')} initialOpen={true}>
                <PanelRow>
                  <strong>{__('ID:', 'lean-forms')}</strong> {selectedEntry.id}
                </PanelRow>
                <PanelRow>
                  <strong>{__('Form ID:', 'lean-forms')}</strong> {selectedEntry.form_id}
                </PanelRow>
                <PanelRow>
                  <strong>{__('Status:', 'lean-forms')}</strong> {getStatusBadge(selectedEntry.status)}
                </PanelRow>
                <PanelRow>
                  <strong>{__('Created:', 'lean-forms')}</strong> {new Date(selectedEntry.created).toLocaleString()}
                </PanelRow>
                <PanelRow>
                  <strong>{__('IP Address:', 'lean-forms')}</strong> {selectedEntry.ip || __('N/A', 'lean-forms')}
                </PanelRow>
                <PanelRow>
                  <strong>{__('User Agent:', 'lean-forms')}</strong> {selectedEntry.user_agent || __('N/A', 'lean-forms')}
                </PanelRow>
              </PanelBody>

              <PanelBody title={__('Form Data', 'lean-forms')} initialOpen={true}>
                {Object.keys(selectedEntry.data || {}).length > 0 ? (
                  <table className="widefat">
                    <thead>
                      <tr>
                        <th>{__('Field', 'lean-forms')}</th>
                        <th>{__('Value', 'lean-forms')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(selectedEntry.data || {}).map(([key, value]) => (
                        <tr key={key}>
                          <td><strong>{key}</strong></td>
                          <td>
                            {Array.isArray(value) 
                              ? value.join(', ')
                              : String(value)
                            }
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-gray-600">{__('No form data available.', 'lean-forms')}</p>
                )}
              </PanelBody>
            </Panel>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default EntriesPage;