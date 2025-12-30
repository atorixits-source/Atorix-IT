"use client";

const values = [
  {
    title: "Innovation",
    description: "We embrace change and encourage creative thinking to drive progress.",
    color: "text-yellow-500",
  },
  {
    title: "Excellence",
    description: "We strive for the highest standards in everything we do.",
    color: "text-blue-500",
  },
  {
    title: "Integrity",
    description: "We conduct our business with honesty, transparency, and ethical behavior.",
    color: "text-green-500",
  },
  {
    title: "Collaboration",
    description: "We believe in the power of teamwork and mutual respect.",
    color: "text-purple-500",
  },
  {
    title: "Passion",
    description: "We are passionate about our work and committed to making a difference.",
    color: "text-red-500",
  },
  {
    title: "Impact",
    description: "We focus on delivering meaningful results for our clients and community.",
    color: "text-indigo-500",
  },
];

export default function CoreValues() {
  return (
    <section className="py-20 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            Our Core Values
          </h2>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
            The principles that guide everything we do
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {values.map((value, index) => {
            return (
              <div
                key={index}
                className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {value.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}