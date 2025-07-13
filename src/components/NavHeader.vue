<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import {
  Menu,
  Globe,
  Calculator,
  ChevronDown,
  Layers,
  Percent,
  TrendingUp,
  Equal,
  BarChart3,
  Home,
} from "lucide-vue-next";

const router = useRouter();
const isMenuOpen = ref(false);
const isMobileMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const navigateTo = (route: string) => {
  router.push(route);
  isMenuOpen.value = false;
  isMobileMenuOpen.value = false;
};

const closeMenuOnClickOutside = (event: Event) => {
  const target = event.target as HTMLElement;
  if (isMenuOpen.value && !target.closest(".relative")) {
    isMenuOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", closeMenuOnClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", closeMenuOnClickOutside);
});
</script>

<template>
  <nav
    class="bg-gradient-to-r from-blue-900 to-blue-600 text-white p-4 shadow-lg fixed w-full top-0 left-0 z-50"
  >
    <div class="flex justify-between items-center w-full">
      <router-link
        to="/"
        class="text-xl font-bold tracking-wider hover:text-blue-200 transition-colors flex items-center gap-2"
      >
        <img
          src="/assets/trading_tools.svg"
          alt="Trading Tools"
          class="h-8 w-8"
        />
        Herramientas de trading
      </router-link>
      <!-- Botón hamburguesa para móvil -->
      <button
        @click="toggleMobileMenu"
        class="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-white hover:bg-blue-700 focus:outline-none"
      >
        <span class="sr-only">Abrir menú principal</span>
        <Menu class="block h-6 w-6" />
      </button>
      <!-- Menú de escritorio -->
      <div class="hidden md:flex space-x-4">
        <router-link
          to="/mercados"
          class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2"
        >
          <Globe class="w-4 h-4" />
          Mercados
        </router-link>
        <div class="relative">
          <button
            @click="toggleMenu"
            class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium inline-flex items-center"
            :class="{ 'text-white': isMenuOpen }"
          >
            <Calculator class="w-4 h-4 mr-1" />
            <span>Calculadoras</span>
            <ChevronDown
              class="w-4 h-4 ml-1"
              :class="{ 'transform rotate-180': isMenuOpen }"
            />
          </button>
          <div
            v-show="isMenuOpen"
            class="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
          >
            <div class="py-1">
              <a
                href="#"
                @click.prevent="navigateTo('/lote')"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
              >
                <Layers class="w-4 h-4" />
                Lote
              </a>
              <a
                href="#"
                @click.prevent="navigateTo('/margen')"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
              >
                <Percent class="w-4 h-4" />
                Margen
              </a>
              <a
                href="#"
                @click.prevent="navigateTo('/ganancia')"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
              >
                <TrendingUp class="w-4 h-4" />
                Ganancia
              </a>
              <a
                href="#"
                @click.prevent="navigateTo('/breakeven')"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
              >
                <Equal class="w-4 h-4" />
                Break-even
              </a>
              <a
                href="#"
                @click.prevent="navigateTo('/simulador')"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
              >
                <BarChart3 class="w-4 h-4" />
                Simulador R:R
              </a>
            </div>
          </div>
        </div>
        <router-link
          to="/"
          class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2"
        >
          <Home class="w-4 h-4" />
          Inicio
        </router-link>
      </div>
      <!-- Menú móvil -->
      <div
        v-show="isMobileMenuOpen"
        class="md:hidden absolute top-full left-0 w-full bg-blue-800 shadow-lg"
      >
        <div class="px-2 pt-2 pb-3 space-y-1">
          <a
            href="#"
            @click.prevent="navigateTo('/')"
            class="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
          >
            <Home class="w-4 h-4 inline-block mr-2" />
            Inicio
          </a>
          <a
            href="#"
            @click.prevent="navigateTo('/mercados')"
            class="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
          >
            <Globe class="w-4 h-4 inline-block mr-2" />
            Mercados
          </a>
          <a
            href="#"
            @click.prevent="navigateTo('/lote')"
            class="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
          >
            <Layers class="w-4 h-4 inline-block mr-2" />
            Lote
          </a>
          <a
            href="#"
            @click.prevent="navigateTo('/ganancia')"
            class="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
          >
            <TrendingUp class="w-4 h-4 inline-block mr-2" />
            Ganancia
          </a>
          <a
            href="#"
            @click.prevent="navigateTo('/breakeven')"
            class="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
          >
            <Equal class="w-4 h-4 inline-block mr-2" />
            Break-even
          </a>
          <a
            href="#"
            @click.prevent="navigateTo('/margen')"
            class="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
          >
            <Percent class="w-4 h-4 inline-block mr-2" />
            Margen
          </a>
          <a
            href="#"
            @click.prevent="navigateTo('/simulador')"
            class="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
          >
            <BarChart3 class="w-4 h-4 inline-block mr-2" />
            Simulador R:R
          </a>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
/* Sin wrapper restrictivo, header 100% flotante y fijo arriba */
</style>
