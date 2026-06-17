import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageIntroHero } from "@/components/kit/page-intro-hero";
import { GalleryGrid } from "@/components/pages/gallery-grid";
import { loadGalleryPhotos } from "@/lib/data/events";

export default async function GalleryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("gallery");
  const photos = await loadGalleryPhotos();

  return (
    <>
      <PageIntroHero
        overline={t("overline")}
        title={t("title")}
        titleHighlight={t("titleHighlight")}
        lead={t("intro")}
      />
      <div id="gallery-grid" className="kit-page-main scroll-mt-28">
        <GalleryGrid photos={photos} />
      </div>
    </>
  );
}
