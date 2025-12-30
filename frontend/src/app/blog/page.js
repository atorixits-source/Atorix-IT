"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import BlogHero from "@/components/blog/BlogHero";
import BlogCategories from "@/components/blog/BlogCategories";
import FeaturedPost from "@/components/blog/FeaturedPost";
import BlogGrid from "@/components/blog/BlogGrid";
import Newsletter from "@/components/blog/Newsletter";

// Helper function to resolve image URLs
const getApiOrigin = () => {
  const raw = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').trim();
  try {
    const url = new URL(raw);
    return `${url.protocol}//${url.host}`;
  } catch (error) {
    if (raw.startsWith('http://') || raw.startsWith('https://')) {
      return raw.replace(/\/+$/, '');
    }
    return `http://${raw}`.replace(/\/+$/, '');
  }
};

const apiOrigin = getApiOrigin();

const resolveImageUrl = (imageCandidate) => {
  if (!imageCandidate) return null;

  const normalize = (value) => {
    if (!value) return null;
    if (value.startsWith('http://') || value.startsWith('https://')) return value;
    if (value.startsWith('data:')) return value; // Base64 images
    if (value.startsWith('/')) return `${apiOrigin}${value}`;
    return `${apiOrigin}/${value}`;
  };

  if (typeof imageCandidate === 'string') {
    return normalize(imageCandidate);
  }

  if (typeof imageCandidate === 'object') {
    return normalize(imageCandidate.url || imageCandidate.src || imageCandidate.path);
  }

  return null;
};

// Helper function to strip HTML tags and convert to plain text
const stripHtml = (html) => {
  if (!html) return '';
  
  // Create a temporary DOM element to parse HTML
  if (typeof window !== 'undefined') {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  }
  
  // Fallback for server-side: use regex to strip HTML tags
  // This is a simple approach - for production, consider using a proper HTML parser
  return html
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&nbsp;/g, ' ') // Replace &nbsp; with space
    .replace(/&amp;/g, '&') // Replace &amp; with &
    .replace(/&lt;/g, '<') // Replace &lt; with <
    .replace(/&gt;/g, '>') // Replace &gt; with >
    .replace(/&quot;/g, '"') // Replace &quot; with "
    .replace(/&#39;/g, "'") // Replace &#39; with '
    .replace(/&apos;/g, "'") // Replace &apos; with '
    .trim();
};

// Helper function to get plain text excerpt from content
const getPlainTextExcerpt = (content, maxLength = 150) => {
  if (!content) return '';
  
  const plainText = stripHtml(content);
  if (plainText.length <= maxLength) return plainText;
  
  // Truncate at word boundary
  const truncated = plainText.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  return lastSpace > 0 ? truncated.substring(0, lastSpace) + '...' : truncated + '...';
};

// Helper function to map backend blog data to frontend format
const mapBlogData = (blog) => {
  // Calculate read time (rough estimate: 200 words per minute)
  // Use plain text for accurate word count
  const plainTextContent = blog.content ? stripHtml(blog.content) : '';
  const wordCount = plainTextContent ? plainTextContent.split(/\s+/).filter(word => word.length > 0).length : 0;
  const readTime = Math.ceil(wordCount / 200) || 1;
  
  // Get image URL with proper resolution
  const getImageUrl = () => {
    const imageUrl = 
      resolveImageUrl(blog.bannerImage) ||
      resolveImageUrl(blog.featuredImage) ||
      resolveImageUrl(blog.image) ||
      '/images/web-dev.svg'; // Default fallback image
    return imageUrl;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Get plain text description/excerpt
  const getDescription = () => {
    // First try excerpt or seoDescription (they might already be plain text)
    if (blog.excerpt) {
      const excerptPlain = stripHtml(blog.excerpt);
      if (excerptPlain.trim()) return excerptPlain.length > 150 ? getPlainTextExcerpt(excerptPlain, 150) : excerptPlain;
    }
    if (blog.seoDescription) {
      const seoPlain = stripHtml(blog.seoDescription);
      if (seoPlain.trim()) return seoPlain.length > 150 ? getPlainTextExcerpt(seoPlain, 150) : seoPlain;
    }
    // Fallback to content, stripping HTML
    if (blog.content) {
      return getPlainTextExcerpt(blog.content, 150);
    }
    return '';
  };

  return {
    id: blog.slug || blog._id || blog.id,
    title: stripHtml(blog.title || ''), // Strip HTML from title too
    description: getDescription(),
    date: formatDate(blog.createdAt || blog.created || blog.date),
    author: blog.authorName || blog.author || 'Atorix Team',
    image: getImageUrl(),
    category: blog.category || 'Uncategorized',
    readTime: `${readTime} min read`,
    tags: blog.tags || blog.keywords || [],
    content: blog.content || '', // Keep original content for full blog view
    excerpt: blog.excerpt ? stripHtml(blog.excerpt) : (blog.seoDescription ? stripHtml(blog.seoDescription) : '')
  };
};

export default function BlogPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [allPosts, setAllPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);

  // Fetch blogs from backend API - fetch all published blogs
  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        let allBlogs = [];
        let currentPage = 1;
        let hasMore = true;
        const limit = 100; // Fetch 100 per page
        
        // Fetch all pages until we get all blogs
        while (hasMore) {
          const url = new URL('/api/blog/posts', baseUrl);
          url.searchParams.append('status', 'published');
          url.searchParams.append('page', currentPage.toString());
          url.searchParams.append('limit', limit.toString());
          
          const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            throw new Error('Failed to fetch blog posts');
          }

          const data = await response.json();
          
          if (data.success && data.data && data.data.length > 0) {
            allBlogs = [...allBlogs, ...data.data];
            
            // Check if there are more pages
            const totalPages = data.totalPages || Math.ceil((data.totalPosts || allBlogs.length) / limit);
            hasMore = currentPage < totalPages && data.data.length === limit;
            currentPage++;
          } else {
            hasMore = false;
          }
        }
        
        // Map all blogs to frontend format
        if (allBlogs.length > 0) {
          const mappedPosts = allBlogs.map(mapBlogData);
          setAllPosts(mappedPosts);
          
          // Extract unique categories from blogs
          const uniqueCategories = [...new Set(mappedPosts.map(post => post.category.toLowerCase()))];
          setCategories(uniqueCategories);
        } else {
          setAllPosts([]);
        }
      } catch (err) {
        console.error('Error fetching blogs:', err);
        setError(err.message);
        setAllPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Handle search and category changes
  useEffect(() => {
    // Get search and category from URL
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || 'all';
    
    setSearchQuery(search);
    setSelectedCategory(category);
    
    // Filter posts based on search query and category
    let filtered = [...allPosts];
    
    // Apply category filter
    if (category !== 'all') {
      filtered = filtered.filter(post => 
        post.category.toLowerCase() === category.toLowerCase()
      );
    }
    
    // Apply search filter
    if (search) {
      const query = search.toLowerCase();
      filtered = filtered.filter(post => {
        const titleMatch = post.title?.toLowerCase().includes(query) || false;
        const excerptMatch = post.excerpt?.toLowerCase().includes(query) || false;
        const descriptionMatch = post.description?.toLowerCase().includes(query) || false;
        const tagsMatch = Array.isArray(post.tags) && 
                         post.tags.some(tag => tag?.toLowerCase().includes(query));
        return titleMatch || excerptMatch || descriptionMatch || tagsMatch;
      });
    }
    
    setFilteredPosts(filtered);
  }, [searchParams, allPosts]);
  
  // Handle search from BlogHero
  const handleSearch = (query) => {
    const params = new URLSearchParams(searchParams);
    if (query) {
      params.set('search', query);
      // Reset category when searching
      params.delete('category');
    } else {
      params.delete('search');
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  // Handle category change
  const handleCategoryChange = (category) => {
    const params = new URLSearchParams(searchParams);
    if (category && category !== 'all') {
      params.set('category', category);
      // Reset search when changing category
      params.delete('search');
    } else {
      params.delete('category');
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <>
      {/* Hero Section with Search */}
      <BlogHero onSearch={handleSearch} initialSearch={searchQuery} />

      {/* Categories Section */}
      <BlogCategories 
        selectedCategory={selectedCategory} 
        onCategoryChange={handleCategoryChange}
        categories={categories}
      />

      {/* Loading State */}
      {loading && (
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-muted-foreground">Loading blog posts...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="text-center py-16">
          <h3 className="text-xl font-medium text-red-600 mb-2">Error loading blog posts</h3>
          <p className="text-muted-foreground">{error}</p>
        </div>
      )}

      {/* Content - Only show if not loading and no error */}
      {!loading && !error && (
        <>
          {/* Featured Post - Only show if there are posts */}
          {filteredPosts.length > 0 && <FeaturedPost post={filteredPosts[0]} />}

          {/* Blog Posts Grid - Show all posts except the first one (featured) */}
          <BlogGrid posts={filteredPosts.length > 1 ? filteredPosts.slice(1) : []} />

          {/* Show message if no posts found */}
          {filteredPosts.length === 0 && (
            <div className="text-center py-16">
              <h3 className="text-xl font-medium text-muted-foreground">
                {searchQuery 
                  ? `No articles found for "${searchQuery}"`
                  : `No articles found for this category.`
                }
              </h3>
              {searchQuery && (
                <button 
                  onClick={() => handleSearch('')}
                  className="mt-4 text-blue-600 hover:underline"
                >
                  Clear search
                </button>
              )}
            </div>
          )}
        </>
      )}

      {/* Newsletter Section */}
      <Newsletter />
    </>
  );
}
