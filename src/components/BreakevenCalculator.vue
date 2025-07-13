<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from "vue";
import {
  Globe,
  Layers,
  MoveHorizontal,
  DollarSign,
  Calculator,
  CheckCircle,
} from "lucide-vue-next";
import { tradingPairs as tradingPairsData } from "@/data/trading-pairs";
import Button from "primevue/button";
import Select from "primevue/select";
import InputNumber from "primevue/inputnumber";
import InputGroup from "primevue/inputgroup";
import InputGroupAddon from "primevue/inputgroupaddon";

interface Resultado {
  pips: number;
}

interface Notification {
  type: "success" | "error" | "info";
  title: string;
  message: string;
}

const pair = ref<string>("");
const lote = ref<number | null>(null);
const spread = ref<number | null>(null);
const comision = ref<number | null>(null);
const ayudaActiva = ref<string>("");
const resultado = ref<Resultado | null>(null);
const notification = ref<Notification | null>(null);
const tradingPairs = tradingPairsData as Record<string, any>;

const pairsOptions = computed(() => {
  return Object.entries(tradingPairs).map(([symbol, info]) => ({
    label: `${symbol} - ${info.nombre}`,
    value: symbol,
  }));
});

const ayudas: Record<string, string> = {
  pair: "Selecciona el par que vas a operar. El valor del pip por lote depende del activo: no es lo mismo operar EUR/USD que oro o plata.",
  lote: "El tamaño del lote determina la exposición de tu operación. Más lote implica mayor impacto del spread y de cualquier comisión.",
  spread:
    "El spread es la diferencia entre el precio de compra y el de venta. Es un costo implícito que el mercado cobra desde que abres la operación.",
  comision:
    "Algunos brókers cobran una comisión fija por abrir y cerrar operaciones, adicional al spread. Aquí puedes incluirla si aplica.",
  result: `<div class='space-y-4'>
    <p>El break-even es la cantidad mínima de pips que el precio debe moverse a tu favor para cubrir el costo operativo de una operación (spread + comisión).</p> 
    <p>Para calcularlo, primero se convierte la comisión en pips y luego se suma al spread:</p>
    <div class='text-center'>$$BE = S + \\frac{C}{VP \\times L}$$</div>
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
};

const setAyuda = (id: string) => {
  ayudaActiva.value = id;
};

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
  if (lote.value === null || isNaN(lote.value) || lote.value <= 0) {
    showNotification(
      "error",
      "Lote inválido",
      "El tamaño del lote debe ser mayor a 0."
    );
    return false;
  }
  if (spread.value === null || isNaN(spread.value) || spread.value < 0) {
    showNotification(
      "error",
      "Spread inválido",
      "El spread debe ser 0 o mayor."
    );
    return false;
  }
  if (comision.value === null || isNaN(comision.value) || comision.value < 0) {
    showNotification(
      "error",
      "Comisión inválida",
      "La comisión debe ser 0 o mayor."
    );
    return false;
  }
  return true;
}

function handleClick() {
  if (!validateInputs()) return;
  calcularBreakEven();
  showNotification(
    "success",
    "Cálculo exitoso",
    "El break-even se ha calculado correctamente."
  );

  // Renderizar MathJax después del cálculo
  nextTick(() => {
    if (window.MathJax) {
      window.MathJax.typeset();
    }
  });
}

function calcularBreakEven() {
  if (!pair.value || !tradingPairs[pair.value]) return;

  const pipValue = tradingPairs[pair.value].valorPip;
  const pips =
    (spread.value! * pipValue * lote.value! + comision.value!) /
    (pipValue * lote.value!);
  resultado.value = { pips };
}

const calculoHTML = computed(() => {
  if (!resultado.value || !pair.value || !tradingPairs[pair.value]) return "";
  return `$$BE = \\frac{${spread.value} \\times ${
    tradingPairs[pair.value].valorPip
  } \\times ${lote.value} + ${comision.value}}{${
    tradingPairs[pair.value].valorPip
  } \\times ${lote.value}} = ${resultado.value.pips.toFixed(2)}\\text{ pips}$$`;
});

// LocalStorage: guardar y cargar
watch(pair, (v) => localStorage.setItem("breakeven_lastPair", v || ""));
watch(lote, (v) =>
  localStorage.setItem("breakeven_lastLote", v?.toString() || "")
);
watch(spread, (v) =>
  localStorage.setItem("breakeven_lastSpread", v?.toString() || "")
);
watch(comision, (v) =>
  localStorage.setItem("breakeven_lastComision", v?.toString() || "")
);

// Watcher para renderizar MathJax cuando cambie la fórmula
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

watch(resultado, (v) => {
  if (v) localStorage.setItem("breakeven_lastResultado", JSON.stringify(v));
});

onMounted(() => {
  // Cargar localStorage
  pair.value = localStorage.getItem("breakeven_lastPair") || "";
  lote.value = +(localStorage.getItem("breakeven_lastLote") || "") || null;
  spread.value = +(localStorage.getItem("breakeven_lastSpread") || "") || null;
  comision.value =
    +(localStorage.getItem("breakeven_lastComision") || "") || null;
  try {
    const res = localStorage.getItem("breakeven_lastResultado");
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
    <div
      class="bg-white shadow-md rounded p-6 max-w-7xl w-full grid grid-cols-1 md:grid-cols-3 gap-6"
    >
      <!-- Columna principal -->
      <div class="md:col-span-2">
        <h1 class="text-2xl font-bold mb-6 text-center">
          Calculadora de Break-even
        </h1>

        <!-- Notificación -->
        <div
          v-if="notification"
          :class="[
            'mb-4 p-4 rounded-lg border',
            notification.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-800'
              : notification.type === 'error'
              ? 'bg-red-50 border-red-200 text-red-800'
              : 'bg-blue-50 border-blue-200 text-blue-800',
          ]"
        >
          <div class="flex items-center gap-2">
            <CheckCircle
              v-if="notification.type === 'success'"
              class="w-5 h-5"
            />
            <div>
              <h4 class="font-semibold">{{ notification.title }}</h4>
              <p class="text-sm">{{ notification.message }}</p>
            </div>
          </div>
        </div>

        <!-- Par -->
        <div class="mb-4 relative">
          <label class="block font-semibold mb-1" for="pair"
            >Par de divisas o activo</label
          >
          <Select
            v-model="pair"
            :options="pairsOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Selecciona un par"
            class="w-full"
            @focus="setAyuda('pair')"
            @change="setAyuda('pair')"
          >
            <template #option="{ option }">
              <div class="flex items-center gap-2">
                <Globe class="w-4 h-4" />
                <span>{{ option.label }}</span>
              </div>
            </template>
            <template #value="{ value }">
              <div v-if="value" class="flex items-center gap-2">
                <Globe class="w-4 h-4" />
                <span>{{
                  pairsOptions.find((p) => p.value === value)?.label
                }}</span>
              </div>
              <span v-else class="text-gray-500">Selecciona un par</span>
            </template>
          </Select>
        </div>

        <!-- Inputs -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div class="relative">
            <label class="block font-semibold mb-1" for="lote"
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
            <label class="block font-semibold mb-1" for="spread"
              >Spread (en pips)</label
            >
            <InputGroup>
              <InputGroupAddon>
                <MoveHorizontal class="w-4 h-4" />
              </InputGroupAddon>
              <InputNumber
                v-model="spread"
                placeholder="0.0"
                :min="0"
                :step="0.1"
                :minFractionDigits="0"
                :maxFractionDigits="2"
                :useGrouping="false"
                locale="en-US"
                class="w-full"
                @focus="setAyuda('spread')"
                @input="setAyuda('spread')"
              />
            </InputGroup>
          </div>
          <div class="relative">
            <label class="block font-semibold mb-1" for="comision"
              >Comisión (USD)</label
            >
            <InputGroup>
              <InputGroupAddon>
                <DollarSign class="w-4 h-4" />
              </InputGroupAddon>
              <InputNumber
                v-model="comision"
                placeholder="0.00"
                :min="0"
                :step="0.01"
                :minFractionDigits="0"
                :maxFractionDigits="2"
                :useGrouping="false"
                locale="en-US"
                class="w-full"
                @focus="setAyuda('comision')"
                @input="setAyuda('comision')"
              />
            </InputGroup>
          </div>
        </div>

        <!-- Botón -->
        <div class="text-center mb-6">
          <Button
            @click="handleClick"
            class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
          >
            <Calculator class="w-5 h-5" />
            Calcular break-even
          </Button>
        </div>

        <!-- Resultados -->
        <div v-if="resultado" class="text-center mb-6">
          <div
            class="inline-flex flex-col items-center justify-center px-6 py-4 rounded-lg bg-green-100 border border-green-300 shadow-md animate-fade-in"
          >
            <div class="flex items-center gap-2 mb-2">
              <CheckCircle class="w-6 h-6 text-green-600" />
              <span class="text-lg font-semibold">Break-even calculado:</span>
            </div>
            <p class="text-3xl text-green-700 font-extrabold tracking-wide">
              {{ resultado.pips.toFixed(2) }} pips
            </p>
          </div>

          <div
            class="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200 animate-fade-in"
          >
            <p class="text-sm text-blue-800 mb-2">Fórmula aplicada:</p>
            <div class="text-center" v-html="calculoHTML"></div>
          </div>

          <div
            class="mt-4 p-4 bg-gray-100 border border-gray-300 rounded text-sm"
          >
            <p>
              Para cubrir el costo operativo de esta operación, el precio debe
              moverse al menos
              <strong>{{ resultado.pips.toFixed(2) }} pips</strong>
              a tu favor. Este valor incluye tanto el spread como la comisión,
              calculados en función del tamaño del lote ingresado.
            </p>
            <p class="mt-2">
              Esto significa que solo a partir de ese punto, cualquier
              movimiento adicional comenzará a generar beneficios.
            </p>
            <p class="mt-2">
              Se debe tener en cuenta que el spread se incrementa cada día y que
              hay días que el spread es mayor.
            </p>
          </div>
        </div>

        <!-- Información del par -->
        <div
          v-if="pair && tradingPairs[pair]"
          class="text-sm bg-blue-50 border border-blue-200 p-4 rounded"
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
