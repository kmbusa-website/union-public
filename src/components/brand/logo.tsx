import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { LOGO_PATH, ORG_NAME, ORG_SHORT } from "@/lib/brand";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("group flex min-w-0 items-center gap-3", className)}>
      <Image
        src={LOGO_PATH}
        alt={ORG_SHORT}
        width={48}
        height={48}
        className="site-logo-mark h-11 w-11 shrink-0 rounded-full object-contain ring-2 ring-[var(--gold)]/30 transition group-hover:ring-[var(--gold)]/60"
        priority
      />
      <div className="hidden min-w-0 leading-tight sm:block">
        <span
          className="block text-sm font-bold tracking-wide"
          style={{ color: "var(--text-nav-active)" }}
        >
          {ORG_SHORT}
        </span>
        <span
          className="block max-w-[11rem] truncate text-[10px] font-medium leading-snug lg:max-w-[13rem]"
          style={{ color: "var(--text-nav)" }}
        >
          {ORG_NAME}
        </span>
      </div>
    </Link>
  );
}
