// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  runtimeConfig: {
    public: {
      baseUrl: process.env.BASE_URL ?? 'http://localhost:3000'
    }
  },
  devtools: { enabled: true },
  future: {
    compatibilityVersion: 4
  },
  supabase: {
    redirect: true,
  },
  modules: ["@nuxt/ui", "@nuxtjs/supabase"]
})