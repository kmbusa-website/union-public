import { PageHero } from "@/components/kit/page-hero";
import { GalleryGrid } from "@/components/pages/gallery-grid";

export default function GalleryPage() {
  return (
    <>
      <PageHero title="Photo" highlight="Gallery" subtitle="Moments from our events and activities." />
      <div className="kit-white-main">
        <GalleryGrid />
      </div>
    </>
  );
}
