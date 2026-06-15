export type CommitteeTier = "executive" | "roles" | "mentors" | "members";

export interface CommitteeMember {
  id: string;
  name: string;
  role: string;
  tier: CommitteeTier;
  faculty: string;
  university: string;
  photoUrl: string;
  accent: string;
  year: number;
}

export const COMMITTEE_TIER_LABELS: Record<CommitteeTier, string> = {
  executive: "Executive",
  roles: "Committee",
  mentors: "Mentor",
  members: "General",
};
