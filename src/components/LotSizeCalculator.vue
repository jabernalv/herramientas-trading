<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from "vue";
import {
  Globe,
  Wallet,
  Percent,
  Slash,
  Calculator,
  CheckCircle,
} from "lucide-vue-next";
import { tradingPairs as tradingPairsData } from "@/data/trading-pairs";
import Select from "primevue/select";
import InputNumber from "primevue/inputnumber";
import InputGroup from "primevue/inputgroup";
import InputGroupAddon from "primevue/inputgroupaddon";
import Button from "primevue/button";
import DataTable from "primevue/datatable";
import Column from "primevue/column";

const pair = ref<string>("");
const accountSize = ref<number | null>(null);
const riskPercent = ref<number | null>(null);
const stopLossPips = ref<number | null>(null);
const lotSize = ref<number | null>(null);
const ayudaActiva = ref<string>("");
const tradingPairs = tradingPairsData as Record<string, any>;

const ayudas: Record<string, string> = {
  pair: `En trading, un par de divisas representa la relación entre dos monedas: una que se compra y otra que se vende. Por ejemplo, en EUR/USD, compras euros vendiendo dólares. Cada par tiene características propias: los pares principales suelen tener spreads más bajos y mayor liquidez, mientras que los cruzados o los que involucran metales pueden ser más volátiles. Además, el valor de cada pip varía según el par. Esta elección no solo afecta el riesgo, sino también la velocidad y el comportamiento de la operación.`,
  accountSize: `El tamaño de la cuenta es el capital total disponible en tu bróker para operar. No es simplemente un número: representa tu capacidad de asumir pérdidas y de sostener tu operativa en el tiempo. Una cuenta más grande permite distribuir mejor el riesgo y sobrevivir a rachas negativas. Aquí, este valor es la base para calcular cuánto dinero estás dispuesto a arriesgar en cada operación según tu porcentaje de riesgo.`,
  riskPercent: `Este es uno de los pilares de la gestión monetaria. Indica qué fracción de tu cuenta estás dispuesto a perder si la operación sale mal. Un trader profesional rara vez arriesga más del 1-2% por operación. Arriesgar más puede acelerar las pérdidas en una mala racha y llevar a un colapso emocional. Definir correctamente este porcentaje es clave para la sostenibilidad y longevidad en el trading.`,
  stopLossPips: `El "stop loss" define el punto donde asumes que tu hipótesis era incorrecta. Medido en pips, representa la distancia entre tu punto de entrada y tu nivel de protección. No es un número arbitrario: debe estar basado en el análisis técnico y considerar la volatilidad del par. Cuanto más grande sea el stop, más lote necesitas reducir para mantener el riesgo fijo. Es una herramienta para controlar pérdidas, no una barrera emocional.`,
  pipTable: `El pip (Percentage in Point) es la unidad mínima de movimiento de precio en un par. El valor monetario del pip depende del par y del tamaño del lote. La tabla muestra el valor del pip por lote estándar y las unidades que representa cada lote. Por ejemplo, en forex un lote estándar suele ser 100,000 unidades, mientras que en metales como el oro puede variar. Conocer estos valores es fundamental para calcular correctamente tu exposición al riesgo.`,
  result: `El tamaño del lote es la cantidad de unidades de un par que vas a comprar o vender. Se calcula utilizando la siguiente fórmula matemática:<br><br>$$\\text{Lote} = \\dfrac{\\text{Capital} \\times \\text{% Riesgo}}{\\text{Stop Loss} \\times \\text{Valor del Pip}}$$<br><br>Cada elemento de la fórmula tiene un propósito específico:<br>• Capital: Tu balance total disponible<br>• % Riesgo: El porcentaje que estás dispuesto a arriesgar<br>• Stop Loss: Tu nivel de salida en pips<br>• Valor del Pip: El valor monetario de cada pip según el par<br><br>Esta fórmula asegura que tu riesgo monetario real coincida exactamente con el porcentaje que deseas arriesgar.`,
};

const isFormValid = computed(() => {
  return (
    pair.value &&
    !!accountSize.value &&
    accountSize.value > 0 &&
    !!riskPercent.value &&
    riskPercent.value > 0 &&
    !!stopLossPips.value &&
    stopLossPips.value > 0
  );
});

const priceMovement = computed(() => {
  if (!pair.value || !stopLossPips.value) return 0;
  const decimals = tradingPairs[pair.value]?.decimales || 2;
  return (stopLossPips.value * Math.pow(0.1, decimals)).toFixed(decimals);
});

const formulaHTML = computed(() => {
  if (!lotSize.value) return "";
  return `$$\\text{Lote} = \\dfrac{${accountSize.value} \\times ${
    riskPercent.value
  }\\%}{${stopLossPips.value} \\times ${
    tradingPairs[pair.value]?.valorPip
  }} = ${lotSize.value.toFixed(2)}$$`;
});

const pipTableData = computed(() => {
  return Object.entries(tradingPairs).map(([symbol, data]) => ({
    symbol,
    nombre: data.nombre,
    valorPip: data.valorPip,
    unidades: data.unidades,
  }));
});

function setAyuda(id: string) {
  ayudaActiva.value = id;
}

function calculateLot() {
  if (isFormValid.value) {
    const pipValue = tradingPairs[pair.value].valorPip;
    const riskAmount =
      (accountSize.value as number) * ((riskPercent.value as number) / 100);
    lotSize.value = riskAmount / ((stopLossPips.value as number) * pipValue);

    // Renderizar MathJax después del cálculo
    nextTick(() => {
      if (window.MathJax) {
        window.MathJax.typeset();
      }
    });
  } else {
    lotSize.value = null;
  }
}

// LocalStorage: guardar y cargar
watch(pair, (v) => localStorage.setItem("lot_lastPair", v || ""));
watch(accountSize, (v) =>
  localStorage.setItem("lot_lastAccountSize", v?.toString() || "")
);
watch(riskPercent, (v) =>
  localStorage.setItem("lot_lastRiskPercent", v?.toString() || "")
);
watch(stopLossPips, (v) =>
  localStorage.setItem("lot_lastStopLossPips", v?.toString() || "")
);

// Watcher para renderizar MathJax cuando cambie la fórmula
watch(formulaHTML, () => {
  nextTick(() => {
    if (window.MathJax) {
      window.MathJax.typeset();
    }
  });
});

onMounted(() => {
  pair.value = localStorage.getItem("lot_lastPair") || "";
  accountSize.value =
    +(localStorage.getItem("lot_lastAccountSize") || "") || null;
  riskPercent.value =
    +(localStorage.getItem("lot_lastRiskPercent") || "") || null;
  stopLossPips.value =
    +(localStorage.getItem("lot_lastStopLossPips") || "") || null;

  // Mostrar ayuda por defecto
  ayudaActiva.value = "result";

  // Inicializar MathJax después del montaje
  nextTick(() => {
    if (window.MathJax) {
      window.MathJax.typeset();
    }
  });
});
</script>

<template>
  <div class="flex items-center justify-center px-4 py-8">
    <div
      class="bg-white shadow-md rounded p-6 max-w-7xl w-full grid grid-cols-1 md:grid-cols-3 gap-6"
    >
      <div class="md:col-span-2 order-1 md:order-none">
        <h1 class="text-2xl font-bold mb-6 text-center">
          Calculadora de lote en trading
        </h1>
        <div class="mb-6 relative">
          <label for="pair" class="block font-semibold mb-1"
            >Par de divisas o activo</label
          >
          <Select
            v-model="pair"
            :options="Object.keys(tradingPairs)"
            placeholder="-- Selecciona un par --"
            class="w-full"
            @focus="setAyuda('pair')"
            @change="setAyuda('pair')"
          >
            <template #option="{ option }">
              <div class="flex items-center gap-2">
                <Globe class="w-4 h-4" />
                <span>{{ option }} - {{ tradingPairs[option].nombre }}</span>
              </div>
            </template>
            <template #value="{ value }">
              <div v-if="value" class="flex items-center gap-2">
                <Globe class="w-4 h-4" />
                <span>{{ value }} - {{ tradingPairs[value].nombre }}</span>
              </div>
              <span v-else class="text-gray-500">-- Selecciona un par --</span>
            </template>
          </Select>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div class="relative">
            <label for="accountSize" class="block font-semibold mb-1"
              >Tamaño de cuenta (USD)</label
            >
            <InputGroup>
              <InputGroupAddon>
                <Wallet class="w-4 h-4" />
              </InputGroupAddon>
              <InputNumber
                v-model="accountSize"
                placeholder="1000"
                :min="1"
                :step="1"
                class="w-full"
                @focus="setAyuda('accountSize')"
                @input="setAyuda('accountSize')"
              />
            </InputGroup>
          </div>
          <div class="relative">
            <label for="riskPercent" class="block font-semibold mb-1"
              >Riesgo por operación (%)</label
            >
            <InputGroup>
              <InputGroupAddon>
                <Percent class="w-4 h-4" />
              </InputGroupAddon>
              <InputNumber
                v-model="riskPercent"
                placeholder="1.0"
                :min="0.01"
                :max="10"
                :step="0.01"
                :minFractionDigits="2"
                :maxFractionDigits="2"
                class="w-full"
                @focus="setAyuda('riskPercent')"
                @input="setAyuda('riskPercent')"
              />
            </InputGroup>
          </div>
          <div class="relative">
            <label for="stopLossPips" class="block font-semibold mb-1"
              >Stop loss (pips)</label
            >
            <InputGroup>
              <InputGroupAddon>
                <Slash class="w-4 h-4" />
              </InputGroupAddon>
              <InputNumber
                v-model="stopLossPips"
                placeholder="5.0"
                :min="0.1"
                :step="0.1"
                :minFractionDigits="1"
                :maxFractionDigits="1"
                class="w-full"
                @focus="setAyuda('stopLossPips')"
                @input="setAyuda('stopLossPips')"
              />
            </InputGroup>
          </div>
        </div>
        <div class="text-center mb-6">
          <Button
            @click="calculateLot"
            :disabled="!isFormValid"
            class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
          >
            <Calculator class="w-5 h-5" />
            Calcular lote
          </Button>
        </div>

        <!-- Resultado -->
        <div v-if="lotSize" class="text-center mb-6">
          <div
            class="inline-flex flex-col items-center justify-center px-6 py-4 rounded-lg bg-green-100 border border-green-300 shadow-md animate-fade-in"
          >
            <div class="flex items-center gap-2 mb-2">
              <CheckCircle class="w-6 h-6 text-green-600" />
              <span class="text-lg font-semibold"
                >Tamaño de lote sugerido:</span
              >
            </div>
            <p class="text-3xl text-green-700 font-extrabold tracking-wide">
              {{ lotSize.toFixed(2) }}
            </p>
          </div>
          <div
            class="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200 animate-fade-in"
          >
            <p class="text-sm text-blue-800 mb-2">Fórmula aplicada:</p>
            <div class="text-center" v-html="formulaHTML"></div>
            <div class="mt-3 text-sm text-blue-600">
              <div>Donde:</div>
              <div>Capital = ${{ accountSize }}</div>
              <div>Riesgo = {{ riskPercent }}%</div>
              <div>Stop Loss = {{ stopLossPips }} pips</div>
              <div>Valor del Pip = ${{ tradingPairs[pair]?.valorPip }}</div>
            </div>
            <div class="mt-3 text-sm text-blue-600">
              <div>Para {{ pair }}:</div>
              <div>
                {{ stopLossPips }} pips equivalen a un movimiento de
                {{ priceMovement }} en el precio
              </div>
            </div>
          </div>
        </div>

        <!-- Información del par seleccionado -->
        <div
          v-if="pair && tradingPairs[pair]"
          class="text-sm bg-blue-50 border border-blue-200 p-4 rounded mb-6"
        >
          <h3 class="font-semibold mb-2">{{ tradingPairs[pair].nombre }}</h3>
          <p class="text-gray-600">{{ tradingPairs[pair].descripcion }}</p>
          <div class="mt-2 grid grid-cols-2 gap-2">
            <div>
              <strong>Valor del pip:</strong> ${{ tradingPairs[pair].valorPip }}
            </div>
            <div>
              <strong>Unidades por lote:</strong>
              {{ tradingPairs[pair].unidades.toLocaleString() }}
            </div>
          </div>
        </div>

        <!-- Tabla de valores pip por lote -->
        <div class="mb-4">
          <h2 class="text-lg font-bold mb-2">Tabla de valores pip por lote</h2>
          <DataTable
            :value="pipTableData"
            :paginator="true"
            :rows="20"
            :rowsPerPageOptions="[10, 20, 50]"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} registros"
            class="w-full"
            @mouseover="setAyuda('pipTable')"
          >
            <Column field="symbol" header="Par" sortable class="font-medium">
              <template #body="{ data }">
                <div class="flex items-center gap-2">
                  <Globe class="w-4 h-4 text-blue-600" />
                  <span
                    :class="{ 'font-bold text-blue-700': pair === data.symbol }"
                  >
                    {{ data.symbol }}
                  </span>
                </div>
              </template>
            </Column>
            <Column field="nombre" header="Nombre" sortable></Column>
            <Column field="valorPip" header="Valor pip (USD)" sortable>
              <template #body="{ data }">
                <span class="text-right font-mono"
                  >${{ data.valorPip.toFixed(2) }}</span
                >
              </template>
            </Column>
            <Column field="unidades" header="Unidades/Lote" sortable>
              <template #body="{ data }">
                <span class="text-right font-mono">{{
                  data.unidades.toLocaleString()
                }}</span>
              </template>
            </Column>
          </DataTable>
        </div>
      </div>

      <!-- Ayuda contextual -->
      <div
        class="bg-gray-100 border border-gray-300 p-4 rounded text-sm leading-relaxed text-left"
      >
        <h2 class="font-bold text-lg mb-2">Ayuda contextual</h2>
        <div v-if="ayudaActiva" v-html="ayudas[ayudaActiva]"></div>
        <p v-else class="text-gray-500">
          Enfoca un campo para ver la explicación.
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
