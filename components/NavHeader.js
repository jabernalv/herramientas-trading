const NavHeader = {
  template: `
    <nav class="bg-gradient-to-r from-blue-900 to-blue-600 text-white p-4 shadow-lg fixed w-full top-0 z-50">
      <div class="container mx-auto flex justify-between items-center">
        <a href="#" class="text-xl font-bold tracking-wider hover:text-blue-200 transition-colors flex items-center gap-2">
          <img src="assets/trading_tools.svg" alt="Trading Tools" class="h-8 w-8">
          Herramientas de trading
        </a>
        
        <!-- Botón hamburguesa para móvil -->
        <button 
          @click="toggleMobileMenu"
          class="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-white hover:bg-blue-700 focus:outline-none"
        >
          <span class="sr-only">Abrir menú principal</span>
          <i data-lucide="menu" class="block h-6 w-6"></i>
        </button>

        <!-- Menú de escritorio -->
        <div class="hidden md:flex space-x-4">
          <a href="#" @click.prevent="selectOption('mercados')" class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2">
            <i data-lucide="globe" class="w-4 h-4"></i>
            Mercados
          </a>
          <div class="relative">
            <button 
              @click="toggleMenu"
              class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium inline-flex items-center"
              :class="{ 'text-white': isMenuOpen }"
            >
              <i data-lucide="calculator" class="w-4 h-4 mr-1"></i>
              <span>Calculadoras</span>
              <i data-lucide="chevron-down" class="w-4 h-4 ml-1" :class="{ 'transform rotate-180': isMenuOpen }"></i>
            </button>
            <div 
              v-show="isMenuOpen"
              class="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
            >
              <div class="py-1">
                <a href="#" @click.prevent="selectOption('lote')" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                  <i data-lucide="layers" class="w-4 h-4"></i>
                  Lote
                </a>
                <a href="#" @click.prevent="selectOption('margen')" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                  <i data-lucide="percent" class="w-4 h-4"></i>
                  Margen
                </a>
                <a href="#" @click.prevent="selectOption('ganancia')" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                  <i data-lucide="trending-up" class="w-4 h-4"></i>
                  Ganancia
                </a>
                <a href="#" @click.prevent="selectOption('breakeven')" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                  <i data-lucide="equal" class="w-4 h-4"></i>
                  Break-even
                </a>
                <a href="#" @click.prevent="selectOption('simulador')" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                  <i data-lucide="bar-chart-3" class="w-4 h-4"></i>
                  Simulador R:R
                </a>
              </div>
            </div>
          </div>
          <a href="#" @click.prevent="selectOption('home')" class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2">
            <i data-lucide="home" class="w-4 h-4"></i>
            Inicio
          </a>
        </div>

        <!-- Menú móvil -->
        <div 
          v-show="isMobileMenuOpen" 
          class="md:hidden absolute top-full left-0 w-full bg-blue-800 shadow-lg"
        >
          <div class="px-2 pt-2 pb-3 space-y-1">
            <a href="#" @click.prevent="selectOption('home')" class="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
              <i data-lucide="home" class="w-4 h-4 inline-block mr-2"></i>
              Inicio
            </a>
            <a href="#" @click.prevent="selectOption('mercados')" class="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
              <i data-lucide="globe" class="w-4 h-4 inline-block mr-2"></i>
              Mercados
            </a>
            <a href="#" @click.prevent="selectOption('lote')" class="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
              <i data-lucide="layers" class="w-4 h-4 inline-block mr-2"></i>
              Lote
            </a>
            <a href="#" @click.prevent="selectOption('ganancia')" class="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
              <i data-lucide="trending-up" class="w-4 h-4 inline-block mr-2"></i>
              Ganancia
            </a>
            <a href="#" @click.prevent="selectOption('breakeven')" class="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
              <i data-lucide="equal" class="w-4 h-4 inline-block mr-2"></i>
              Break-even
            </a>
            <a href="#" @click.prevent="selectOption('simulador')" class="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
              <i data-lucide="bar-chart-3" class="w-4 h-4 inline-block mr-2"></i>
              Simulador R:R
            </a>
            <a href="#" @click.prevent="selectOption('margen')" class="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
              <i data-lucide="percent" class="w-4 h-4 inline-block mr-2"></i>
              Margen
            </a>
          </div>
        </div>
      </div>
    </nav>
  `,
  data() {
    return {
      isMenuOpen: false,
      isMobileMenuOpen: false,
    };
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    toggleMobileMenu() {
      this.isMobileMenuOpen = !this.isMobileMenuOpen;
      this.$nextTick(() => {
        lucide.createIcons();
      });
    },
    selectOption(tool) {
      this.$emit("show-tool", tool);
      this.isMenuOpen = false;
      this.isMobileMenuOpen = false;
    },
    closeMenuOnClickOutside(event) {
      if (this.isMenuOpen && !event.target.closest(".relative")) {
        this.isMenuOpen = false;
      }
    },
  },
  mounted() {
    lucide.createIcons();
    document.addEventListener("click", this.closeMenuOnClickOutside);
  },
  beforeUnmount() {
    document.removeEventListener("click", this.closeMenuOnClickOutside);
  },
};
