import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  base: process.env.NODE_ENV === "production" ? "/herramientas-trading/" : "/",
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          vue: ["vue", "vue-router"],
          primevue: [
            "primevue/button",
            "primevue/select",
            "primevue/inputnumber",
            "primevue/inputgroup",
            "primevue/inputgroupaddon",
            "primevue/card",
            "primevue/badge",
            "primevue/fieldset",
          ],
          icons: ["lucide-vue-next"],
          // Calculator chunks
          calculators: [
            "./src/components/LotSizeCalculator.vue",
            "./src/components/MarginCalculator.vue",
            "./src/components/ProfitCalculator.vue",
            "./src/components/BreakevenCalculator.vue",
          ],
          simulator: ["./src/components/ForexSimulator.vue"],
          market: ["./src/components/MarketOverview.vue"],
        },
      },
    },
    chunkSizeWarningLimit: 500,
  },
});
