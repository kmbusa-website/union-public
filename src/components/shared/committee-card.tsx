import { Globe, Mail, Share2 } from "lucide-react";
import type { Executive } from "@/lib/types/api";

export function CommitteeCard({ member }: { member: Executive }) {
  return (
    <div className="kit-card text-center">
      {member.photoUrl ? (
        <img
          src={member.photoUrl}
          alt={member.memberName}
          className="mx-auto h-28 w-28 rounded-full object-cover ring-4 ring-amber-400/60"
        />
      ) : (
        <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-blue-100 text-3xl font-bold text-blue-600 ring-4 ring-amber-400/60">
          {member.memberName.charAt(0)}
        </div>
      )}
      <h3 className="mt-4 text-lg font-bold text-slate-900">{member.memberName}</h3>
      <p className="text-sm font-medium text-blue-600">{member.positionTitle}</p>
      {member.bio && <p className="mt-2 text-sm text-slate-600 line-clamp-3">{member.bio}</p>}
      <div className="mt-4 flex justify-center gap-2">
        <a href="#" className="rounded-lg bg-blue-50 p-2 text-blue-600 hover:bg-blue-100" aria-label="Share">
          <Share2 className="h-4 w-4" />
        </a>
        <a href="#" className="rounded-lg bg-blue-50 p-2 text-blue-600 hover:bg-blue-100" aria-label="Web">
          <Globe className="h-4 w-4" />
        </a>
        <a href="mailto:info@kmbsa.lk" className="rounded-lg bg-blue-50 p-2 text-blue-600 hover:bg-blue-100" aria-label="Email">
          <Mail className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
