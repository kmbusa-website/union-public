import { PageHero } from "@/components/kit/page-hero";
import { ContactForm } from "@/components/pages/contact-form";

export default function ContactPage() {
  return (
    <>
      <PageHero title="Contact" highlight="Us" subtitle="We would love to hear from you." />
      <div className="kit-page-main">
        <ContactForm />
      </div>
    </>
  );
}
