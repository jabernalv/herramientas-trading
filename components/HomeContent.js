const HomeContent = {
  template: `
    <div>
      <div v-if="!currentTool" class="animate-fade-in">
        <div class="flex items-center justify-center px-2 py-6">
          <div class="max-w-5xl w-full">
            <header class="text-center mb-8">
              <h1 class="text-2xl sm:text-3xl font-bold text-blue-800">
                Herramientas de apoyo para el análisis técnico y la gestión del riesgo
              </h1>
              <p class="mt-3 text-gray-700 text-sm md:text-base">
                Este entorno contiene utilidades académicas diseñadas para apoyar
                la toma de decisiones en trading. No se trata de adivinar
                movimientos, sino de planear con fundamento y gestionar el riesgo
                con criterio.
              </p>
            </header>

            <div class="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
              <!-- Mercados -->
              <a
                href="#"
                @click.prevent="showTool('mercados')"
                class="group block border border-gray-200 rounded-lg p-5 sm:p-6 bg-white shadow hover:shadow-lg transition"
              >
                <div class="flex items-center gap-4">
                  <div class="bg-red-100 text-red-700 p-3 rounded-full">
                    <i data-lucide="globe" class="w-6 h-6"></i>
                  </div>
                  <h2
                    class="text-base sm:text-lg font-semibold text-gray-800 group-hover:text-red-700"
                  >
                    Estado de los Mercados
                  </h2>
                </div>
                <p class="mt-3 text-gray-600 text-sm">
                  Consulta el estado actual de los principales mercados bursátiles del mundo, con horarios locales y tiempos de apertura/cierre.
                </p>
              </a>
              <!-- Lote -->
              <a
                href="#"
                @click.prevent="showTool('lote')"
                class="group block border border-gray-200 rounded-lg p-5 sm:p-6 bg-white shadow hover:shadow-lg transition"
              >
                <div class="flex items-center gap-4">
                  <div class="bg-blue-100 text-blue-700 p-3 rounded-full">
                    <i data-lucide="ruler" class="w-6 h-6"></i>
                  </div>
                  <h2
                    class="text-base sm:text-lg font-semibold text-gray-800 group-hover:text-blue-700"
                  >
                    Calculadora de tamaño de lote
                  </h2>
                </div>
                <p class="mt-3 text-gray-600 text-sm">
                  Calcula el tamaño de lote adecuado para una operación con base
                  en tu riesgo por operación y el stop loss definido.
                </p>
              </a>
              <!-- Margen -->
              <a
                href="#"
                @click.prevent="showTool('margen')"
                class="group block border border-gray-200 rounded-lg p-5 sm:p-6 bg-white shadow hover:shadow-lg transition"
              >
                <div class="flex items-center gap-4">
                  <div class="bg-indigo-100 text-indigo-700 p-3 rounded-full">
                    <i data-lucide="scale" class="w-6 h-4"></i>
                  </div>
                  <h2
                    class="text-base sm:text-lg font-semibold text-gray-800 group-hover:text-indigo-700"
                  >
                    Calculadora de margen requerido
                  </h2>
                </div>
                <p class="mt-3 text-gray-600 text-sm">
                  Calcula el margen necesario para abrir una posición según el tamaño del lote y el apalancamiento seleccionado.
                </p>
              </a>
              <!-- Ganancia -->
              <a
                href="#"
                @click.prevent="showTool('ganancia')"
                class="group block border border-gray-200 rounded-lg p-5 sm:p-6 bg-white shadow hover:shadow-lg transition"
              >
                <div class="flex items-center gap-4">
                  <div class="bg-green-100 text-green-700 p-3 rounded-full">
                    <i data-lucide="dollar-sign" class="w-6 h-6"></i>
                  </div>
                  <h2
                    class="text-base sm:text-lg font-semibold text-gray-800 group-hover:text-green-700"
                  >
                    Calculadora de ganancia por operación
                  </h2>
                </div>
                <p class="mt-3 text-gray-600 text-sm">
                  Estima tu ganancia o pérdida en una operación según precios de
                  entrada y salida, tipo de operación y apalancamiento.
                </p>
              </a>
              <!-- Break-even -->
              <a
                href="#"
                @click.prevent="showTool('breakeven')"
                class="group block border border-gray-200 rounded-lg p-5 sm:p-6 bg-white shadow hover:shadow-lg transition"
              >
                <div class="flex items-center gap-4">
                  <div class="bg-yellow-100 text-yellow-700 p-3 rounded-full">
                    <i data-lucide="divide" class="w-6 h-6"></i>
                  </div>
                  <h2
                    class="text-base sm:text-lg font-semibold text-gray-800 group-hover:text-yellow-700"
                  >
                    Calculadora de break-even
                  </h2>
                </div>
                <p class="mt-3 text-gray-600 text-sm">
                  Calcula el punto de equilibrio para mover tu stop loss a break-even basado en el porcentaje de recorrido hacia tu take profit.
                </p>
              </a>
              <!-- Simulador R:R -->
              <a
                href="#"
                @click.prevent="showTool('simulador')"
                class="group block border border-gray-200 rounded-lg p-5 sm:p-6 bg-white shadow hover:shadow-lg transition"
              >
                <div class="flex items-center gap-4">
                  <div class="bg-purple-100 text-purple-700 p-3 rounded-full">
                    <i data-lucide="activity" class="w-6 h-6"></i>
                  </div>
                  <h2
                    class="text-base sm:text-lg font-semibold text-gray-800 group-hover:text-purple-700"
                  >
                    Simulador riesgo - recompensa
                  </h2>
                </div>
                <p class="mt-3 text-gray-600 text-sm">
                  Compara el riesgo asumido frente a la posible ganancia. Evalúa
                  si la operación tiene una relación R:R favorable.
                </p>
              </a>
            </div>
          </div>
        </div>
      </div>
      <template v-else>
        <component :is="currentComponent"></component>
      </template>
    </div>
  `,
  components: {
    "nav-header": NavHeader,
    "footer-component": FooterComponent,
    "lote-calculator": LoteCalculator,
    "ganancia-calculator": GananciaCalculator,
    "breakeven-calculator": BreakevenCalculator,
    "simulador-calculator": SimuladorCalculator,
    "margen-calculator": MargenCalculator,
    "mercados-calculator": MercadosCalculator,
  },
  data() {
    return {
      currentTool: null,
    };
  },
  computed: {
    currentComponent() {
      const components = {
        lote: "lote-calculator",
        ganancia: "ganancia-calculator",
        breakeven: "breakeven-calculator",
        simulador: "simulador-calculator",
        margen: "margen-calculator",
        mercados: "mercados-calculator",
      };
      return components[this.currentTool] || null;
    },
  },
  methods: {
    showTool(tool) {
      if (tool === "home") {
        this.currentTool = null;
        window.history.pushState({}, "", window.location.pathname);
      } else {
        this.currentTool = tool;
        if (tool) {
          window.history.pushState({}, "", `#${tool}`);
        } else {
          window.history.pushState({}, "", window.location.pathname);
        }
      }
    },
    handlePopState() {
      const hash = window.location.hash.slice(1);
      if (
        [
          "lote",
          "ganancia",
          "breakeven",
          "simulador",
          "margen",
          "mercados",
        ].includes(hash)
      ) {
        this.currentTool = hash;
      } else {
        this.currentTool = null;
      }
    },
  },
  mounted() {
    const hash = window.location.hash.slice(1);
    if (
      [
        "lote",
        "ganancia",
        "breakeven",
        "simulador",
        "margen",
        "mercados",
      ].includes(hash)
    ) {
      this.currentTool = hash;
    }
    window.addEventListener("popstate", this.handlePopState);
    lucide.createIcons();
  },
  beforeUnmount() {
    window.removeEventListener("popstate", this.handlePopState);
  },
  updated() {
    lucide.createIcons();
  },
};

// Exportar el componente
if (typeof exports !== "undefined") {
  exports.HomeContent = HomeContent;
} else {
  window.HomeContent = HomeContent;
}
