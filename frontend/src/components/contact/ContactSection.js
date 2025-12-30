import ContactInfo from "./ContactInfo";
import ContactForm from "./ContactForm";

export default function ContactSection() {
  return (
    <section className="py-16 md:py-24 relative">
      <div className="absolute inset-0 bg-[url('/grid.png')] opacity-[0.02]"></div>

      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16">
          {/* Contact Information */}
          <ContactInfo />

          {/* Contact Form */}
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
