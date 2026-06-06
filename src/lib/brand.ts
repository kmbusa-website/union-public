export const ORG_NAME = "Kilinochchi Maths Bio University Students' Association";
export const ORG_SHORT = "KMBUSA";
export const ORG_FULL = `${ORG_NAME} (${ORG_SHORT})`;
export const ORG_TAGLINE =
  "Uniting Maths & Bio university students — supporting academic growth, events, and our community.";

export const HERO_CAMPUS_IMAGE = "/hero-campus.jpg";
export const LOGO_PATH = "/logo.png";

export const CONTACT = {
  location: "AKSHAYA HOSPITAL, 2ND FLOOR",
  email: "info@kmbsa.lk",
  phone: "+94 77 123 4567",
} as const;

export const FOOTER_QUICK_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/committee", label: "Committee" },
  { href: "/events", label: "Events" },
  { href: "/contact", label: "Contact" },
] as const;

export const FOOTER_RESOURCES = [
  { href: "/results", label: "A/L Results" },
  { href: "/past-papers", label: "Past Papers" },
  { href: "/gallery", label: "Gallery" },
  { href: "/news", label: "News" },
  { href: "/events", label: "Events" },
] as const;

export const FOOTER_SOCIAL = [
  { label: "Facebook", href: "https://facebook.com", icon: "facebook" as const, color: "bg-[#1877F2]" },
  { label: "Instagram", href: "https://instagram.com", icon: "instagram" as const, color: "bg-gradient-to-br from-[#f58529] via-[#dd2a7b] to-[#8134af]" },
  { label: "Email", href: `mailto:info@kmbsa.lk`, icon: "email" as const, color: "bg-[#7c3aed]" },
  { label: "YouTube", href: "https://youtube.com", icon: "youtube" as const, color: "bg-[#FF0000]" },
] as const;

export const SOCIAL_LINKS = [
  { label: "Facebook", href: "https://facebook.com", icon: "facebook" as const },
  { label: "Instagram", href: "https://instagram.com", icon: "instagram" as const },
  { label: "YouTube", href: "https://youtube.com", icon: "youtube" as const },
  { label: "X", href: "https://x.com", icon: "x" as const },
] as const;

export const STATS = [
  { value: "350+", label: "Active Members", icon: "users" as const },
  { value: "15+", label: "Academic Programs", icon: "book" as const },
  { value: "25+", label: "Events Conducted", icon: "calendar" as const },
] as const;

export const ABOUT_VALUES = [
  { title: "Our Mission", description: "Unite Maths & Bio students and advance academic excellence across our community." },
  { title: "Our Vision", description: "A thriving student body leading with integrity, innovation, and compassion." },
  { title: "Our Values", description: "Collaboration, inclusivity, academic integrity, and service to society." },
  { title: "Our Goals", description: "Support members through events, resources, guidance, and representation." },
] as const;

export const MILESTONES = [
  { value: "2025", label: "Established" },
  { value: "50+", label: "Students Impacted" },
  { value: "5+", label: "Annual Events" },
] as const;

export const NEWS_FILTERS = ["All", "Academic", "Events", "Sports", "Announcements"] as const;
export const GALLERY_FILTERS = [
  "All",
  "Academic",
  "Sports",
  "Events",
  "Seminars",
  "Community Service",
] as const;

export const GALLERY_CATEGORY_API: Record<string, string> = {
  Academic: "ACADEMIC",
  Sports: "SPORTS",
  Events: "EVENTS",
  Seminars: "SEMINARS",
  "Community Service": "COMMUNITY_SERVICE",
};
export const POPULAR_SUBJECTS = ["Combined Mathematics", "Biology", "Chemistry", "Physics", "ICT"] as const;

export const MAP_EMBED_URL =
  "https://maps.google.com/maps?q=Akshaya+Hospital,+Kilinochchi,+Sri+Lanka&hl=en&z=16&output=embed";
