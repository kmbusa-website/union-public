import Link from "next/link";

export default function NotFound() {
  return (
    <div className="kit-white-main flex min-h-[50vh] flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-slate-900">404</h1>
      <p className="mt-2 text-slate-600">Page not found</p>
      <Link href="/" className="kit-btn-primary mt-6">
        Go home
      </Link>
    </div>
  );
}
