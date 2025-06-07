const BreakevenCalculator = {
  template: `
    <div class="flex items-center justify-center px-4 py-8">
      <div class="bg-white shadow-md rounded p-6 max-w-7xl w-full grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Columna principal -->
        <div class="md:col-span-2">
          <h1 class="text-2xl font-bold mb-6 text-center">
            Calculadora de Break-even
          </h1>
          <!-- Par -->
          <div class="mb-4 relative">
            <label class="block font-semibold mb-1" for="pair">Par de divisas o activo</label>
            <span class="absolute left-3 top-10 text-gray-500">
              <i data-lucide="globe" class="w-4 h-4"></i>
            </span>
            <select
              v-model="pair"
              @focus="setAyuda('pair')"
              class="w-full pl-10 border border-gray-300 rounded p-2"
              id="pair"
              aria-label="Par de divisas o activo"
            >
              <option disabled value="">-- Selecciona un par --</option>
              <option v-for="(info, symbol) in tradingPairs" :key="symbol" :value="symbol">
                {{ symbol }} - {{ info.nombre }}
              </option>
            </select>
          </div>
          <!-- Inputs -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div class="relative">
              <label class="block font-semibold mb-1" for="lote">Tamaño del lote</label>
              <span class="absolute left-3 top-10 text-gray-500">
                <i data-lucide="layers" class="w-4 h-4"></i>
              </span>
              <input
                v-model.number="lote"
                @focus="setAyuda('lote')"
                type="number"
                step="0.01"
                min="0.01"
                max="1000"
                class="w-full text-right pl-10 border border-gray-300 rounded p-2"
                id="lote"
                aria-label="Tamaño del lote"
                @input="limitDecimals('lote', 2)"
              />
            </div>
            <div class="relative">
              <label class="block font-semibold mb-1" for="spread">Spread (en pips)</label>
              <span class="absolute left-3 top-10 text-gray-500">
                <i data-lucide="move-horizontal" class="w-4 h-4"></i>
              </span>
              <input
                v-model.number="spread"
                @focus="setAyuda('spread')"
                type="number"
                step="0.01"
                min="0"
                max="1000"
                class="w-full text-right pl-10 border border-gray-300 rounded p-2"
                id="spread"
                aria-label="Spread (en pips)"
                @input="limitDecimals('spread', 2)"
              />
            </div>
            <div class="relative">
              <label class="block font-semibold mb-1" for="comision">Comisión (USD)</label>
              <span class="absolute left-3 top-10 text-gray-500">
                <i data-lucide="dollar-sign" class="w-4 h-4"></i>
              </span>
              <input
                v-model.number="comision"
                @focus="setAyuda('comision')"
                type="number"
                step="0.01"
                min="0"
                max="10000"
                class="w-full text-right pl-10 border border-gray-300 rounded p-2"
                id="comision"
                aria-label="Comisión (USD)"
                @input="limitDecimals('comision', 2)"
              />
            </div>
          </div>
          <!-- Mensaje de error -->
          <div
            v-if="error"
            class="text-red-600 bg-red-100 border border-red-300 p-3 rounded mb-4"
          >
            {{ error }}
          </div>
          <!-- Botón -->
          <div class="text-center mb-6">
            <button
              @click="calcularBreakEven"
              class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 inline-flex items-center gap-2"
            >
              <i data-lucide="calculator" class="w-4 h-4"></i>
              Calcular break-even
            </button>
          </div>
          <!-- Resultados -->
          <div
            v-if="resultado"
            class="text-sm bg-gray-100 border border-gray-300 p-4 rounded mb-6"
          >
            <div class="text-center mb-4" v-html="calculoHTML"></div>
            
            <div class="p-3 bg-white rounded border border-gray-200">
              <p>
                <strong>Break-even en pips:</strong> <span v-text="resultado.pips.toFixed(2)"></span>
              </p>
              <p class="mt-2">
                Para cubrir el costo operativo de esta operación, el precio debe moverse al menos
                <strong><span v-text="resultado.pips.toFixed(2)"></span> pips</strong> a tu favor.
                Este valor incluye tanto el spread como la comisión, calculados en función del tamaño del lote ingresado.
              </p>
              <p>Esto significa que solo a partir de ese punto, cualquier movimiento adicional comenzará a generar beneficios.</p>
              <p>Se debe tener en cuenta que el spread se incrementa cada día y que hay días que el spread es mayor.</p>
            </div>
          </div>
          <!-- Información del par -->
          <div v-if="pair && tradingPairs[pair]" class="text-sm bg-blue-50 border border-blue-200 p-4 rounded">
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
      lote: null,
      spread: null,
      comision: 0,
      ayudaActiva: "",
      resultado: null,
      error: "",
      tradingPairs: window.tradingPairs,
      ayudas: {
        pair: "Selecciona el par que vas a operar. El valor del pip por lote depende del activo: no es lo mismo operar EUR/USD que oro o plata.",
        lote: "El tamaño del lote determina la exposición de tu operación. Más lote implica mayor impacto del spread y de cualquier comisión.",
        spread:
          "El spread es la diferencia entre el precio de compra y el de venta. Es un costo implícito que el mercado cobra desde que abres la operación.",
        comision:
          "Algunos brókers cobran una comisión fija por abrir y cerrar operaciones, adicional al spread. Aquí puedes incluirla si aplica.",
        result: `<div class='space-y-4'>
                    <p>El break-even es la cantidad mínima de pips que el precio debe moverse a tu favor para cubrir el costo operativo de una operación (spread + comisión).</p> 
                    <p>Para calcularlo, primero se convierte la comisión en pips y luego se suma al spread:</p>
                    <div class='text-center'>$$BE = S + \\dfrac{C}{VP \\times L}$$</div>
                    <div class='space-y-1'>
                        <p>Donde:</p>
                        <div class='ml-4'>• <strong><i>BE</i></strong>: Break-even en pips</div>
                        <div class='ml-4'>• <strong><i>S</i></strong>: Spread - Diferencia entre precio de compra y venta (en pips)</div>
                        <div class='ml-4'>• <strong><i>C</i></strong>: Comisión - Costo del bróker por la operación (en USD)</div>
                        <div class='ml-4'>• <strong><i>VP</i></strong>: Valor del pip - Monto que representa un pip en USD por lote</div>
                        <div class='ml-4'>• <strong><i>L</i></strong>: Lote - Tamaño de la operación</div>
                    </div>
                    <p>El resultado indica cuántos pips debe avanzar el precio para que el resultado neto de la operación sea igual a cero.</p>
                    </div>`,
      },
    };
  },
  computed: {
    calculoHTML() {
      if (!this.resultado) return "";

      return `$$BE = \\dfrac{${this.spread} \\times ${
        this.tradingPairs[this.pair].valorPip
      } \\times ${this.lote} + ${this.comision}}{${
        this.tradingPairs[this.pair].valorPip
      } \\times ${this.lote}} = ${this.resultado.pips.toFixed(
        2
      )}\\text{ pips}$$`;
    },
  },
  watch: {
    pair(newVal) {
      localStorage.setItem("breakeven_lastPair", newVal || "");
    },
    lote(newVal) {
      localStorage.setItem("breakeven_lastLote", newVal || "");
    },
    spread(newVal) {
      localStorage.setItem("breakeven_lastSpread", newVal || "");
    },
    comision(newVal) {
      localStorage.setItem("breakeven_lastComision", newVal || "");
    },
    resultado(newVal) {
      if (newVal) {
        localStorage.setItem("breakeven_lastResultado", JSON.stringify(newVal));
      }
    },
  },
  methods: {
    setAyuda(id) {
      this.ayudaActiva = id;
    },
    limitDecimals(field, decimals) {
      if (this[field] !== null && this[field] !== undefined) {
        const value = this[field].toString();
        if (value.includes(".")) {
          const [intPart, decPart] = value.split(".");
          this[field] = Number(intPart + "." + decPart.slice(0, decimals));
        }
      }
    },
    calcularBreakEven() {
      this.error = "";
      this.resultado = null;

      // Validación robusta
      if (!this.pair) {
        this.error = "Selecciona un par de divisas o activo.";
        return;
      }
      if (this.lote === null || isNaN(this.lote) || this.lote <= 0) {
        this.error = "El tamaño del lote debe ser mayor a 0.";
        return;
      }
      if (this.spread === null || isNaN(this.spread) || this.spread < 0) {
        this.error = "El spread debe ser 0 o mayor.";
        return;
      }
      if (this.comision === null || isNaN(this.comision) || this.comision < 0) {
        this.error = "La comisión debe ser 0 o mayor.";
        return;
      }

      // Cálculo del break-even
      const pipValue = this.tradingPairs[this.pair].valorPip;
      const spreadCost = this.spread * pipValue * this.lote;
      const totalCost = spreadCost + this.comision;
      const pipsToBreakeven = totalCost / (pipValue * this.lote);

      this.resultado = {
        pips: pipsToBreakeven,
        usd: totalCost,
      };

      this.setAyuda("result");
    },
    loadLocalStorage() {
      const lastPair = localStorage.getItem("breakeven_lastPair");
      const lastLote = localStorage.getItem("breakeven_lastLote");
      const lastSpread = localStorage.getItem("breakeven_lastSpread");
      const lastComision = localStorage.getItem("breakeven_lastComision");
      const lastResultado = localStorage.getItem("breakeven_lastResultado");

      if (lastPair) this.pair = lastPair;
      if (lastLote) this.lote = Number(lastLote);
      if (lastSpread) this.spread = Number(lastSpread);
      if (lastComision) this.comision = Number(lastComision);
      if (lastResultado) this.resultado = JSON.parse(lastResultado);

      // Si hay datos guardados en localStorage, mostrar la ayuda contextual
      if (lastPair || lastLote || lastSpread || lastComision || lastResultado) {
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
  exports.BreakevenCalculator = BreakevenCalculator;
} else {
  window.BreakevenCalculator = BreakevenCalculator;
}
