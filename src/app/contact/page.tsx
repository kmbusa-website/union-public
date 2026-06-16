import { PageIntroHero } from "@/components/kit/page-intro-hero";
import { ContactForm } from "@/components/pages/contact-form";
import { ABOUT_HERO_IMAGE, CONTACT, CONTACT_INTRO } from "@/lib/brand";

export default function ContactPage() {
  return (
    <>
      <PageIntroHero
        overline="Reach out"
        title="Contact"
        titleHighlight="Us"
        lead={CONTACT_INTRO}
        imageSrc={ABOUT_HERO_IMAGE}
        imageAlt={CONTACT.location}
        cta={{ href: "#contact-form", label: "Send a Message" }}
      />
      <div id="contact-form" className="kit-page-main scroll-mt-28">
        <ContactForm />
      </div>
    </>
  );
}
