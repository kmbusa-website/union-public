import type { Metadata } from "next";
import { Inter, Noto_Sans_Tamil } from "next/font/google";
import { getLocale } from "next-intl/server";

export const metadata: Metadata = {
  icons: { icon: "/logo.png" },
};

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const notoTamil = Noto_Sans_Tamil({ subsets: ["tamil"], variable: "--font-tamil" });

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  return (
    <html
      lang={locale}
      className={`dark ${inter.variable} ${notoTamil.variable}`}
      suppressHydrationWarning
    >
      <head>
        <meta charSet="utf-8" />
      </head>
      <body
        className={`flex min-h-screen flex-col antialiased ${locale === "ta" ? "font-tamil" : "font-sans"}`}
        style={{ fontFamily: locale === "ta" ? "var(--font-tamil), var(--font-inter), system-ui, sans-serif" : undefined }}
      >
        {children}
      </body>
    </html>
  );
}
