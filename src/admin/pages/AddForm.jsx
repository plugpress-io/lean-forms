/**
 * Add Form Page
 * Pre-built Contact Form 7 templates with import functionality
 */

import React, { useState } from 'react';
import { __ } from '@wordpress/i18n';
import { Download, Eye, ArrowRight, Search } from 'lucide-react';
import apiFetch from '@wordpress/api-fetch';

// UI Components
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { showToast } from '../components/ui/toast';

// Form templates data
import { FORM_TEMPLATES, TEMPLATE_CATEGORIES } from '../data/form-templates';

const AddForm = ({ navigate }) => {
  const [selectedCategory, setSelectedCategory] = useState('Popular');
  const [searchTerm, setSearchTerm] = useState('');
  const [importing, setImporting] = useState({});
  const [previewModal, setPreviewModal] = useState(null);

  // Filter templates by category and search
  const filteredTemplates = FORM_TEMPLATES.filter(template => {
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
    const matchesSearch = !searchTerm || 
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  const importTemplate = async (template) => {
    setImporting(prev => ({ ...prev, [template.id]: true }));
    
    try {
      console.log('Importing template:', template.name);
      
      const response = await apiFetch({
        path: '/lean-forms/v1/import-form',
        method: 'POST',
        data: {
          template_id: template.id,
          form_title: template.name,
          form_content: template.shortcode,
          mail_template: template.mail || {},
        },
      });

      console.log('Import response:', response);

      if (response.success && response.form_id) {
        showToast.success(
          __('Form imported successfully! Redirecting to Contact Form 7...', 'lean-forms')
        );

        // Redirect to CF7 edit page after short delay
        setTimeout(() => {
          const editUrl = `${window.location.origin}/wp-admin/admin.php?page=wpcf7&post=${response.form_id}&action=edit`;
          window.open(editUrl, '_blank');
        }, 1500);
      } else {
        throw new Error(response.message || 'Import failed');
      }
      
    } catch (error) {
      console.error('Error importing template:', error);
      showToast.error(
        error.message || __('Failed to import form template. Please try again.', 'lean-forms')
      );
    } finally {
      setImporting(prev => ({ ...prev, [template.id]: false }));
    }
  };

  const openPreview = (template) => {
    setPreviewModal(template);
  };

  const closePreview = () => {
    setPreviewModal(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="">
        <h1 className="text-3xl font-bold tracking-tight">
          {__('Add Form', 'lean-forms')}
        </h1>
        <p className="text-muted-foreground mt-2">
          {__('Choose from pre-built Contact Form 7 templates to get started quickly.', 'lean-forms')}
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 max-w-sm">
          <Input
            placeholder={__('Search templates...', 'lean-forms')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {['All', ...TEMPLATE_CATEGORIES].map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="whitespace-nowrap"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            className="group bg-white rounded-lg border shadow-sm hover:shadow-lg transition-all duration-300"
          >
            {/* Title */}
            <div className="p-4 pb-2">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-lg text-gray-900">
                  {template.name}
                </h3>
                <Badge variant="secondary" className="text-xs">
                  {template.category}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2">
                {template.description}
              </p>
            </div>

            {/* Preview Image with Overlay */}
            <div className="relative aspect-video bg-gray-100 rounded-lg mx-4 mb-4 overflow-hidden">
              <img
                src={template.preview}
                alt={template.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDQwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNzUgNzVIMjI1VjEyNUgxNzVWNzVaIiBzdHJva2U9IiM5Q0EzQUYiIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0ibm9uZSIvPgo8L3N2Zz4K';
                }}
              />
              
              {/* Subtle Overlay with Buttons */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex gap-2">
                  {/* Preview Button */}
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => openPreview(template)}
                    className="bg-white/95 hover:bg-white text-gray-900 shadow-lg backdrop-blur-sm"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    {__('Preview', 'lean-forms')}
                  </Button>

                  {/* Import Button */}
                  <Button
                    size="sm"
                    onClick={() => importTemplate(template)}
                    disabled={importing[template.id]}
                    className="bg-primary/95 hover:bg-primary text-white shadow-lg backdrop-blur-sm"
                  >
                    {importing[template.id] ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        {__('Importing...', 'lean-forms')}
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        {__('Import', 'lean-forms')}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground">
            <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">
              {__('No templates found', 'lean-forms')}
            </p>
            <p className="text-sm">
              {__('Try adjusting your search or category filter.', 'lean-forms')}
            </p>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <div>
                <h3 className="text-lg font-semibold">{previewModal.name}</h3>
                <p className="text-sm text-muted-foreground">{previewModal.description}</p>
              </div>
              <Button variant="ghost" onClick={closePreview}>
                ×
              </Button>
            </div>
            <div className="p-4 overflow-y-auto">
              <div className="mb-4">
                <img
                  src={previewModal.preview}
                  alt={previewModal.name}
                  className="w-full rounded-lg border"
                />
              </div>
              <div className="mb-4">
                <h4 className="font-medium mb-2">{__('Form Code:', 'lean-forms')}</h4>
                <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                  <code>{previewModal.shortcode}</code>
                </pre>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={closePreview}>
                  {__('Close', 'lean-forms')}
                </Button>
                <Button 
                  onClick={() => {
                    closePreview();
                    importTemplate(previewModal);
                  }}
                  disabled={importing[previewModal.id]}
                >
                  <Download className="h-4 w-4 mr-2" />
                  {__('Import Form', 'lean-forms')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddForm;
