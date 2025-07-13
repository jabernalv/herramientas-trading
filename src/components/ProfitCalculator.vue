<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from "vue";
import {
  Globe,
  Layers,
  TrendingUp,
  TrendingDown,
  Scale,
  Calculator,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
} from "lucide-vue-next";
import { tradingPairs as tradingPairsData } from "@/data/trading-pairs";
import Select from "primevue/select";
import InputNumber from "primevue/inputnumber";
import InputGroup from "primevue/inputgroup";
import InputGroupAddon from "primevue/inputgroupaddon";
import Button from "primevue/button";

interface Resultado {
  ganancia: number;
  diferenciaPips: number;
  margen: number;
  rentabilidad: number;
}

interface Notification {
  type: "error" | "warning" | "success";
  title: string;
  message: string;
}

const pair = ref<string>("");
const tipoOperacion = ref<"compra" | "venta">("compra");
const precioEntrada = ref<number | null>(null);
const precioSalida = ref<number | null>(null);
const lote = ref<number | null>(null);
const apalancamiento = ref<number>(100);
const apalancamientoOpciones = [10, 20, 30, 50, 100, 200, 400, 500].map(
  (v) => ({ valor: v, texto: `${v}:1` })
);
const resultado = ref<Resultado | null>(null);
const notification = ref<Notification | null>(null);
const ayudaActiva = ref<string>("");
const tradingPairs = tradingPairsData as Record<string, any>;

const ayudas: Record<string, string> = {
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
      <div class='ml-4'>• <strong><i>G</i></strong>: Ganancia o pérdida en USD</div>
      <div class='ml-4'>• <strong><i>D</i></strong>: Diferencia en pips</div>
      <div class='ml-4'>• <strong><i>VP</i></strong>: Valor del pip</div>
      <div class='ml-4'>• <strong><i>L</i></strong>: Tamaño del lote</div>
    </div>
    <p>El margen requerido se calcula como:</p>
    <div class='text-center'>$$M = \\dfrac{P \\times U \\times L}{A}$$</div>
    <div class='space-y-1'>
      <div class='ml-4'>• <strong><i>M</i></strong>: Margen requerido en USD</div>
      <div class='ml-4'>• <strong><i>P</i></strong>: Precio de entrada</div>
      <div class='ml-4'>• <strong><i>U</i></strong>: Unidades por lote</div>
      <div class='ml-4'>• <strong><i>L</i></strong>: Tamaño del lote</div>
      <div class='ml-4'>• <strong><i>A</i></strong>: Apalancamiento</div>
    </div>
  </div>`,
};

const setAyuda = (id: string) => {
  ayudaActiva.value = id;
};

function getPipSize() {
  if (!pair.value || !tradingPairs[pair.value]) return 0.0001;
  return Math.pow(10, -tradingPairs[pair.value].decimales);
}

function showNotification(
  type: Notification["type"],
  title: string,
  message: string,
  duration = 5000
) {
  notification.value = { type, title, message };
  setTimeout(() => {
    notification.value = null;
  }, duration);
}

function validateInputs() {
  if (!pair.value) {
    showNotification(
      "error",
      "Par no seleccionado",
      "Selecciona un par de divisas o activo."
    );
    return false;
  }
  if (precioEntrada.value === null || isNaN(precioEntrada.value)) {
    showNotification(
      "error",
      "Precio de entrada inválido",
      "Debes ingresar el precio de entrada."
    );
    return false;
  }
  if (precioSalida.value === null || isNaN(precioSalida.value)) {
    showNotification(
      "error",
      "Precio de salida inválido",
      "Debes ingresar el precio de salida."
    );
    return false;
  }
  if (lote.value === null || isNaN(lote.value) || lote.value <= 0) {
    showNotification(
      "error",
      "Lote inválido",
      "El tamaño del lote debe ser mayor a 0."
    );
    return false;
  }
  if (
    apalancamiento.value === null ||
    isNaN(apalancamiento.value) ||
    apalancamiento.value <= 0
  ) {
    showNotification(
      "error",
      "Apalancamiento inválido",
      "Selecciona un apalancamiento válido."
    );
    return false;
  }
  return true;
}

function handleClick() {
  if (!validateInputs()) return;
  calculateResult();
  showNotification(
    "success",
    "Cálculo exitoso",
    "La ganancia/pérdida se ha calculado correctamente."
  );

  // Renderizar MathJax después del cálculo
  nextTick(() => {
    if (window.MathJax) {
      window.MathJax.typeset();
    }
  });
}

function calculateResult() {
  if (!pair.value || !tradingPairs[pair.value]) return;
  const info = tradingPairs[pair.value];
  const pipSize = Math.pow(10, -info.decimales);

  // Calcular diferencia en pips según tipo de operación
  const diferenciaPrecio =
    tipoOperacion.value === "compra"
      ? precioSalida.value! - precioEntrada.value!
      : precioEntrada.value! - precioSalida.value!;

  const diferenciaPips = diferenciaPrecio / pipSize;
  const ganancia = diferenciaPips * info.valorPip * (lote.value || 0);

  // Calcular margen requerido
  const margen =
    (precioEntrada.value! * info.unidades * (lote.value || 0)) /
    (apalancamiento.value || 1);

  // Calcular rentabilidad
  const rentabilidad = (ganancia / margen) * 100;

  resultado.value = {
    diferenciaPips,
    ganancia,
    margen,
    rentabilidad,
  };
}

const formulaHTML = computed(() => {
  if (!resultado.value || !pair.value || !tradingPairs[pair.value]) return "";

  const diferenciaPrecio =
    tipoOperacion.value === "compra"
      ? `(${precioSalida.value} - ${precioEntrada.value})`
      : `(${precioEntrada.value} - ${precioSalida.value})`;

  const pipSize = Math.pow(10, -tradingPairs[pair.value].decimales);
  const diferenciaPips = `\\frac{${diferenciaPrecio}}{${pipSize}}`;

  return `$$G = ${diferenciaPips} \\times ${
    tradingPairs[pair.value].valorPip
  } \\times ${lote.value} = $${resultado.value.ganancia.toFixed(2)}$$`;
});

// LocalStorage: guardar y cargar
watch(pair, (v) => localStorage.setItem("profit_lastPair", v || ""));
watch(tipoOperacion, (v) =>
  localStorage.setItem("profit_lastTipoOperacion", v)
);
watch(precioEntrada, (v) =>
  localStorage.setItem("profit_lastPrecioEntrada", v?.toString() || "")
);
watch(precioSalida, (v) =>
  localStorage.setItem("profit_lastPrecioSalida", v?.toString() || "")
);
watch(lote, (v) =>
  localStorage.setItem("profit_lastLote", v?.toString() || "")
);
watch(apalancamiento, (v) =>
  localStorage.setItem("profit_lastApalancamiento", v?.toString() || "")
);

// Watcher para renderizar MathJax cuando cambie la fórmula
watch(formulaHTML, () => {
  nextTick(() => {
    if (window.MathJax) {
      window.MathJax.typeset();
    }
  });
});

// Watcher para renderizar MathJax cuando cambie la ayuda activa
watch(ayudaActiva, () => {
  nextTick(() => {
    if (window.MathJax) {
      window.MathJax.typeset();
    }
  });
});
watch(resultado, (v) => {
  if (v) localStorage.setItem("profit_lastResultado", JSON.stringify(v));
});

onMounted(() => {
  pair.value = localStorage.getItem("profit_lastPair") || "";
  tipoOperacion.value =
    (localStorage.getItem("profit_lastTipoOperacion") as any) || "compra";
  precioEntrada.value =
    +(localStorage.getItem("profit_lastPrecioEntrada") || "") || null;
  precioSalida.value =
    +(localStorage.getItem("profit_lastPrecioSalida") || "") || null;
  lote.value = +(localStorage.getItem("profit_lastLote") || "") || null;
  apalancamiento.value =
    +(localStorage.getItem("profit_lastApalancamiento") || "") || 100;
  try {
    const res = localStorage.getItem("profit_lastResultado");
    if (res) resultado.value = JSON.parse(res);
  } catch {}

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
    <!-- Sistema de notificaciones -->
    <div v-if="notification" class="fixed top-20 right-4 z-50 max-w-sm">
      <div
        :class="{
          'p-4 rounded-lg shadow-lg border flex items-start gap-3 transition-all duration-300': true,
          'bg-red-50 border-red-300 text-red-800':
            notification.type === 'error',
          'bg-yellow-50 border-yellow-300 text-yellow-800':
            notification.type === 'warning',
          'bg-green-50 border-green-300 text-green-800':
            notification.type === 'success',
        }"
      >
        <div class="flex-shrink-0 mt-0.5">
          <AlertCircle v-if="notification.type === 'error'" class="w-5 h-5" />
          <AlertTriangle
            v-if="notification.type === 'warning'"
            class="w-5 h-5"
          />
          <CheckCircle v-if="notification.type === 'success'" class="w-5 h-5" />
        </div>
        <div>
          <h3 class="font-semibold">{{ notification.title }}</h3>
          <p class="text-sm">{{ notification.message }}</p>
        </div>
      </div>
    </div>
    <div
      class="bg-white shadow-md rounded p-6 max-w-7xl w-full grid grid-cols-1 md:grid-cols-3 gap-6"
    >
      <!-- Columna principal -->
      <div class="md:col-span-2">
        <h1 class="text-2xl font-bold mb-6 text-center">
          Calculadora de ganancia en trading
        </h1>
        <!-- Selector de par -->
        <div class="mb-4 relative">
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
        <!-- Tipo de operación -->
        <div class="mb-4">
          <label for="tipoOperacion" class="block font-semibold mb-1"
            >Tipo de operación</label
          >
          <Select
            v-model="tipoOperacion"
            :options="[
              { value: 'compra', label: 'Compra (long)' },
              { value: 'venta', label: 'Venta (short)' },
            ]"
            optionLabel="label"
            optionValue="value"
            placeholder="Selecciona tipo de operación"
            class="w-full"
            @focus="setAyuda('tipoOperacion')"
            @change="setAyuda('tipoOperacion')"
          >
            <template #option="{ option }">
              <div class="flex items-center gap-2">
                <TrendingUp
                  v-if="option.value === 'compra'"
                  class="w-4 h-4 text-green-600"
                />
                <TrendingDown
                  v-if="option.value === 'venta'"
                  class="w-4 h-4 text-red-600"
                />
                <span>{{ option.label }}</span>
              </div>
            </template>
            <template #value="{ value }">
              <div v-if="value" class="flex items-center gap-2">
                <TrendingUp
                  v-if="value === 'compra'"
                  class="w-4 h-4 text-green-600"
                />
                <TrendingDown
                  v-if="value === 'venta'"
                  class="w-4 h-4 text-red-600"
                />
                <span>{{
                  value === "compra" ? "Compra (long)" : "Venta (short)"
                }}</span>
              </div>
              <span v-else class="text-gray-500"
                >Selecciona tipo de operación</span
              >
            </template>
          </Select>
        </div>
        <!-- Entradas -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div class="relative">
            <label for="precioEntrada" class="block font-semibold mb-1"
              >Precio de entrada</label
            >
            <InputGroup>
              <InputGroupAddon>
                <TrendingUp class="w-4 h-4" />
              </InputGroupAddon>
              <InputNumber
                v-model="precioEntrada"
                :min="0.0001"
                :step="getPipSize()"
                :minFractionDigits="0"
                :maxFractionDigits="5"
                :useGrouping="false"
                locale="en-US"
                class="w-full"
                @focus="setAyuda('precioEntrada')"
                @input="setAyuda('precioEntrada')"
              />
            </InputGroup>
          </div>
          <div class="relative">
            <label for="precioSalida" class="block font-semibold mb-1"
              >Precio de salida</label
            >
            <InputGroup>
              <InputGroupAddon>
                <TrendingDown class="w-4 h-4" />
              </InputGroupAddon>
              <InputNumber
                v-model="precioSalida"
                :min="0.0001"
                :step="getPipSize()"
                :minFractionDigits="0"
                :maxFractionDigits="5"
                :useGrouping="false"
                locale="en-US"
                class="w-full"
                @focus="setAyuda('precioSalida')"
                @input="setAyuda('precioSalida')"
              />
            </InputGroup>
          </div>
          <div class="relative">
            <label for="lote" class="block font-semibold mb-1"
              >Tamaño del lote</label
            >
            <InputGroup>
              <InputGroupAddon>
                <Layers class="w-4 h-4" />
              </InputGroupAddon>
              <InputNumber
                v-model="lote"
                placeholder="0.01"
                :min="0.01"
                :step="0.01"
                :minFractionDigits="0"
                :maxFractionDigits="2"
                :useGrouping="false"
                locale="en-US"
                class="w-full"
                @focus="setAyuda('lote')"
                @input="setAyuda('lote')"
              />
            </InputGroup>
          </div>
          <div class="relative">
            <label for="apalancamiento" class="block font-semibold mb-1"
              >Apalancamiento</label
            >
            <Select
              v-model="apalancamiento"
              :options="apalancamientoOpciones"
              optionLabel="texto"
              optionValue="valor"
              placeholder="Selecciona apalancamiento"
              class="w-full"
              @focus="setAyuda('apalancamiento')"
              @change="setAyuda('apalancamiento')"
            >
              <template #option="{ option }">
                <div class="flex items-center gap-2">
                  <Scale class="w-4 h-4" />
                  <span>{{ option.texto }}</span>
                </div>
              </template>
              <template #value="{ value }">
                <div v-if="value" class="flex items-center gap-2">
                  <Scale class="w-4 h-4" />
                  <span>{{ value }}:1</span>
                </div>
                <span v-else class="text-gray-500"
                  >Selecciona apalancamiento</span
                >
              </template>
            </Select>
          </div>
        </div>
        <!-- Botón -->
        <div class="text-center mb-6">
          <Button
            @click="handleClick"
            class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
          >
            <Calculator class="w-5 h-5" />
            Calcular ganancia
          </Button>
        </div>
        <!-- Resultados -->
        <div v-if="resultado" class="text-center mb-6">
          <div
            class="inline-flex flex-col items-center justify-center px-6 py-4 rounded-lg bg-green-100 border border-green-300 shadow-md animate-fade-in"
          >
            <div class="flex items-center gap-2 mb-2">
              <CheckCircle class="w-6 h-6 text-green-600" />
              <span class="text-lg font-semibold">Resultado del cálculo:</span>
            </div>
            <p class="text-3xl text-green-700 font-extrabold tracking-wide">
              ${{ resultado.ganancia.toFixed(2) }}
            </p>
          </div>
          <div
            class="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200 animate-fade-in"
          >
            <p class="text-sm text-blue-800 mb-2">Fórmula aplicada:</p>
            <div class="text-center" v-html="formulaHTML"></div>
            <div class="mt-3 text-sm text-blue-600">
              <div>Donde:</div>
              <div>
                Diferencia =
                {{
                  tipoOperacion === "compra"
                    ? "Precio salida - Precio entrada"
                    : "Precio entrada - Precio salida"
                }}
              </div>
              <div>Precio entrada = {{ precioEntrada }}</div>
              <div>Precio salida = {{ precioSalida }}</div>
              <div>Lote = {{ lote }}</div>
              <div>Valor del pip = ${{ tradingPairs[pair].valorPip }}</div>
              <div>
                Unidades = {{ tradingPairs[pair].unidades.toLocaleString() }}
              </div>
            </div>
          </div>
          <div
            class="mt-4 p-4 bg-gray-100 border border-gray-300 rounded text-sm"
          >
            <div class="grid grid-cols-2 gap-4">
              <div>
                <strong>Diferencia:</strong>
                {{ resultado.diferenciaPips.toFixed(2) }} pips
              </div>
              <div>
                <strong>Margen requerido:</strong> ${{
                  resultado.margen.toFixed(2)
                }}
              </div>
              <div>
                <strong>Ganancia/pérdida:</strong> ${{
                  resultado.ganancia.toFixed(2)
                }}
              </div>
              <div>
                <strong>Rentabilidad:</strong>
                {{ resultado.rentabilidad.toFixed(2) }}%
              </div>
            </div>
            <p class="mt-3">
              Con este apalancamiento, esta operación requeriría un margen de
              <strong>${{ resultado.margen.toFixed(2) }}</strong
              >, y habría generado una
              {{ resultado.ganancia >= 0 ? "ganancia" : "pérdida" }} de
              <strong>${{ Math.abs(resultado.ganancia).toFixed(2) }}</strong
              >, lo que equivale al
              <strong>{{ resultado.rentabilidad.toFixed(2) }}%</strong> sobre el
              capital inmovilizado.
            </p>
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
      </div>

      <!-- Ayuda contextual -->
      <div
        class="bg-gray-100 border border-gray-300 p-4 rounded text-sm leading-relaxed text-left"
      >
        <h2 class="font-bold text-lg mb-2">Ayuda contextual</h2>
        <div v-if="ayudaActiva" v-html="ayudas[ayudaActiva]"></div>
        <p v-else class="text-gray-500">
          Haz clic en un campo para ver la explicación.
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
