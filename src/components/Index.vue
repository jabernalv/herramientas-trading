<template>
  <div class="animate-fade-in">
    <div class="flex items-center justify-center px-2 py-6">
      <div class="max-w-5xl w-full">
        <header class="text-center mb-8">
          <h1 class="text-2xl sm:text-3xl font-bold text-blue-800">
            Herramientas de apoyo para el análisis técnico y la gestión del
            riesgo
          </h1>
          <p class="mt-3 text-gray-700 text-sm md:text-base">
            Este entorno contiene utilidades académicas diseñadas para apoyar la
            toma de decisiones en trading. No se trata de adivinar movimientos,
            sino de planear con fundamento y gestionar el riesgo con criterio.
          </p>
        </header>

        <div class="space-y-6">
          <!-- Calculadoras de Trading -->
          <Fieldset :toggleable="true" class="w-full">
            <template #legend>
              <div class="flex items-center gap-3">
                <div class="p-2 rounded-full bg-blue-100">
                  <Calculator class="w-5 h-5 text-blue-600" />
                </div>
                <span class="font-bold text-lg text-gray-800"
                  >Calculadoras de Trading</span
                >
              </div>
            </template>

            <div
              class="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              <router-link
                v-for="tool in calculatorTools"
                :key="tool.route"
                :to="tool.route"
                class="group block border border-gray-200 rounded-lg p-5 bg-white shadow hover:shadow-lg transition"
              >
                <div class="flex items-center gap-4">
                  <div
                    class="p-3 rounded-full"
                    :class="getIconBgClass(tool.iconColor)"
                  >
                    <component
                      :is="tool.icon"
                      class="w-6 h-6"
                      :class="tool.iconColor"
                    />
                  </div>
                  <h2
                    class="text-base sm:text-lg font-semibold text-gray-800 group-hover:text-gray-900"
                  >
                    {{ tool.label }}
                  </h2>
                </div>
                <p class="mt-3 text-gray-600 text-sm">
                  {{ tool.description }}
                </p>
                <div class="mt-4">
                  <span class="text-sm font-medium" :class="tool.linkColor">
                    {{ tool.linkText }} →
                  </span>
                </div>
              </router-link>
            </div>
          </Fieldset>

          <!-- Información de Mercados -->
          <Fieldset :toggleable="true" class="w-full">
            <template #legend>
              <div class="flex items-center gap-3">
                <div class="p-2 rounded-full bg-green-100">
                  <Globe class="w-5 h-5 text-green-600" />
                </div>
                <span class="font-bold text-lg text-gray-800"
                  >Información de Mercados</span
                >
              </div>
            </template>

            <div class="grid grid-cols-1 gap-4 sm:gap-6">
              <router-link
                v-for="tool in marketTools"
                :key="tool.route"
                :to="tool.route"
                class="group block border border-gray-200 rounded-lg p-5 bg-white shadow hover:shadow-lg transition"
              >
                <div class="flex items-center gap-4">
                  <div
                    class="p-3 rounded-full"
                    :class="getIconBgClass(tool.iconColor)"
                  >
                    <component
                      :is="tool.icon"
                      class="w-6 h-6"
                      :class="tool.iconColor"
                    />
                  </div>
                  <h2
                    class="text-base sm:text-lg font-semibold text-gray-800 group-hover:text-gray-900"
                  >
                    {{ tool.label }}
                  </h2>
                </div>
                <p class="mt-3 text-gray-600 text-sm">
                  {{ tool.description }}
                </p>
                <div class="mt-4">
                  <span class="text-sm font-medium" :class="tool.linkColor">
                    {{ tool.linkText }} →
                  </span>
                </div>
              </router-link>
            </div>
          </Fieldset>

          <!-- Simuladores -->
          <Fieldset :toggleable="true" class="w-full">
            <template #legend>
              <div class="flex items-center gap-3">
                <div class="p-2 rounded-full bg-purple-100">
                  <BarChart3 class="w-5 h-5 text-purple-600" />
                </div>
                <span class="font-bold text-lg text-gray-800">Simuladores</span>
              </div>
            </template>

            <div class="grid grid-cols-1 gap-4 sm:gap-6">
              <router-link
                v-for="tool in simulatorTools"
                :key="tool.route"
                :to="tool.route"
                class="group block border border-gray-200 rounded-lg p-5 bg-white shadow hover:shadow-lg transition"
              >
                <div class="flex items-center gap-4">
                  <div
                    class="p-3 rounded-full"
                    :class="getIconBgClass(tool.iconColor)"
                  >
                    <component
                      :is="tool.icon"
                      class="w-6 h-6"
                      :class="tool.iconColor"
                    />
                  </div>
                  <h2
                    class="text-base sm:text-lg font-semibold text-gray-800 group-hover:text-gray-900"
                  >
                    {{ tool.label }}
                  </h2>
                </div>
                <p class="mt-3 text-gray-600 text-sm">
                  {{ tool.description }}
                </p>
                <div class="mt-4">
                  <span class="text-sm font-medium" :class="tool.linkColor">
                    {{ tool.linkText }} →
                  </span>
                </div>
              </router-link>
            </div>
          </Fieldset>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import Fieldset from "primevue/fieldset";
import { Calculator, Globe, BarChart3 } from "lucide-vue-next";
import { toolsMenu, type ToolMenuItem } from "../data/toolsMenu";

// Group tools by category
const calculatorTools = computed(() =>
  toolsMenu.filter((tool: ToolMenuItem) =>
    ["Lote", "Margen", "Ganancia", "Break-even"].includes(tool.label)
  )
);

const marketTools = computed(() =>
  toolsMenu.filter((tool: ToolMenuItem) => tool.label === "Mercados")
);

const simulatorTools = computed(() =>
  toolsMenu.filter((tool: ToolMenuItem) => tool.label === "Simulador R:R")
);

function getIconBgClass(iconColor: string | undefined): string {
  if (!iconColor) return "bg-gray-100";

  const colorMap: Record<string, string> = {
    "text-blue-600": "bg-blue-100",
    "text-amber-600": "bg-amber-100",
    "text-green-600": "bg-green-100",
    "text-emerald-600": "bg-emerald-100",
    "text-indigo-600": "bg-indigo-100",
    "text-fuchsia-600": "bg-fuchsia-100",
    "text-red-600": "bg-red-100",
    "text-yellow-600": "bg-yellow-100",
    "text-purple-600": "bg-purple-100",
  };

  return colorMap[iconColor] || "bg-gray-100";
}
</script>

<style scoped>
.animate-fade-in {
  animation: fade-in 0.7s;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
