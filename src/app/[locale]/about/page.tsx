import { Target, Eye, Heart, Flag } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageIntroHero } from "@/components/kit/page-intro-hero";
import { MILESTONES } from "@/lib/brand";

const valueKeys = ["mission", "vision", "values", "goals"] as const;
const icons = [Target, Eye, Heart, Flag];
const milestoneKeys = ["established", "students", "annualEvents"] as const;

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");
  const tb = await getTranslations("brand");

  return (
    <>
      <PageIntroHero
        overline={t("overline", { org: tb("orgShort") })}
        title={t("title")}
        titleHighlight={t("titleHighlight")}
        lead={t("intro")}
      />

      <div className="kit-page-main">
        <div id="mission-vision" className="kit-container scroll-mt-28 pb-16">
          <div className="mb-10 text-center">
            <p className="page-intro-overline">{t("standFor")}</p>
            <h2 className="page-intro-title mt-3 text-3xl sm:text-4xl">
              {t("missionTitle")}{" "}
              <span className="page-intro-title-accent">{t("missionHighlight")}</span>
            </h2>
            <div className="page-intro-title-rule mx-auto" aria-hidden />
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {valueKeys.map((key, i) => {
              const Icon = icons[i] ?? Target;
              return (
                <div key={key} className="kit-card text-center">
                  <Icon className="page-intro-title-accent mx-auto h-10 w-10" strokeWidth={1.5} />
                  <h3 className="mt-4 font-semibold" style={{ color: "var(--text-primary)" }}>
                    {t(`values.${key}.title`)}
                  </h3>
                  <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                    {t(`values.${key}.description`)}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {MILESTONES.map((m, i) => (
              <div key={milestoneKeys[i]} className="kit-card text-center">
                <p className="page-intro-title-accent text-2xl font-bold">{m.value}</p>
                <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
                  {t(`milestones.${milestoneKeys[i]}`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
