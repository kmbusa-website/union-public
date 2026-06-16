import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { LOGO_PATH, ORG_NAME, ORG_SHORT } from "@/lib/brand";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-3", className)}>
      <Image
        src={LOGO_PATH}
        alt={ORG_SHORT}
        width={48}
        height={48}
        className="h-11 w-11 rounded-full object-contain"
        priority
      />
      <div className="hidden leading-tight sm:block">
        <span className="block text-sm font-bold" style={{ color: "var(--text-nav-active)" }}>
          {ORG_SHORT}
        </span>
        <span className="block max-w-[200px] text-[10px]" style={{ color: "var(--text-nav)" }}>
          {ORG_NAME}
        </span>
      </div>
    </Link>
  );
}
