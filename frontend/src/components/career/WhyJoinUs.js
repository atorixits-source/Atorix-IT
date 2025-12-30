"use client";

const benefits = [
  {
    icon: "🏆",
    title: "Competitive Salary",
    description: "We offer industry-competitive compensation packages."
  },
  {
    icon: "🏡",
    title: "Flexible Work",
    description: "Work from anywhere with our remote-friendly policies."
  },
  {
    icon: "📚",
    title: "Learning & Growth",
    description: "Access to courses and conferences for your development."
  },
  {
    icon: "❤️",
    title: "Health Benefits",
    description: "Comprehensive health insurance for you and your family."
  },
  {
    icon: "🎯",
    title: "Challenging Work",
    description: "Work on meaningful projects that make a real impact."
  },
  {
    icon: "🤝",
    title: "Great Team",
    description: "Collaborate with talented and passionate colleagues."
  }
];

export default function WhyJoinUs() {
  return (
    <section className="py-16 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Why Join Us?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <div key={index} className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
              <div className="text-4xl mb-4">{benefit.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
