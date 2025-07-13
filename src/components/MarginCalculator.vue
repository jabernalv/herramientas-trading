<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from "vue";
import {
  Globe,
  TrendingUp,
  Layers,
  Scale,
  Calculator,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
} from "lucide-vue-next";
import { tradingPairs as tradingPairsData } from "@/data/trading-pairs";
import Button from "primevue/button";
import Select from "primevue/select";
import InputNumber from "primevue/inputnumber";
import InputGroup from "primevue/inputgroup";
import InputGroupAddon from "primevue/inputgroupaddon";

interface Resultado {
  margenRequerido: number;
  valorNominal: number;
}

interface Notification {
  type: "error" | "warning" | "success";
  title: string;
  message: string;
}

const pair = ref<string>("");
const precio = ref<number | null>(null);
const lote = ref<number | null>(null);
const apalancamiento = ref<number>(100);
const apalancamientoOpciones = [10, 20, 30, 50, 100, 200, 400, 500].map(
  (v) => ({ valor: v, texto: `${v}:1` })
);
const ayudaActiva = ref<string>("");
const resultado = ref<Resultado | null>(null);
const notification = ref<Notification | null>(null);
const tradingPairs = tradingPairsData as Record<string, any>;

const ayudas: Record<string, string> = {
  pair: "Selecciona el par de divisas o activo que vas a operar. Cada instrumento tiene diferentes unidades por lote estándar.",
  precio:
    "El precio actual del instrumento. Este valor se usa para calcular el valor nominal de la posición.",
  lote: "El tamaño del lote determina el valor nominal de tu posición. A mayor lote, mayor margen requerido.",
  apalancamiento:
    "El apalancamiento determina qué fracción del valor nominal necesitas como margen. Por ejemplo, 100:1 significa que necesitas 1/100 del valor nominal.",
  result: `<div class='space-y-4'>
    <p>El <strong>margen requerido</strong> es la cantidad mínima que debes tener disponible en tu cuenta para abrir una operación, según:</p>
    <ul class='list-disc list-inside ml-4'>
      <li>El tamaño de la operación (valor nominal)</li>
      <li>El apalancamiento ofrecido</li>
    </ul>
    <p>No es una comisión, ni un costo que se descuente: es un <strong>bloqueo temporal</strong> de capital que queda congelado mientras la operación esté abierta.</p>
    <p>Se calcula con la siguiente fórmula:</p>
    <div class='text-center'>$$M = \\frac{P \\times U \\times L}{A}$$</div>
    <div class='space-y-1 mt-3'>
      <p>Donde:</p>
      <div class='ml-4'>• <strong><i>M</i></strong>: Margen requerido en USD</div>
      <div class='ml-4'>• <strong><i>P</i></strong>: Precio actual del activo</div>
      <div class='ml-4'>• <strong><i>U</i></strong>: Unidades por lote (ej. 100,000 en Forex)</div>
      <div class='ml-4'>• <strong><i>L</i></strong>: Tamaño del lote</div>
      <div class='ml-4'>• <strong><i>A</i></strong>: Apalancamiento</div>
    </div>
    <p>El valor nominal de la operación se calcula así:</p>
    <div class='text-center'>$$\\text{Valor Nominal} = P \\times U \\times L$$</div>
  </div>`,
};

const setAyuda = (id: string) => {
  ayudaActiva.value = id;
};

function getPipSize() {
  if (!pair.value || !tradingPairs[pair.value]) return 0.0001;
  return tradingPairs[pair.value].pipSize || 0.0001;
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
  if (precio.value === null || isNaN(precio.value)) {
    showNotification(
      "error",
      "Precio inválido",
      "Debes ingresar el precio actual."
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

function calcularMargen() {
  if (!validateInputs()) return;
  if (!pair.value || !tradingPairs[pair.value]) return;
  const info = tradingPairs[pair.value];
  const unidades = info.unidades * (lote.value || 0);
  const valorNominal = (precio.value || 0) * unidades;
  const margenRequerido = valorNominal / (apalancamiento.value || 1);
  resultado.value = { margenRequerido, valorNominal };
  showNotification(
    "success",
    "Cálculo exitoso",
    "El margen requerido se ha calculado correctamente."
  );

  // Renderizar MathJax después del cálculo
  nextTick(() => {
    if (window.MathJax) {
      window.MathJax.typeset();
    }
  });
}

const calculoHTML = computed(() => {
  if (!resultado.value || !pair.value || !tradingPairs[pair.value]) return "";
  const info = tradingPairs[pair.value];
  return `\\begin{align*}
    \\text{Valor Nominal} &= ${precio.value} \\times ${info.unidades} \\times ${
    lote.value
  } = \\$${resultado.value.valorNominal.toFixed(2)} \\\\
    \\text{Margen} &= \\frac{${precio.value} \\times ${info.unidades} \\times ${
    lote.value
  }}{${apalancamiento.value}} = \\$${resultado.value.margenRequerido.toFixed(2)}
  \\end{align*}`;
});

// LocalStorage: guardar y cargar
watch(pair, (v) => localStorage.setItem("margin_lastPair", v || ""));
watch(precio, (v) =>
  localStorage.setItem("margin_lastPrecio", v?.toString() || "")
);
watch(lote, (v) =>
  localStorage.setItem("margin_lastLote", v?.toString() || "")
);
watch(apalancamiento, (v) =>
  localStorage.setItem("margin_lastApalancamiento", v?.toString() || "")
);
watch(resultado, (v) => {
  if (v) localStorage.setItem("margin_lastResultado", JSON.stringify(v));
});

// Watcher para renderizar MathJax cuando cambie el cálculo
watch(calculoHTML, () => {
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

onMounted(() => {
  pair.value = localStorage.getItem("margin_lastPair") || "";
  precio.value = +(localStorage.getItem("margin_lastPrecio") || "") || null;
  lote.value = +(localStorage.getItem("margin_lastLote") || "") || null;
  apalancamiento.value =
    +(localStorage.getItem("margin_lastApalancamiento") || "") || 100;
  try {
    const res = localStorage.getItem("margin_lastResultado");
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
          Calculadora de margen requerido
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
        <!-- Entradas -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div class="relative">
            <label for="precio" class="block font-semibold mb-1"
              >Precio actual</label
            >
            <InputGroup>
              <InputGroupAddon>
                <TrendingUp class="w-4 h-4" />
              </InputGroupAddon>
              <InputNumber
                v-model="precio"
                :min="0.0001"
                :step="getPipSize()"
                :minFractionDigits="4"
                :maxFractionDigits="5"
                class="w-full"
                @focus="setAyuda('precio')"
                @input="setAyuda('precio')"
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
                :minFractionDigits="2"
                :maxFractionDigits="2"
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
            @click="calcularMargen"
            class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
          >
            <Calculator class="w-5 h-5" />
            Calcular margen
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
              \${{ resultado.margenRequerido.toFixed(2) }}
            </p>
          </div>
          <div
            class="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200 animate-fade-in"
          >
            <p class="text-sm text-blue-800 mb-2">Fórmula aplicada:</p>
            <div class="text-center" v-html="calculoHTML"></div>
            <div class="mt-3 text-sm text-blue-600">
              <div>Donde:</div>
              <div>Precio = {{ precio }}</div>
              <div>
                Unidades = {{ tradingPairs[pair].unidades.toLocaleString() }}
              </div>
              <div>Lote = {{ lote }}</div>
              <div>Apalancamiento = {{ apalancamiento }}:1</div>
            </div>
          </div>
          <div
            class="mt-4 p-4 bg-gray-100 border border-gray-300 rounded text-sm"
          >
            <div class="grid grid-cols-2 gap-4">
              <div>
                <strong>Valor nominal:</strong> \${{
                  resultado.valorNominal.toFixed(2)
                }}
              </div>
              <div>
                <strong>Margen requerido:</strong> \${{
                  resultado.margenRequerido.toFixed(2)
                }}
              </div>
            </div>
            <p class="mt-3">
              Para abrir una posición de {{ lote }} {{ pair }} necesitarás un
              margen de
              <strong>\${{ resultado.margenRequerido.toFixed(2) }}</strong> con
              un apalancamiento de {{ apalancamiento }}:1. Esto representa el
              {{ ((1 / apalancamiento) * 100).toFixed(2) }}% del valor nominal
              de la posición.
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
              <strong>Valor del pip:</strong> \${{
                tradingPairs[pair].valorPip
              }}
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
