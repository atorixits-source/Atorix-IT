"use client";

import * as React from "react";
import { Button } from "./button";

const LoadingButton = React.forwardRef(
  ({
    children,
    isLoading = false,
    loadingText = "Processing...",
    icon: Icon,
    iconPosition = "right",
    className,
    ...props
  }, ref) => {
    return (
      <Button
        ref={ref}
        className={className}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center">
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
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
            {loadingText}
          </span>
        ) : (
          <>
            {Icon && iconPosition === "left" && <Icon className="h-4 w-4 mr-2" />}
            {children}
            {Icon && iconPosition === "right" && <Icon className="h-4 w-4 ml-2" />}
          </>
        )}
      </Button>
    );
  }
);

LoadingButton.displayName = "LoadingButton";

export { LoadingButton };
