import { PageIntroHero } from "@/components/kit/page-intro-hero";
import { GalleryGrid } from "@/components/pages/gallery-grid";
import { GALLERY_INTRO } from "@/lib/brand";

export default function GalleryPage() {
  return (
    <>
      <PageIntroHero
        overline="Memories"
        title="Photo"
        titleHighlight="Gallery"
        lead={GALLERY_INTRO}
      />
      <div id="gallery-grid" className="kit-page-main scroll-mt-28">
        <GalleryGrid />
      </div>
    </>
  );
}
