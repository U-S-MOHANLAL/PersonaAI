// https://nuxt.com/docs/api/configuration/nuxt-config
import process from 'node:process'
export default defineNuxtConfig({
  nitro: {
    preset: "vercel",
  },
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL,
      defaultCharacterId: process.env.NUXT_PUBLIC_DEFAULT_CHARACTER_ID,
    },
  },
    googleSignIn: {
    clientId: "488735869290-q979s2n8c5m0ori8q9b1hbqo64eir2he.apps.googleusercontent.com",
  },
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  app: {
    head: {
      htmlAttrs: { lang: "en" },
      link: [
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: "",
        },
        {
          rel: "apple-touch-icon",
          href: "/apple-touch-icon.png",
          sizes: "180x180",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap",
        },
      ],
      meta: [{ name: "theme-color", content: "#0a0e1a" }],
    },
  },
  modules: ["@element-plus/nuxt", "nuxt-vue3-google-signin", "@vite-pwa/nuxt"],
  css: ["@/assets/styles/index.css"],
});
