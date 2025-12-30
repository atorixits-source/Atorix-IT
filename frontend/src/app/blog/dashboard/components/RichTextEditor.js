'use client';

import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

const RichTextEditor = ({ value, onChange, placeholder = 'Write your blog content here...' }) => {
  // Dynamically import ReactQuill to avoid SSR issues
  const ReactQuill = useMemo(() => dynamic(
    () => import('react-quill'),
    { ssr: false }
  ), []);

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image', 'video'],
      ['blockquote', 'code-block'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'list', 'bullet',
    'link', 'image', 'video',
    'blockquote', 'code-block'
  ];

  return (
    <div className="rich-text-editor">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        className="min-h-[200px]"
      />
      <style jsx global>{`
        .rich-text-editor .ql-container {
          min-height: 200px;
          border-radius: 0 0 0.5rem 0.5rem;
        }
        .rich-text-editor .ql-toolbar {
          border-radius: 0.5rem 0.5rem 0 0;
          background-color: #f8f9fa;
        }
        .rich-text-editor .ql-editor {
          min-height: 200px;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
