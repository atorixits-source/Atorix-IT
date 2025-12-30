"use client";

import { useEffect } from "react";

export default function ClientBody({ children }) {
  useEffect(() => {
    document.body.className = "antialiased";
  }, []);

  return (
    <body className="antialiased" suppressHydrationWarning>
      {children}
    </body>
  );
}
