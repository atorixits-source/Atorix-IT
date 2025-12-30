"use client";

// Enhanced service section background
export default function EnhancedServiceSectionPattern({ index }) {
  const even = index % 2 === 0;

  return (
    <div className="absolute inset-0">
      {/* Base gradient */}
      <div
        className={`absolute inset-0 ${
          even
            ? "bg-gradient-to-br from-blue-500/5 via-indigo-100/5 to-transparent"
            : "bg-gradient-to-tr from-primary/5 via-violet-500/3 to-transparent"
        }`}
      ></div>

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[url('/grid.png')] opacity-[0.02]"></div>

      {/* Light beam */}
      <div
        className={`absolute top-0 ${even ? "left-1/3" : "right-1/4"} w-[1px] h-full bg-gradient-to-b ${even ? "from-blue-500/15" : "from-primary/15"} via-transparent to-transparent`}
      ></div>
    </div>
  );
}
