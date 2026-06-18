import Link from "next/link";

export default function NotFound() {
  return (
    <div className="kit-page-main flex min-h-[50vh] flex-col items-center justify-center">
      <h1 className="text-4xl font-bold" style={{ color: "var(--text-primary)" }}>404</h1>
      <p className="mt-2" style={{ color: "var(--text-secondary)" }}>Page not found</p>
      <Link href="/en" className="kit-btn-primary mt-6">
        Go home
      </Link>
    </div>
  );
}
