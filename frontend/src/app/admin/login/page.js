"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { AlertCircle, LogIn, Eye, EyeOff } from "lucide-react";
import { login, isAuthenticated } from '@/lib/auth';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isBlogLogin, setIsBlogLogin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) {
      const urlParams = new URLSearchParams(window.location.search);
      const blogLogin = urlParams.get("blog") === "true";
      const redirectPath = blogLogin ? "/blog/dashboard" : "/admin/dashboard";
      router.push(redirectPath);
    }
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!formData.username.trim() || !formData.password) {
        throw new Error("Please enter both username and password");
      }

      const result = await login(formData.username, formData.password, isBlogLogin);
      
      if (result.success) {
        if (isBlogLogin) {
          router.push("/blog/dashboard");
        } else {
          router.push("/admin/dashboard");
        }
      } else {
        throw new Error(result.message || "Login failed");
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || "An error occurred during login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: 'url(https://res.cloudinary.com/dh72ujjxx/image/upload/v1762412853/be49eb5e228213232ecaa69f98020834_ibqyn7.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
      }}
    >
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="w-full max-w-md p-0 m-3 relative z-10">
        <div className="bg-white dark:bg-[#23263a] border border-blue-100 dark:border-[#292c45] rounded-xl shadow-lg px-8 py-10 flex flex-col">
          <div className="flex flex-col items-center mb-7">
            <Image
              src="/atorix-logo.png"
              alt="Atorix IT Logo"
              width={100}
              height={40}
              className="mb-2"
              priority
            />
            <h1 className="text-xl font-bold text-blue-700 dark:text-blue-400 tracking-tight mb-0.5">
              {isBlogLogin ? "Blog Login" : "Admin Login"}
            </h1>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {isBlogLogin ? "Sign in to access blog panel" : "Sign in to manage Atorix"}
            </span>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 p-3 rounded flex gap-2 items-center mb-5 text-sm border border-red-200 dark:border-red-500/30">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <div>{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="username"
                className="block text-sm mb-1 font-medium text-gray-800 dark:text-white"
              >
                Username or Email
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                value={formData.username}
                onChange={handleChange}
                className="block w-full rounded-md border border-blue-100 dark:border-[#343753] bg-[#f3f6fa] dark:bg-[#242547] px-4 py-2 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:border-blue-500 dark:focus:ring-blue-900 transition outline-none text-gray-900 dark:text-white font-medium placeholder:text-gray-400 dark:placeholder:text-gray-500 text-base"
                placeholder="Enter username or email"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm mb-1 font-medium text-gray-800 dark:text-white"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full rounded-md border border-blue-100 dark:border-[#343753] bg-[#f3f6fa] dark:bg-[#242547] px-4 py-2 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:border-blue-500 dark:focus:ring-blue-900 transition outline-none text-gray-900 dark:text-white font-medium placeholder:text-gray-400 dark:placeholder:text-gray-500 text-base pr-10"
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-400 hover:text-blue-700 dark:hover:text-blue-300"
                  onClick={() => setShowPassword(v => !v)}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full font-semibold text-base bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-800 text-white py-2.5 rounded-md shadow-sm mt-3 transition-all disabled:opacity-70"
              size="lg"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Logging in...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </span>
              )}
            </Button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-[#23263a] text-gray-500 dark:text-gray-400">
                  OR
                </span>
              </div>
            </div>

            <div className="flex items-center justify-center mt-4">
              <button
                type="button"
                onClick={() => setIsBlogLogin(!isBlogLogin)}
                className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
              >
                {isBlogLogin ? "Need admin access?" : "Login to blog panel instead?"}
              </button>
            </div>
          </form>

          <p className="mt-7 text-xs text-gray-500 dark:text-gray-500/80 text-center">
            &copy; {new Date().getFullYear()} Atorix IT. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}