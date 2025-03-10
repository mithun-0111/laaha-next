module.exports = {
  name: "Laaha",
  slogan: "The laaha site built as a headless Drupal with Next.js",
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
  drupalBaseUrl: process.env.NEXT_PUBLIC_DRUPAL_BASE_URL,
  defaultLocale: "en",
  rtlLocales: ["ar", "ku", "prs"],
  locales: {
    en: "English",
    es: "Spanish (Español)",
    prs: "Dari",
    ar: "Arabic ( عربى )",
    ku: "Kurdish ( کوردی )",
    ps: "Pashto",
    uk: "Ukrainian (українська)",
    my: "Burmese ( မြန်မာစာ)"
  },
}
