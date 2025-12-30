import { motion } from "framer-motion";

// Animated floating shapes for contact page background
export default function FloatingShapes() {
  const shapes = [
    // Circles
    { type: "circle", size: 70, color: "bg-blue-500/10" },
    { type: "circle", size: 50, color: "bg-indigo-500/10" },
    { type: "circle", size: 90, color: "bg-primary/10" },
    { type: "circle", size: 40, color: "bg-violet-500/10" },
    { type: "circle", size: 60, color: "bg-blue-600/10" },

    // Squares
    { type: "square", size: 60, color: "bg-indigo-400/10" },
    { type: "square", size: 40, color: "bg-primary/10" },
    { type: "square", size: 80, color: "bg-blue-500/10" },

    // Triangles (using pseudo before/after elements)
    { type: "triangle", size: 60, color: "bg-transparent border-primary/10" },
    {
      type: "triangle",
      size: 80,
      color: "bg-transparent border-indigo-500/10",
    },
    { type: "triangle", size: 40, color: "bg-transparent border-blue-400/10" },
  ];

  // Fixed positions for SSR compatibility
  const positions = [
    { x: 5, y: 15 },
    { x: 20, y: 80 },
    { x: 25, y: 30 },
    { x: 40, y: 60 },
    { x: 60, y: 20 },
    { x: 75, y: 65 },
    { x: 80, y: 35 },
    { x: 90, y: 70 },
    { x: 15, y: 45 },
    { x: 65, y: 85 },
    { x: 95, y: 5 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {shapes.map((shape, i) => {
        const pos = positions[i % positions.length];
        const duration = 30 + (i % 15);
        const delay = i * 2;

        if (shape.type === "circle") {
          return (
            <motion.div
              key={i}
              className={`absolute rounded-full ${shape.color} blur-lg`}
              style={{
                width: shape.size,
                height: shape.size,
                left: `${pos.x}%`,
                top: `${pos.y}%`,
              }}
              animate={{
                x: [0, 50, -50, 0],
                y: [0, -50, 50, 0],
                rotate: [0, 180, 0],
              }}
              transition={{
                duration,
                repeat: Infinity,
                ease: "linear",
                delay,
              }}
            />
          );
        } else if (shape.type === "square") {
          return (
            <motion.div
              key={i}
              className={`absolute rounded-lg ${shape.color} blur-lg`}
              style={{
                width: shape.size,
                height: shape.size,
                left: `${pos.x}%`,
                top: `${pos.y}%`,
              }}
              animate={{
                x: [0, -60, 60, 0],
                y: [0, 60, -60, 0],
                rotate: [0, 90, 180, 270, 360],
              }}
              transition={{
                duration,
                repeat: Infinity,
                ease: "linear",
                delay,
              }}
            />
          );
        } else {
          // Triangle using a rotated element with borders
          return (
            <motion.div
              key={i}
              className={`absolute ${shape.color}`}
              style={{
                width: 0,
                height: 0,
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                borderLeft: `${shape.size / 2}px solid transparent`,
                borderRight: `${shape.size / 2}px solid transparent`,
                borderBottom: `${shape.size}px solid rgba(99, 102, 241, 0.1)`,
                filter: "blur(8px)",
              }}
              animate={{
                x: [0, 40, -40, 0],
                y: [0, -40, 40, 0],
                rotate: [0, 120, 240, 360],
              }}
              transition={{
                duration,
                repeat: Infinity,
                ease: "linear",
                delay,
              }}
            />
          );
        }
      })}
    </div>
  );
}
