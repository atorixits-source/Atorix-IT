// Use NEXT_PUBLIC_API_BASE_URL for main admin API (port 5001)
// NEXT_PUBLIC_API_URL is for blog API (port 5000)
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://atorix-backend-server.onrender.com";

class ApiInterceptor {
  constructor() {
    if (typeof window === "undefined") return;

    if (window.__apiInterceptorInitialized) return;
    window.__apiInterceptorInitialized = true;

    this.originalFetch = window.fetch;
    this.initInterceptor();
  }

  initInterceptor() {
    const originalFetch = this.originalFetch;

    window.fetch = async (url, options = {}) => {
      // 🚫 Ignore Next.js internal requests
      if (
        typeof url === "string" &&
        (url.includes("__nextjs") ||
          url.startsWith("/_next") ||
          url.startsWith("/__next"))
      ) {
        return originalFetch(url, options);
      }

      let finalUrl = url;

      // ✅ Only proxy backend APIs that are relative paths
      // Don't modify URLs that are already full URLs (http:// or https://)
      if (typeof url === "string" && 
          url.startsWith("/api") && 
          !url.startsWith("http") &&
          !url.startsWith("https")) {
        finalUrl = `${API_BASE_URL}${url}`;
      }

      const finalOptions = {
        ...options,
        headers: {
          ...(options.headers || {}),
          // Only set Content-Type to application/json if it's not FormData
          ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
        },
      };

      // If this is FormData and the URL contains the blog API, remove Content-Type header completely
      if (options.body instanceof FormData && 
          (typeof url === "string" && (url.includes(':5000') || url.includes('/api/blog')))) {
        delete finalOptions.headers['Content-Type'];
      }

      let response;
      try {
        response = await originalFetch(finalUrl, finalOptions);
      } catch (fetchError) {
        // Handle network errors (server not running, CORS, etc.)
        console.error('Fetch error:', fetchError);
        console.error('Failed URL:', finalUrl);
        if (fetchError.message.includes('Failed to fetch') || fetchError.name === 'TypeError') {
          // Determine which server based on the URL
          const serverName = finalUrl.includes(':5000') ? 'blog server (port 5000)' : 
                           finalUrl.includes(':5001') ? 'main server (port 5001)' : 
                           'backend server';
          throw new Error(`Cannot connect to ${serverName} at ${finalUrl}. Please ensure the server is running.`);
        }
        throw fetchError;
      }

      // Handle auth errors
      if (response.status === 401 && typeof window !== "undefined") {
        localStorage.removeItem("token");
        sessionStorage.removeItem("atorix_auth_token");

        if (!window.location.pathname.includes("/admin/login")) {
          window.location.href = "/admin/login";
        }
      }

      return response;
    };
  }
}

if (typeof window !== "undefined") {
  new ApiInterceptor();
}

export default null;
