const SimuladorCalculator = {
  template: `
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

    <div class="flex items-center justify-center px-4 py-8">
      <div
        class="bg-white shadow-md rounded p-6 max-w-7xl w-full grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <!-- Columna principal -->
        <div class="md:col-span-2">
          <h1 class="text-2xl font-bold mb-6 text-center">
            Simulador de riesgo - recompensa
          </h1>

          <!-- Grid para par y dirección -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <!-- Selector de par -->
            <div class="relative">
              <label class="block font-semibold mb-1"
                >Par de divisas o activo</label
              >
              <span class="absolute left-3 top-10 text-gray-500">
                <i data-lucide="globe" class="w-4 h-4"></i>
              </span>
              <select
                v-model="pair"
                @focus="setAyuda('pair')"
                class="w-full pl-10 border border-gray-300 rounded p-2"
                :class="{'border-red-500': errors.pair}"
              >
                <option disabled value="">-- Selecciona un par --</option>
                <option
                  v-for="(info, symbol) in tradingPairs"
                  :key="symbol"
                  :value="symbol"
                >
                  {{ symbol }} - {{ info.nombre }}
                </option>
              </select>
              <p v-if="errors.pair" class="text-red-500 text-xs mt-1">
                {{ errors.pair }}
              </p>
            </div>

            <!-- Selector de dirección -->
            <div class="relative">
              <label class="block font-semibold mb-1"
                >Dirección de la operación</label
              >
              <span class="absolute left-3 top-10 text-gray-500">
                <i data-lucide="move-vertical" class="w-4 h-4"></i>
              </span>
              <select
                v-model="direccion"
                @focus="setAyuda('direccion')"
                class="w-full pl-10 border border-gray-300 rounded p-2"
                :class="{'border-red-500': errors.direccion}"
              >
                <option value="compra">Compra (Long)</option>
                <option value="venta">Venta (Short)</option>
              </select>
              <p v-if="errors.direccion" class="text-red-500 text-xs mt-1">
                {{ errors.direccion }}
              </p>
            </div>
          </div>

          <!-- Inputs -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
                min="0.01"
                max="100"
                class="w-full text-right pl-10 border border-gray-300 rounded p-2"
                :class="{'border-red-500': errors.lote}"
              />
              <p v-if="errors.lote" class="text-red-500 text-xs mt-1">
                {{ errors.lote }}
              </p>
            </div>

            <div class="relative">
              <label class="block font-semibold mb-1"
                >Precio de entrada</label
              >
              <span class="absolute left-3 top-10 text-gray-500">
                <i data-lucide="arrow-right-circle" class="w-4 h-4"></i>
              </span>
              <input
                v-model.number="entrada"
                @focus="setAyuda('entrada')"
                type="number"
                :step="getPipSize()"
                class="w-full text-right pl-10 border border-gray-300 rounded p-2"
                :class="{'border-red-500': errors.entrada}"
              />
              <p v-if="errors.entrada" class="text-red-500 text-xs mt-1">
                {{ errors.entrada }}
              </p>
            </div>

            <div class="relative">
              <label class="block font-semibold mb-1"
                >Stop loss (precio)</label
              >
              <span class="absolute left-3 top-10 text-gray-500">
                <i data-lucide="arrow-down-circle" class="w-4 h-4"></i>
              </span>
              <input
                v-model.number="stop"
                @focus="setAyuda('stop')"
                type="number"
                :step="getPipSize()"
                class="w-full text-right pl-10 border border-gray-300 rounded p-2"
                :class="{'border-red-500': errors.stop}"
              />
              <p v-if="errors.stop" class="text-red-500 text-xs mt-1">
                {{ errors.stop }}
              </p>
            </div>

            <div class="relative">
              <label class="block font-semibold mb-1"
                >Take profit (precio)</label
              >
              <span class="absolute left-3 top-10 text-gray-500">
                <i data-lucide="arrow-up-circle" class="w-4 h-4"></i>
              </span>
              <input
                v-model.number="take"
                @focus="setAyuda('take')"
                type="number"
                :step="getPipSize()"
                class="w-full text-right pl-10 border border-gray-300 rounded p-2"
                :class="{'border-red-500': errors.take}"
              />
              <p v-if="errors.take" class="text-red-500 text-xs mt-1">
                {{ errors.take }}
              </p>
            </div>
          </div>

          <!-- Botones -->
          <div class="text-center mb-6 space-x-4">
            <button
              @click="simular"
              :disabled="!isFormValid"
              class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i data-lucide="bar-chart-3" class="w-4 h-4"></i>
              Simular riesgo - recompensa
            </button>
          </div>

          <!-- Resultados -->
          <div v-if="resultado" class="text-center mb-6">
            <div class="inline-flex flex-col items-center justify-center px-6 py-4 rounded-lg bg-green-100 border border-green-300 shadow-md animate-fade-in">
              <div class="flex items-center gap-2 mb-2">
                <i data-lucide="check-circle" class="w-6 h-6 text-green-600"></i>
                <span class="text-lg font-semibold">Relación Riesgo:Recompensa</span>
              </div>
              <p class="text-3xl text-green-700 font-extrabold tracking-wide">
                1:{{ resultado.relacion.toFixed(2) }}
              </p>
            </div>

            <div class="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200 animate-fade-in">
              <p class="text-sm text-blue-800 mb-2">Fórmula aplicada:</p>
              <div class="text-center" v-html="calculoHTML"></div>
              <div class="mt-3 text-sm text-blue-600">
                <div>Donde:</div>
                <div>Entrada = {{ entrada }}</div>
                <div>Stop Loss = {{ stop }}</div>
                <div>Take Profit = {{ take }}</div>
                <div>Lote = {{ lote }}</div>
                <div>Valor del pip = \${{ tradingPairs[pair].valorPip }}</div>
              </div>
            </div>

            <div class="mt-4 p-4 bg-gray-100 border border-gray-300 rounded text-sm">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <strong>Riesgo:</strong>
                  <div>{{ resultado.pipsRiesgo.toFixed(2) }} pips</div>
                  <div class="text-red-600">\${{ resultado.riesgoUSD.toFixed(2) }}</div>
                </div>
                <div>
                  <strong>Recompensa:</strong>
                  <div>{{ resultado.pipsRecompensa.toFixed(2) }} pips</div>
                  <div class="text-green-600">\${{ resultado.gananciaUSD.toFixed(2) }}</div>
                </div>
              </div>
              <p class="mt-3 font-medium" :class="resultado.colorClass">
                {{ resultado.recomendacion }}
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
        <div
          class="bg-gray-100 border border-gray-300 p-4 rounded text-sm leading-relaxed"
        >
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
      direccion: "compra",
      lote: null,
      entrada: null,
      stop: null,
      take: null,
      resultado: null,
      notification: null,
      ayudaActiva: "",
      errors: {
        pair: "",
        direccion: "",
        lote: "",
        entrada: "",
        stop: "",
        take: "",
      },
      tradingPairs: window.tradingPairs,
      ayudas: {
        pair: "Selecciona el par de divisas o activo que vas a operar. Cada instrumento tiene diferentes unidades por lote estándar.",
        direccion:
          "Indica si vas a abrir una posición de compra (long) o venta (short).",
        lote: "El tamaño de la posición en lotes. Un lote estándar equivale a 100,000 unidades de la divisa base.",
        entrada: "El precio al que planeas abrir la operación.",
        stop: "El precio donde colocarás tu stop loss. En una compra debe ser menor que la entrada, en una venta debe ser mayor.",
        take: "El precio objetivo donde planeas tomar ganancias. En una compra debe ser mayor que la entrada, en una venta debe ser menor.",
        result: `<div class='space-y-4'>
          <p>El riesgo y la recompensa se calculan en pips y luego se convierten a USD:</p>
          
          <div class='text-center'>
            $$\\text{Pips} = \\frac{|\\text{Precio}_1 - \\text{Precio}_2|}{\\text{Tamaño del pip}}$$
          </div>

          <div class='text-center'>
            $$\\text{USD} = \\text{Pips} \\times \\text{Valor del pip} \\times \\text{Lote}$$
          </div>

          <div class='space-y-1 mt-3'>
            <p>La relación riesgo:recompensa (R:R) se calcula como:</p>
            <div class='text-center'>
              $$\\text{R:R} = \\frac{\\text{Recompensa en pips}}{\\text{Riesgo en pips}}$$
            </div>
          </div>

          <p>Se recomienda buscar operaciones con una relación R:R mínima de 1:2, es decir, que la recompensa potencial sea al menos el doble que el riesgo asumido.</p>
        </div>`,
      },
    };
  },
  computed: {
    isFormValid() {
      return (
        this.pair &&
        this.direccion &&
        this.lote > 0 &&
        this.entrada > 0 &&
        this.stop > 0 &&
        this.take > 0 &&
        !Object.values(this.errors).some((error) => error)
      );
    },
    calculoHTML() {
      if (!this.resultado) return "";

      const info = this.tradingPairs[this.pair];
      const pipSize = Math.pow(10, -info.decimales);

      return `\\begin{align*}
        \\text{Riesgo} &= \\frac{|${this.entrada} - ${
        this.stop
      }|}{${pipSize}} = ${this.resultado.pipsRiesgo.toFixed(
        2
      )}\\text{ pips} \\\\
        &= ${this.resultado.pipsRiesgo.toFixed(2)} \\times ${
        info.valorPip
      } \\times ${this.lote} = \\$${this.resultado.riesgoUSD.toFixed(2)} \\\\
        \\text{Recompensa} &= \\frac{|${this.entrada} - ${
        this.take
      }|}{${pipSize}} = ${this.resultado.pipsRecompensa.toFixed(
        2
      )}\\text{ pips} \\\\
        &= ${this.resultado.pipsRecompensa.toFixed(2)} \\times ${
        info.valorPip
      } \\times ${this.lote} = \\$${this.resultado.gananciaUSD.toFixed(2)} \\\\
        \\text{R:R} &= \\frac{${this.resultado.pipsRecompensa.toFixed(
          2
        )}}{${this.resultado.pipsRiesgo.toFixed(
        2
      )}} = 1:${this.resultado.relacion.toFixed(2)}
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
    validateInputs() {
      this.errors = {
        pair: "",
        direccion: "",
        lote: "",
        entrada: "",
        stop: "",
        take: "",
      };

      if (!this.pair) {
        this.errors.pair = "Por favor selecciona un par de divisas.";
        return false;
      }

      if (!this.direccion) {
        this.errors.direccion =
          "Por favor selecciona la dirección de la operación.";
        return false;
      }

      if (!this.lote || this.lote <= 0) {
        this.errors.lote = "El tamaño del lote debe ser mayor a 0.";
        return false;
      }

      if (!this.entrada || this.entrada <= 0) {
        this.errors.entrada = "El precio de entrada debe ser mayor a 0.";
        return false;
      }

      if (!this.stop || this.stop <= 0) {
        this.errors.stop = "El stop loss debe ser mayor a 0.";
        return false;
      }

      if (!this.take || this.take <= 0) {
        this.errors.take = "El take profit debe ser mayor a 0.";
        return false;
      }

      // Validar lógica de precios según dirección
      if (this.direccion === "compra") {
        if (this.stop >= this.entrada) {
          this.errors.stop =
            "En una compra, el stop loss debe ser menor que el precio de entrada.";
          return false;
        }
        if (this.take <= this.entrada) {
          this.errors.take =
            "En una compra, el take profit debe ser mayor que el precio de entrada.";
          return false;
        }
      } else {
        if (this.stop <= this.entrada) {
          this.errors.stop =
            "En una venta, el stop loss debe ser mayor que el precio de entrada.";
          return false;
        }
        if (this.take >= this.entrada) {
          this.errors.take =
            "En una venta, el take profit debe ser menor que el precio de entrada.";
          return false;
        }
      }

      return true;
    },
    simular() {
      if (this.validateInputs()) {
        const info = this.tradingPairs[this.pair];
        const pipSize = Math.pow(10, -info.decimales);

        // Calcular pips de riesgo y recompensa
        const pipsRiesgo = Math.abs(this.entrada - this.stop) / pipSize;
        const pipsRecompensa = Math.abs(this.entrada - this.take) / pipSize;

        // Calcular valores en USD
        const riesgoUSD = pipsRiesgo * info.valorPip * this.lote;
        const gananciaUSD = pipsRecompensa * info.valorPip * this.lote;

        // Calcular relación riesgo:recompensa
        const relacion = pipsRecompensa / pipsRiesgo;

        // Determinar recomendación y color
        let recomendacion = "";
        let colorClass = "";

        if (relacion >= 3) {
          recomendacion =
            "¡Excelente setup! La recompensa potencial es más del triple que el riesgo.";
          colorClass = "text-green-600";
        } else if (relacion >= 2) {
          recomendacion =
            "Buen setup. La relación riesgo:recompensa cumple con el mínimo recomendado de 1:2.";
          colorClass = "text-green-600";
        } else if (relacion >= 1) {
          recomendacion =
            "Setup aceptable, pero considera ajustar los niveles para mejorar la relación R:R.";
          colorClass = "text-yellow-600";
        } else {
          recomendacion =
            "No recomendado. El riesgo es mayor que la recompensa potencial.";
          colorClass = "text-red-600";
        }

        this.resultado = {
          pipsRiesgo,
          pipsRecompensa,
          riesgoUSD,
          gananciaUSD,
          relacion,
          recomendacion,
          colorClass,
        };

        this.setAyuda("result");
        localStorage.setItem(
          "simulador_lastResultado",
          JSON.stringify(this.resultado)
        );
      }
    },
  },
  watch: {
    pair(newVal) {
      localStorage.setItem("simulador_lastPair", newVal || "");
    },
    direccion(newVal) {
      localStorage.setItem("simulador_lastDireccion", newVal || "");
    },
    lote(newVal) {
      localStorage.setItem("simulador_lastLote", newVal || "");
    },
    entrada(newVal) {
      localStorage.setItem("simulador_lastEntrada", newVal || "");
    },
    stop(newVal) {
      localStorage.setItem("simulador_lastStop", newVal || "");
    },
    take(newVal) {
      localStorage.setItem("simulador_lastTake", newVal || "");
    },
  },
  mounted() {
    // Cargar valores guardados sin mostrar notificación
    const lastPair = localStorage.getItem("simulador_lastPair");
    const lastDireccion = localStorage.getItem("simulador_lastDireccion");
    const lastLote = localStorage.getItem("simulador_lastLote");
    const lastEntrada = localStorage.getItem("simulador_lastEntrada");
    const lastStop = localStorage.getItem("simulador_lastStop");
    const lastTake = localStorage.getItem("simulador_lastTake");
    const lastResultado = localStorage.getItem("simulador_lastResultado");

    if (lastPair) this.pair = lastPair;
    if (lastDireccion) this.direccion = lastDireccion;
    if (lastLote) this.lote = Number(lastLote);
    if (lastEntrada) this.entrada = Number(lastEntrada);
    if (lastStop) this.stop = Number(lastStop);
    if (lastTake) this.take = Number(lastTake);
    if (lastResultado) this.resultado = JSON.parse(lastResultado);
  },
  updated() {
    if (window.MathJax) {
      window.MathJax.typeset();
    }
  },
};

// Exportar el componente
if (typeof exports !== "undefined") {
  exports.SimuladorCalculator = SimuladorCalculator;
} else {
  window.SimuladorCalculator = SimuladorCalculator;
}
