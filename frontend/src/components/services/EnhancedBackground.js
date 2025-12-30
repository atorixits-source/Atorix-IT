"use client";

// Enhanced hero background with dynamic patterns and gradients
export default function EnhancedBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-indigo-500/5"></div>

      {/* Animated gradient blobs */}
      <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[60%] rounded-full bg-gradient-to-br from-primary/10 via-blue-500/5 to-transparent opacity-80 blur-[100px]"></div>
      <div className="absolute top-[50%] -left-[10%] w-[40%] h-[40%] rounded-full bg-gradient-to-tr from-violet-500/5 via-indigo-500/5 to-transparent opacity-70 blur-[80px]"></div>

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[url('/grid.png')] opacity-[0.04]"></div>

      {/* Light rays */}
      <div className="absolute top-0 left-1/4 w-[1px] h-full bg-gradient-to-b from-primary/30 via-primary/10 to-transparent"></div>
      <div className="absolute top-0 left-2/3 w-[1px] h-full bg-gradient-to-b from-primary/20 via-primary/5 to-transparent"></div>
      <div className="absolute bottom-0 left-1/3 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/10 to-transparent"></div>
    </div>
  );
}
