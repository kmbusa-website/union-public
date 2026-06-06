import { PageHero } from "@/components/kit/page-hero";
import { CommitteeCard } from "@/components/shared/committee-card";
import { getCommittee } from "@/lib/api";

export const revalidate = 120;

export default async function CommitteePage() {
  const members = await getCommittee().catch(() => []);

  return (
    <>
      <PageHero title="Executive" highlight="Committee" subtitle="Meet the team representing KMBUSA." />
      <div className="kit-white-main">
        <div className="kit-container">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {members.length === 0 ? (
              <p className="col-span-full max-w-xl text-slate-600">
                Committee profiles will appear here once they are added in the admin panel
                (Committee → assign approved members to President, Secretary, and other roles).
                Ensure the backend API is running at{" "}
                <code className="rounded bg-slate-100 px-1 text-sm">
                  {process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api"}
                </code>
                .
              </p>
            ) : (
              members.map((m) => <CommitteeCard key={m.id} member={m} />)
            )}
          </div>
        </div>
      </div>
    </>
  );
}
