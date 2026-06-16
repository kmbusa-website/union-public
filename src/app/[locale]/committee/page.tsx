import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageIntroHero } from "@/components/kit/page-intro-hero";
import { CommitteeMembers } from "@/components/pages/committee-members";

export default async function CommitteePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("committee");

  return (
    <>
      <PageIntroHero
        overline={t("overline")}
        title={t("title")}
        titleHighlight={t("titleHighlight")}
        lead={t("intro")}
      />
      <div id="committee-members" className="kit-page-main scroll-mt-28">
        <CommitteeMembers />
      </div>
    </>
  );
}
