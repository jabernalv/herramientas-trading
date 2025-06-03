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
              @change="updateInputSteps"
              class="w-full pl-10 border border-gray-300 rounded p-2"
            >
              <option disabled value="">-- Selecciona un par --</option>
              <option v-for="(info, key) in pipTable" :key="key" :value="key">
                {{ key }}
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
                <div>Valor del pip = \${{ pipTable[pair].valorPip }}</div>
                <div>Unidades = {{ pipTable[pair].unidades.toLocaleString() }}</div>
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

          <!-- Tabla de valores pip por par -->
          <div>
            <h2 class="text-lg font-bold mb-2">
              Tabla de valores pip por lote
            </h2>
            <table class="w-full text-sm border border-gray-300">
              <thead class="bg-gray-200 text-gray-800">
                <tr>
                  <th class="p-2 text-left">Par</th>
                  <th class="p-2 text-left">Valor pip por lote</th>
                  <th class="p-2 text-left">Unidades por lote</th>
                  <th class="p-2 text-left">Decimales</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(info, key) in pipTable"
                  :key="key"
                  :class="{'bg-blue-100': pair === key}"
                >
                  <td class="p-2">{{ key }}</td>
                  <td class="p-2">\${{ info.valorPip.toFixed(2) }}</td>
                  <td class="p-2">{{ info.unidades.toLocaleString() }}</td>
                  <td class="p-2">{{ info.decimales }}</td>
                </tr>
              </tbody>
            </table>
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
        { valor: 50, texto: "50:1" },
        { valor: 100, texto: "100:1" },
        { valor: 200, texto: "200:1" },
        { valor: 500, texto: "500:1" },
      ],
      ayudaActiva: "",
      resultado: null,
      notification: null,
      pipTable: {
        EURUSD: { valorPip: 10, unidades: 100000, decimales: 4 },
        GBPUSD: { valorPip: 10, unidades: 100000, decimales: 4 },
        USDJPY: { valorPip: 9.13, unidades: 100000, decimales: 2 },
        GBPJPY: { valorPip: 9.13, unidades: 100000, decimales: 2 },
        AUDUSD: { valorPip: 10, unidades: 100000, decimales: 4 },
        NZDUSD: { valorPip: 10, unidades: 100000, decimales: 4 },
        USDCHF: { valorPip: 10, unidades: 100000, decimales: 4 },
        USDCAD: { valorPip: 10, unidades: 100000, decimales: 4 },
        XAUUSD: { valorPip: 1, unidades: 100, decimales: 2 },
        XAGUSD: { valorPip: 5, unidades: 5000, decimales: 3 },
        XAUEUR: { valorPip: 1, unidades: 100, decimales: 2 },
        XAGEUR: { valorPip: 5, unidades: 5000, decimales: 3 },
      },
      rangosPrecio: {
        EURUSD: { min: 0.5, max: 2 },
        GBPUSD: { min: 0.5, max: 2 },
        USDJPY: { min: 50, max: 200 },
        GBPJPY: { min: 50, max: 200 },
        AUDUSD: { min: 0.5, max: 1.5 },
        NZDUSD: { min: 0.5, max: 1.5 },
        USDCHF: { min: 0.5, max: 2 },
        USDCAD: { min: 0.5, max: 2 },
        XAUUSD: { min: 1000, max: 3000 },
        XAGUSD: { min: 10, max: 50 },
        XAUEUR: { min: 1000, max: 3000 },
        XAGEUR: { min: 10, max: 50 },
      },
      ayudas: {
        pair: "En trading, un par de divisas representa la relación entre dos monedas: una que se compra y otra que se vende. Por ejemplo, en EUR/USD, compras euros vendiendo dólares. Cada par tiene características propias como el valor del pip y las unidades por lote estándar.",
        tipoOperacion:
          "Define si estás abriendo una posición de compra (long) o venta (short). En una compra, ganas si el precio sube; en una venta, ganas si el precio baja.",
        precioEntrada:
          "El precio al que abres la operación. Debe tener en cuenta los decimales correctos según el par.",
        precioSalida:
          "El precio al que cierras o planeas cerrar la operación. La diferencia con el precio de entrada determinará tu ganancia o pérdida.",
        lote: "El tamaño de tu posición en lotes. Un lote estándar representa diferentes cantidades según el instrumento (100,000 unidades para forex, 100 oz para oro, etc).",
        apalancamiento:
          "El apalancamiento determina cuánto margen necesitas para abrir la operación. Por ejemplo, 100:1 significa que necesitas $1 de margen por cada $100 de posición.",
        result:
          "La ganancia o pérdida se calcula usando la siguiente fórmula matemática:<div><br>Para operaciones de compra (long):<br>$$G = (PS - PE) \\times L \\times U$$<br><br>Para operaciones de venta (short):<br>$$G = (PE - PS) \\times L \\times U$$<br><br>El margen requerido se calcula como:<br>$$\\text{Margen} = \\dfrac{PE \\times L \\times U}{A}$$</div><br><br>Donde:<div class='list-disc pl-4'><div class='mb-1'>• $G$: Ganancia o pérdida</div><div class='mb-1'>• $PS$: Precio de salida</div><div class='mb-1'>• $PE$: Precio de entrada</div><div class='mb-1'>• $L$: Lote</div><div class='mb-1'>• $U$: Unidades</div><div class='mb-1'>• $A$: Apalancamiento</div></div>",
      },
    };
  },
  computed: {
    diferenciaPipsFormatted() {
      return this.resultado?.diferenciaPips?.toFixed(2) || "0.00";
    },
    gananciaFormatted() {
      return this.resultado?.ganancia?.toFixed(2) || "0.00";
    },
    margenFormatted() {
      return this.resultado?.margen?.toFixed(2) || "0.00";
    },
    rentabilidadFormatted() {
      return this.resultado?.rentabilidad?.toFixed(2) || "0.00";
    },
    formulaHTML() {
      if (!this.resultado) return "";
      const operacion =
        this.tipoOperacion === "compra"
          ? `(${this.precioSalida} - ${this.precioEntrada})`
          : `(${this.precioEntrada} - ${this.precioSalida})`;

      return `$$\\text{Ganancia} = ${operacion} \\times ${this.lote} \\times ${
        this.pipTable[this.pair].unidades
      } = $${this.resultado.ganancia.toFixed(2)}$$`;
    },
    isFormValid() {
      return (
        this.pair && this.precioEntrada && this.precioSalida && this.lote > 0
      );
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
    resultado(newVal) {
      if (newVal) {
        localStorage.setItem("ganancia_lastResultado", JSON.stringify(newVal));
      }
    },
  },
  methods: {
    setAyuda(id) {
      this.ayudaActiva = id;
    },
    showNotification(type, title, message, duration = 5000) {
      this.notification = { type, title, message };
      setTimeout(() => {
        this.notification = null;
      }, duration);
    },
    getPipSize() {
      if (!this.pair) return "0.0001";
      return Math.pow(10, -this.pipTable[this.pair].decimales).toString();
    },
    validateInputs() {
      if (!this.pair) {
        this.showNotification(
          "error",
          "Campo requerido",
          "Por favor, selecciona un par de divisas."
        );
        return false;
      }
      if (!this.precioEntrada || this.precioEntrada <= 0) {
        this.showNotification(
          "error",
          "Precio inválido",
          "El precio de entrada debe ser mayor que 0."
        );
        return false;
      }
      if (!this.precioSalida || this.precioSalida <= 0) {
        this.showNotification(
          "error",
          "Precio inválido",
          "El precio de salida debe ser mayor que 0."
        );
        return false;
      }
      if (!this.lote || this.lote <= 0) {
        this.showNotification(
          "error",
          "Lote inválido",
          "El tamaño del lote debe ser mayor que 0."
        );
        return false;
      }
      if (!this.apalancamiento || this.apalancamiento <= 1) {
        this.showNotification(
          "error",
          "Apalancamiento inválido",
          "El apalancamiento debe ser mayor que 1."
        );
        return false;
      }

      const rango = this.rangosPrecio[this.pair];
      if (this.precioEntrada < rango.min || this.precioEntrada > rango.max) {
        this.showNotification(
          "warning",
          "Precio fuera de rango",
          `El precio de entrada para ${this.pair} debe estar entre ${rango.min} y ${rango.max}`
        );
        return false;
      }
      if (this.precioSalida < rango.min || this.precioSalida > rango.max) {
        this.showNotification(
          "warning",
          "Precio fuera de rango",
          `El precio de salida para ${this.pair} debe estar entre ${rango.min} y ${rango.max}`
        );
        return false;
      }

      return true;
    },
    handleClick() {
      if (this.validateInputs()) {
        this.calculateResult();
        this.setAyuda("result");
        this.$nextTick(() => {
          if (window.MathJax) {
            window.MathJax.typesetPromise && window.MathJax.typesetPromise();
          }
        });
      }
    },
    calculateResult() {
      const info = this.pipTable[this.pair];
      const diff = this.precioSalida - this.precioEntrada;
      const signo = this.tipoOperacion === "compra" ? 1 : -1;
      const pipSize = Math.pow(10, -info.decimales);
      const deltaPips = signo * (diff / pipSize);
      const ganancia = deltaPips * info.valorPip * this.lote;
      const margen =
        (info.unidades * this.lote * this.precioEntrada) / this.apalancamiento;
      const rentabilidad = (ganancia / margen) * 100;

      this.resultado = {
        diferenciaPips: deltaPips,
        ganancia,
        margen,
        rentabilidad,
      };

      // Mostrar notificación de éxito
      const tipoNotificacion = ganancia >= 0 ? "success" : "warning";
      const mensaje =
        ganancia >= 0
          ? "La operación habría resultado en ganancia."
          : "La operación habría resultado en pérdida.";
      this.showNotification(tipoNotificacion, "Cálculo completado", mensaje);
    },
    formatNumber(value) {
      return value ? value.toFixed(2) : "0.00";
    },
    loadLocalStorage() {
      // Cargar valores de entrada
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

      // Asignar valores si existen
      if (lastPair && this.pipTable[lastPair]) this.pair = lastPair;
      if (lastTipoOperacion) this.tipoOperacion = lastTipoOperacion;
      if (lastPrecioEntrada) this.precioEntrada = Number(lastPrecioEntrada);
      if (lastPrecioSalida) this.precioSalida = Number(lastPrecioSalida);
      if (lastLote) this.lote = Number(lastLote);
      if (lastApalancamiento) this.apalancamiento = Number(lastApalancamiento);
      if (lastResultado) {
        try {
          this.resultado = JSON.parse(lastResultado);
        } catch (e) {
          console.warn("Error parsing last result from localStorage");
        }
      }
    },
  },
  mounted() {
    this.loadLocalStorage();
    lucide.createIcons();
  },
  updated() {
    lucide.createIcons();
  },
};

// Exportar el componente
if (typeof exports !== "undefined") {
  exports.GananciaCalculator = GananciaCalculator;
} else {
  window.GananciaCalculator = GananciaCalculator;
}
