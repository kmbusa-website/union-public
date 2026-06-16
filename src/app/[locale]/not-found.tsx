import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("common");

  return (
    <div className="kit-page-main flex min-h-[50vh] flex-col items-center justify-center">
      <h1 className="text-4xl font-bold" style={{ color: "var(--text-primary)" }}>
        404
      </h1>
      <p className="mt-2" style={{ color: "var(--text-secondary)" }}>
        {t("notFound")}
      </p>
      <Link href="/" className="kit-btn-primary mt-6">
        {t("goHome")}
      </Link>
    </div>
  );
}
