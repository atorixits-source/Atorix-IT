// Frontend Code (Modified CreateBlogPost Component)

'use client';

import React, { useState, useEffect, useContext, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AuthContext from '@/context/AuthContext';
import {
  Upload, User, Save, Eye, Image as ImageIcon, X, Plus, Hash, Calendar, Camera, Edit, Tag, Trash2,
  Bold, Italic, Underline, Link, AlignLeft, AlignCenter, AlignRight, AlignJustify, List, Type, Palette, Code, Quote, Video, Indent, Outdent, BookOpen
} from 'lucide-react';

// Import React-Quill from react-quill-new
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill-new'), { 
  ssr: false,
  loading: () => <div>Loading editor...</div> 
});

// Backend base URL - should match your Express server
const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001';

// Match backend slugification
const slugify = (text) => text
  .toString()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .trim()
  .replace(/\s+/g, '-')
  .replace(/[^\w-]+/g, '')
  .replace(/--+/g, '-');


// Shared Tailwind utility presets for consistent inputs/labels/help
const fieldBase = 'w-full rounded-xl border border-gray-200 bg-white/80 text-black placeholder-black ring-1 ring-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition-shadow';
const labelBase = 'block text-sm font-semibold text-gray-800 mb-2';
const helpText = 'text-xs text-gray-500 mt-1';

export default function CreateBlogPost({ onSave, initialData = {}, isModal = false, onCancel }) {
  const subcategoryOptions = ['Article', 'Tutorial', 'Interview Questions'];
  const statusOptions = ['None', 'Trending', 'Featured', "Editor's Pick", 'Recommended'];

  const [formData, setFormData] = useState({
    title: '',
    urlSlug: '',
    content: '',
    category: '',
    subcategory: 'Article',
    authorName: '',
    status: 'None',
    blogImage: null,
    bannerImage: null,
    tags: [],
    keywords: [], // NEW: Added keywords array
    courseSections: [] // NEW: Common course image state
  });

  const [commonCourseImage, setCommonCourseImage] = useState({ file: null, preview: null });

  // Tag-specific state
  const [tagInput, setTagInput] = useState('');
  const [availableTags, setAvailableTags] = useState([]);
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);

  // NEW: Keyword-specific state (mirroring tags)
  const [keywordInput, setKeywordInput] = useState('');
  const [availableKeywords, setAvailableKeywords] = useState([]);
  const [showKeywordSuggestions, setShowKeywordSuggestions] = useState(false);

  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [dragActiveBanner, setDragActiveBanner] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [previewBanner, setPreviewBanner] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [blogId, setBlogId] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState(null);
  const [existingBannerUrl, setExistingBannerUrl] = useState(null);

  const quillRef = useRef(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Safely access AuthContext with a default value
  const authContext = useContext(AuthContext) || {};
  const user = authContext?.user || null;

  // Enhanced Quill configuration
  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'font': [] }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],
      ['link', 'image', 'video'],
      ['blockquote', 'code-block'],
      ['clean']
    ],
    clipboard: { matchVisual: false },
  };

  const quillFormats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'list', 'indent',
    'align', 'direction',
    'link', 'image', 'video',
    'blockquote', 'code-block'
  ];

  // NEW: Common course image handler functions
  const handleCommonCourseImageUpload = (file) => {
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setCommonCourseImage({ file, preview: e.target.result });
    };
    reader.readAsDataURL(file);
  };

  // NEW: Apply common image to all courses
  const applyCommonImageToAllCourses = () => {
    if (!commonCourseImage.file && !commonCourseImage.preview) {
      setError('Please select a common image first');
      return;
    }
    const updatedSections = formData.courseSections.map(section => ({
      ...section,
      imageFile: commonCourseImage.file,
      imagePreview: commonCourseImage.preview
    }));
    setFormData(prev => ({ ...prev, courseSections: updatedSections }));
    // Show success message
    setTimeout(() => setError(''), 100); // Clear any previous errors
  };

  // NEW: Remove common course image
  const removeCommonCourseImage = () => {
    setCommonCourseImage({ file: null, preview: null });
  };

  // Add keyboard shortcuts for formatting
  useEffect(() => {
    if (typeof window !== 'undefined' && quillRef.current) {
      const handleKeyDown = (e) => {
        // Handle Cmd+K (Mac) or Ctrl+K (Windows/Linux) for adding links
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
          e.preventDefault();
          insertQuickContent('link');
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, []);

  // Quick Action Functions
  const applyQuickFormat = (format, value = true) => {
    if (quillRef.current) {
      const quill = quillRef.current.getEditor();
      const range = quill.getSelection();
      if (range) {
        if (format === 'header') {
          value = quill.format('header', false);
        } else {
          quill.format(format, value);
        }
      }
      quill.focus();
    }
  };

  const insertQuickContent = (type) => {
    if (quillRef.current) {
      const quill = quillRef.current.getEditor();
      const range = quill.getSelection(true);
      const hasSelection = range && range.length > 0;
      const index = range ? range.index : quill.getLength();

      switch (type) {
        case 'link':
          // Get the current selection
          const selectedText = hasSelection ? quill.getText(range.index, range.length) : '';

          // Create a modal for better UX
          const url = window.prompt(
            'Enter the URL (include https:// or http://)',
            selectedText.startsWith('http') ? selectedText : 'https://'
          );
          if (url && url.trim()) {
            // Ensure URL has a protocol
            let finalUrl = url.trim();
            if (!/^https?:\/\//i.test(finalUrl)) {
              finalUrl = 'https://' + finalUrl;
            }

            if (hasSelection) {
              // If text is selected, turn it into a link
              quill.format('link', finalUrl);
              // Move cursor to the end of the link
              quill.setSelection(range.index + range.length, 0);
            } else {
              // If no text is selected, insert new link text
              const text = window.prompt('Enter link text (or leave empty to use URL as text)', finalUrl.replace(/^https?:\/\//, '').split('/')[0]);
              const linkText = text || finalUrl.trim();

              // CORRECTED: Use insertText to create the link with text
              quill.insertText(index, linkText, 'link', finalUrl);
              quill.setSelection(index + linkText.length, 0);
            }
          }
          // Position cursor after the link
          quill.setSelection(index + 1, 0);
          quill.focus();
          break;

        case 'image':
          const input = document.createElement('input');
          input.setAttribute('type', 'file');
          input.setAttribute('accept', 'image/*');
          input.click();
          input.onchange = () => {
            const file = input.files[0];
            if (file) {
              if (file.size > 5 * 1024 * 1024) {
                setError('Image size should be less than 5MB');
                return;
              }
              const reader = new FileReader();
              reader.onload = (e) => {
                quill.insertEmbed(index, 'image', e.target.result);
                quill.setSelection(index + 1);
              };
              reader.readAsDataURL(file);
            }
          };
          break;

        case 'video':
          const videoUrl = prompt('Enter video URL (YouTube, Vimeo, etc.)', 'https://');
          if (videoUrl && videoUrl.trim()) {
            quill.insertEmbed(index, 'video', videoUrl.trim());
            quill.setSelection(index + 1);
          }
          break;

        default:
          break;
      }
      quill.focus();
    }
  };

  const handleDeleteSelected = () => {
    if (quillRef.current) {
      const quill = quillRef.current.getEditor();
      const range = quill.getSelection();
      if (range && range.length > 0) {
        quill.deleteText(range.index, range.length);
        quill.setSelection(range.index, 0);
      } else {
        setError('Please select some content to delete');
        setTimeout(() => setError(''), 2000);
      }
      quill.focus();
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all content? This action cannot be undone.')) {
      setFormData(prev => ({ ...prev, content: '' }));
      if (quillRef.current) {
        const quill = quillRef.current.getEditor();
        quill.setText('');
      }
    }
  };

  const handleClearFormatting = () => {
    if (quillRef.current) {
      const quill = quillRef.current.getEditor();
      const range = quill.getSelection();
      if (range && range.length > 0) {
        quill.removeFormat(range.index, range.length);
      } else {
        setError('Please select some content to clear formatting');
        setTimeout(() => setError(''), 2000);
      }
      quill.focus();
    }
  };

  // Banner drag handlers
  const handleDragBanner = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActiveBanner(true);
    } else if (e.type === 'dragleave') {
      setDragActiveBanner(false);
    }
  };

  const handleDropBanner = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActiveBanner(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        handleBannerUpload(file);
      } else {
        setError('Only image files are allowed.');
      }
    }
  };

  const handleBannerUpload = (file) => {
    if (file.size > 5 * 1024 * 1024) {
      setError('Banner image size should be less than 5MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewBanner(e.target.result);
      setFormData(prev => ({ ...prev, bannerImage: file }));
      setExistingBannerUrl(null);
    };
    reader.readAsDataURL(file);
  };

  const handleBannerFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleBannerUpload(e.target.files[0]);
    }
  };

  const removeBanner = () => {
    setPreviewBanner(null);
    setExistingBannerUrl(null);
    setFormData(prev => ({ ...prev, bannerImage: null }));
  };

  // Initialize course sections if in edit mode
  useEffect(() => {
    if (initialData.courseSections) {
      setFormData(prev => ({ ...prev, courseSections: [...initialData.courseSections] }));
    }
  }, [initialData.courseSections]);

  // Fetch available tags on component mount
  useEffect(() => {
    fetchAvailableTags();
  }, []);

  // NEW: Fetch available keywords on component mount (mirroring tags)
  useEffect(() => {
    fetchAvailableKeywords();
  }, []);

  // Handle course section changes
  const handleCourseSectionChange = (index, field, value) => {
    const updatedSections = [...formData.courseSections];
    updatedSections[index] = { ...updatedSections[index], [field]: value };
    setFormData(prev => ({ ...prev, courseSections: updatedSections }));
  };

  // Handle course image upload
  const handleCourseImageUpload = (index, file) => {
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const updatedSections = [...formData.courseSections];
      updatedSections[index] = { ...updatedSections[index], imageFile: file, imagePreview: e.target.result };
      setFormData(prev => ({ ...prev, courseSections: updatedSections }));
    };
    reader.readAsDataURL(file);
  };

  // Remove course image
  const removeCourseImage = (index) => {
    const updatedSections = [...formData.courseSections];
    updatedSections[index] = { ...updatedSections[index], imageFile: null, imagePreview: null };
    setFormData(prev => ({ ...prev, courseSections: updatedSections }));
  };

  // Add a new course section
  const addCourseSection = () => {
    setFormData(prev => ({
      ...prev,
      courseSections: [...prev.courseSections, { name: '', description: '', url: '', imageFile: null, imagePreview: null }]
    }));
  };

  // Remove a course section
  const removeCourseSection = (index) => {
    const updatedSections = [...formData.courseSections];
    updatedSections.splice(index, 1);
    setFormData(prev => ({ ...prev, courseSections: updatedSections }));
  };

  // Fetch available tags from backend
  const fetchAvailableTags = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/blogs/tags`);
      if (response.ok) {
        const data = await response.json();
        setAvailableTags(data.tags);
      }
    } catch (err) {
      console.error('Error fetching tags:', err);
    }
  };

  // NEW: Fetch available keywords from backend (mirroring tags)
  const fetchAvailableKeywords = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/blogs/keywords`);
      if (response.ok) {
        const data = await response.json();
        setAvailableKeywords(data.keywords);
      }
    } catch (err) {
      console.error('Error fetching keywords:', err);
    }
  };

  // Populate form data from initial data
  const populateFormData = (data) => {
    // Set basic form fields
    const formData = {
      title: data.title || '',
      urlSlug: data.slug || data.urlSlug || '',
      content: data.content || '',
      category: data.category || '',
      subcategory: data.subcategory || 'Article',
      authorName: data.author || data.authorName || '',
      status: data.status || 'None',
      blogImage: null,
      bannerImage: null,
      tags: data.tags || [],
      keywords: data.keywords || [], // NEW: Added keywords
      // Handle courses data if it exists
      courseSections: data.courses?.map(course => ({
        name: course.name || '',
        description: course.description || '',
        url: course.courseUrl || '',
        imagePreview: course.courseImage || null,
        // Store the public ID for cleanup if needed
        imagePublicId: course.courseImagePublicId || null,
        imageFile: null,
      })) || []
    };

    setFormData(prev => ({ ...prev, ...formData }));

    // Set preview images if they exist
    if (data.image) {
      setExistingImageUrl(data.image);
      setPreviewImage(data.image);
    }
    if (data.bannerImage) {
      setExistingBannerUrl(data.bannerImage);
      setPreviewBanner(data.bannerImage);
    }
  };

  // Initialize with initialData for modal mode or URL params for standalone mode
  useEffect(() => {
    if (isModal && initialData && Object.keys(initialData).length > 0) {
      setIsEditMode(true);
      setBlogId(initialData.id);
      populateFormData(initialData);
    } else if (!isModal) {
      const id = searchParams?.get('id');
      const mode = searchParams?.get('mode');
      if (id && mode === 'edit') {
        setIsEditMode(true);
        setBlogId(id);
        fetchBlogData(id);
      }
    }
  }, [initialData, searchParams, isModal]);

  // Fetch blog data for URL-based editing
  const fetchBlogData = async (id) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('adminToken') || localStorage.getItem('blogToken');
      if (!token) {
        router.push('/AdminLogin');
        return;
      }
      const response = await fetch(`${API_BASE}/api/blogs/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('adminToken');
          localStorage.removeItem('blogToken');
          router.push('/AdminLogin');
          return;
        }
        throw new Error('Failed to fetch blog data');
      }
      const blog = await response.json();
      populateFormData(blog);
    } catch (err) {
      console.error('Error fetching blog data:', err);
      setError('Failed to load blog data for editing');
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-save simulation
  useEffect(() => {
    const interval = setInterval(() => {
      if (formData.title && formData.content) {
        setIsAutoSaving(true);
        setTimeout(() => setIsAutoSaving(false), 1000);
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [formData]);

  // Auto-generate URL slug from title only for new blogs
  useEffect(() => {
    if (!isEditMode && formData.title) {
      setFormData(prev => ({ ...prev, urlSlug: slugify(formData.title) }));
    } else if (!isEditMode) {
      setFormData(prev => ({ ...prev, urlSlug: '' }));
    }
  }, [formData.title, isEditMode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  // Handle rich text content change
  const handleContentChange = (content) => {
    setFormData(prev => ({ ...prev, content }));
    if (error) setError('');
  };

  // Tag handling functions
  const handleTagInputChange = (e) => {
    const value = e.target.value;
    setTagInput(value);
    setShowTagSuggestions(value.length > 0);
  };

  const handleTagInputKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(tagInput.trim());
    } else if (e.key === 'Backspace' && !tagInput && formData.tags.length > 0) {
      removeTag(formData.tags.length - 1);
    }
  };

  const addTag = (tag) => {
    if (!tag) return;
    const normalizedTag = tag.toLowerCase().trim();

    // Validation
    if (normalizedTag.length > 50) {
      setError('Tag cannot be longer than 50 characters');
      return;
    }
    if (formData.tags.length >= 10) {
      setError('Maximum 10 tags allowed');
      return;
    }
    if (formData.tags.includes(normalizedTag)) {
      setError('Tag already added');
      return;
    }

    setFormData(prev => ({ ...prev, tags: [...prev.tags, normalizedTag] }));
    setTagInput('');
    setShowTagSuggestions(false);
    if (error) setError('');
  };

  const removeTag = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, index) => index !== indexToRemove)
    }));
  };

  const addSuggestedTag = (tag) => {
    addTag(tag);
  };

  // Filter suggestions based on input and exclude already added tags
  const getFilteredSuggestions = () => {
    if (!tagInput.trim()) return [];
    return availableTags
      .filter(tag => tag.toLowerCase().includes(tagInput.toLowerCase()) && !formData.tags.includes(tag.toLowerCase()))
      .slice(0, 5);
  };

  // NEW: Keyword handling functions (mirroring tags)
  const handleKeywordInputChange = (e) => {
    const value = e.target.value;
    setKeywordInput(value);
    setShowKeywordSuggestions(value.length > 0);
  };

  const handleKeywordInputKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addKeyword(keywordInput.trim());
    } else if (e.key === 'Backspace' && !keywordInput && formData.keywords.length > 0) {
      removeKeyword(formData.keywords.length - 1);
    }
  };

  const addKeyword = (keyword) => {
    if (!keyword) return;
    const normalizedKeyword = keyword.toLowerCase().trim();

    // Validation
    if (normalizedKeyword.length > 50) {
      setError('Keyword cannot be longer than 50 characters');
      return;
    }
    if (formData.keywords.length >= 10) {
      setError('Maximum 10 keywords allowed');
      return;
    }
    if (formData.keywords.includes(normalizedKeyword)) {
      setError('Keyword already added');
      return;
    }

    setFormData(prev => ({ ...prev, keywords: [...prev.keywords, normalizedKeyword] }));
    setKeywordInput('');
    setShowKeywordSuggestions(false);
    if (error) setError('');
  };

  const removeKeyword = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords.filter((_, index) => index !== indexToRemove)
    }));
  };

  const addSuggestedKeyword = (keyword) => {
    addKeyword(keyword);
  };

  // NEW: Filter keyword suggestions based on input and exclude already added keywords
  const getFilteredKeywordSuggestions = () => {
    if (!keywordInput.trim()) return [];
    return availableKeywords
      .filter(kw => kw.toLowerCase().includes(keywordInput.toLowerCase()) && !formData.keywords.includes(kw.toLowerCase()))
      .slice(0, 5);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        handleImageUpload(file);
      } else {
        setError('Only image files are allowed.');
      }
    }
  };

  const handleImageUpload = (file) => {
    // Validate file size (e.g., 5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewImage(e.target.result);
      setFormData(prev => ({ ...prev, blogImage: file }));
      setExistingImageUrl(null);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleImageUpload(e.target.files[0]);
    }
  };

  const removeImage = () => {
    setPreviewImage(null);
    setExistingImageUrl(null);
    setFormData(prev => ({ ...prev, blogImage: null }));
  };

  const showNotification = (message, type = 'success') => {
    if (isModal) return;
    const notification = document.createElement('div');
    const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
    notification.className = `fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-opacity duration-300`;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => {
      notification.style.opacity = 0;
      setTimeout(() => {
        if (document.body.contains(notification)) document.body.removeChild(notification);
      }, 300);
    }, type === 'success' ? 3000 : 5000);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setIsSubmitting(true);

  try {
    const formDataToSend = new FormData();

    // Append all form fields to formDataToSend
    formDataToSend.append('title', formData.title);
    formDataToSend.append('content', formData.content);
    formDataToSend.append('category', formData.category);
    formDataToSend.append('subcategory', formData.subcategory);
    formDataToSend.append('authorName', formData.authorName);
    formDataToSend.append('status', formData.status);
    formDataToSend.append('urlSlug', formData.urlSlug);
    
    // Append tags and keywords as JSON strings
    if (formData.tags.length > 0) {
      formDataToSend.append('tags', JSON.stringify(formData.tags));
    }
    if (formData.keywords.length > 0) {
      formDataToSend.append('keywords', JSON.stringify(formData.keywords));
    }

    // Handle image uploads
    if (formData.blogImage) {
      formDataToSend.append('image', formData.blogImage);
    }
    if (formData.bannerImage) {
      formDataToSend.append('bannerImage', formData.bannerImage);
    }

    // Handle course sections if they exist
    if (formData.courseSections && formData.courseSections.length > 0) {
      formDataToSend.append('courseSections', JSON.stringify(formData.courseSections));
    }

    // Rest of your existing code...
  
      // Handle modal submission if applicable
      if (isModal && onSave) {
        await onSave({ ...formData, id: blogId });
        setIsSubmitting(false);
        return;
      }
  
      // Get auth token - but DON'T redirect if missing
      const token = localStorage.getItem('adminToken') || localStorage.getItem('blogToken');
      
      // REMOVED: Don't redirect here, let the API request fail and show error
      // if (!token) {
      //   router.push('/AdminLogin');
      //   return;
      // }
  
      // REMOVED: Don't check user here
      // if (!user) {
      //   setError('User not authenticated. Please log in again.');
      //   setIsSubmitting(false);
      //   return;
      // }
  
      // Determine API endpoint and method
      const url = isEditMode ? `${API_BASE}/api/blogs/${blogId}` : `${API_BASE}/api/blogs`;
      const method = isEditMode ? 'PUT' : 'POST';
  
      // Make the API call
      const res = await fetch(url, {
        method,
        headers: {
          // Only add Authorization header if token exists
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: formDataToSend
      });
  
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        if (res.status === 409) {
          throw new Error(errData.message || 'A post with this URL slug already exists.');
        }
        if (res.status === 401) {
          // Show error instead of redirecting
          throw new Error('Authentication required. Please log in first.');
        }
        throw new Error(errData.message || `Failed to ${isEditMode ? 'update' : 'create'} blog post.`);
      }
  
      const data = await res.json();
      showNotification(`Blog post ${isEditMode ? 'updated' : 'created'} successfully!`, 'success');
  
      // Reset form if creating a new post
      if (!isEditMode) {
        setFormData({
          title: '',
          urlSlug: '',
          content: '',
          category: '',
          subcategory: 'Article',
          authorName: '',
          status: 'None',
          blogImage: null,
          bannerImage: null,
          tags: [],
          keywords: [],
          courseSections: []
        });
        setPreviewImage(null);
        setPreviewBanner(null);
        setExistingImageUrl(null);
        setExistingBannerUrl(null);
        setCommonCourseImage({ file: null, preview: null });
        fetchAvailableTags();
        fetchAvailableKeywords();
      }
    } catch (err) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} blog post:`, err);
      const msg = err.message || 'An unexpected error occurred.';
      setError(msg);
      showNotification(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else if (!isModal) {
      router.back();
    }
  };

  const categories = ['SAP', 'IT', 'AI', 'Data Science', 'Data Analytics', 'HR', 'Digital Marketing', 'Cloud Computing'];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading blog data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={isModal ? 'w-full min-h-screen bg-gray-50' : 'w-full'}>
      <div className={isModal ? 'w-full mx-auto' : 'w-full p-4 md:p-6 lg:p-8'}>
        <div className="w-full">
          {/* Form Content */}
          <div className="flex-1 overflow-y-auto pr-[calc(33%+2rem)]">
            <div className="bg-white/95 backdrop-blur rounded-2xl shadow-lg border border-gray-100">
              {/* Form */}
              <form id="blog-form" onSubmit={handleSubmit} className="p-4 md:p-6 lg:p-8 space-y-6 pb-28 sm:pb-0">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
                    <span className="block sm:inline">{error}</span>
                    <button type="button" onClick={() => setError('')} className="absolute top-2 right-2 text-red-600 hover:text-red-700" aria-label="Dismiss error">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Blog Title */}
                <div className="group">
                  <label className={labelBase}>
                    <span className="inline-flex items-center">
                      <Hash className="w-4 h-4 mr-2 text-blue-600" />
                      Blog Title
                    </span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter blog title"
                    className={`${fieldBase} px-4 py-3 text-sm md:text-base`}
                    required
                    disabled={isSubmitting}
                    maxLength={200}
                    aria-describedby="title-help"
                  />
                  <p id="title-help" className={helpText}>
                    Aim for a concise, scannable headline under 70 characters.
                  </p>
                </div>

                {/* URL Slug */}
                <div className="group">
                  <label className={labelBase}>URL Slug</label>
                  <input
                    type="text"
                    name="urlSlug"
                    value={formData.urlSlug}
                    onChange={handleInputChange}
                    placeholder={isEditMode ? 'Edit slug if needed' : 'Auto-generated from title'}
                    className={`${fieldBase} px-4 py-3 text-sm md:text-base ${!isEditMode ? 'bg-gray-50' : ''}`}
                    readOnly={!isEditMode}
                    maxLength={100}
                    aria-describedby="slug-help"
                  />
                  <p id="slug-help" className={helpText}>
                    Use lowercase-with-hyphens; keep it short and descriptive.
                  </p>
                </div>

                {/* Tags Field */}
                <div className="group relative">
                  <label className={labelBase}>
                    <span className="inline-flex items-center">
                      <Tag className="w-4 h-4 mr-2 text-blue-600" />
                      Tags
                    </span>
                  </label>

                  {/* Tags display */}
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {formData.tags.map((tag, index) => (
                        <span key={index} className="inline-flex items-center bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(index)}
                            disabled={isSubmitting}
                            className="ml-1 text-blue-600 hover:text-blue-800 focus:outline-none"
                            aria-label={`Remove tag ${tag}`}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Tag input */}
                  <div className="relative">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={handleTagInputChange}
                      onKeyDown={handleTagInputKeyDown}
                      onFocus={() => setShowTagSuggestions(tagInput.length > 0)}
                      onBlur={() => setTimeout(() => setShowTagSuggestions(false), 200)}
                      placeholder="Type a tag and press Enter or comma"
                      className={`${fieldBase} px-4 py-3 text-sm md:text-base pr-10`}
                      disabled={isSubmitting || formData.tags.length >= 10}
                      maxLength={50}
                      aria-describedby="tags-help"
                    />
                    {/* Add tag button */}
                    <button
                      type="button"
                      onClick={() => addTag(tagInput.trim())}
                      disabled={isSubmitting || !tagInput.trim() || formData.tags.length >= 10}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Add tag"
                    >
                      <Plus className="w-4 h-4" />
                    </button>

                    {/* Tag suggestions */}
                    {showTagSuggestions && getFilteredSuggestions().length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-32 overflow-y-auto">
                        {getFilteredSuggestions().map((tag, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => addSuggestedTag(tag)}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:bg-blue-50 focus:text-blue-700"
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <p id="tags-help" className={helpText}>
                    Add up to 10 tags. Use existing tags for better discoverability. {formData.tags.length}/10
                  </p>
                </div>

                {/* NEW: Keywords Field (mirroring Tags) */}
                <div className="group relative">
                  <label className={labelBase}>
                    <span className="inline-flex items-center">
                      <Tag className="w-4 h-4 mr-2 text-blue-600" />
                      Keywords
                    </span>
                  </label>

                  {/* Keywords display */}
                  {formData.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {formData.keywords.map((kw, index) => (
                        <span key={index} className="inline-flex items-center bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
                          {kw}
                          <button
                            type="button"
                            onClick={() => removeKeyword(index)}
                            disabled={isSubmitting}
                            className="ml-1 text-blue-600 hover:text-blue-800 focus:outline-none"
                            aria-label={`Remove keyword ${kw}`}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Keyword input */}
                  <div className="relative">
                    <input
                      type="text"
                      value={keywordInput}
                      onChange={handleKeywordInputChange}
                      onKeyDown={handleKeywordInputKeyDown}
                      onFocus={() => setShowKeywordSuggestions(keywordInput.length > 0)}
                      onBlur={() => setTimeout(() => setShowKeywordSuggestions(false), 200)}
                      placeholder="Type a keyword and press Enter or comma"
                      className={`${fieldBase} px-4 py-3 text-sm md:text-base pr-10`}
                      disabled={isSubmitting || formData.keywords.length >= 10}
                      maxLength={50}
                      aria-describedby="keywords-help"
                    />
                    {/* Add keyword button */}
                    <button
                      type="button"
                      onClick={() => addKeyword(keywordInput.trim())}
                      disabled={isSubmitting || !keywordInput.trim() || formData.keywords.length >= 10}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Add keyword"
                    >
                      <Plus className="w-4 h-4" />
                    </button>

                    {/* Keyword suggestions */}
                    {showKeywordSuggestions && getFilteredKeywordSuggestions().length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-32 overflow-y-auto">
                        {getFilteredKeywordSuggestions().map((kw, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => addSuggestedKeyword(kw)}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:bg-blue-50 focus:text-blue-700"
                          >
                            {kw}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <p id="keywords-help" className={helpText}>
                    Add up to 10 keywords. Use existing keywords for better SEO. {formData.keywords.length}/10
                  </p>
                </div>

                {/* Rich Text Editor with Sticky Quick Actions Toolbar */}
                <div className="group">
                  <label className={labelBase}>
                    <span className="inline-flex items-center">
                      <Edit className="w-4 h-4 mr-2 text-blue-600" />
                      Content
                    </span>
                  </label>

                  {/* Sticky Quick Actions Bar */}
                  <div className="sticky top-4 z-30 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg mb-2">
                    <div className="flex flex-wrap items-center p-3 gap-2 overflow-x-auto">
                      {/* Header/Format Dropdown */}
                      <select
                        onChange={(e) => applyQuickFormat('header', e.target.value ? parseInt(e.target.value) : false)}
                        className="text-sm border border-gray-300 rounded px-3 py-2 bg-white hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 min-w-[80px]"
                        title="Text Format"
                      >
                        <option value="">Normal</option>
                        <option value="1">Heading 1</option>
                        <option value="2">Heading 2</option>
                        <option value="3">Heading 3</option>
                        <option value="4">Heading 4</option>
                        <option value="5">Heading 5</option>
                        <option value="6">Heading 6</option>
                      </select>

                      {/* Font Family Dropdown */}
                      <select
                        onChange={(e) => applyQuickFormat('font', e.target.value)}
                        className="text-sm border border-gray-300 rounded px-3 py-2 bg-white hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 min-w-[100px]"
                        title="Font Family"
                      >
                        <option value="">Sans Serif</option>
                        <option value="serif">Serif</option>
                        <option value="monospace">Monospace</option>
                      </select>

                      {/* Font Size Dropdown */}
                      <select
                        onChange={(e) => applyQuickFormat('size', e.target.value)}
                        className="text-sm border border-gray-300 rounded px-3 py-2 bg-white hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 min-w-[80px]"
                        title="Font Size"
                      >
                        <option value="">Normal</option>
                        <option value="small">Small</option>
                        <option value="large">Large</option>
                        <option value="huge">Huge</option>
                      </select>

                      {/* Separator */}
                      <div className="w-px h-6 bg-gray-300 mx-1"></div>

                      {/* Bold */}
                      <button type="button" onClick={() => applyQuickFormat('bold')} className="p-2.5 hover:bg-gray-100 active:bg-gray-200 rounded transition-colors font-bold text-sm border border-transparent hover:border-gray-300" title="Bold (Ctrl+B)">
                        <Bold className="w-4 h-4" />
                      </button>

                      {/* Italic */}
                      <button type="button" onClick={() => applyQuickFormat('italic')} className="p-2.5 hover:bg-gray-100 active:bg-gray-200 rounded transition-colors text-sm border border-transparent hover:border-gray-300" title="Italic (Ctrl+I)">
                        <Italic className="w-4 h-4" />
                      </button>

                      {/* Underline */}
                      <button type="button" onClick={() => applyQuickFormat('underline')} className="p-2.5 hover:bg-gray-100 active:bg-gray-200 rounded transition-colors text-sm border border-transparent hover:border-gray-300" title="Underline (Ctrl+U)">
                        <Underline className="w-4 h-4" />
                      </button>

                      {/* Strikethrough */}
                      <button type="button" onClick={() => applyQuickFormat('strike')} className="p-2.5 hover:bg-gray-100 active:bg-gray-200 rounded transition-colors text-sm border border-transparent hover:border-gray-300" title="Strikethrough">
                        <span className="line-through font-bold">S</span>
                      </button>

                      {/* Separator */}
                      <div className="w-px h-6 bg-gray-300 mx-1"></div>

                      {/* Text Color */}
                      <div className="relative">
                        <input type="color" onChange={(e) => applyQuickFormat('color', e.target.value)} className="w-10 h-10 border border-gray-300 rounded cursor-pointer bg-white" title="Text Color" />
                        <span className="absolute -bottom-1 -right-1 text-xs font-bold text-blue-600">A</span>
                      </div>

                      {/* Background Color */}
                      <div className="relative">
                        <input type="color" onChange={(e) => applyQuickFormat('background', e.target.value)} className="w-10 h-10 border border-gray-300 rounded cursor-pointer" title="Background Color" defaultValue="#ffff00" />
                        <span className="absolute -bottom-1 -right-1 text-xs"></span>
                      </div>

                      {/* Separator */}
                      <div className="w-px h-6 bg-gray-300 mx-1"></div>

                      {/* Align Left */}
                      <button type="button" onClick={() => applyQuickFormat('align', '')} className="p-2.5 hover:bg-gray-100 active:bg-gray-200 rounded transition-colors border border-transparent hover:border-gray-300" title="Align Left">
                        <AlignLeft className="w-4 h-4" />
                      </button>

                      {/* Align Center */}
                      <button type="button" onClick={() => applyQuickFormat('align', 'center')} className="p-2.5 hover:bg-gray-100 active:bg-gray-200 rounded transition-colors border border-transparent hover:border-gray-300" title="Align Center">
                        <AlignCenter className="w-4 h-4" />
                      </button>

                      {/* Align Right */}
                      <button type="button" onClick={() => applyQuickFormat('align', 'right')} className="p-2.5 hover:bg-gray-100 active:bg-gray-200 rounded transition-colors border border-transparent hover:border-gray-300" title="Align Right">
                        <AlignRight className="w-4 h-4" />
                      </button>

                      {/* Justify */}
                      <button type="button" onClick={() => applyQuickFormat('align', 'justify')} className="p-2.5 hover:bg-gray-100 active:bg-gray-200 rounded transition-colors border border-transparent hover:border-gray-300" title="Justify">
                        <AlignJustify className="w-4 h-4" />
                      </button>

                      {/* Separator */}
                      <div className="w-px h-6 bg-gray-300 mx-1"></div>

                      {/* Bullet List */}
                      <button type="button" onClick={() => applyQuickFormat('list', 'bullet')} className="p-2.5 hover:bg-gray-100 active:bg-gray-200 rounded transition-colors border border-transparent hover:border-gray-300" title="Bullet List">
                        <List className="w-4 h-4" />
                      </button>

                      {/* Numbered List */}
                      <button type="button" onClick={() => applyQuickFormat('list', 'ordered')} className="p-2.5 hover:bg-gray-100 active:bg-gray-200 rounded transition-colors font-mono text-sm font-bold border border-transparent hover:border-gray-300" title="Numbered List">
                        1.
                      </button>

                      {/* Decrease Indent */}
                      <button type="button" onClick={() => applyQuickFormat('indent', '-1')} className="p-2.5 hover:bg-gray-100 active:bg-gray-200 rounded transition-colors border border-transparent hover:border-gray-300" title="Decrease Indent">
                        <Outdent className="w-4 h-4" />
                      </button>

                      {/* Increase Indent */}
                      <button type="button" onClick={() => applyQuickFormat('indent', '+1')} className="p-2.5 hover:bg-gray-100 active:bg-gray-200 rounded transition-colors border border-transparent hover:border-gray-300" title="Increase Indent">
                        <Indent className="w-4 h-4" />
                      </button>

                      {/* Separator */}
                      <div className="w-px h-6 bg-gray-300 mx-1"></div>

                      {/* Link */}
                      <button type="button" onClick={() => insertQuickContent('link')} className="p-2.5 hover:bg-gray-100 active:bg-gray-200 rounded transition-colors border border-transparent hover:border-gray-300" title="Insert Link">
                        <Link className="w-4 h-4" />
                      </button>

                      {/* Image */}
                      <button type="button" onClick={() => insertQuickContent('image')} className="p-2.5 hover:bg-gray-100 active:bg-gray-200 rounded transition-colors border border-transparent hover:border-gray-300" title="Insert Image">
                        <ImageIcon className="w-4 h-4" />
                      </button>

                      {/* Video */}
                      <button type="button" onClick={() => insertQuickContent('video')} className="p-2.5 hover:bg-gray-100 active:bg-gray-200 rounded transition-colors border border-transparent hover:border-gray-300" title="Insert Video">
                        <Video className="w-4 h-4" />
                      </button>

                      {/* Separator */}
                      <div className="w-px h-6 bg-gray-300 mx-1"></div>

                      {/* Blockquote */}
                      <button type="button" onClick={() => applyQuickFormat('blockquote', true)} className="p-2.5 hover:bg-gray-100 active:bg-gray-200 rounded transition-colors text-lg font-bold border border-transparent hover:border-gray-300" title="Blockquote">
                        <Quote className="w-4 h-4" />
                      </button>

                      {/* Code Block */}
                      <button type="button" onClick={() => applyQuickFormat('code-block', true)} className="p-2.5 hover:bg-gray-100 active:bg-gray-200 rounded transition-colors border border-transparent hover:border-gray-300" title="Code Block">
                        <Code className="w-4 h-4" />
                      </button>

                      {/* Separator */}
                      <div className="w-px h-6 bg-gray-300 mx-1"></div>

                      {/* Delete Selected */}
                      <button type="button" onClick={handleDeleteSelected} className="p-2.5 hover:bg-red-100 active:bg-red-200 rounded transition-colors text-red-600 border border-transparent hover:border-red-300" title="Delete Selected Content">
                        <Trash2 className="w-4 h-4" />
                      </button>

                      {/* Clear Formatting */}
                      <button type="button" onClick={handleClearFormatting} className="p-2.5 hover:bg-orange-100 active:bg-orange-200 rounded transition-colors text-orange-600 font-bold text-sm border border-transparent hover:border-orange-300" title="Clear Formatting">
                        f<span className="text-xs">x</span>
                      </button>
                    </div>
                  </div>

                  {/* Rich Text Editor */}
                  <div className="rounded-xl border border-gray-200 bg-white ring-1 ring-gray-200 focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 transition-shadow overflow-hidden">
                    <ReactQuill
                      ref={quillRef}
                      theme="snow"
                      value={formData.content}
                      onChange={handleContentChange}
                      modules={quillModules}
                      formats={quillFormats}
                      placeholder="Write your blog content here... Use the sticky toolbar above for quick formatting. Select text and use the formatting buttons for instant styling."
                      style={{ 
                        minHeight: '400px',
                        backgroundColor: '#ffffff',
                        color: '#000000'  // Force black text
                      }}
                      readOnly={isSubmitting}
                      className="text-black [&_.ql-editor]:text-black [&_.ql-editor_*]:text-black"
                    />
                  </div>

                  <p id="content-help" className={helpText}>
                    <strong>Professional Rich Text Editor:</strong> Sticky toolbar with all formatting tools always visible! <br />
                    <strong>Quick Tips:</strong> Select text & Use toolbar buttons | Dropdowns for headers/fonts/sizes | Color pickers | Lists & alignment | Links & media
                  </p>
                </div>

                {/* Category and Subcategory */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelBase}>Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className={`${fieldBase} px-4 py-3 text-sm md:text-base`}
                      required
                      disabled={isSubmitting}
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelBase}>Subcategory</label>
                    <select
                      name="subcategory"
                      value={formData.subcategory}
                      onChange={handleInputChange}
                      className={`${fieldBase} px-4 py-3 text-sm md:text-base`}
                      required
                      disabled={isSubmitting}
                      aria-describedby="subcat-help"
                    >
                      {subcategoryOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                    <p id="subcat-help" className={helpText}>
                      Must match backend enum values exactly.
                    </p>
                  </div>
                </div>

                {/* Author and Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelBase} htmlFor="authorName">
                      <span className="inline-flex items-center">
                        <User className="w-4 h-4 mr-2 text-blue-600" />
                        Author Name
                      </span>
                    </label>
                    <input
                      type="text"
                      name="authorName"
                      value={formData.authorName}
                      onChange={handleInputChange}
                      placeholder={user?.username || 'Enter author name'}
                      className={`${fieldBase} px-4 py-3 text-sm md:text-base`}
                      required
                      disabled={isSubmitting}
                      maxLength={50}
                    />
                  </div>
                  <div>
                    <label className={labelBase}>Status</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className={`${fieldBase} px-4 py-3 text-sm md:text-base`}
                      disabled={isSubmitting}
                      aria-describedby="status-help"
                    >
                      {statusOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                    <p id="status-help" className={helpText}>
                      Display status used for highlighting, not publishing state.
                    </p>
                  </div>
                </div>

                {/* Blog Images Upload Section - Featured Image & Banner Side by Side */}
                <div className="space-y-4">
                  <label className={labelBase}>
                    <span className="inline-flex items-center">
                      <Camera className="w-4 h-4 mr-2 text-blue-600" />
                      Blog Images
                    </span>
                  </label>

                  {/* Side by Side Image Upload */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Featured Image */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Featured Image</h4>
                      <div
                        className={`relative w-full min-h-[200px] rounded-xl p-4 flex items-center justify-center bg-white shadow-sm border-2 border-dashed ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-200'} ring-1 ring-gray-200 focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 transition-all`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        tabIndex={0}
                        role="button"
                        aria-label="Upload featured image"
                      >
                        {previewImage ? (
                          <div className="relative w-full">
                            <div className="aspect-video w-full bg-gray-100 rounded-lg overflow-hidden">
                              <img src={previewImage} alt="Featured Preview" className="h-full w-full object-cover" />
                            </div>
                            <button
                              type="button"
                              onClick={removeImage}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                              disabled={isSubmitting}
                              aria-label="Remove featured image"
                            >
                              <X className="w-4 h-4" />
                            </button>
                            {isEditMode && existingImageUrl && !formData.blogImage && (
                              <p className="text-xs text-blue-600 mt-2">Current featured image</p>
                            )}
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center w-full text-center">
                            <Upload className="w-10 h-10 text-gray-400 mb-2" />
                            <p className="text-gray-700 mb-2 text-sm">Drag & drop featured image</p>
                            <label className="cursor-pointer inline-flex items-center justify-center rounded-lg px-3 py-2 bg-blue-600 text-white font-medium hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 text-sm">
                              Browse
                              <input type="file" accept="image/*" onChange={handleFileInput} className="hidden" disabled={isSubmitting} />
                            </label>
                            <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 5MB</p>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Main blog cover image displayed in listings</p>
                    </div>

                    {/* Banner Image */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Banner Image</h4>
                      <div
                        className={`relative w-full min-h-[200px] rounded-xl p-4 flex items-center justify-center bg-white shadow-sm border-2 border-dashed ${dragActiveBanner ? 'border-green-500 bg-green-50' : 'border-gray-200'} ring-1 ring-gray-200 focus-within:ring-2 focus-within:ring-green-600 focus-within:ring-offset-2 transition-all`}
                        onDragEnter={handleDragBanner}
                        onDragLeave={handleDragBanner}
                        onDragOver={handleDragBanner}
                        onDrop={handleDropBanner}
                        tabIndex={0}
                        role="button"
                        aria-label="Upload banner image"
                      >
                        {previewBanner ? (
                          <div className="relative w-full">
                            <div className="aspect-video w-full bg-gray-100 rounded-lg overflow-hidden">
                              <img src={previewBanner} alt="Banner Preview" className="h-full w-full object-cover" />
                            </div>
                            <button
                              type="button"
                              onClick={removeBanner}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                              disabled={isSubmitting}
                              aria-label="Remove banner image"
                            >
                              <X className="w-4 h-4" />
                            </button>
                            {isEditMode && existingBannerUrl && !formData.bannerImage && (
                              <p className="text-xs text-green-600 mt-2">Current banner image</p>
                            )}
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center w-full text-center">
                            <Upload className="w-10 h-10 text-gray-400 mb-2" />
                            <p className="text-gray-700 mb-2 text-sm">Drag & drop banner image</p>
                            <label className="cursor-pointer inline-flex items-center justify-center rounded-lg px-3 py-2 bg-green-600 text-white font-medium hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2 text-sm">
                              Browse
                              <input type="file" accept="image/*" onChange={handleBannerFileInput} className="hidden" disabled={isSubmitting} />
                            </label>
                            <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 5MB</p>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Wide banner image for blog header/hero section</p>
                    </div>
                  </div>

                  <p className={helpText}>
                    <strong>Featured Image:</strong> Main cover image shown in blog listings and social shares. <br />
                    <strong>Banner Image:</strong> Wide header image displayed at the top of the blog post page.
                  </p>
                </div>

                {/* NEW: Explore Other Course Section with Common Course Image */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className={labelBase}>
                      <span className="flex items-center">
                        <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
                        Explore Other Courses
                      </span>
                    </label>
                    <button
                      type="button"
                      onClick={addCourseSection}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Course
                    </button>
                  </div>

                  {/* NEW: Common Course Image Section */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="text-sm font-semibold text-blue-800 mb-1">Common Course Image</h4>
                        <p className="text-xs text-blue-600">Upload one image to use for all courses</p>
                      </div>
                      {commonCourseImage.preview && (
                        <button
                          type="button"
                          onClick={applyCommonImageToAllCourses}
                          className="px-3 py-2 bg-blue-600 text-white rounded-md text-xs font-medium hover:bg-blue-700 transition-colors"
                        >
                          Apply to All Courses
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Common Image Upload Area */}
                      <div>
                        <div className={`relative w-full aspect-[4/3] rounded-lg border-2 border-dashed ${commonCourseImage.preview ? 'border-transparent' : 'border-blue-300 hover:border-blue-500'} bg-blue-50 flex items-center justify-center overflow-hidden`}>
                          {commonCourseImage.preview ? (
                            <>
                              <img src={commonCourseImage.preview} alt="Common course preview" className="absolute inset-0 w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={removeCommonCourseImage}
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                aria-label="Remove common course image"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </>
                          ) : (
                            <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer p-4 text-center">
                              <ImageIcon className="w-12 h-12 text-blue-400 mb-2" />
                              <span className="text-sm text-blue-700 font-medium">Upload Common Course Image</span>
                              <span className="text-xs text-blue-500 mt-1">Will be applied to all courses</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    handleCommonCourseImageUpload(e.target.files[0]);
                                  }
                                }}
                              />
                            </label>
                          )}
                        </div>
                      </div>

                      {/* Preview/Instructions */}
                      <div className="flex flex-col justify-center">
                        <div className="bg-white rounded-lg p-3 border border-blue-200">
                          <h5 className="text-sm font-medium text-gray-800 mb-2">How it works</h5>
                          <ul className="text-xs text-gray-600 space-y-1">
                            <li>Upload one image here</li>
                            <li>Click "Apply to All Courses"</li>
                            <li>All courses will use this image</li>
                            <li>Individual uploads override this</li>
                          </ul>
                        </div>
                        {formData.courseSections.length > 0 && (
                          <div className="mt-3 pt-2 border-t border-blue-200">
                            <p className="text-xs text-blue-600">
                              {formData.courseSections.length} courses will receive this image
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Course Sections List */}
                  {formData.courseSections.length > 0 ? (
                    <div className="space-y-4">
                      {formData.courseSections.map((section, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <div className="flex justify-between items-center mb-3">
                            <h4 className="text-sm font-medium text-gray-700">Course {index + 1}</h4>
                            <button
                              type="button"
                              onClick={() => removeCourseSection(index)}
                              className="text-red-600 hover:text-red-800"
                              aria-label="Remove course section"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          <div className="space-y-3 md:flex md:space-x-4">
                            <div className="flex-1 space-y-3">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Course Name</label>
                                <input
                                  type="text"
                                  value={section.name}
                                  onChange={(e) => handleCourseSectionChange(index, 'name', e.target.value)}
                                  className={`${fieldBase} px-3 py-2 text-sm w-full`}
                                  placeholder="e.g., Advanced React Patterns"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Course URL</label>
                                <input
                                  type="url"
                                  value={section.url}
                                  onChange={(e) => handleCourseSectionChange(index, 'url', e.target.value)}
                                  className={`${fieldBase} px-3 py-2 text-sm w-full`}
                                  placeholder="https://example.com/course"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                  value={section.description}
                                  onChange={(e) => handleCourseSectionChange(index, 'description', e.target.value)}
                                  className={`${fieldBase} px-3 py-2 text-sm min-h-[100px] w-full`}
                                  placeholder="Brief description of what this course covers"
                                  rows={3}
                                />
                              </div>
                            </div>
                            <div className="w-full md:w-64 flex-shrink-0">
                              <label className="block text-sm font-medium text-gray-700 mb-1">Course Image</label>
                              <div className={`relative w-full aspect-[4/3] rounded-lg border-2 border-dashed ${section.imagePreview ? 'border-transparent' : 'border-gray-300 hover:border-blue-500'} bg-gray-50 flex items-center justify-center overflow-hidden`}>
                                {section.imagePreview ? (
                                  <>
                                    <img src={section.imagePreview} alt="Course preview" className="absolute inset-0 w-full h-full object-cover" />
                                    <button
                                      type="button"
                                      onClick={() => removeCourseImage(index)}
                                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                      aria-label="Remove course image"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </>
                                ) : (
                                  <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer p-2 text-center">
                                    <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                                    <span className="text-xs text-gray-500">Click to upload</span>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      className="hidden"
                                      onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                          handleCourseImageUpload(index, e.target.files[0]);
                                        }
                                      }}
                                    />
                                  </label>
                                )}
                              </div>
                              <p className="text-xs text-gray-500 mt-1 text-center">Recommended: 800x600px (4:3 ratio)</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg bg-white">
                      <BookOpen className="mx-auto h-10 w-10 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No courses added</h3>
                      <p className="mt-1 text-sm text-gray-500">Get started by adding a new course.</p>
                      <div className="mt-4">
                        <button
                          type="button"
                          onClick={addCourseSection}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <Plus className="-ml-1 mr-2 h-5 w-5" />
                          Add Course
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Desktop/tablet actions (inline) */}
                <div className="hidden sm:flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`flex-1 ${isEditMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'} text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 disabled:opacity-70`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {isEditMode ? 'Updating...' : 'Publishing...'}
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5 inline mr-2" />
                        {isEditMode ? 'Update Post' : 'Publish Now'}
                      </>
                    )}
                  </button>
                  {isModal && onCancel ? (
                    <button
                      type="button"
                      onClick={handleCancel}
                      disabled={isSubmitting}
                      className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  ) : null}
                </div>
              </form>

              {/* Mobile sticky bar actions */}
              <div className="sm:hidden">
                <div className="fixed inset-x-0 bottom-0 z-40 bg-white/90 backdrop-blur border-t border-gray-200 p-3">
                  <div className="flex gap-2">
                    {isModal && onCancel ? (
                      <button
                        type="button"
                        onClick={handleCancel}
                        disabled={isSubmitting}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    ) : null}
                    <button
                      form="blog-form"
                      type="submit"
                      disabled={isSubmitting}
                      className={`flex-1 ${isEditMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'} text-white font-semibold py-3 px-4 rounded-xl transition-colors disabled:opacity-70`}
                    >
                      {isSubmitting ? 'Saving...' : (isEditMode ? 'Update' : 'Publish')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Updated Preview column (standalone only) */}
          {!isModal && (
            <div className="fixed right-12 top-12 bottom-12 w-[32%] max-w-[500px] overflow-y-auto bg-white shadow-2xl rounded-xl z-50 text-black">
              <div className="bg-white p-6 h-full rounded-xl">
                <div className="flex items-center mb-6">
                  <Eye className="w-5 h-5 mr-2 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-800">Preview</h3>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 min-h-48 flex flex-col text-black">
                  {/* Updated preview section with both images */}
                  <div className="space-y-3 mb-4">
                    {/* Featured Image Preview */}
                    <div className="w-full rounded-lg overflow-hidden bg-gray-100">
                      <div className="aspect-video w-full">
                        {previewImage ? (
                          <img src={previewImage} alt="Featured preview" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="w-16 h-16 text-gray-300" />
                            <span className="ml-2 text-gray-500 text-sm">Featured Image</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-black text-center mt-1">Featured Image</p>

                    {/* Banner Image Preview */}
                    <div className="w-full rounded-lg overflow-hidden bg-gray-100">
                      <div className="aspect-[3/1] w-full">
                        {previewBanner ? (
                          <img src={previewBanner} alt="Banner preview" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="w-16 h-16 text-gray-300" />
                            <span className="ml-2 text-gray-500 text-sm">Banner Image</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-black text-center mt-1">Banner Image</p>
                  </div>

                  <div className="flex items-center text-sm text-black mb-4 flex-wrap gap-x-2">
                    <User className="w-5 h-5 mr-2" />
                    <span>{formData.authorName || user?.username || 'Author Name'}</span>
                    <span className="mx-1">•</span>
                    <Calendar className="w-5 h-5 mr-1" />
                    <span>{new Date().toLocaleDateString()}</span>
                    <span className="mx-1">•</span>
                    <span>5 min read</span>
                  </div>

                  <h4 className="font-bold text-black text-xl mb-2">
                    {formData.title || 'Your Blog Title Will Appear Here'}
                  </h4>

                  <div className="flex gap-2 mb-3 flex-wrap">
                    {formData.category && (
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">{formData.category}</span>
                    )}
                    {formData.subcategory && (
                      <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold">{formData.subcategory}</span>
                    )}
                    {formData.status && formData.status !== 'None' && (
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">{formData.status}</span>
                    )}
                  </div>

                  {/* Tags preview */}
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {formData.tags.map((tag, index) => (
                        <span key={index} className="inline-flex items-center bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-md">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* NEW: Keywords preview */}
                  {formData.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {formData.keywords.map((kw, index) => (
                        <span key={index} className="inline-flex items-center bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-md">
                          {kw}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Rich content preview */}
                  <div className="text-gray-700 text-sm leading-relaxed mb-4 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: formData.content || 'Your blog content preview will be displayed here as you type with full formatting, colors, images, and links...' }} />

                  <hr className="my-2" />

                  {/* Course sections preview */}
                  {formData.courseSections.length > 0 && (
                    <div className="mt-4">
                      <h5 className="text-md font-semibold text-gray-800 mb-2">Explore Other Courses</h5>
                      <div className="space-y-3">
                        {formData.courseSections.map((section, index) => (
                          <div key={index} className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                            <div className="flex gap-3">
                              {section.imagePreview ? (
                                <img src={section.imagePreview} alt={section.name} className="w-24 h-18 object-cover rounded" />
                              ) : (
                                <div className="w-24 h-18 bg-gray-100 flex items-center justify-center rounded">
                                  <ImageIcon className="w-8 h-8 text-gray-300" />
                                </div>
                              )}
                              <div className="flex-1">
                                <h6 className="text-sm font-medium text-gray-800">{section.name || 'Course Name'}</h6>
                                <p className="text-xs text-gray-600 mt-1">{section.description || 'Course description'}</p>
                                <a href={section.url} className="text-xs text-blue-600 mt-1 inline-block" target="_blank" rel="noopener noreferrer">
                                  Learn More →
                                </a>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-gray-400 text-sm mt-auto">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.364l-7.682-7.682a4.5 4.5 0 010-6.364z" />
                        </svg>
                        0 likes
                      </span>
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 012 2v8a2 2 0 01-2 2H7a2 2 0 01-2-2v-8a2 2 0 012-2h2m4-4h-4a2 2 0 00-2 2v4a2 2 0 002 2h4a2 2 0 002-2v-4a2 2 0 00-2-2z" />
                        </svg>
                        0 comments
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Custom Quill Styles with Sticky Toolbar */}
      <style jsx global>{`
        .ql-editor {
          min-height: 400px !important;
          font-size: 14px;
          line-height: 1.6;
          font-family: inherit;
          color: #000000 !important;  /* Force black text */
        }
        
        /* Ensure all text in the editor is black */
        .ql-editor,
        .ql-editor p,
        .ql-editor h1,
        .ql-editor h2,
        .ql-editor h3,
        .ql-editor h4,
        .ql-editor h5,
        .ql-editor h6,
        .ql-editor div,
        .ql-editor span,
        .ql-editor strong,
        .ql-editor em,
        .ql-editor u,
        .ql-editor a,
        .ql-editor li,
        .ql-editor ol,
        .ql-editor ul,
        .ql-editor blockquote,
        .ql-editor pre,
        .ql-editor code {
          color: #000000 !important;
        }

        /* Custom Quill toolbar styles */
        .ql-toolbar {
          display: none !important; /* Hide default toolbar */
        }
        
        /* Custom sticky toolbar styles */
        .sticky-toolbar {
          background-color: #f8f9fa !important;
          border: 1px solid #e2e8f0 !important;
          border-radius: 0.5rem 0.5rem 0 0 !important;
          padding: 8px 12px !important;
          z-index: 10 !important;
        }
        
        /* Toolbar buttons and text */
        .sticky-toolbar button,
        .sticky-toolbar select,
        .sticky-toolbar .ql-formats {
          color: #ffffffff !important;
        }
        
        /* Hover states */
        .sticky-toolbar button:hover,
        .sticky-toolbar select:hover {
          color: #1a365d !important;
          background-color: #e2e8f0 !important;
        }

        .ql-container {
          border: none !important;
          font-family: inherit;
          border-radius: 0.75rem;
        }

        @media (min-width: 768px) {
          .ql-editor {
            font-size: 16px;
          }
        }

        /* Style for images in content */
        .ql-editor img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 10px 0;
          cursor: pointer;
          transition: transform 0.2s ease;
        }

        .ql-editor img:hover {
          transform: scale(1.02);
        }

        /* Style for links in content */
        .ql-editor a {
          display: inline;
          color: #2563eb;
          text-decoration: none;
        }

        .ql-editor a:hover {
          color: #1d4ed8;
        }

        /* Enhanced focus styles */
        .ql-editor:focus {
          outline: none;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
        }

        /* Style for blockquotes */
        .ql-editor blockquote {
          border-left: 4px solid #d1d5db;
          padding-left: 16px;
          margin: 16px 0;
          font-style: italic;
          background: #f9fafb;
          border-radius: 4px;
          padding: 12px 16px;
        }

        /* Style for code blocks */
        .ql-editor pre {
          background: #1f2937;
          color: #f9fafb;
          padding: 16px;
          border-radius: 8px;
          overflow-x: auto;
        }

        /* Style for inline code */
        .ql-editor code {
          background: #f3f4f6;
          padding: 2px 6px;
          border-radius: 4px;
          font-family: 'Courier New', monospace;
        }

        /* List styling */
        .ql-editor ul, .ql-editor ol {
          margin: 16px 0;
          padding-left: 24px;
        }

        .ql-editor li {
          margin: 4px 0;
        }

        /* Enhanced heading styles */
        .ql-editor h1 { font-size: 2rem; font-weight: bold; margin: 24px 0 16px; }
        .ql-editor h2 { font-size: 1.75rem; font-weight: bold; margin: 20px 0 14px; }
        .ql-editor h3 { font-size: 1.5rem; font-weight: bold; margin: 16px 0 12px; }
        .ql-editor h4 { font-size: 1.25rem; font-weight: bold; margin: 14px 0 10px; }
        .ql-editor h5 { font-size: 1.1rem; font-weight: bold; margin: 12px 0 8px; }
        .ql-editor h6 { font-size: 1rem; font-weight: bold; margin: 10px 0 6px; }
      `}</style>
    </div>
  );
}
