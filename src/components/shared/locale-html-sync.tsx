"use client";

import { useLocale } from "next-intl";
import { useLayoutEffect } from "react";

const TAMIL_FONT_STACK = "var(--font-tamil), var(--font-inter), system-ui, sans-serif";

export function LocaleHtmlSync() {
  const locale = useLocale();

  useLayoutEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    html.lang = locale;

    if (locale === "ta") {
      body.classList.add("font-tamil");
      body.classList.remove("font-sans");
      body.style.fontFamily = TAMIL_FONT_STACK;
    } else {
      body.classList.add("font-sans");
      body.classList.remove("font-tamil");
      body.style.fontFamily = "";
    }
  }, [locale]);

  return null;
}
