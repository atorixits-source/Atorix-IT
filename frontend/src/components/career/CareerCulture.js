"use client";

export default function CareerCulture() {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Our Culture</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            We foster a culture of innovation, collaboration, and continuous learning. 
            Our team is our greatest asset, and we're committed to creating an environment 
            where everyone can thrive and do their best work.
          </p>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div>
              <h3 className="text-xl font-semibold mb-3">Innovation</h3>
              <p className="text-gray-600 dark:text-gray-400">We encourage creative thinking and new ideas that drive progress.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">Collaboration</h3>
              <p className="text-gray-600 dark:text-gray-400">Teamwork makes the dream work. We achieve more together.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">Growth</h3>
              <p className="text-gray-600 dark:text-gray-400">Continuous learning and development opportunities for all team members.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
