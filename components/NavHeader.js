const NavHeader = {
  template: `
    <nav class="bg-gradient-to-r from-blue-900 to-blue-600 text-white p-4 shadow-lg fixed w-full top-0 z-50">
      <div class="container mx-auto flex justify-between items-center">
        <a href="#" class="text-xl font-bold tracking-wider hover:text-blue-200 transition-colors">
          Herramientas de trading
        </a>
        <a href="index.html" class="hover:text-blue-200 transition-colors flex items-center gap-1">
          <i data-lucide="home" class="w-4 h-4"></i>
          <span>Inicio</span>
        </a>
      </div>
    </nav>
  `,
  mounted() {
    lucide.createIcons();
  },
};
