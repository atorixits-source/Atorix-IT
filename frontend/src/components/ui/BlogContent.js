'use client';

import { useEffect, useMemo, useState, useRef } from 'react';
import DOMPurify from 'isomorphic-dompurify';

const ALLOWED_TAGS = [
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'p', 'br', 'a', 'ul', 'ol', 'li',
  'strong', 'em', 'u', 's', 'blockquote',
  'pre', 'code', 'hr', 'div', 'span', 'img',
  'table', 'thead', 'tbody', 'tr', 'th', 'td',
];

const ALLOWED_ATTR = [
  'href', 'target', 'rel', 'class', 'src',
  'alt', 'width', 'height', 'loading', 'id',
];

const generateSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export default function BlogContent({ content = '' }) {
  const [isClient, setIsClient] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const sanitizedContent = useMemo(() => {
    const raw = typeof content === 'string' ? content : '';
    return DOMPurify.sanitize(raw, {
      ALLOWED_TAGS,
      ALLOWED_ATTR,
    });
  }, [content]);

  useEffect(() => {
    if (isClient && contentRef.current) {
      const headings = contentRef.current.querySelectorAll(
        'h1, h2, h3, h4, h5, h6'
      );
      headings.forEach((heading) => {
        if (!heading.id) {
          const text = heading.textContent || '';
          const slug = generateSlug(text);
          if (slug) heading.id = slug;
        }
      });
    }
  }, [sanitizedContent, isClient]);

  useEffect(() => {
    if (isClient && contentRef.current) {
      const links = contentRef.current.querySelectorAll('a');
      links.forEach((link) => {
        link.style.color = '#2563eb';
        link.style.textDecoration = 'underline';
        link.style.textDecorationColor = '#2563eb';
        link.classList.add('blog-link');
      });
    }
  }, [sanitizedContent, isClient]);

  if (!isClient) return null;

  return (
    <>
      <style jsx global>{`
        .prose a,
        .prose a:visited,
        .prose a:link {
          color: #2563eb !important;
          text-decoration: underline !important;
          text-decoration-color: #2563eb !important;
        }
        .prose a:hover {
          color: #1d4ed8 !important;
          text-decoration-color: #1d4ed8 !important;
        }
        .prose a:active {
          color: #1e40af !important;
        }

        article a,
        article a:visited,
        article a:link,
        [class*='prose'] a,
        [class*='prose'] a:visited,
        [class*='prose'] a:link {
          color: #2563eb !important;
          text-decoration: underline !important;
          text-decoration-color: #2563eb !important;
        }
        article a:hover,
        [class*='prose'] a:hover {
          color: #1d4ed8 !important;
          text-decoration-color: #1d4ed8 !important;
        }

        .prose pre {
          white-space: pre-wrap;
          word-break: break-word;
        }
      `}</style>

      {/* IMPORTANT: className ek hi line me */}
      <div className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl dark:prose-invert max-w-none break-words text-wrap">
        <div
          ref={contentRef}
          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        />
      </div>
    </>
  );
}
