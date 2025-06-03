const NavHeader = {
  template: `
    <nav class="bg-gradient-to-r from-blue-900 to-blue-600 text-white p-4 shadow-lg fixed w-full top-0 z-50">
      <div class="container mx-auto flex justify-between items-center">
        <a href="#" class="text-xl font-bold tracking-wider hover:text-blue-200 transition-colors flex items-center gap-2">
          <img src="assets/trading_tools.svg" alt="Trading Tools" class="h-8 w-8">
          Herramientas de trading
        </a>
        <div class="flex space-x-4">
          <div class="relative">
            <button 
              @click="toggleMenu"
              class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium inline-flex items-center"
              :class="{ 'text-white': isMenuOpen }"
            >
              <span>Calculadoras</span>
              <i data-lucide="chevron-down" class="w-4 h-4 ml-1" :class="{ 'transform rotate-180': isMenuOpen }"></i>
            </button>
            <div 
              v-show="isMenuOpen"
              class="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
            >
              <div class="py-1">
                <a href="#" @click.prevent="selectOption('lote')" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Lote</a>
                <a href="#" @click.prevent="selectOption('ganancia')" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Ganancia</a>
                <a href="#" @click.prevent="selectOption('breakeven')" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Break-even</a>
                <a href="#" @click.prevent="selectOption('simulador')" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Simulador R:R</a>
              </div>
            </div>
          </div>
          <a href="index.html" class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Inicio</a>
        </div>
      </div>
    </nav>
  `,
  data() {
    return {
      isMenuOpen: false,
    };
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    selectOption(tool) {
      this.$emit("show-tool", tool);
      this.isMenuOpen = false;
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
