"use client";

import { useEffect, useState, useRef } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Send,
  AlertCircle,
  CheckCircle,
  User,
  Mail,
  Phone,
  Building,
  MessageSquare,
  ChevronDown,
} from "lucide-react";
import { NeonLogoBorder } from "./Navbar";
import { submitWeb3FormData, submitFormData } from "@/lib/api";

export default function PopupContactForm() {
  const countryCodes = [
    { code: "+1", country: "USA", minLength: 10, maxLength: 10 },
    { code: "+91", country: "India", minLength: 10, maxLength: 10 },
    { code: "+44", country: "UK", minLength: 10, maxLength: 11 },
    { code: "+61", country: "Australia", minLength: 9, maxLength: 9 },
    { code: "+81", country: "Japan", minLength: 10, maxLength: 11 },
    { code: "+49", country: "Germany", minLength: 10, maxLength: 11 },
    { code: "+33", country: "France", minLength: 9, maxLength: 9 },
    { code: "+86", country: "China", minLength: 11, maxLength: 11 },
    { code: "+7", country: "Russia", minLength: 10, maxLength: 10 },
    { code: "+39", country: "Italy", minLength: 9, maxLength: 10 },
    { code: "+55", country: "Brazil", minLength: 10, maxLength: 11 },
    { code: "+34", country: "Spain", minLength: 9, maxLength: 9 },
    { code: "+27", country: "South Africa", minLength: 9, maxLength: 9 },
    { code: "+971", country: "UAE", minLength: 9, maxLength: 9 },
    { code: "+62", country: "Indonesia", minLength: 10, maxLength: 12 },
    { code: "+90", country: "Turkey", minLength: 10, maxLength: 10 },
    { code: "+82", country: "South Korea", minLength: 9, maxLength: 10 },
    { code: "+60", country: "Malaysia", minLength: 9, maxLength: 10 },
    { code: "+31", country: "Netherlands", minLength: 9, maxLength: 9 },
    { code: "+52", country: "Mexico", minLength: 10, maxLength: 10 },
  ];

  const [open, setOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const particlesRef = useRef(null);
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    countryCode: "+91",
    phone: "",
    company: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [focusedField, setFocusedField] = useState(null);

  const getSelectedCountryDetails = () => {
    return (
      countryCodes.find((country) => country.code === formData.countryCode) ||
      countryCodes[0]
    );
  };

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      (window.sessionStorage.getItem("atorix_popup_closed") ||
        window.sessionStorage.getItem("atorix_popup_submitted"))
    ) {
      setOpen(false);
      return;
    }

    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 1024);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    const timer = setTimeout(() => setOpen(true), 15000);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  useEffect(() => {
    if (open && particlesRef.current) {
      initParticles();
    }
  }, [open, particlesRef.current]);

  useEffect(() => {
    if (countryDropdownOpen) {
      function handleClickOutside(event) {
        if (!event.target.closest(".country-dropdown")) {
          setCountryDropdownOpen(false);
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [countryDropdownOpen]);

  const initParticles = () => {
    const canvas = particlesRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const particles = [];
    const particleCount = 20;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        color: `rgba(255, 255, 255, ${Math.random() * 0.2 + 0.1})`,
        speedX: Math.random() * 0.5 - 0.25,
        speedY: Math.random() * 0.5 - 0.25,
      });
    }

    function animate() {
      if (!canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
      });

      requestAnimationFrame(animate);
    }

    animate();
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setOpen(false);
      setIsClosing(false);
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem("atorix_popup_closed", "1");
      }
    }, 500);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else {
      const countryDetails = getSelectedCountryDetails();
      const phoneDigits = formData.phone.replace(/\D/g, "");

      if (
        phoneDigits.length < countryDetails.minLength ||
        phoneDigits.length > countryDetails.maxLength
      ) {
        newErrors.phone = `For ${countryDetails.country}, phone must be ${
          countryDetails.minLength === countryDetails.maxLength
            ? `${countryDetails.minLength} digits`
            : `${countryDetails.minLength}-${countryDetails.maxLength} digits`
        }`;
      } else if (!/^\d+$/.test(phoneDigits)) {
        newErrors.phone = "Phone number can only contain digits";
      }
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
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

  const handleCountryCodeSelect = (code) => {
    setFormData((prev) => ({ ...prev, countryCode: code }));
    setCountryDropdownOpen(false);

    if (errors.phone) {
      setErrors((prev) => ({ ...prev, phone: undefined }));
    }
  };

  const handleFocus = (fieldName) => {
    setFocusedField(fieldName);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    setApiError(null);

    try {
      const formattedFormData = {
        ...formData,
        phone: `${formData.countryCode} ${formData.phone}`,
        subject: `Contact Form Submission from ${formData.name}`,
      };

      const web3Result = await submitWeb3FormData(formattedFormData);

      let backendSuccess = false;
      try {
        const backendResult = await submitFormData(formattedFormData);
        backendSuccess = backendResult.success;
      } catch (backendError) {
        console.warn(
          "Backend submission failed, but email was sent via Web3Forms:",
          backendError
        );
      }

      if (web3Result.success) {
        setSubmitted(true);
        setFormData({
          name: "",
          email: "",
          countryCode: "+1",
          phone: "",
          company: "",
          message: "",
        });
        if (typeof window !== "undefined") {
          window.sessionStorage.setItem("atorix_popup_submitted", "1");
        }
        setTimeout(() => {
          handleClose();
        }, 1500);
      } else {
        setApiError(web3Result.error);
      }
    } catch (error) {
      setApiError("An unexpected error occurred. Please try again later.");
      console.error("Form submission error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const FormComponent = () => (
    <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-3">
      {/* Name field */}
      <div className="space-y-0.5 sm:space-y-1">
        <label
          htmlFor="name"
          className="text-xs sm:text-xs font-medium flex items-center gap-1"
        >
          <User size={11} className="opacity-70" />
          Name <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          onFocus={() => handleFocus("name")}
          onBlur={handleBlur}
          className={`w-full px-2 py-1.5 text-xs sm:text-sm rounded-md border ${
            errors.name
              ? "border-red-400"
              : "border-gray-200 dark:border-gray-700"
          } bg-white/80 dark:bg-gray-800/50 focus:outline-none focus:ring-1 focus:ring-blue-500`}
          placeholder="Name"
        />
        {errors.name && (
          <p className="text-red-500 text-xs flex items-center mt-0.5">
            <AlertCircle className="h-3 w-3 mr-1" />
            {errors.name}
          </p>
        )}
      </div>

      {/* Email field */}
      <div className="space-y-0.5 sm:space-y-1">
        <label
          htmlFor="email"
          className="text-xs sm:text-xs font-medium flex items-center gap-1"
        >
          <Mail size={11} className="opacity-70" />
          Email <span className="text-red-500">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          onFocus={() => handleFocus("email")}
          onBlur={handleBlur}
          className={`w-full px-2 py-1.5 text-xs sm:text-sm rounded-md border ${
            errors.email
              ? "border-red-400"
              : "border-gray-200 dark:border-gray-700"
          } bg-white/80 dark:bg-gray-800/50 focus:outline-none focus:ring-1 focus:ring-blue-500`}
          placeholder="Email"
        />
        {errors.email && (
          <p className="text-red-500 text-xs flex items-center mt-0.5">
            <AlertCircle className="h-3 w-3 mr-1" />
            {errors.email}
          </p>
        )}
      </div>

      {/* Company field */}
      <div className="space-y-0.5 sm:space-y-1">
        <label
          htmlFor="company"
          className="text-xs sm:text-xs font-medium flex items-center gap-1"
        >
          <Building size={11} className="opacity-70" />
          Company
        </label>
        <input
          id="company"
          name="company"
          type="text"
          value={formData.company}
          onChange={handleChange}
          onFocus={() => handleFocus("company")}
          onBlur={handleBlur}
          className="w-full px-2 py-1.5 text-xs sm:text-sm rounded-md border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/50 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Company"
        />
      </div>

      {/* Phone field */}
      <div className="space-y-0.5 sm:space-y-1">
        <label
          htmlFor="phone"
          className="text-xs sm:text-xs font-medium flex items-center gap-1"
        >
          <Phone size={11} className="opacity-70" />
          Phone <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-1 sm:gap-2">
          <div className="relative country-dropdown">
            <button
              type="button"
              onClick={() => setCountryDropdownOpen(!countryDropdownOpen)}
              className="flex items-center justify-between w-16 px-2 py-1.5 text-xs rounded-md border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/50 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <span className="text-xs">{formData.countryCode}</span>
              <ChevronDown size={12} className="opacity-70" />
            </button>

            {countryDropdownOpen && (
              <div className="absolute z-10 mt-1 w-40 bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 max-h-48 overflow-y-auto">
                {countryCodes.map((country) => (
                  <button
                    key={country.code}
                    type="button"
                    onClick={() => handleCountryCodeSelect(country.code)}
                    className="flex items-center w-full px-2 py-1.5 text-xs text-left hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <span className="mr-1 text-xs">{country.code}</span>
                    <span className="text-gray-600 dark:text-gray-300 text-xs">
                      {country.country}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            onFocus={() => handleFocus("phone")}
            onBlur={handleBlur}
            className={`flex-1 px-2 py-1.5 text-xs rounded-md border ${
              errors.phone
                ? "border-red-400"
                : "border-gray-200 dark:border-gray-700"
            } bg-white/80 dark:bg-gray-800/50 focus:outline-none focus:ring-1 focus:ring-blue-500`}
            placeholder="Phone"
          />
        </div>
        {errors.phone && (
          <p className="text-red-500 text-xs flex items-center mt-0.5">
            <AlertCircle className="h-3 w-3 mr-1" />
            {errors.phone}
          </p>
        )}
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          {`${getSelectedCountryDetails().minLength}-${getSelectedCountryDetails().maxLength} digits`}
        </p>
      </div>

      {/* Message field */}
      <div className="space-y-0.5 sm:space-y-1">
        <label
          htmlFor="message"
          className="text-xs sm:text-xs font-medium flex items-center gap-1"
        >
          <MessageSquare size={11} className="opacity-70" />
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows="2"
          value={formData.message}
          onChange={handleChange}
          onFocus={() => handleFocus("message")}
          onBlur={handleBlur}
          className={`w-full px-2 py-1.5 text-xs rounded-md border ${
            errors.message
              ? "border-red-400"
              : "border-gray-200 dark:border-gray-700"
          } bg-white/80 dark:bg-gray-800/50 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none`}
          placeholder="Message"
        ></textarea>
        {errors.message && (
          <p className="text-red-500 text-xs flex items-center mt-0.5">
            <AlertCircle className="h-3 w-3 mr-1" />
            {errors.message}
          </p>
        )}
      </div>

      {/* API error feedback */}
      {apiError && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 p-1.5 rounded flex items-center gap-1 text-xs">
          <AlertCircle className="h-3 w-3" />
          {apiError}
        </div>
      )}

      {/* Submit button */}
      <motion.button
        type="submit"
        className="w-full py-2 rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-1.5 hover:from-blue-500 hover:to-indigo-500 transition-all duration-200"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        disabled={submitting}
      >
        {submitting ? (
          <>
            <svg
              className="animate-spin h-3 w-3 text-white"
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
            Sending...
          </>
        ) : (
          <>
            Send
            <Send className="h-3 w-3" />
          </>
        )}
      </motion.button>

      {/* Privacy note */}
      <p className="text-xs text-center text-gray-500 dark:text-gray-400">
        By submitting, you agree to our privacy policy.
      </p>
    </form>
  );

  const SuccessMessage = () => (
    <motion.div
      className="bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 p-3 rounded-lg"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center gap-2">
        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
        <div>
          <p className="font-medium text-sm">Thank you!</p>
          <p className="text-xs mt-0.5">We'll get back to you soon.</p>
        </div>
      </div>
    </motion.div>
  );

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className={`p-0 overflow-hidden border-none bg-transparent shadow-xl ${isSmallScreen ? "max-w-[90vw] sm:max-w-[95vw]" : "max-w-4xl"}`}
      >
        <DialogTitle className="sr-only">Contact Us</DialogTitle>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4, type: "spring", bounce: 0.2 }}
              className="relative w-full h-full rounded-xl overflow-hidden"
              aria-labelledby="contact-dialog-title"
            >
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.3 }}
                onClick={handleClose}
                className="absolute top-1 sm:top-2 right-1 sm:right-2 z-50 bg-white/80 p-1 rounded-full shadow-lg hover:bg-white transition-all duration-200"
                aria-label="Close popup"
              >
                <X size={14} className="text-gray-700" />
              </motion.button>

              <div className="absolute inset-0 bg-gradient-to-br from-blue-700 to-indigo-900 overflow-hidden">
                <canvas
                  ref={particlesRef}
                  className="absolute inset-0 w-full h-full"
                />
              </div>

              <div className="relative z-10 w-full h-full flex flex-col lg:flex-row bg-white/90 dark:bg-gray-900/80 backdrop-blur-md shadow-lg rounded-xl overflow-hidden border border-white/20">
                {!isSmallScreen && (
                  <div className="lg:w-1/2 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-700 to-indigo-900 flex items-center justify-center">
                      <img
                        src="/images/services/SAP-Services.png"
                        alt="Atorix IT"
                        className="object-fill mx-auto mb-4"
                      />
                    </div>
                  </div>
                )}

                <div className={`${isSmallScreen ? "w-full" : "lg:w-1/2"}`}>
                  <div className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 p-2 sm:p-4">
                    <div className="flex items-center justify-center lg:justify-center gap-1 sm:gap-2">
                      <div className="scale-75 sm:scale-90">
                        <NeonLogoBorder width={90} height={28} />
                      </div>
                      <h2 className="text-base sm:text-xl font-bold text-white">
                        Get In Touch
                      </h2>
                    </div>
                    <p className="text-xs sm:text-sm text-white/90 mt-0.5 sm:mt-1 text-center">
                      SAP specialists ready to help
                    </p>
                  </div>

                  <div className="p-2.5 sm:p-4">
                    {submitted ? <SuccessMessage /> : <FormComponent />}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}