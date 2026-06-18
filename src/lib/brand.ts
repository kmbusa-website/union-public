export const ORG_NAME = "Kilinochchi Maths Bio University Students' Association";
export const ORG_SHORT = "KMBUSA";
export const ORG_FULL = `${ORG_NAME} (${ORG_SHORT})`;
export const ORG_TAGLINE =
  "Uniting Maths & Bio university students — supporting academic growth, events, and our community.";

export const HERO_CAMPUS_IMAGE = "/hero-campus.jpg";
export const LOGO_PATH = "/logo.png";

export const CONTACT = {
  location: "AKSHAYA HOSPITAL, 2ND FLOOR",
  email: "kmbusasl@gmail.com",
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
  { href: "/gallery", label: "Gallery" },
  { href: "/events", label: "Events" },
] as const;

export const FOOTER_SOCIAL = [
  { label: "Facebook", href: "https://web.facebook.com/profile.php?id=61566333822162", icon: "facebook" as const, color: "bg-[#1877F2]" },
  { label: "Instagram", href: "https://www.instagram.com/k.m.b.u.s.a/", icon: "instagram" as const, color: "bg-gradient-to-br from-[#f58529] via-[#dd2a7b] to-[#8134af]" },
  { label: "Email", href: `mailto:${CONTACT.email}`, icon: "email" as const, color: "bg-[#7c3aed]" },
  { label: "YouTube", href: "https://youtube.com", icon: "youtube" as const, color: "bg-[#FF0000]" },
] as const;

export const SOCIAL_LINKS = [
  { label: "Facebook", href: "https://web.facebook.com/profile.php?id=61566333822162", icon: "facebook" as const },
  { label: "Instagram", href: "https://www.instagram.com/k.m.b.u.s.a/", icon: "instagram" as const },
] as const;

export const STATS = [
  { value: "100+", label: "Active Members", icon: "users" as const },
  { value: "2+", label: "Academic Programs", icon: "graduation" as const },
  { value: "3+", label: "Events Conducted", icon: "calendar" as const },
  { value: "1 Goal", label: "Student Empowerment", icon: "medal" as const },
] as const;

export const ABOUT_VALUES = [
  { title: "Our Mission", description: "Unite Maths & Bio students and advance academic excellence across our community." },
  { title: "Our Vision", description: "A thriving student body leading with integrity, innovation, and compassion." },
  { title: "Our Values", description: "Collaboration, inclusivity, academic integrity, and service to society." },
  { title: "Our Goals", description: "Support members through events, resources, guidance, and representation." },
] as const;

export const MILESTONES = [
  { value: "2024", label: "Established" },
  { value: "50+", label: "Students Impacted" },
  { value: "5+", label: "Annual Events" },
] as const;

export const ABOUT_INTRO =
  `${ORG_SHORT} is a student-led organization dedicated to empowering Maths and Bio students through academic support, leadership, and community engagement.` as const;

export const COMMITTEE_INTRO =
  `${ORG_NAME} — leadership and members who guide our union's activities and represent the student community.` as const;

export const EVENTS_INTRO =
  "Seminars, cultural events, and union activities over the years." as const;

export const GALLERY_INTRO = "Moments from our events and activities." as const;

export const CONTACT_INTRO =
  "Have a question, suggestion, or want to get involved?" as const;
export const CONTACT_INTRO_SECONDARY =
  "We're here to help and answer any question you might have." as const;

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

export const MAP_EMBED_URL =
  "https://maps.google.com/maps?q=Akshaya+Hospital,+Kilinochchi,+Sri+Lanka&hl=en&z=16&output=embed";
