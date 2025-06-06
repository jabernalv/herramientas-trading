const GananciaCalculator = {
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
            Calculadora de ganancia en trading
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

          <!-- Tipo de operación -->
          <div class="mb-4">
            <label class="block font-semibold mb-1">Tipo de operación</label>
            <select
              v-model="tipoOperacion"
              @focus="setAyuda('tipoOperacion')"
              class="w-full border border-gray-300 rounded p-2"
            >
              <option value="compra">Compra (long)</option>
              <option value="venta">Venta (short)</option>
            </select>
          </div>

          <!-- Entradas -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div class="relative">
              <label class="block font-semibold mb-1">Precio de entrada</label>
              <span class="absolute left-3 top-10 text-gray-500">
                <i data-lucide="trending-up" class="w-4 h-4"></i>
              </span>
              <input
                v-model.number="precioEntrada"
                @focus="setAyuda('precioEntrada')"
                type="number"
                :step="getPipSize()"
                class="w-full text-right pl-10 border border-gray-300 rounded p-2"
              />
            </div>
            <div class="relative">
              <label class="block font-semibold mb-1">Precio de salida</label>
              <span class="absolute left-3 top-10 text-gray-500">
                <i data-lucide="trending-down" class="w-4 h-4"></i>
              </span>
              <input
                v-model.number="precioSalida"
                @focus="setAyuda('precioSalida')"
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
              @click="handleClick"
              class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 inline-flex items-center gap-2"
            >
              <i data-lucide="calculator" class="w-4 h-4"></i>
              Calcular ganancia
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
                \${{ resultado.ganancia.toFixed(2) }}
              </p>
            </div>

            <div class="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200 animate-fade-in">
              <p class="text-sm text-blue-800 mb-2">Fórmula aplicada:</p>
              <div class="text-center" v-html="formulaHTML"></div>
              <div class="mt-3 text-sm text-blue-600">
                <div>Donde:</div>
                <div>Diferencia = {{ tipoOperacion === 'compra' ? 'Precio salida - Precio entrada' : 'Precio entrada - Precio salida' }}</div>
                <div>Precio entrada = {{ precioEntrada }}</div>
                <div>Precio salida = {{ precioSalida }}</div>
                <div>Lote = {{ lote }}</div>
                <div>Valor del pip = \${{ tradingPairs[pair].valorPip }}</div>
                <div>Unidades = {{ tradingPairs[pair].unidades.toLocaleString() }}</div>
              </div>
            </div>

            <div class="mt-4 p-4 bg-gray-100 border border-gray-300 rounded text-sm">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <strong>Diferencia:</strong> {{ resultado.diferenciaPips.toFixed(2) }} pips
                </div>
                <div>
                  <strong>Margen requerido:</strong> \${{ resultado.margen.toFixed(2) }}
                </div>
                <div>
                  <strong>Ganancia/pérdida:</strong> \${{ resultado.ganancia.toFixed(2) }}
                </div>
                <div>
                  <strong>Rentabilidad:</strong> {{ resultado.rentabilidad.toFixed(2) }}%
                </div>
              </div>
              <p class="mt-3">
                Con este apalancamiento, esta operación requeriría un margen de
                <strong>\${{ resultado.margen.toFixed(2) }}</strong>, y habría
                generado una {{ resultado.ganancia >= 0 ? 'ganancia' : 'pérdida' }} de
                <strong>\${{ Math.abs(resultado.ganancia).toFixed(2) }}</strong>, lo que
                equivale al <strong>{{ resultado.rentabilidad.toFixed(2) }}%</strong> sobre
                el capital inmovilizado.
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
          <p v-if="ayudaActiva" v-html="ayudas[ayudaActiva]"></p>
          <p v-else class="text-gray-500">
            Pasa el cursor o enfoca un campo para ver la explicación.
          </p>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      pair: "",
      tipoOperacion: "compra",
      precioEntrada: null,
      precioSalida: null,
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
      resultado: null,
      notification: null,
      ayudaActiva: "",
      tradingPairs: window.tradingPairs,
      ayudas: {
        pair: "Selecciona el par de divisas o activo que vas a operar. El valor del pip y las unidades por lote dependerán de esta selección.",
        tipoOperacion:
          "Indica si vas a abrir una posición de compra (long) o venta (short).",
        precioEntrada: "El precio al que planeas abrir la operación.",
        precioSalida: "El precio objetivo donde planeas cerrar la operación.",
        lote: "El tamaño de la posición en lotes. Un lote estándar equivale a 100,000 unidades de la divisa base.",
        apalancamiento:
          "El apalancamiento que usarás en la operación. Mayor apalancamiento significa menor margen requerido pero mayor riesgo.",
        result: `<div class='space-y-4'>
          <p>La ganancia o pérdida se calcula usando la siguiente fórmula:</p>
          <div class='text-center'>$$G = D \\times VP \\times L$$</div>
          <div class='space-y-1'>
            <p>Donde:</p>
            <div class='ml-4'>• <strong><i>G</i></strong>: Ganancia/pérdida en USD</div>
            <div class='ml-4'>• <strong><i>D</i></strong>: Diferencia en pips</div>
            <div class='ml-4'>• <strong><i>VP</i></strong>: Valor del pip</div>
            <div class='ml-4'>• <strong><i>L</i></strong>: Tamaño del lote</div>
          </div>
          <p>El margen requerido se calcula como:</p>
          <div class='text-center'>$$M = \\frac{P \\times U \\times L}{A}$$</div>
          <div class='space-y-1'>
            <p>Donde:</p>
            <div class='ml-4'>• <strong><i>M</i></strong>: Margen requerido en USD</div>
            <div class='ml-4'>• <strong><i>P</i></strong>: Precio de entrada</div>
            <div class='ml-4'>• <strong><i>U</i></strong>: Unidades por lote</div>
            <div class='ml-4'>• <strong><i>L</i></strong>: Tamaño del lote</div>
            <div class='ml-4'>• <strong><i>A</i></strong>: Apalancamiento</div>
          </div>
        </div>`,
      },
    };
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
    validateInputs() {
      if (!this.pair) {
        this.showNotification(
          "error",
          "Campo requerido",
          "Por favor selecciona un par de divisas."
        );
        return false;
      }

      if (!this.precioEntrada || this.precioEntrada <= 0) {
        this.showNotification(
          "error",
          "Precio inválido",
          "El precio de entrada debe ser mayor a 0."
        );
        return false;
      }

      if (!this.precioSalida || this.precioSalida <= 0) {
        this.showNotification(
          "error",
          "Precio inválido",
          "El precio de salida debe ser mayor a 0."
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

      if (this.precioEntrada === this.precioSalida) {
        this.showNotification(
          "warning",
          "Precios iguales",
          "Los precios de entrada y salida son iguales, la ganancia será 0."
        );
      }

      return true;
    },
    handleClick() {
      if (this.validateInputs()) {
        this.calculateResult();
        this.setAyuda("result");
      }
    },
    calculateResult() {
      const info = this.tradingPairs[this.pair];
      const pipSize = Math.pow(10, -info.decimales);

      // Calcular diferencia en pips según tipo de operación
      const diferenciaPrecio =
        this.tipoOperacion === "compra"
          ? this.precioSalida - this.precioEntrada
          : this.precioEntrada - this.precioSalida;

      const diferenciaPips = diferenciaPrecio / pipSize;
      const ganancia = diferenciaPips * info.valorPip * this.lote;

      // Calcular margen requerido
      const margen =
        (this.precioEntrada * info.unidades * this.lote) / this.apalancamiento;

      // Calcular rentabilidad
      const rentabilidad = (ganancia / margen) * 100;

      this.resultado = {
        diferenciaPips,
        ganancia,
        margen,
        rentabilidad,
      };

      localStorage.setItem(
        "ganancia_lastResultado",
        JSON.stringify(this.resultado)
      );
    },
    formatNumber(value) {
      return value ? value.toLocaleString() : "0";
    },
    loadLocalStorage() {
      const lastPair = localStorage.getItem("ganancia_lastPair");
      const lastTipoOperacion = localStorage.getItem(
        "ganancia_lastTipoOperacion"
      );
      const lastPrecioEntrada = localStorage.getItem(
        "ganancia_lastPrecioEntrada"
      );
      const lastPrecioSalida = localStorage.getItem(
        "ganancia_lastPrecioSalida"
      );
      const lastLote = localStorage.getItem("ganancia_lastLote");
      const lastApalancamiento = localStorage.getItem(
        "ganancia_lastApalancamiento"
      );
      const lastResultado = localStorage.getItem("ganancia_lastResultado");

      if (lastPair) this.pair = lastPair;
      if (lastTipoOperacion) this.tipoOperacion = lastTipoOperacion;
      if (lastPrecioEntrada) this.precioEntrada = Number(lastPrecioEntrada);
      if (lastPrecioSalida) this.precioSalida = Number(lastPrecioSalida);
      if (lastLote) this.lote = Number(lastLote);
      if (lastApalancamiento) this.apalancamiento = Number(lastApalancamiento);
      if (lastResultado) this.resultado = JSON.parse(lastResultado);

      // Si hay datos guardados en localStorage, mostrar la ayuda contextual
      if (
        lastPair ||
        lastTipoOperacion ||
        lastPrecioEntrada ||
        lastPrecioSalida ||
        lastLote ||
        lastApalancamiento ||
        lastResultado
      ) {
        this.setAyuda("result");
      }
    },
  },
  watch: {
    pair(newVal) {
      localStorage.setItem("ganancia_lastPair", newVal || "");
    },
    tipoOperacion(newVal) {
      localStorage.setItem("ganancia_lastTipoOperacion", newVal || "");
    },
    precioEntrada(newVal) {
      localStorage.setItem("ganancia_lastPrecioEntrada", newVal || "");
    },
    precioSalida(newVal) {
      localStorage.setItem("ganancia_lastPrecioSalida", newVal || "");
    },
    lote(newVal) {
      localStorage.setItem("ganancia_lastLote", newVal || "");
    },
    apalancamiento(newVal) {
      localStorage.setItem("ganancia_lastApalancamiento", newVal || "");
    },
  },
  computed: {
    formulaHTML() {
      if (!this.resultado) return "";

      const diferenciaPrecio =
        this.tipoOperacion === "compra"
          ? `(${this.precioSalida} - ${this.precioEntrada})`
          : `(${this.precioEntrada} - ${this.precioSalida})`;

      const pipSize = Math.pow(10, -this.tradingPairs[this.pair].decimales);
      const diferenciaPips = `\\frac{${diferenciaPrecio}}{${pipSize}}`;

      return `$$G = ${diferenciaPips} \\times ${
        this.tradingPairs[this.pair].valorPip
      } \\times ${this.lote} = \\$${this.resultado.ganancia.toFixed(2)}$$`;
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
  exports.GananciaCalculator = GananciaCalculator;
} else {
  window.GananciaCalculator = GananciaCalculator;
}
