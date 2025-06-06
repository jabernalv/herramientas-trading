const LoteCalculator = {
  template: `
    <div class="flex items-center justify-center px-4 py-8">
      <div class="bg-white shadow-md rounded p-6 max-w-7xl w-full grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="md:col-span-2 order-1 md:order-none">
          <h1 class="text-2xl font-bold mb-6 text-center">
            Calculadora de lote en trading
          </h1>

          <div class="mb-6 relative">
            <label for="pair" class="block font-semibold mb-1">Par de divisas o activo</label>
            <div class="relative">
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                <i data-lucide="globe" class="w-4 h-4"></i>
              </span>
              <select
                id="pair"
                aria-label="Selecciona un par de divisas o activo"
                v-model="pair"
                @focus="setAyuda('pair')"
                @change="setAyuda('pair')"
                class="w-full pl-10 border border-gray-300 rounded p-2"
                :aria-invalid="!pair"
                required
              >
                <option disabled value="">-- Selecciona un par --</option>
                <option v-for="symbol in Object.keys(tradingPairs)" :key="symbol" :value="symbol">
                  {{ symbol }} - {{ tradingPairs[symbol].nombre }}
                </option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div class="relative">
              <label for="accountSize" class="block font-semibold mb-1">Tamaño de cuenta (USD)</label>
              <span class="absolute left-3 top-10 text-gray-500">
                <i data-lucide="wallet" class="w-4 h-4"></i>
              </span>
              <input
                id="accountSize"
                aria-label="Tamaño de cuenta en dólares"
                v-model.number="accountSize"
                @focus="setAyuda('accountSize')"
                type="number"
                step="1"
                min="1"
                class="w-full text-right pl-10 border border-gray-300 rounded p-2"
                :aria-invalid="!accountSize"
                required
              />
            </div>

            <div class="relative">
              <label for="riskPercent" class="block font-semibold mb-1">Riesgo por operación (%)</label>
              <span class="absolute left-3 top-10 text-gray-500">
                <i data-lucide="percent" class="w-4 h-4"></i>
              </span>
              <input
                id="riskPercent"
                aria-label="Riesgo por operación en porcentaje"
                v-model.number="riskPercent"
                @focus="setAyuda('riskPercent')"
                type="number"
                step="0.01"
                min="0.01"
                max="10"
                class="w-full text-right pl-10 border border-gray-300 rounded p-2"
                :aria-invalid="!riskPercent"
                required
              />
            </div>

            <div class="relative">
              <label for="stopLossPips" class="block font-semibold mb-1">Stop loss (pips)</label>
              <span class="absolute left-3 top-10 text-gray-500">
                <i data-lucide="slash" class="w-4 h-4"></i>
              </span>
              <input
                id="stopLossPips"
                aria-label="Stop loss en pips"
                v-model.number="stopLossPips"
                @focus="setAyuda('stopLossPips')"
                type="number"
                step="0.1"
                min="0.1"
                class="w-full text-right pl-10 border border-gray-300 rounded p-2"
                :aria-invalid="!stopLossPips"
                required
              />
            </div>
          </div>

          <div class="text-center mb-6">
            <button
              @click="handleClick"
              class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="!isFormValid"
              aria-label="Calcular tamaño de lote"
            >
              <i data-lucide="calculator" class="w-4 h-4"></i>
              Calcular lote
            </button>
          </div>

          <div v-if="lotSize !== null" class="text-center mb-6">
            <div class="inline-flex flex-col items-center justify-center px-6 py-4 rounded-lg bg-green-100 border border-green-300 shadow-md animate-fade-in">
              <div class="flex items-center gap-2 mb-2">
                <i data-lucide="check-circle" class="w-6 h-6 text-green-600"></i>
                <span class="text-lg font-semibold">Tamaño de lote sugerido:</span>
              </div>
              <p class="text-3xl text-green-700 font-extrabold tracking-wide">
                {{ lotSize.toFixed(2) }}
              </p>
              <div class="mt-3 text-blue-700">
                <p>Para {{ pair }}:</p>
                <p>{{ stopLossPips }} pips equivalen a un movimiento de {{ priceMovement }} en el precio</p>
              </div>
            </div>
            <div class="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200 animate-fade-in">
              <p class="text-sm text-blue-800 mb-2">Fórmula aplicada:</p>
              <div class="text-center" v-html="formulaHTML"></div>
              <div class="mt-3 text-sm text-blue-600">
                <div>Donde:</div>
                <div>Capital = \${{ accountSize }}</div>
                <div>Riesgo = {{ riskPercent }}%</div>
                <div>Stop Loss = {{ stopLossPips }} pips</div>
                <div>Valor del Pip = \${{ tradingPairs[pair]?.valorPip }}</div>
              </div>
            </div>
          </div>

          <div class="mb-4">
            <h2 class="text-lg font-bold mb-2">Tabla de valores pip por lote</h2>
            <table class="w-full text-sm border border-gray-300" @mouseover="setAyuda('pipTable')">
              <thead class="bg-gray-200 text-gray-800">
                <tr>
                  <th class="p-2 text-left">Par</th>
                  <th class="p-2 text-left">Nombre</th>
                  <th class="p-2 text-right">Valor pip (USD)</th>
                  <th class="p-2 text-right">Unidades/Lote</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(info, symbol) in tradingPairs"
                  :key="symbol"
                  :class="{'bg-blue-100 text-blue-800 font-semibold': pair === symbol}"
                >
                  <td class="p-2">{{ symbol }}</td>
                  <td class="p-2">{{ info.nombre }}</td>
                  <td class="p-2 text-right">\${{ info.valorPip.toFixed(2) }}</td>
                  <td class="p-2 text-right">{{ info.unidades.toLocaleString() }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="bg-gray-100 border border-gray-300 p-4 rounded text-sm leading-relaxed order-2 md:order-1">
          <h2 class="font-bold text-lg mb-2">Ayuda contextual</h2>
          <p v-if="ayudaActiva" v-html="ayudas[ayudaActiva]"></p>
          <p v-else class="text-gray-500">
            Pasa el cursor o enfoca un campo para ver la explicación.
          </p>
          <div v-if="pair && tradingPairs[pair]" class="mt-4 p-3 bg-white rounded border border-gray-200">
            <h3 class="font-semibold mb-2">{{ tradingPairs[pair].nombre }}</h3>
            <p class="text-gray-600">{{ tradingPairs[pair].descripcion }}</p>
          </div>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      pair: "",
      accountSize: null,
      riskPercent: null,
      stopLossPips: null,
      lotSize: null,
      ayudaActiva: "",
      tradingPairs: window.tradingPairs,
      ayudas: {
        pair: "En trading, un par de divisas representa la relación entre dos monedas: una que se compra y otra que se vende. Por ejemplo, en EUR/USD, compras euros vendiendo dólares. Cada par tiene características propias: los pares principales suelen tener spreads más bajos y mayor liquidez, mientras que los cruzados o los que involucran metales pueden ser más volátiles. Además, el valor de cada pip varía según el par. Esta elección no solo afecta el riesgo, sino también la velocidad y el comportamiento de la operación.",
        accountSize:
          "El tamaño de la cuenta es el capital total disponible en tu bróker para operar. No es simplemente un número: representa tu capacidad de asumir pérdidas y de sostener tu operativa en el tiempo. Una cuenta más grande permite distribuir mejor el riesgo y sobrevivir a rachas negativas. Aquí, este valor es la base para calcular cuánto dinero estás dispuesto a arriesgar en cada operación según tu porcentaje de riesgo.",
        riskPercent:
          "Este es uno de los pilares de la gestión monetaria. Indica qué fracción de tu cuenta estás dispuesto a perder si la operación sale mal. Un trader profesional rara vez arriesga más del 1-2% por operación. Arriesgar más puede acelerar las pérdidas en una mala racha y llevar a un colapso emocional. Definir correctamente este porcentaje es clave para la sostenibilidad y longevidad en el trading.",
        stopLossPips:
          'El "stop loss" define el punto donde asumes que tu hipótesis era incorrecta. Medido en pips, representa la distancia entre tu punto de entrada y tu nivel de protección. No es un número arbitrario: debe estar basado en el análisis técnico y considerar la volatilidad del par. Cuanto más grande sea el stop, más lote necesitas reducir para mantener el riesgo fijo. Es una herramienta para controlar pérdidas, no una barrera emocional.',
        pipTable:
          "El pip (Percentage in Point) es la unidad mínima de movimiento de precio en un par. El valor monetario del pip depende del par y del tamaño del lote. La tabla muestra el valor del pip por lote estándar y las unidades que representa cada lote. Por ejemplo, en forex un lote estándar suele ser 100,000 unidades, mientras que en metales como el oro puede variar. Conocer estos valores es fundamental para calcular correctamente tu exposición al riesgo.",
        result:
          "El tamaño del lote es la cantidad de unidades de un par que vas a comprar o vender. Se calcula utilizando la siguiente fórmula matemática:<br><br>$$\\text{Lote} = \\dfrac{\\text{Capital} \\times \\text{% Riesgo}}{\\text{Stop Loss} \\times \\text{Valor del Pip}}$$<br><br>Cada elemento de la fórmula tiene un propósito específico:<br>• Capital: Tu balance total disponible<br>• % Riesgo: El porcentaje que estás dispuesto a arriesgar<br>• Stop Loss: Tu nivel de salida en pips<br>• Valor del Pip: El valor monetario de cada pip según el par<br><br>Esta fórmula asegura que tu riesgo monetario real coincida exactamente con el porcentaje que deseas arriesgar.",
      },
    };
  },
  computed: {
    isFormValid() {
      return (
        this.pair &&
        this.accountSize > 0 &&
        this.riskPercent > 0 &&
        this.stopLossPips > 0
      );
    },
    priceMovement() {
      if (!this.pair || !this.stopLossPips) return 0;
      const decimals = this.tradingPairs[this.pair].decimales;
      return (this.stopLossPips * Math.pow(0.1, decimals)).toFixed(decimals);
    },
    formulaHTML() {
      if (!this.lotSize) return "";
      const formula = `$$\\text{Lote} = \\dfrac{${this.accountSize} \\times ${
        this.riskPercent
      }\\%}{${this.stopLossPips} \\times ${
        tradingPairs[this.pair].valorPip
      }} = ${this.lotSize.toFixed(2)}$$`;
      return formula;
    },
  },
  watch: {
    pair(newVal) {
      localStorage.setItem("lastPair", newVal || "");
    },
    accountSize(newVal) {
      localStorage.setItem("lastAccountSize", newVal || "");
    },
    riskPercent(newVal) {
      localStorage.setItem("lastRiskPercent", newVal || "");
    },
    stopLossPips(newVal) {
      localStorage.setItem("lastStopLossPips", newVal || "");
    },
  },
  methods: {
    setAyuda(id) {
      this.ayudaActiva = id;
    },
    calculateLot() {
      if (
        this.pair &&
        this.accountSize > 0 &&
        this.riskPercent > 0 &&
        this.stopLossPips > 0
      ) {
        const pipValue = tradingPairs[this.pair].valorPip;
        const riskAmount = this.accountSize * (this.riskPercent / 100);
        this.lotSize = riskAmount / (this.stopLossPips * pipValue);
      } else {
        this.lotSize = null;
      }
    },
    handleClick() {
      this.calculateLot();
      this.setAyuda("result");
    },
    loadLocalStorage() {
      this.pair = localStorage.getItem("lastPair") || "";
      this.accountSize =
        Number(localStorage.getItem("lastAccountSize")) || null;
      this.riskPercent =
        Number(localStorage.getItem("lastRiskPercent")) || null;
      this.stopLossPips =
        Number(localStorage.getItem("lastStopLossPips")) || null;

      // Si hay datos en localStorage, mostrar la ayuda contextual
      if (
        this.pair ||
        this.accountSize ||
        this.riskPercent ||
        this.stopLossPips
      ) {
        this.calculateLot();
        this.setAyuda("result");
      }
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
  exports.LoteCalculator = LoteCalculator;
} else {
  window.LoteCalculator = LoteCalculator;
}
