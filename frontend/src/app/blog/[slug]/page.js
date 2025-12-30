"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, Clock, User, Tag, Share2, Facebook, Twitter, Linkedin, Mail, Phone, MapPin, ArrowRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import BlogContent from "@/components/ui/BlogContent";
import TableOfContents from "@/components/blog/TableOfContents";

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

// Helper function to format date
const formatDate = (dateString) => {
  if (!dateString) return new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

// Helper function to calculate read time
const calculateReadTime = (content) => {
  if (!content) return 1;
  // Strip HTML and count words
  const text = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  const wordCount = text.split(' ').filter(word => word.length > 0).length;
  return Math.ceil(wordCount / 200) || 1;
};

// Static blog posts data (fallback)
const staticBlogPosts = [
  {
    id: "best-sap-implementation-partner-in-india",
    title: "BEST SAP IMPLEMENTATION PARTNER IN INDIA",
    description: "ATORIX IT SOLUTIONS - Best SAP Implementation Partner in India with expertise in SAP S/4HANA implementation and support services.",
    date: "May 24, 2023",
    author: "Atorix Team",
    authorRole: "SAP Implementation Expert",
    image: "/images/web-dev.svg",
    category: "SAP",
    readTime: "5 min read",
    content: `
      <div>
        <p>ATORIX IT SOLUTIONS - Best SAP Implementation Partner in India with its head office in Pune. We provide robust, business process solutions for successful clients.</p>
        <p>Atorix IT Solutions is the Best SAP Implementation Partner in India with its head office in Pune. We provide robust, business process solutions for successful clients. From implementation to support, we ensure a seamless SAP experience tailored to your business needs.</p>
        <h3>Why Choose Atorix as Your SAP Implementation Partner?</h3>
        <ul>
          <li>Expertise in SAP S/4HANA Implementation</li>
          <li>Certified SAP Consultants</li>
          <li>Industry-Specific Solutions</li>
          <li>End-to-End Support</li>
          <li>Proven Implementation Methodology</li>
        </ul>
        <p>Partner with us for successful SAP implementations that drive digital transformation and business growth.</p>
      </div>
    `
  },
  {
    id: "what-is-sap-solution-manager",
    title: "What is SAP Solution Manager?",
    description: "SAP Solution Manager (SolMan) is a module of SAP that provides functionalities like integrated content, methodologies, tools etc. Learn more about this essential SAP tool.",
    date: "February 28, 2023",
    author: "Atorix Team",
    authorRole: "SAP Technical Specialist",
    image: "/images/app.svg",
    category: "SAP",
    readTime: "7 min read",
    content: `
      <div>
        <p>SAP Solution Manager (SolMan) is a module of SAP that provides functionalities like integrated content, methodologies, tools etc. To implement, operate, monitor and support an enterprise's SAP solution. SAP solution manager manages the SAP and Non-SAP solutions in the IT landscapes of an organization. It supports the underlying IT infrastructure and business processes.</p>
        <h3>Key Functions of SAP Solution Manager</h3>
        <p>SAP Solution Manager is central to your SAP landscape management, providing:</p>
        <ul>
          <li>Implementation and upgrade support</li>
          <li>Business process operations</li>
          <li>Application lifecycle management</li>
          <li>Change control management</li>
          <li>IT service management</li>
          <li>Monitoring and alerting functions</li>
          <li>Root cause analysis tools</li>
          <li>Testing support</li>
        </ul>
        <p>For organizations running SAP systems, Solution Manager is an essential tool for maintaining optimal system performance and ensuring smooth operations of their SAP landscape.</p>
      </div>
    `
  },
  {
    id: "future-scope-of-sap",
    title: "Future Scope of SAP",
    description: "SAP is an idea that has revolutionized the recruitment scene in India. Explore the future opportunities and trends in SAP implementation and careers.",
    date: "February 7, 2023",
    author: "Atorix Team",
    authorRole: "SAP Strategic Consultant",
    image: "/images/consultation.svg",
    category: "SAP",
    readTime: "6 min read",
    content: `
      <div>
        <p>SAP is an idea that has revolutionised the recruitment scene in India. Even though it is an extraordinarily new idea in the Indian context, the fact is that ERP software program applications are increasing through the minute right here and in this kind of state of affairs the want for SAP-licensed specialists is growing throughout horizontals and verticals.</p>
        <h3>Growing Demand for SAP Professionals</h3>
        <p>The demand for SAP experts continues to grow as more businesses adopt enterprise resource planning solutions. This growth is evident across various industries, creating numerous career opportunities for SAP specialists.</p>
        <h3>Future Trends in SAP</h3>
        <ul>
          <li>Increased adoption of SAP S/4HANA</li>
          <li>Cloud-based SAP implementations</li>
          <li>Integration with AI and machine learning</li>
          <li>Enhanced mobile capabilities</li>
          <li>IoT integration with SAP systems</li>
        </ul>
        <p>As businesses continue to digitally transform, the scope for SAP implementation and support services will continue to expand, making it a promising field for professionals and implementation partners alike.</p>
      </div>
    `
  },
  {
    id: "sap-s4-hana-all-about-sap-s4-hana",
    title: "SAP S/4 HANA- All about SAP S/4 HANA",
    description: "S/4HANA is an acronym for SAP Business Suite 4 SAP HANA. Learn about this next-generation ERP system and its benefits for large enterprises.",
    date: "February 7, 2023",
    author: "Atorix Team",
    authorRole: "S/4HANA Expert",
    image: "/images/web.svg",
    category: "SAP",
    readTime: "8 min read",
    content: `
      <p>S/4HANA is an acronym for SAP Business Suite 4 SAP HANA. Similar to the shift from SAP R/2 to SAP R/3, it brings in the next significant wave of innovation for SAP clients. SAP S/4HANA is SAP's enterprise resource planning (ERP) system for large businesses. It is the successor to SAP R/3 and SAP ERP, and it is built on SAP HANA, the company's in-memory database.</p>

      <h3>Key Features of SAP S/4HANA</h3>

      <ul>
        <li>In-memory computing architecture for faster processing</li>
        <li>Simplified data model reducing database footprint</li>
        <li>Improved real-time analytics capabilities</li>
        <li>Modern user experience with SAP Fiori</li>
        <li>Enhanced planning and simulation features</li>
        <li>Embedded machine learning capabilities</li>
      </ul>

      <h3>Benefits of SAP S/4HANA</h3>

      <p>Businesses implementing S/4HANA can expect:</p>

      <ul>
        <li>Faster transaction processing and reporting</li>
        <li>Reduced total cost of ownership</li>
        <li>Improved decision-making with real-time insights</li>
        <li>Simplified IT landscape and operations</li>
        <li>Enhanced productivity through intuitive user interfaces</li>
        <li>Future-proofing business operations</li>
      </ul>

      <p>SAP S/4HANA represents the future of ERP systems, combining speed, simplicity, and innovative features to drive digital transformation.</p>
    `
  },
  {
    id: "data-migration-in-sap-s4-hana",
    title: "Data migration in SAP S/4 HANA - All about SAP HANA Migration Cockpit",
    description: "Data migration is a tool its mainly used in SAP for the system installations separately. Learn about the SAP HANA Migration Cockpit and best practices.",
    date: "February 7, 2023",
    author: "Atorix Team",
    authorRole: "Data Migration Specialist",
    image: "/images/hosting.svg",
    category: "SAP",
    readTime: "7 min read",
    content: `
      <p>Data migration is a tool its mainly used in SAP for the system installations separately. It is used to provide the data extraction and transformation, & load, In the same its gives quality data management and processing.</p>

      <h3>SAP HANA Migration Cockpit</h3>

      <p>The SAP S/4HANA Migration Cockpit is a tool designed to facilitate data migration to SAP S/4HANA. It provides a guided approach to data transfer from various source systems to SAP S/4HANA.</p>

      <h3>Key Features of the Migration Cockpit</h3>

      <ul>
        <li>Predefined migration content for common business objects</li>
        <li>Data extraction from various source systems</li>
        <li>Mapping capabilities for source and target fields</li>
        <li>Validation of migrated data</li>
        <li>Migration monitoring and error handling</li>
        <li>Support for multiple migration approaches</li>
      </ul>

      <h3>Migration Approaches</h3>

      <ol>
        <li><strong>File-Based Migration</strong>: Transfer data using CSV files</li>
        <li><strong>Direct Transfer</strong>: Connect directly to SAP source systems</li>
        <li><strong>Staging Tables</strong>: Use staging tables for complex transformations</li>
        <li><strong>SAP Cloud Platform Integration</strong>: Leverage cloud integration services</li>
      </ol>

      <p>Successful data migration is critical for any SAP S/4HANA implementation project. The Migration Cockpit simplifies this process, reducing risk and ensuring data quality in your new S/4HANA environment.</p>
    `
  }
];

// Animated blob background
function AnimatedBlobBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Main blob */}
      <motion.div
        className="absolute rounded-full bg-primary/10 blur-[120px]"
        style={{
          width: "50%",
          height: "50%",
          top: "10%",
          left: "10%",
        }}
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Secondary blob */}
      <motion.div
        className="absolute rounded-full bg-blue-500/10 blur-[100px]"
        style={{
          width: "35%",
          height: "35%",
          bottom: "20%",
          right: "5%",
        }}
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -30, 0],
          y: [0, 40, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />
    </div>
  );
}

// Related posts component (fallback for static posts)
function RelatedPosts({ currentPostId }) {
  // Get three related posts (excluding the current one)
  const relatedPosts = staticBlogPosts
    .filter(post => post.id !== currentPostId)
    .slice(0, 3);

  return (
    <div className="mt-16 border-t border-border/60 pt-12">
      <h2 className="text-2xl font-bold mb-8">Related Articles</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {relatedPosts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-card rounded-xl overflow-hidden border border-border/40 hover:border-primary/30 hover:shadow-md transition-all duration-300"
          >
            <Link href={`/blog/${post.id}`} className="block">
              <div className="aspect-[16/9] relative">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </Link>
            <div className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900/20 px-2 py-1 text-xs font-medium text-blue-800 dark:text-blue-300">
                  {post.category}
                </div>
                <span className="text-xs text-muted-foreground">{post.readTime}</span>
              </div>
              <h3 className="text-lg font-bold mb-2 line-clamp-2">
                <Link href={`/blog/${post.id}`} className="hover:text-primary transition-colors">
                  {post.title}
                </Link>
              </h3>
              <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                {post.description}
              </p>
              <div className="flex items-center justify-between pt-3 border-t border-border/60">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-semibold">
                    {post.author.charAt(0)}
                  </div>
                  <span className="text-xs">{post.author}</span>
                </div>
                <span className="text-xs text-muted-foreground">{post.date}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [allBlogPosts, setAllBlogPosts] = useState([]);
  
  // Contact form state
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    countryCode: 'IN',
    phone: '',
    location: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  
  // Country codes list
  const countryCodes = [
    { code: 'IN', name: 'India', dialCode: '+91' },
    { code: 'US', name: 'United States', dialCode: '+1' },
    { code: 'UK', name: 'United Kingdom', dialCode: '+44' },
    { code: 'CA', name: 'Canada', dialCode: '+1' },
    { code: 'AU', name: 'Australia', dialCode: '+61' },
  ];
  
  const selectedCountry = countryCodes.find(c => c.code === contactForm.countryCode) || countryCodes[0];
  
  // Handle contact form input changes
  const handleContactInputChange = (field, value) => {
    setContactForm(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Handle contact form submission
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!contactForm.name.trim()) {
      alert('Please enter your name');
      return;
    }
    if (!contactForm.email.trim() || !contactForm.email.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }
    if (!contactForm.phone.trim()) {
      alert('Please enter your phone number');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Here you would typically send the form data to your backend API
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${baseUrl}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: contactForm.name,
          email: contactForm.email,
          phone: `${selectedCountry.dialCode} ${contactForm.phone}`,
          location: contactForm.location,
          source: 'blog_contact_form'
        }),
      });
      
      if (response.ok) {
        alert('Thank you! We will contact you soon.');
        // Reset form
        setContactForm({
          name: '',
          email: '',
          countryCode: 'IN',
          phone: '',
          location: ''
        });
      } else {
        throw new Error('Failed to submit form');
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      // Even if API fails, show success message (for demo purposes)
      alert('Thank you! We will contact you soon.');
      setContactForm({
        name: '',
        email: '',
        countryCode: 'IN',
        phone: '',
        location: ''
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchBlogPost = async () => {
      setLoading(true);
      
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const slug = params.slug;
        let blog = null;
        
        // First, try to fetch directly by slug/ID
        try {
          const url = new URL(`/api/blog/posts/${slug}`, baseUrl);
          const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const data = await response.json();
            if (data.success && data.data) {
              blog = data.data;
            }
          }
        } catch (directError) {
          console.log('Direct fetch failed, trying alternative method:', directError);
        }
        
        // If direct fetch failed, try fetching all posts and finding the matching one
        if (!blog) {
          try {
            const allPostsUrl = new URL('/api/blog/posts', baseUrl);
            allPostsUrl.searchParams.append('status', 'published');
            allPostsUrl.searchParams.append('limit', '100');
            
            const allPostsResponse = await fetch(allPostsUrl.toString(), {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            });
            
            if (allPostsResponse.ok) {
              const allPostsData = await allPostsResponse.json();
              if (allPostsData.success && allPostsData.data) {
                // Try to find by slug, _id, or id
                blog = allPostsData.data.find(p => 
                  (p.slug && p.slug.toLowerCase() === slug.toLowerCase()) ||
                  (p._id && p._id.toString() === slug) ||
                  (p.id && p.id.toString() === slug)
                );
              }
            }
          } catch (allPostsError) {
            console.error('Error fetching all posts:', allPostsError);
          }
        }
        
        // If found, map and set the post
        if (blog) {
          // Map backend data to frontend format
          const mappedPost = {
            id: blog.slug || blog._id || blog.id,
            title: blog.title || '',
            description: blog.excerpt || blog.seoDescription || '',
            date: formatDate(blog.createdAt || blog.created || blog.date),
            author: blog.authorName || blog.author || 'Atorix Team',
            authorRole: 'SAP Expert',
            image: resolveImageUrl(blog.bannerImage) || 
                   resolveImageUrl(blog.featuredImage) || 
                   resolveImageUrl(blog.image) || 
                   '/images/bg/services-bg.webp',
            category: blog.category || 'Uncategorized',
            readTime: `${calculateReadTime(blog.content)} min read`,
            content: blog.content || '',
            tags: blog.tags || blog.keywords || [],
            excerpt: blog.excerpt || blog.seoDescription || ''
          };
          
          setPost(mappedPost);
          
          // Fetch related posts (same category, excluding current)
          try {
            const relatedUrl = new URL('/api/blog/posts', baseUrl);
            relatedUrl.searchParams.append('status', 'published');
            relatedUrl.searchParams.append('category', blog.category || '');
            relatedUrl.searchParams.append('limit', '4');
            
            const relatedResponse = await fetch(relatedUrl.toString(), {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            });
            
            if (relatedResponse.ok) {
              const relatedData = await relatedResponse.json();
              if (relatedData.success && relatedData.data) {
                const related = relatedData.data
                  .filter(p => {
                    const pId = p.slug || p._id || p.id;
                    const currentId = blog.slug || blog._id || blog.id;
                    return pId.toString() !== currentId.toString();
                  })
                  .slice(0, 3)
                  .map(p => ({
                    id: p.slug || p._id || p.id,
                    title: p.title || '',
                    description: p.excerpt || p.seoDescription || '',
                    date: formatDate(p.createdAt || p.created),
                    author: p.authorName || p.author || 'Atorix Team',
                    image: resolveImageUrl(p.bannerImage) || 
                           resolveImageUrl(p.featuredImage) || 
                           resolveImageUrl(p.image) || 
                           '/images/web-dev.svg',
                    category: p.category || 'Uncategorized',
                    readTime: `${calculateReadTime(p.content)} min read`
                  }));
                setRelatedPosts(related);
              }
            }
          } catch (relatedError) {
            console.error('Error fetching related posts:', relatedError);
          }
        } else {
          // If not found in API, try static data as fallback
          const staticPost = staticBlogPosts.find(p => p.id === slug || p.id.toLowerCase() === slug.toLowerCase());
          if (staticPost) {
            setPost(staticPost);
          }
        }
      } catch (error) {
        console.error('Error fetching blog post:', error);
        // Fallback to static data
        const staticPost = staticBlogPosts.find(p => p.id === params.slug || p.id.toLowerCase() === params.slug.toLowerCase());
        if (staticPost) {
          setPost(staticPost);
        }
      } finally {
        setLoading(false);
      }
    };

    if (params.slug) {
      fetchBlogPost();
    }
  }, [params.slug]);

  // Fetch all blog posts for category counting
  useEffect(() => {
    const fetchAllBlogPosts = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        let allBlogs = [];
        let currentPage = 1;
        let hasMore = true;
        const limit = 100;
        
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
        
        setAllBlogPosts(allBlogs);
      } catch (error) {
        console.error('Error fetching all blog posts for categories:', error);
        // Fallback to static posts if API fails
        setAllBlogPosts(staticBlogPosts);
      }
    };

    fetchAllBlogPosts();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showCountryDropdown && !event.target.closest('.country-dropdown-container')) {
        setShowCountryDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCountryDropdown]);

  // Function to calculate category count
  const getCategoryCount = (categoryName) => {
    // Use allBlogPosts if available, otherwise fallback to staticBlogPosts
    const posts = allBlogPosts.length > 0 ? allBlogPosts : staticBlogPosts;
    
    // Normalize category names for comparison (case-insensitive)
    const normalizedCategory = (categoryName || '').toLowerCase().trim();
    
    return posts.filter(post => {
      const postCategory = (post.category || '').toLowerCase().trim();
      // Handle variations like "S/4HANA" vs "S4HANA" by also checking without special chars
      const postCategoryNormalized = postCategory.replace(/[\/\-_\s]/g, '');
      const normalizedCategoryClean = normalizedCategory.replace(/[\/\-_\s]/g, '');
      
      // Match if exact match or if normalized versions match
      return postCategory === normalizedCategory || 
             (postCategoryNormalized && normalizedCategoryClean && 
              postCategoryNormalized === normalizedCategoryClean);
    }).length;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container-custom py-24 text-center">
        <h1 className="text-3xl font-bold mb-6">Blog Post Not Found</h1>
        <p className="text-lg text-muted-foreground mb-8">
          The blog post you are looking for does not exist or has been removed.
        </p>
        <Button asChild>
          <Link href="/blog">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section className="py-16 md:py-20 bg-primary/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>
        <AnimatedBlobBackground />
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Button
              variant="ghost"
              asChild
              className="mb-6 hover:bg-background/80 text-primary"
              size="sm"
            >
              <Link href="/blog">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Link>
            </Button>

            <div className="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900/20 px-3 py-1 text-xs font-medium text-blue-800 dark:text-blue-300 mb-4">
              {post.category}
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 max-w-4xl">
              {post.title}
            </h1>

            {/* Visible slug / permalink */}
            <div className="mb-5 text-xs md:text-sm text-muted-foreground flex flex-wrap items-center gap-2">
              <span className="font-medium">Slug:</span>
              <code className="px-2 py-1 rounded bg-muted text-foreground text-xs">
                {post.slug || post.id}
              </code>
              <span className="font-medium ml-3">Route:</span>
              <code className="px-2 py-1 rounded bg-muted text-foreground text-xs">
                {`/blog/${post.slug || post.id}`}
              </code>
              {typeof window !== 'undefined' && (
                <>
                  <span className="hidden sm:inline">·</span>
                  <button
                    onClick={() => {
                      const path = `/blog/${post.slug || post.id}`;
                      const url = `${window.location.origin}${path}`;
                      navigator.clipboard
                        ?.writeText(url)
                        .then(() => alert('Blog URL copied to clipboard.'))
                        .catch(() => alert('Could not copy URL. Please copy it manually.'));
                    }}
                    className="text-blue-600 hover:underline text-xs font-medium"
                  >
                    Copy full URL
                  </button>
                </>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm text-muted-foreground mb-8">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span>{post.readTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-primary" />
                <span>{post.category}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Table of Contents - Left Side */}
            <div className="lg:col-span-3 order-2 lg:order-1">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <TableOfContents content={post.content} />
              </motion.div>
            </div>

            {/* Article Content */}
            <div className="lg:col-span-6 order-1 lg:order-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {/* Featured Image */}
                {post.image && (
                  <div className="aspect-[16/9] relative rounded-xl overflow-hidden mb-10 border border-border/40 shadow-md">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover"
                      priority
                      unoptimized={post.image?.startsWith('http') || post.image?.startsWith('data:')}
                      onError={(e) => {
                        e.target.src = "/images/bg/services-bg.webp";
                      }}
                    />
                  </div>
                )}

                {/* Content */}
                <article className="max-w-none">
                  <BlogContent content={post.content} />
                </article>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-10">
                    {post.tags.map((tag, index) => (
                      <span key={index} className="bg-muted px-3 py-1 rounded-full text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                {(!post.tags || post.tags.length === 0) && post.category && (
                  <div className="flex flex-wrap gap-2 mt-10">
                    <span className="bg-muted px-3 py-1 rounded-full text-sm">{post.category}</span>
                  </div>
                )}

                {/* Social Share */}
                <div className="flex items-center gap-4 mt-10 border-t border-border/60 pt-6">
                  <span className="text-sm font-medium">Share this article:</span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" className="rounded-full h-9 w-9" asChild>
                      <Link href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`} target="_blank">
                        <Facebook className="h-4 w-4" />
                        <span className="sr-only">Share on Facebook</span>
                      </Link>
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-full h-9 w-9" asChild>
                      <Link href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}&text=${encodeURIComponent(post.title)}`} target="_blank">
                        <Twitter className="h-4 w-4" />
                        <span className="sr-only">Share on Twitter</span>
                      </Link>
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-full h-9 w-9" asChild>
                      <Link href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`} target="_blank">
                        <Linkedin className="h-4 w-4" />
                        <span className="sr-only">Share on LinkedIn</span>
                      </Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-3 order-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="sticky top-24"
              >
                {/* Author Card */}
                <div className="bg-card rounded-xl p-6 border border-border/40 mb-8">
                  <h3 className="text-lg font-semibold mb-4">About the Author</h3>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-semibold">
                      {post.author.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-medium">{post.author}</h4>
                      <p className="text-sm text-muted-foreground">{post.authorRole}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Atorix IT Solutions expert with extensive experience in SAP implementation, support, and business process optimization.
                  </p>
                </div>

                {/* Contact Us Form */}
                <div className="bg-[#0a0e1a] rounded-xl p-6 mb-8 border border-[#1a2332]">
                  <h3 className="text-2xl font-bold text-[#87ceeb] mb-6 text-center">Contact Us</h3>
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    {/* Name Field */}
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#87ceeb]" size={20} />
                      <input
                        type="text"
                        placeholder="Your Name"
                        value={contactForm.name}
                        onChange={(e) => handleContactInputChange('name', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-[#1a2332]/80 border border-[#2a3441] rounded-lg text-white placeholder-[#87ceeb]/60 focus:outline-none focus:ring-2 focus:ring-[#87ceeb] focus:border-[#87ceeb]"
                        required
                      />
                    </div>
                    
                    {/* Email Field */}
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#87ceeb]" size={20} />
                      <input
                        type="email"
                        placeholder="Email Address"
                        value={contactForm.email}
                        onChange={(e) => handleContactInputChange('email', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-[#1a2332]/80 border border-[#2a3441] rounded-lg text-white placeholder-[#87ceeb]/60 focus:outline-none focus:ring-2 focus:ring-[#87ceeb] focus:border-[#87ceeb]"
                        required
                      />
                    </div>
                    
                    {/* Phone Number Section */}
                    <div className="grid grid-cols-2 gap-3">
                      {/* Country Code Dropdown */}
                      <div className="relative country-dropdown-container">
                        <button
                          type="button"
                          onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                          className="w-full pl-3 pr-8 py-3 bg-[#1a2332]/80 border border-[#2a3441] rounded-lg text-white flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-[#87ceeb] focus:border-[#87ceeb]"
                        >
                          <span>{selectedCountry.code} {selectedCountry.dialCode}</span>
                          <ChevronDown className="absolute right-3 text-[#87ceeb]" size={18} />
                        </button>
                        {showCountryDropdown && (
                          <div className="absolute z-10 w-full mt-1 bg-[#1a2332] border border-[#2a3441] rounded-lg shadow-lg max-h-48 overflow-y-auto">
                            {countryCodes.map((country) => (
                              <button
                                key={country.code}
                                type="button"
                                onClick={() => {
                                  handleContactInputChange('countryCode', country.code);
                                  setShowCountryDropdown(false);
                                }}
                                className="w-full px-3 py-2 text-left text-white hover:bg-[#2a3441] flex items-center justify-between"
                              >
                                <span>{country.code} {country.dialCode}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      {/* Phone Number Input */}
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#87ceeb]" size={20} />
                        <input
                          type="tel"
                          placeholder="Phone Number"
                          value={contactForm.phone}
                          onChange={(e) => handleContactInputChange('phone', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-[#1a2332]/80 border border-[#2a3441] rounded-lg text-white placeholder-[#87ceeb]/60 focus:outline-none focus:ring-2 focus:ring-[#87ceeb] focus:border-[#87ceeb]"
                          required
                        />
                      </div>
                    </div>
                    
                    {/* Location Field */}
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#87ceeb]" size={20} />
                      <input
                        type="text"
                        placeholder="Your Location"
                        value={contactForm.location}
                        onChange={(e) => handleContactInputChange('location', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-[#1a2332]/80 border border-[#2a3441] rounded-lg text-white placeholder-[#87ceeb]/60 focus:outline-none focus:ring-2 focus:ring-[#87ceeb] focus:border-[#87ceeb]"
                      />
                    </div>
                    
                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#1e3a8a] hover:bg-[#2563eb] text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Get Free Consultation
                      <ArrowRight size={20} />
                    </button>
                  </form>
                </div>

                {/* Popular Posts */}
                <div className="bg-card rounded-xl p-6 border border-border/40">
                  <h3 className="text-lg font-semibold mb-4">Popular Posts</h3>
                  <div className="space-y-4">
                    {staticBlogPosts.slice(0, 3).map((popularPost) => (
                      <div key={`popular-${popularPost.id}`} className="flex gap-3">
                        <div className="flex-shrink-0 h-16 w-16 relative rounded-md overflow-hidden">
                          <Image
                            src={popularPost.image}
                            alt={popularPost.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium line-clamp-2 hover:text-primary">
                            <Link href={`/blog/${popularPost.id}`}>
                              {popularPost.title}
                            </Link>
                          </h4>
                          <p className="text-xs text-muted-foreground mt-1">{popularPost.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 ? (
            <div className="mt-16 border-t border-border/60 pt-12">
              <h2 className="text-2xl font-bold mb-8">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedPosts.map((relatedPost, index) => (
                  <motion.div
                    key={relatedPost.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-card rounded-xl overflow-hidden border border-border/40 hover:border-primary/30 hover:shadow-md transition-all duration-300"
                  >
                    <Link href={`/blog/${relatedPost.id}`} className="block">
                      <div className="aspect-[16/9] relative">
                        <Image
                          src={relatedPost.image}
                          alt={relatedPost.title}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-500"
                          unoptimized={relatedPost.image?.startsWith('http') || relatedPost.image?.startsWith('data:')}
                          onError={(e) => {
                            e.target.src = "/images/web-dev.svg";
                          }}
                        />
                      </div>
                    </Link>
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900/20 px-2 py-1 text-xs font-medium text-blue-800 dark:text-blue-300">
                          {relatedPost.category}
                        </div>
                        <span className="text-xs text-muted-foreground">{relatedPost.readTime}</span>
                      </div>
                      <h3 className="text-lg font-bold mb-2 line-clamp-2">
                        <Link href={`/blog/${relatedPost.id}`} className="hover:text-primary transition-colors">
                          {relatedPost.title}
                        </Link>
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {relatedPost.description}
                      </p>
                      <div className="flex items-center justify-between pt-3 border-t border-border/60">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-semibold">
                            {relatedPost.author.charAt(0)}
                          </div>
                          <span className="text-xs">{relatedPost.author}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{relatedPost.date}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <RelatedPosts currentPostId={post.id} />
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary/5 relative overflow-hidden">
        <AnimatedBlobBackground />
        <div className="container-custom relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your SAP Experience?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Contact Atorix IT Solutions today to learn how our SAP experts can help optimize your business processes and maximize your SAP investment.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button asChild size="lg" className="gap-2">
                  <Link href="/contact">
                    Get in Touch
                  </Link>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="outline" asChild size="lg">
                  <Link href="/services">Explore Services</Link>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}