import { PageIntroHero } from "@/components/kit/page-intro-hero";
import { GalleryGrid } from "@/components/pages/gallery-grid";
import { GALLERY_HERO_IMAGE, GALLERY_INTRO } from "@/lib/brand";

export default function GalleryPage() {
  return (
    <>
      <PageIntroHero
        overline="Memories"
        title="Photo"
        titleHighlight="Gallery"
        lead={GALLERY_INTRO}
        imageSrc={GALLERY_HERO_IMAGE}
        imageAlt="KMBUSA gallery preview"
        cta={{ href: "#gallery-grid", label: "View Photos" }}
      />
      <div id="gallery-grid" className="kit-page-main scroll-mt-28">
        <GalleryGrid />
      </div>
    </>
  );
}
