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
                <option v-for="(pip, key) in pipTable" :key="key" :value="key">
                  {{ key }}
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
            </div>
            <div class="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200 animate-fade-in">
              <p class="text-sm text-blue-800 mb-2">Fórmula aplicada:</p>
              <div class="text-center" v-html="formulaHTML"></div>
              <div class="mt-3 text-sm text-blue-600">
                Donde:<br>
                Capital = \${{ accountSize }}<br>
                Riesgo = {{ riskPercent }}%<br>
                Stop Loss = {{ stopLossPips }} pips<br>
                Valor del Pip = \${{ pipTable[pair] }}
              </div>
            </div>
          </div>

          <div class="mb-4">
            <h2 class="text-lg font-bold mb-2">Tabla de valores pip por lote</h2>
            <table class="w-full text-sm border border-gray-300" @mouseover="setAyuda('pipTable')">
              <thead class="bg-gray-200 text-gray-800">
                <tr>
                  <th class="p-2 text-left">Par</th>
                  <th class="p-2 text-left">Valor pip por lote estándar (USD)</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(pip, key) in pipTable"
                  :key="key"
                  :class="{'bg-blue-100 text-blue-800 font-semibold': pair === key}"
                >
                  <td class="p-2">{{ key }}</td>
                  <td class="p-2">\${{ pip }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="bg-gray-100 border border-gray-300 p-4 rounded text-sm leading-relaxed order-2 md:order-1">
          <h2 class="font-bold text-lg mb-2">Ayuda contextual</h2>
          <p v-if="ayudaActiva">{{ ayudas[ayudaActiva] }}</p>
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
      accountSize: null,
      riskPercent: null,
      stopLossPips: null,
      lotSize: null,
      ayudaActiva: "",
      pipTable: {
        EURUSD: 10.0,
        GBPUSD: 10.0,
        USDJPY: 9.13,
        GBPJPY: 9.13,
        AUDUSD: 10.0,
        NZDUSD: 10.0,
        USDCHF: 10.0,
        USDCAD: 10.0,
        XAUUSD: 1.0,
        XAGUSD: 5.0,
        XAUEUR: 1.0,
        XAGEUR: 5.0,
      },
      ayudas: {
        pair: "En trading, un par de divisas representa la relación entre dos monedas: una que se compra y otra que se vende. Por ejemplo, en EUR/USD, compras euros vendiendo dólares. Cada par tiene características propias: los pares principales suelen tener spreads más bajos y mayor liquidez, mientras que los cruzados o los que involucran metales pueden ser más volátiles. Además, el valor de cada pip varía según el par. Esta elección no solo afecta el riesgo, sino también la velocidad y el comportamiento de la operación.",
        accountSize:
          "El tamaño de la cuenta es el capital total disponible en tu bróker para operar. No es simplemente un número: representa tu capacidad de asumir pérdidas y de sostener tu operativa en el tiempo. Una cuenta más grande permite distribuir mejor el riesgo y sobrevivir a rachas negativas. Aquí, este valor es la base para calcular cuánto dinero estás dispuesto a arriesgar en cada operación según tu porcentaje de riesgo.",
        riskPercent:
          "Este es uno de los pilares de la gestión monetaria. Indica qué fracción de tu cuenta estás dispuesto a perder si la operación sale mal. Un trader profesional rara vez arriesga más del 1-2% por operación. Arriesgar más puede acelerar las pérdidas en una mala racha y llevar a un colapso emocional. Definir correctamente este porcentaje es clave para la sostenibilidad y longevidad en el trading.",
        stopLossPips:
          'El "stop loss" define el punto donde asumes que tu hipótesis era incorrecta. Medido en pips, representa la distancia entre tu punto de entrada y tu nivel de protección. No es un número arbitrario: debe estar basado en el análisis técnico y considerar la volatilidad del par. Cuanto más grande sea el stop, más lote necesitas reducir para mantener el riesgo fijo. Es una herramienta para controlar pérdidas, no una barrera emocional.',
        pipTable:
          "El pip (Percentage in Point) es la unidad mínima de movimiento de precio en un par. El valor monetario del pip depende del par y del tamaño del lote. Por ejemplo, en EUR/USD 1 pip = $10 por lote estándar. Pero en XAU/USD o USD/JPY ese valor cambia. Conocer el valor del pip es fundamental para medir tu exposición real y ajustar el tamaño del lote para mantener el riesgo bajo control. La tabla te da valores aproximados usados por la mayoría de brókers.",
        result:
          "El tamaño del lote es la cantidad de unidades de un par que vas a comprar o vender. Se calcula utilizando la siguiente fórmula matemática:\\n\\n$$\\text{Lote} = \\frac{\\text{Capital} \\times \\text{% Riesgo}}{\\text{Stop Loss} \\times \\text{Valor del Pip}}$$\\n\\nCada elemento de la fórmula tiene un propósito específico:\\n• Capital: Tu balance total disponible\\n• % Riesgo: El porcentaje que estás dispuesto a arriesgar\\n• Stop Loss: Tu nivel de salida en pips\\n• Valor del Pip: El valor monetario de cada pip según el par\\n\\nEsta fórmula asegura que tu riesgo monetario real coincida exactamente con el porcentaje que deseas arriesgar.",
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
    formatPipValue(pip) {
      const value = Number(pip);
      return value ? "$" + value.toFixed(2) : "$0.00";
    },
    formulaHTML() {
      if (!this.lotSize) return "";
      const formula = `$$\\text{Lote} = \\frac{${this.accountSize} \\times ${
        this.riskPercent
      }\\%}{${this.stopLossPips} \\times ${
        this.pipTable[this.pair]
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
        const pipValue = Number(this.pipTable[this.pair]);
        const riskAmount = this.accountSize * (this.riskPercent / 100);
        this.lotSize = riskAmount / (this.stopLossPips * pipValue);
      } else {
        this.lotSize = null;
      }
    },
    handleClick() {
      this.calculateLot();
      this.setAyuda("result");
      // Dar tiempo a que se renderice el contenido antes de actualizar MathJax
      this.$nextTick(() => {
        if (window.MathJax) {
          window.MathJax.typesetPromise && window.MathJax.typesetPromise();
        }
      });
    },
    loadLocalStorage() {
      const lastPair = localStorage.getItem("lastPair");
      const lastAccountSize = localStorage.getItem("lastAccountSize");
      const lastRiskPercent = localStorage.getItem("lastRiskPercent");
      if (lastPair && this.pipTable[lastPair]) this.pair = lastPair;
      if (lastAccountSize) this.accountSize = Number(lastAccountSize);
      if (lastRiskPercent) this.riskPercent = Number(lastRiskPercent);
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
  exports.LoteCalculator = LoteCalculator;
} else {
  window.LoteCalculator = LoteCalculator;
}
