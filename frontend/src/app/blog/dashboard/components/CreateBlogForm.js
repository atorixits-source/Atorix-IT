'use client';

import React, { useState, useEffect } from 'react';
import { X, Image as ImageIcon, PlusCircle } from 'lucide-react';
import { getAuthToken, isAuthenticated } from '@/lib/auth';
import dynamic from 'next/dynamic';
import 'quill/dist/quill.snow.css';


// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(
  () => import('react-quill-new'),
  { ssr: false }
);


const getBlogApiBase = () => {
  const base = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').trim().replace(/\/+$/, '');
  return base.endsWith('/api/blog') ? base : `${base}/api/blog`;
};

const normalizeStatus = (status) => (status ? status.toLowerCase() : 'draft');

const buildInitialFormState = (initialData) => ({
  title: initialData?.title || '',
  slug: initialData?.slug || '',
  content: initialData?.content || '',
  category: initialData?.category || '',
  subcategory: initialData?.subcategory || 'Article',
  authorName: initialData?.authorName || '',
  status: normalizeStatus(initialData?.status),
  tags: Array.isArray(initialData?.tags) ? initialData.tags : [],
  keywords: Array.isArray(initialData?.keywords) ? initialData.keywords : [],
  featuredImage: null,
  bannerImage: null,
});

const getImagePreview = (image) => {
  if (!image) return null;
  if (typeof image === 'string') return image;
  if (typeof image === 'object' && image.url) return image.url;
  return null;
};

export default function CreateBlogForm({ onClose, onBlogCreated, onBlogUpdated, initialData }) {
  const editableId = initialData?._id || initialData?.id || initialData?.slug || '';
  const isEditMode = Boolean(initialData && editableId);

  const [formData, setFormData] = useState({
    ...buildInitialFormState(initialData),
  });

  const [tagInput, setTagInput] = useState('');
  const [keywordInput, setKeywordInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState({
    featured: getImagePreview(initialData?.featuredImage),
    banner: getImagePreview(initialData?.bannerImage)
  });

  const modalTitle = isEditMode ? 'Edit Blog Post' : 'Create New Blog Post';
  const submitButtonLabel = isSubmitting
    ? (isEditMode ? 'Updating...' : 'Publishing...')
    : (isEditMode ? 'Update Post' : 'Publish Now');

  useEffect(() => {
    setFormData(buildInitialFormState(initialData));
    setPreviewImage({
      featured: getImagePreview(initialData?.featuredImage),
      banner: getImagePreview(initialData?.bannerImage)
    });
  }, [initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTagKeyDown = (e) => {
    if (['Enter', ','].includes(e.key) && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()]
        }));
      }
      setTagInput('');
    }
  };

  const handleKeywordKeyDown = (e) => {
    if (['Enter', ','].includes(e.key) && keywordInput.trim()) {
      e.preventDefault();
      if (!formData.keywords.includes(keywordInput.trim())) {
        setFormData(prev => ({
          ...prev,
          keywords: [...prev.keywords, keywordInput.trim()]
        }));
      }
      setKeywordInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const removeKeyword = (keywordToRemove) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords.filter(kw => kw !== keywordToRemove)
    }));
  };

  const handleImageUpload = (e, type) => {
  const file = e.target.files[0];
  if (!file) return;

  // Update the preview
  const reader = new FileReader();
  reader.onloadend = () => {
    setPreviewImage(prev => ({
      ...prev,
      [type]: reader.result
    }));
  };
  reader.readAsDataURL(file);

  // Update form data
  setFormData(prev => ({
    ...prev,
    [type === 'featured' ? 'featuredImage' : 'bannerImage']: file
  }));
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.title.trim()) {
      alert('Title is required');
      return;
    }
    
    // Better content validation - strip HTML tags to check if there's actual content
    const contentText = formData.content.replace(/<[^>]*>/g, '').trim();
    if (!contentText || contentText.length < 10) {
      alert('Content is required and must be at least 10 characters long');
      return;
    }
    
    if (!formData.category) {
      alert('Category is required');
      return;
    }
    
    // Check if user is authenticated
    if (!isAuthenticated()) {
      alert('Your session has expired. Please log in again.');
      window.location.href = '/admin/login?blog=true';
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const formDataToSend = new FormData();
      
      console.log('Form data being sent:', {
        title: formData.title,
        content: formData.content,
        contentLength: formData.content.length,
        contentText: formData.content.replace(/<[^>]*>/g, '').trim(),
        slug: formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
        category: formData.category,
        status: formData.status,
        tags: formData.tags,
        keywords: formData.keywords,
        hasFeaturedImage: !!formData.featuredImage,
        hasBannerImage: !!formData.bannerImage
      });
      
      // Append all form data
      formDataToSend.append('title', formData.title);
      formDataToSend.append('content', formData.content);
      formDataToSend.append('slug', formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''));
      formDataToSend.append('category', formData.category);
      formDataToSend.append('subcategory', formData.subcategory || '');
      formDataToSend.append('authorName', formData.authorName || '');
      formDataToSend.append('status', formData.status || 'draft');
      formDataToSend.append('tags', JSON.stringify(formData.tags || []));
      formDataToSend.append('keywords', JSON.stringify(formData.keywords || []));
      
      // Append files if they exist
      if (formData.featuredImage) {
        formDataToSend.append('featuredImage', formData.featuredImage);
        console.log('Appending featured image:', formData.featuredImage.name);
      }
      if (formData.bannerImage) {
        formDataToSend.append('bannerImage', formData.bannerImage);
        console.log('Appending banner image:', formData.bannerImage.name);
      }

      // Get token using the auth utility
      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }

      console.log(`${isEditMode ? 'Updating' : 'Creating'} blog post...`);
      if (isEditMode) {
        console.log('Editing blog identifier:', editableId, {
          _id: initialData?._id,
          id: initialData?.id,
          slug: initialData?.slug,
        });
      }
      const apiBase = getBlogApiBase();
      const apiUrl = isEditMode
        ? `${apiBase}/posts/${encodeURIComponent(editableId)}`
        : `${apiBase}/posts`;
      console.log('Blog API URL:', apiUrl);

      const response = await fetch(apiUrl, {
        method: isEditMode ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
          // Note: Don't set Content-Type header when sending FormData
          // The browser will set it automatically with the correct boundary
        },
        credentials: 'include',
        body: formDataToSend
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Server error response:', errorData);
        
        // Handle specific error cases
        if (response.status === 403) {
          throw new Error('You are not authorized to create blog posts. Please contact your administrator.');
        } else if (response.status === 401) {
          throw new Error('Your session has expired. Please log in again.');
        } else if (response.status === 400) {
          throw new Error(errorData.message || 'Invalid data provided. Please check all fields.');
        } else {
          throw new Error(errorData.message || `Server error: ${response.status}`);
        }
      }

      const data = await response.json();
      console.log('Blog post saved successfully:', data);
      
      if (isEditMode) {
        alert('Blog post updated successfully!');
        onBlogUpdated?.(data.data);
      } else {
        // Reset form fields for next create action
        setFormData(buildInitialFormState());
        setPreviewImage({ featured: null, banner: null });
        
        document.querySelectorAll('input[type="file"]').forEach(input => {
          input.value = '';
        });

        alert('Blog post created successfully!');
        onBlogCreated?.(data.data);
      }
      
      onClose?.();
    } catch (error) {
      console.error('Error saving blog post:', error);
      if (error.message.includes('token') || error.message.includes('auth') || error.message.includes('401')) {
        alert('Your session has expired. Please log in again.');
        window.location.href = '/admin/login?blog=true';
      } else {
        alert(error.message || 'Error saving blog post. Please check the console for more details.');
      }
    } finally {
      setIsSubmitting(false);
    }
};

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">{modalTitle}</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Blog Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL Slug
              </label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                placeholder="auto-generated-if-empty"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.tags.map(tag => (
                  <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {tag}
                    <button 
                      type="button" 
                      onClick={() => removeTag(tag)}
                      className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-blue-200 hover:bg-blue-300"
                    >
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder="Type and press Enter to add a tag"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Keywords
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.keywords.map(keyword => (
                  <span key={keyword} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {keyword}
                    <button 
                      type="button" 
                      onClick={() => removeKeyword(keyword)}
                      className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-green-200 hover:bg-green-300"
                    >
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyDown={handleKeywordKeyDown}
                placeholder="Type and press Enter to add a keyword"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Category</option>
                <option value="SAP">SAP</option>
                <option value="Technology">Technology</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Business">Business</option>
                <option value="Implementation">Implementation</option>
                <option value="Migration">Migration</option>
                <option value="Support">Support</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subcategory
              </label>
              <select
                name="subcategory"
                value={formData.subcategory}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Article">Article</option>
                <option value="Tutorial">Tutorial</option>
                <option value="News">News</option>
                <option value="Case Study">Case Study</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Author Name
              </label>
              <input
                type="text"
                name="authorName"
                value={formData.authorName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content <span className="text-red-500">*</span>
            </label>
            <div className="mb-4">
              <ReactQuill
                theme="snow"
                value={formData.content}
                onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                modules={{
                  toolbar: [
                    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ 'color': [] }, { 'background': [] }],
                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                    ['link', 'image', 'video'],
                    ['blockquote', 'code-block'],
                    ['clean']
                  ],
                }}
                formats={[
                  'header',
                  'bold', 'italic', 'underline', 'strike',
                  'color', 'background',
                  'list', 'bullet',
                  'link', 'image', 'video',
                  'blockquote', 'code-block'
                ]}
                placeholder="Write your blog content here..."
                className="min-h-[200px]"
              />
              <style jsx global>{`
                .ql-container {
                  min-height: 200px;
                  border-radius: 0 0 0.5rem 0.5rem;
                }
                .ql-toolbar {
                  border-radius: 0.5rem 0.5rem 0 0;
                  background-color: #f8f9fa;
                }
                .ql-editor {
                  min-height: 200px;
                }
              `}</style>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Featured Image
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  {previewImage.featured ? (
                    <div className="relative">
                      <img 
                        src={previewImage.featured} 
                        alt="Featured preview" 
                        className="mx-auto h-32 w-auto object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setPreviewImage(prev => ({ ...prev, featured: null }));
                          setFormData(prev => ({ ...prev, featuredImage: null }));
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="featured-image"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                        >
                          <span>Upload a file</span>
                          <input
                         id="featured-image"
                         name="featuredImage"
                         type="file"
                         className="sr-only"
                         onChange={(e) => handleImageUpload(e, 'featured')}
                         accept="image/*"
                         multiple={false}
                        />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 2MB</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Banner Image
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  {previewImage.banner ? (
                    <div className="relative">
                      <img 
                        src={previewImage.banner} 
                        alt="Banner preview" 
                        className="mx-auto h-32 w-auto object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setPreviewImage(prev => ({ ...prev, banner: null }));
                          setFormData(prev => ({ ...prev, bannerImage: null }));
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="banner-image"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                        >
                          <span>Upload a file</span>
                          <input
                         id="banner-image"
                         name="banner-image"
                         type="file"
                         className="sr-only"
                         onChange={(e) => handleImageUpload(e, 'banner')}
                         accept="image/*"
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 2MB</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Explore Other Courses Section */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Explore Other Courses</h3>
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PlusCircle className="-ml-1 mr-2 h-5 w-5" />
                Add Course
              </button>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Common Course Image</h4>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                      <span>Upload a file</span>
                      <input type="file" className="sr-only" />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 2MB</p>
                </div>
              </div>
            </div>



            

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-2">How it works</h4>
              <p className="text-sm text-gray-500">
                Add courses to your blog post to help readers discover related learning opportunities.
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Each course should have a title, description, and a link to learn more.
              </p>
            </div>

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-500">No courses added yet</p>
              <button
                type="button"
                className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PlusCircle className="-ml-1 mr-2 h-5 w-5" />
                Add Course
              </button>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {submitButtonLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}