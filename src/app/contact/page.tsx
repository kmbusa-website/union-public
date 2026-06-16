import { PageIntroHero } from "@/components/kit/page-intro-hero";
import { ContactForm } from "@/components/pages/contact-form";
import { CONTACT_INTRO, CONTACT_INTRO_SECONDARY } from "@/lib/brand";

export default function ContactPage() {
  return (
    <>
      <PageIntroHero
        overline="We'd love to hear from you"
        title="Contact"
        titleHighlight="Us"
        lead={CONTACT_INTRO}
        leadSecondary={CONTACT_INTRO_SECONDARY}
      />
      <div id="contact-form" className="kit-page-main scroll-mt-28">
        <ContactForm />
      </div>
    </>
  );
}
