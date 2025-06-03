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
              <option v-for="(info, key) in pipTable" :key="key" :value="key">
                {{ key }}
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
                <i data-lucide="file-cash" class="w-4 h-4"></i>
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
            <p>
              <strong>Break-even en pips:</strong> <span v-text="resultado.pips.toFixed(2)"></span>
            </p>
            <p>
              <strong>Valor equivalente en USD:</strong> $<span v-text="resultado.usd.toFixed(2)"></span>
            </p>
            <p class="mt-2">
              Para cubrir el costo operativo de esta operación, el precio debe moverse al menos
              <strong><span v-text="resultado.pips.toFixed(2)"></span> pips</strong> a tu favor, lo que representa
              <strong>$<span v-text="resultado.usd.toFixed(2)"></span></strong> considerando spread y comisiones.
            </p>
          </div>
        </div>

        <!-- Ayuda contextual -->
        <div class="bg-gray-100 border border-gray-300 p-4 rounded text-sm leading-relaxed">
          <h2 class="font-bold text-lg mb-2">Ayuda contextual</h2>
          <p v-if="ayudaActiva">{{ ayudas[ayudaActiva] }}</p>
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
      pipTable: {
        EURUSD: { valorPip: 10 },
        GBPUSD: { valorPip: 10 },
        USDJPY: { valorPip: 9.13 },
        GBPJPY: { valorPip: 9.13 },
        AUDUSD: { valorPip: 10 },
        NZDUSD: { valorPip: 10 },
        USDCHF: { valorPip: 10 },
        USDCAD: { valorPip: 10 },
        XAUUSD: { valorPip: 1 },
        XAGUSD: { valorPip: 5 },
        XAUEUR: { valorPip: 1 },
        XAGEUR: { valorPip: 5 },
      },
      ayudas: {
        pair: "Selecciona el par que vas a operar. El valor del pip por lote depende del activo: no es lo mismo operar EUR/USD que oro o plata.",
        lote: "El tamaño del lote determina la exposición de tu operación. Más lote implica mayor impacto del spread y de cualquier comisión.",
        spread:
          "El spread es la diferencia entre el precio de compra y el de venta. Es un costo implícito que el mercado cobra desde que abres la operación.",
        comision:
          "Algunos brókers cobran una comisión fija por abrir y cerrar operaciones, adicional al spread. Aquí puedes incluirla si aplica.",
      },
    };
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
        this.error = "El spread debe ser un número igual o mayor a 0.";
        return;
      }
      if (this.comision === null || isNaN(this.comision) || this.comision < 0) {
        this.error = "La comisión debe ser un número igual o mayor a 0.";
        return;
      }

      const pipValue = this.pipTable[this.pair].valorPip;
      const costoTotal =
        this.spread * pipValue * this.lote + Number(this.comision);
      const pipsEquivalente = costoTotal / (pipValue * this.lote);

      this.resultado = {
        pips: pipsEquivalente,
        usd: costoTotal,
      };
    },
  },
  mounted() {
    lucide.createIcons();
  },
  updated() {
    lucide.createIcons();
  },
};

// Exportar el componente
if (typeof exports !== "undefined") {
  exports.BreakevenCalculator = BreakevenCalculator;
} else {
  window.BreakevenCalculator = BreakevenCalculator;
}
