import { ArrowRight, CheckCircle2, PhoneCall, AlertCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function CtaSection() {
  const canvasRef = useRef(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    role: "",
    message: "",
    interests: []
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [apiError, setApiError] = useState(null);

  // Animation for particles effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const particles = [];

    const resizeCanvas = () => {
      const container = canvas.parentElement;
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
      createParticles();
    };

    const createParticles = () => {
      particles.length = 0;
      const particleCount = Math.floor(canvas.width * canvas.height / 15000);

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 2 + 1,
          vx: Math.random() * 1 - 0.5,
          vy: Math.random() * 1 - 0.5,
          opacity: Math.random() * 0.5 + 0.2
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(59, 130, 246, ${p.opacity})`;
        ctx.fill();
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.2 * (1 - distance / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = ['name', 'email', 'phone', 'company', 'role'];
    
    requiredFields.forEach(field => {
      if (!formData[field]?.trim()) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      }
    });

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (formData.phone && !/^[0-9+\s\-()]{7,20}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }

    if (apiError) {
      setApiError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    setApiError(null);

    try {
      const response = await fetch('https://atorix-backend-server.onrender.com/api/demo-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          role: formData.role,
          message: formData.message || '',
          interests: formData.interests || [],
          source: 'website'
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit demo request');
      }

      // Show success message
      setSubmitted(true);
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        role: "",
        message: "",
        interests: []
      });

      // Hide success message after 5 seconds
      setTimeout(() => {
        setSubmitted(false);
      }, 5000);

    } catch (error) {
      console.error('Error submitting demo request:', error);
      setApiError(error.message || 'Failed to submit demo request. Please try again.');
    } finally {
      setSubmitting(false);
    }
    setTimeout(() => {
      setSubmitted(false);
    }, 5000);
  };

  return (
    <div className="py-16 md:py-24 relative overflow-hidden min-h-*">
      {/* REMOVED: Black background - ab transparent hai */}
      
      {/* Animated canvas for particles effect */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ pointerEvents: "none", zIndex: 0 }}
      />

      <div className="container mx-auto px-4 relative z-10 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left column - Text */}
           <div className="text-gray-900 dark:text-white relative">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your Business with SAP?
            </h2>
             <p className="text-gray-700 dark:text-gray-300 text-lg mb-8">
              Our team of SAP experts is ready to help you implement, optimize, or migrate
              your SAP systems for maximum efficiency and ROI.
            </p>

            {/* Benefits list */}
            <div className="space-y-4 mb-8">
              <div className="flex items-start">
                <CheckCircle2 className="h-6 w-6 text-teal-400 mr-3 flex-shrink-0 mt-1" />
                <p className="text-gray-700 dark:text-gray-300">Customized SAP solutions tailored to your specific industry and business needs</p>
              </div>
              <div className="flex items-start">
                <CheckCircle2 className="h-6 w-6 text-teal-400 mr-3 flex-shrink-0 mt-1" />
                <p className="text-gray-700 dark:text-gray-300">Expert team with deep SAP knowledge and implementation experience</p>
              </div>
              <div className="flex items-start">
                <CheckCircle2 className="h-6 w-6 text-teal-400 mr-3 flex-shrink-0 mt-1" />
                <p className="text-gray-700 dark:text-gray-300">Comprehensive support and maintenance services to keep your systems running smoothly</p>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center shadow-lg">
                Request a Consultation
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
              <button className="px-6 py-3 bg-white text-blue-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center shadow-lg">
                <PhoneCall className="mr-2 h-4 w-4" />
                Get a Demo
              </button>
            </div>
          </div>

          {/* Right column - Contact form WITH IMAGE (no black bg) */}
          <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl p-8 relative overflow-hidden shadow-2xl">
            {/* Background image inside form - IMAGE RAHEGA */}
            <div
              className="absolute inset-0 bg-center bg-cover opacity-10 pointer-events-none"
              style={{
                backgroundImage:
                  'url("https://res.cloudinary.com/dvt1c3v7l/image/upload/v1761644554/601c9fdd9819a87c6e234eab66f0baa2_rhsoyw.jpg")',
              }}
            />

            <h3 className="text-xl font-semibold mb-6 text-center text-white relative z-10">
              Get in Touch with Our Team
            </h3>

            {submitted && (
              <div className="bg-green-50 text-green-800 p-6 rounded-lg mb-6 flex items-start relative z-10">
                <div className="rounded-full bg-green-100 p-1 mr-3 flex-shrink-0">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Thank you for your message!</p>
                  <p className="text-sm mt-1">
                    We have received your inquiry and will get back to you shortly.
                  </p>
                </div>
              </div>
            )}

            {apiError && (
              <div className="bg-red-50 text-red-800 p-4 rounded-lg mb-6 flex items-start relative z-10">
                <AlertCircle className="h-5 w-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Error Submitting Form</p>
                  <p className="text-sm">{apiError}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-white block">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-md border ${
                    errors.name ? "border-red-500" : "border-white/40"
                  } bg-transparent text-white placeholder-white/70 focus:border-white/70 focus:ring-2 focus:ring-white/20 outline-none transition-all`}
                  placeholder="Enter your full name"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm flex items-center mt-1">
                    <AlertCircle className="h-3.5 w-3.5 mr-1" />
                    {errors.name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-white block">
                  Email Address <span className="text-red-500">*</span>
                </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-md border ${
                  errors.email ? "border-red-500" : "border-white/40"
                } bg-transparent text-white placeholder-white/70 focus:border-white/70 focus:ring-2 focus:ring-white/20 outline-none transition-all`}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="text-red-500 text-sm flex items-center mt-1">
                  <AlertCircle className="h-3.5 w-3.5 mr-1" />
                  {errors.email}
                </p>
              )}
            </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium text-white block">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-md border ${
                    errors.phone ? "border-red-500" : "border-white/40"
                  } bg-transparent text-white placeholder-white/70 focus:border-white/70 focus:ring-2 focus:ring-white/20 outline-none transition-all`}
                  placeholder="Enter your phone number"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm flex items-center mt-1">
                    <AlertCircle className="h-3.5 w-3.5 mr-1" />
                    {errors.phone}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="company" className="text-sm font-medium text-white block">
                  Company
                </label>
                <input
                  id="company"
                  name="company"
                  type="text"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md border border-white/40 bg-transparent text-white placeholder-white/70 focus:border-white/70 focus:ring-2 focus:ring-white/20 outline-none transition-all"
                  placeholder="Enter your company name"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-white block">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md border border-white/40 bg-transparent text-white placeholder-white/70 focus:border-white/70 focus:ring-2 focus:ring-white/20 outline-none transition-all resize-none"
                  placeholder="Tell us about your requirements"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="role" className="text-sm font-medium text-white block">
                  Your Role <span className="text-red-500">*</span>
                </label>
                <input
                  id="role"
                  name="role"
                  type="text"
                  value={formData.role}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-md border ${
                    errors.role ? "border-red-500" : "border-white/40"
                  } bg-transparent text-white placeholder-white/70 focus:border-white/70 focus:ring-2 focus:ring-white/20 outline-none transition-all`}
                  placeholder="E.g., Project Manager, Developer, etc."
                />
                {errors.role && (
                  <p className="text-red-500 text-sm flex items-center mt-1">
                    <AlertCircle className="h-3.5 w-3.5 mr-1" />
                    {errors.role}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                disabled={submitting}
              >
                {submitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
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
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Processing...
                  </div>
                ) : (
                  "Submit"
                )}
              </button>
              
              <p className="text-xs text-center text-white/70">
                By submitting this form, you agree to our{" "}
                <a href="#" className="underline hover:text-white">
                  Privacy Policy
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}