const MargenCalculator = {
  template: `
    <div class="flex items-center justify-center px-4 py-8">
      <!-- Sistema de notificaciones -->
      <div v-if="notification" class="fixed top-20 right-4 z-50 max-w-sm">
        <div
          :class="{
          'p-4 rounded-lg shadow-lg border flex items-start gap-3 transition-all duration-300': true,
          'bg-red-50 border-red-300 text-red-800': notification.type === 'error',
          'bg-yellow-50 border-yellow-300 text-yellow-800': notification.type === 'warning',
          'bg-green-50 border-green-300 text-green-800': notification.type === 'success'
        }"
        >
          <div class="flex-shrink-0 mt-0.5">
            <i
              v-if="notification.type === 'error'"
              data-lucide="alert-circle"
              class="w-5 h-5"
            ></i>
            <i
              v-if="notification.type === 'warning'"
              data-lucide="alert-triangle"
              class="w-5 h-5"
            ></i>
            <i
              v-if="notification.type === 'success'"
              data-lucide="check-circle"
              class="w-5 h-5"
            ></i>
          </div>
          <div>
            <h3 class="font-semibold">{{ notification.title }}</h3>
            <p class="text-sm">{{ notification.message }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white shadow-md rounded p-6 max-w-7xl w-full grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Columna principal -->
        <div class="md:col-span-2">
          <h1 class="text-2xl font-bold mb-6 text-center">
            Calculadora de margen requerido
          </h1>

          <!-- Selector de par -->
          <div class="mb-4 relative">
            <label class="block font-semibold mb-1">Par de divisas o activo</label>
            <span class="absolute left-3 top-10 text-gray-500">
              <i data-lucide="globe" class="w-4 h-4"></i>
            </span>
            <select
              v-model="pair"
              @focus="setAyuda('pair')"
              class="w-full pl-10 border border-gray-300 rounded p-2"
            >
              <option disabled value="">-- Selecciona un par --</option>
              <option v-for="(info, symbol) in tradingPairs" :key="symbol" :value="symbol">
                {{ symbol }} - {{ info.nombre }}
              </option>
            </select>
          </div>

          <!-- Entradas -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div class="relative">
              <label class="block font-semibold mb-1">Precio actual</label>
              <span class="absolute left-3 top-10 text-gray-500">
                <i data-lucide="trending-up" class="w-4 h-4"></i>
              </span>
              <input
                v-model.number="precio"
                @focus="setAyuda('precio')"
                type="number"
                :step="getPipSize()"
                class="w-full text-right pl-10 border border-gray-300 rounded p-2"
              />
            </div>
            <div class="relative">
              <label class="block font-semibold mb-1">Tamaño del lote</label>
              <span class="absolute left-3 top-10 text-gray-500">
                <i data-lucide="layers" class="w-4 h-4"></i>
              </span>
              <input
                v-model.number="lote"
                @focus="setAyuda('lote')"
                type="number"
                step="0.01"
                class="w-full text-right pl-10 border border-gray-300 rounded p-2"
              />
            </div>
            <div class="relative">
              <label class="block font-semibold mb-1">Apalancamiento</label>
              <span class="absolute left-3 top-10 text-gray-500">
                <i data-lucide="scale" class="w-4 h-4"></i>
              </span>
              <select
                v-model="apalancamiento"
                @focus="setAyuda('apalancamiento')"
                class="w-full pl-10 border border-gray-300 rounded p-2"
              >
                <option v-for="opcion in apalancamientoOpciones" 
                        :key="opcion.valor" 
                        :value="opcion.valor">
                  {{ opcion.texto }}
                </option>
              </select>
            </div>
          </div>

          <!-- Botón -->
          <div class="text-center mb-6">
            <button
              @click="calcularMargen"
              class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 inline-flex items-center gap-2"
            >
              <i data-lucide="calculator" class="w-4 h-4"></i>
              Calcular margen
            </button>
          </div>

          <!-- Resultados -->
          <div v-if="resultado" class="text-center mb-6">
            <div class="inline-flex flex-col items-center justify-center px-6 py-4 rounded-lg bg-green-100 border border-green-300 shadow-md animate-fade-in">
              <div class="flex items-center gap-2 mb-2">
                <i data-lucide="check-circle" class="w-6 h-6 text-green-600"></i>
                <span class="text-lg font-semibold">Resultado del cálculo:</span>
              </div>
              <p class="text-3xl text-green-700 font-extrabold tracking-wide">
                \${{ resultado.margenRequerido.toFixed(2) }}
              </p>
            </div>

            <div class="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200 animate-fade-in">
              <p class="text-sm text-blue-800 mb-2">Fórmula aplicada:</p>
              <div class="text-center" v-html="calculoHTML"></div>
              <div class="mt-3 text-sm text-blue-600">
                <div>Donde:</div>
                <div>Precio = {{ precio }}</div>
                <div>Unidades = {{ tradingPairs[pair].unidades.toLocaleString() }}</div>
                <div>Lote = {{ lote }}</div>
                <div>Apalancamiento = {{ apalancamiento }}:1</div>
              </div>
            </div>

            <div class="mt-4 p-4 bg-gray-100 border border-gray-300 rounded text-sm">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <strong>Valor nominal:</strong> \${{ resultado.valorNominal.toFixed(2) }}
                </div>
                <div>
                  <strong>Margen requerido:</strong> \${{ resultado.margenRequerido.toFixed(2) }}
                </div>
              </div>
              <p class="mt-3">
                Para abrir una posición de {{ lote }} {{ pair }} necesitarás un margen de
                <strong>\${{ resultado.margenRequerido.toFixed(2) }}</strong> con un apalancamiento de {{ apalancamiento }}:1.
                Esto representa el {{ ((1 / apalancamiento) * 100).toFixed(2) }}% del valor nominal de la posición.
              </p>
            </div>
          </div>

          <!-- Información del par seleccionado -->
          <div v-if="pair && tradingPairs[pair]" class="text-sm bg-blue-50 border border-blue-200 p-4 rounded mb-6">
            <h3 class="font-semibold mb-2">{{ tradingPairs[pair].nombre }}</h3>
            <p class="text-gray-600">{{ tradingPairs[pair].descripcion }}</p>
            <div class="mt-2 grid grid-cols-2 gap-2">
              <div>
                <strong>Valor del pip:</strong> \${{ tradingPairs[pair].valorPip }}
              </div>
              <div>
                <strong>Unidades por lote:</strong> {{ tradingPairs[pair].unidades.toLocaleString() }}
              </div>
            </div>
          </div>
        </div>

        <!-- Ayuda contextual -->
        <div class="bg-gray-100 border border-gray-300 p-4 rounded text-sm leading-relaxed">
          <h2 class="font-bold text-lg mb-2">Ayuda contextual</h2>
          <div v-if="ayudaActiva" v-html="ayudas[ayudaActiva]"></div>
          <p v-else class="text-gray-500">
            Enfoca un campo para ver la explicación.
          </p>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      pair: "",
      precio: null,
      lote: null,
      apalancamiento: 100,
      apalancamientoOpciones: [
        { valor: 10, texto: "10:1" },
        { valor: 20, texto: "20:1" },
        { valor: 30, texto: "30:1" },
        { valor: 50, texto: "50:1" },
        { valor: 100, texto: "100:1" },
        { valor: 200, texto: "200:1" },
        { valor: 400, texto: "400:1" },
        { valor: 500, texto: "500:1" },
      ],
      ayudaActiva: "",
      resultado: null,
      notification: null,
      tradingPairs: window.tradingPairs,
      ayudas: {
        pair: "Selecciona el par de divisas o activo que vas a operar. Cada instrumento tiene diferentes unidades por lote estándar.",
        precio:
          "El precio actual del instrumento. Este valor se usa para calcular el valor nominal de la posición.",
        lote: "El tamaño del lote determina el valor nominal de tu posición. A mayor lote, mayor margen requerido.",
        apalancamiento:
          "El apalancamiento determina qué fracción del valor nominal necesitas como margen. Por ejemplo, 100:1 significa que necesitas 1/100 del valor nominal.",
        result: `<div class='space-y-4'>
          <p>El margen requerido se calcula usando la siguiente fórmula:</p>
          
          <div class='text-center'>
            $$M = \\frac{P \\times U \\times L}{A}$$
          </div>

          <div class='space-y-1 mt-3'>
            <p>Donde:</p>
            <div class='ml-4'>• <strong><i>M</i></strong>: Margen requerido en USD</div>
            <div class='ml-4'>• <strong><i>P</i></strong>: Precio actual</div>
            <div class='ml-4'>• <strong><i>U</i></strong>: Unidades por lote</div>
            <div class='ml-4'>• <strong><i>L</i></strong>: Tamaño del lote</div>
            <div class='ml-4'>• <strong><i>A</i></strong>: Apalancamiento</div>
          </div>

          <p>El valor nominal representa el valor total de la posición antes del apalancamiento:</p>
          <div class='text-center'>
            $$\\text{Valor Nominal} = P \\times U \\times L$$
          </div>
        </div>`,
      },
    };
  },
  computed: {
    calculoHTML() {
      if (!this.resultado) return "";

      return `\\begin{align*}
        \\text{Valor Nominal} &= ${this.precio} \\times ${
        this.tradingPairs[this.pair].unidades
      } \\times ${this.lote} = \\$${this.resultado.valorNominal.toFixed(2)} \\\\
        \\text{Margen} &= \\frac{${this.precio} \\times ${
        this.tradingPairs[this.pair].unidades
      } \\times ${this.lote}}{${
        this.apalancamiento
      }} = \\$${this.resultado.margenRequerido.toFixed(2)}
      \\end{align*}`;
    },
  },
  methods: {
    setAyuda(id) {
      this.ayudaActiva = id;
    },
    showNotification(type, title, message, duration = 5000) {
      this.notification = { type, title, message };
      setTimeout(() => (this.notification = null), duration);
    },
    getPipSize() {
      if (!this.pair || !this.tradingPairs[this.pair]) return 0.0001;
      return Math.pow(10, -this.tradingPairs[this.pair].decimales);
    },
    calcularMargen() {
      if (this.validateInputs()) {
        const info = this.tradingPairs[this.pair];

        // Calcular valor nominal
        const valorNominal = this.precio * info.unidades * this.lote;

        // Calcular margen requerido
        const margenRequerido = valorNominal / this.apalancamiento;

        this.resultado = {
          valorNominal,
          margenRequerido,
        };

        this.setAyuda("result");
        localStorage.setItem(
          "margen_lastResultado",
          JSON.stringify(this.resultado)
        );
      }
    },
    validateInputs() {
      if (!this.pair) {
        this.showNotification(
          "error",
          "Campo requerido",
          "Por favor selecciona un par de divisas."
        );
        return false;
      }

      if (!this.precio || this.precio <= 0) {
        this.showNotification(
          "error",
          "Precio inválido",
          "El precio debe ser mayor a 0."
        );
        return false;
      }

      if (!this.lote || this.lote <= 0) {
        this.showNotification(
          "error",
          "Lote inválido",
          "El tamaño del lote debe ser mayor a 0."
        );
        return false;
      }

      return true;
    },
    loadLocalStorage() {
      const lastPair = localStorage.getItem("margen_lastPair");
      const lastPrecio = localStorage.getItem("margen_lastPrecio");
      const lastLote = localStorage.getItem("margen_lastLote");
      const lastApalancamiento = localStorage.getItem(
        "margen_lastApalancamiento"
      );
      const lastResultado = localStorage.getItem("margen_lastResultado");

      if (lastPair) this.pair = lastPair;
      if (lastPrecio) this.precio = Number(lastPrecio);
      if (lastLote) this.lote = Number(lastLote);
      if (lastApalancamiento) this.apalancamiento = Number(lastApalancamiento);
      if (lastResultado) this.resultado = JSON.parse(lastResultado);
    },
  },
  watch: {
    pair(newVal) {
      localStorage.setItem("margen_lastPair", newVal || "");
    },
    precio(newVal) {
      localStorage.setItem("margen_lastPrecio", newVal || "");
    },
    lote(newVal) {
      localStorage.setItem("margen_lastLote", newVal || "");
    },
    apalancamiento(newVal) {
      localStorage.setItem("margen_lastApalancamiento", newVal || "");
    },
  },
  mounted() {
    this.loadLocalStorage();
  },
  updated() {
    if (window.MathJax) {
      window.MathJax.typeset();
    }
  },
};

// Exportar el componente
if (typeof exports !== "undefined") {
  exports.MargenCalculator = MargenCalculator;
} else {
  window.MargenCalculator = MargenCalculator;
}
