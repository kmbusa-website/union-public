import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageIntroHero } from "@/components/kit/page-intro-hero";
import { ContactForm } from "@/components/pages/contact-form";

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");

  return (
    <>
      <PageIntroHero
        overline={t("overline")}
        title={t("title")}
        titleHighlight={t("titleHighlight")}
        lead={t("intro")}
        leadSecondary={t("introSecondary")}
      />
      <div id="contact-form" className="kit-page-main scroll-mt-28">
        <ContactForm />
      </div>
    </>
  );
}
