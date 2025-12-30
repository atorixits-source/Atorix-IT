'use client';

import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';

// Dynamically import components with no SSR
const BlogGrid = dynamic(() => import("@/components/blog/BlogGrid"), { ssr: false });

// Import blog posts with error handling
let blogPosts = [];
try {
  blogPosts = require("@/components/blog/BlogPostsData").default || [];
} catch (error) {
  console.error("Failed to load blog posts:", error);
}

export default function CategoryPage() {
  const { category } = useParams();
  
  if (!category) {
    return <div>Category not found</div>;
  }
  
  // Handle different category name formats
  const getCategoryName = (urlCategory) => {
    try {
      const decoded = decodeURIComponent(urlCategory).toLowerCase();
      // Map URL-friendly category names to actual category names in the data
      const categoryMap = {
        's4hana': 'SAP',
        'implementation': 'SAP',
        'migration': 'SAP',
        'support': 'SAP'
      };
      return categoryMap[decoded] || decoded;
    } catch (error) {
      console.error('Error decoding category:', error);
      return '';
    }
  };

  const targetCategory = getCategoryName(category);
  
  if (!targetCategory) {
    return <div>Invalid category</div>;
  }
  
  // Filter posts by category (case-insensitive)
  const categoryPosts = Array.isArray(blogPosts) ? blogPosts.filter(post => 
    post && 
    post.category && 
    typeof post.category === 'string' &&
    post.category.toLowerCase() === targetCategory.toLowerCase()
  ) : [];

  // Format category name for display
  const formatDisplayName = (name) => {
    try {
      const names = {
        's4hana': 'S/4HANA',
        'sap': 'SAP',
        'implementation': 'Implementation',
        'migration': 'Migration',
        'support': 'Support'
      };
      return names[name.toLowerCase()] || name.replace(/-/g, ' ');
    } catch (error) {
      console.error('Error formatting category name:', error);
      return name;
    }
  };

  const categoryName = formatDisplayName(category);
  
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 capitalize">{categoryName}</h1>
      {categoryPosts.length > 0 ? (
        <BlogGrid posts={categoryPosts} />
      ) : (
        <p className="text-lg text-gray-600">No posts found in this category.</p>
      )}
    </div>
  );
}
