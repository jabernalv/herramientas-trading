<template>
  <!-- Sistema de notificaciones -->
  <div v-if="notification" class="fixed top-20 right-4 z-50 max-w-sm">
    <div
      :class="{
        'p-4 rounded-lg shadow-lg border flex items-start gap-3 transition-all duration-300': true,
        'bg-red-50 border-red-300 text-red-800': notification.type === 'error',
        'bg-yellow-50 border-yellow-300 text-yellow-800':
          notification.type === 'warning',
        'bg-green-50 border-green-300 text-green-800':
          notification.type === 'success',
      }"
    >
      <div class="flex-shrink-0 mt-0.5">
        <AlertCircle v-if="notification.type === 'error'" class="w-5 h-5" />
        <AlertTriangle v-if="notification.type === 'warning'" class="w-5 h-5" />
        <CheckCircle v-if="notification.type === 'success'" class="w-5 h-5" />
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
            <Select
              v-model="pair"
              :options="pairsOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Selecciona un par"
              class="w-full"
              :class="{ 'border-red-500': errors.pair }"
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
            <p v-if="errors.pair" class="text-red-500 text-xs mt-1">
              {{ errors.pair }}
            </p>
          </div>

          <!-- Selector de dirección -->
          <div class="relative">
            <label class="block font-semibold mb-1"
              >Dirección de la operación</label
            >
            <Select
              v-model="direccion"
              :options="direccionOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Selecciona dirección"
              class="w-full"
              :class="{ 'border-red-500': errors.direccion }"
              @focus="setAyuda('direccion')"
              @change="setAyuda('direccion')"
            >
              <template #option="{ option }">
                <div class="flex items-center gap-2">
                  <MoveVertical class="w-4 h-4" />
                  <span>{{ option.label }}</span>
                </div>
              </template>
              <template #value="{ value }">
                <div v-if="value" class="flex items-center gap-2">
                  <MoveVertical class="w-4 h-4" />
                  <span>{{
                    direccionOptions.find((d) => d.value === value)?.label
                  }}</span>
                </div>
                <span v-else class="text-gray-500">Selecciona dirección</span>
              </template>
            </Select>
            <p v-if="errors.direccion" class="text-red-500 text-xs mt-1">
              {{ errors.direccion }}
            </p>
          </div>
        </div>

        <!-- Inputs -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div class="relative">
            <label class="block font-semibold mb-1">Tamaño del lote</label>
            <InputGroup>
              <InputGroupAddon>
                <Layers class="w-4 h-4" />
              </InputGroupAddon>
              <InputNumber
                v-model="lote"
                placeholder="0.01"
                :min="0.01"
                :max="100"
                :step="0.01"
                :minFractionDigits="0"
                :maxFractionDigits="2"
                :useGrouping="false"
                locale="en-US"
                class="w-full"
                :class="{ 'border-red-500': errors.lote }"
                @focus="setAyuda('lote')"
                @input="setAyuda('lote')"
              />
            </InputGroup>
            <p v-if="errors.lote" class="text-red-500 text-xs mt-1">
              {{ errors.lote }}
            </p>
          </div>

          <div class="relative">
            <label class="block font-semibold mb-1">Precio de entrada</label>
            <InputGroup>
              <InputGroupAddon>
                <ArrowRightCircle class="w-4 h-4" />
              </InputGroupAddon>
              <InputNumber
                v-model="entrada"
                placeholder="0.0000"
                :min="0.0001"
                :step="getPipSize()"
                :minFractionDigits="0"
                :maxFractionDigits="5"
                :useGrouping="false"
                locale="en-US"
                class="w-full"
                :class="{ 'border-red-500': errors.entrada }"
                @focus="setAyuda('entrada')"
                @input="setAyuda('entrada')"
              />
            </InputGroup>
            <p v-if="errors.entrada" class="text-red-500 text-xs mt-1">
              {{ errors.entrada }}
            </p>
          </div>

          <div class="relative">
            <label class="block font-semibold mb-1">Stop loss (precio)</label>
            <InputGroup>
              <InputGroupAddon>
                <ArrowDownCircle class="w-4 h-4" />
              </InputGroupAddon>
              <InputNumber
                v-model="stop"
                placeholder="0.0000"
                :min="0.0001"
                :step="getPipSize()"
                :minFractionDigits="0"
                :maxFractionDigits="5"
                :useGrouping="false"
                locale="en-US"
                class="w-full"
                :class="{ 'border-red-500': errors.stop }"
                @focus="setAyuda('stop')"
                @input="updateStopPips"
              />
            </InputGroup>
            <p v-if="errors.stop" class="text-red-500 text-xs mt-1">
              {{ errors.stop }}
            </p>
          </div>

          <div class="relative">
            <label class="block font-semibold mb-1">Stop loss (pips)</label>
            <InputGroup>
              <InputGroupAddon>
                <MoveHorizontal class="w-4 h-4" />
              </InputGroupAddon>
              <InputNumber
                v-model="stopPips"
                placeholder="0"
                :min="1"
                :step="1"
                :minFractionDigits="0"
                :maxFractionDigits="0"
                :useGrouping="false"
                locale="en-US"
                class="w-full"
                :class="{ 'border-red-500': errors.stopPips }"
                @focus="setAyuda('stopPips')"
                @input="updateStopPrice"
              />
            </InputGroup>
            <p v-if="errors.stopPips" class="text-red-500 text-xs mt-1">
              {{ errors.stopPips }}
            </p>
          </div>

          <div class="relative">
            <label class="block font-semibold mb-1">Take profit (precio)</label>
            <InputGroup>
              <InputGroupAddon>
                <ArrowUpCircle class="w-4 h-4" />
              </InputGroupAddon>
              <InputNumber
                v-model="take"
                placeholder="0.0000"
                :min="0.0001"
                :step="getPipSize()"
                :minFractionDigits="0"
                :maxFractionDigits="5"
                :useGrouping="false"
                locale="en-US"
                class="w-full"
                :class="{ 'border-red-500': errors.take }"
                @focus="setAyuda('take')"
                @input="updateTakePips"
              />
            </InputGroup>
            <p v-if="errors.take" class="text-red-500 text-xs mt-1">
              {{ errors.take }}
            </p>
          </div>

          <div class="relative">
            <label class="block font-semibold mb-1">Take profit (pips)</label>
            <InputGroup>
              <InputGroupAddon>
                <MoveHorizontal class="w-4 h-4" />
              </InputGroupAddon>
              <InputNumber
                v-model="takePips"
                placeholder="0"
                :min="1"
                :step="1"
                :minFractionDigits="0"
                :maxFractionDigits="0"
                :useGrouping="false"
                locale="en-US"
                class="w-full"
                :class="{ 'border-red-500': errors.takePips }"
                @focus="setAyuda('takePips')"
                @input="updateTakePrice"
              />
            </InputGroup>
            <p v-if="errors.takePips" class="text-red-500 text-xs mt-1">
              {{ errors.takePips }}
            </p>
          </div>
        </div>

        <!-- Botones -->
        <div class="text-center mb-6 space-x-4">
          <Button
            @click="handleClick"
            :disabled="!isFormValid"
            class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
          >
            <BarChart3 class="w-5 h-5" />
            Simular riesgo - recompensa
          </Button>
        </div>

        <!-- Resultados -->
        <div v-if="resultado" class="text-center mb-6">
          <div
            class="inline-flex flex-col items-center justify-center px-6 py-4 rounded-lg bg-green-100 border border-green-300 shadow-md animate-fade-in"
          >
            <div class="flex items-center gap-2 mb-2">
              <CheckCircle class="w-6 h-6 text-green-600" />
              <span class="text-lg font-semibold"
                >Relación Riesgo:Recompensa</span
              >
            </div>
            <p class="text-3xl text-green-700 font-extrabold tracking-wide">
              1:{{ resultado.relacion.toFixed(2) }}
            </p>
          </div>
          <div
            class="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200 animate-fade-in"
          >
            <p class="text-sm text-blue-800 mb-2">Fórmula aplicada:</p>
            <div class="text-center" v-html="calculoHTML"></div>
            <div class="mt-3 text-sm text-blue-600">
              <div>Donde:</div>
              <div>Entrada = {{ entrada }}</div>
              <div>Stop Loss = {{ stop }}</div>
              <div>Take Profit = {{ take }}</div>
              <div>Lote = {{ lote }}</div>
              <div>Valor del pip = ${{ tradingPairs[pair].valorPip }}</div>
            </div>
          </div>
          <div
            class="mt-4 p-4 bg-gray-100 border border-gray-300 rounded text-sm"
          >
            <div class="grid grid-cols-2 gap-4">
              <div>
                <strong>Riesgo:</strong>
                <div>{{ resultado.pipsRiesgo.toFixed(2) }} pips</div>
                <div class="text-red-600">
                  ${{ resultado.riesgoUSD.toFixed(2) }}
                </div>
              </div>
              <div>
                <strong>Recompensa:</strong>
                <div>{{ resultado.pipsRecompensa.toFixed(2) }} pips</div>
                <div class="text-green-600">
                  ${{ resultado.gananciaUSD.toFixed(2) }}
                </div>
              </div>
            </div>
            <p class="mt-3 font-medium" :class="resultado.colorClass">
              {{ resultado.recomendacion }}
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

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from "vue";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Globe,
  MoveVertical,
  Layers,
  ArrowRightCircle,
  ArrowDownCircle,
  MoveHorizontal,
  ArrowUpCircle,
  BarChart3,
} from "lucide-vue-next";
import { tradingPairs, type TradingPair } from "@/data/trading-pairs";
import Button from "primevue/button";
import Select from "primevue/select";
import InputNumber from "primevue/inputnumber";
import InputGroup from "primevue/inputgroup";
import InputGroupAddon from "primevue/inputgroupaddon";

interface Notification {
  type: "error" | "warning" | "success";
  title: string;
  message: string;
}

interface Resultado {
  pipsRiesgo: number;
  pipsRecompensa: number;
  riesgoUSD: number;
  gananciaUSD: number;
  relacion: number;
  recomendacion: string;
  colorClass: string;
}

interface Errors {
  pair: string;
  direccion: string;
  lote: string;
  entrada: string;
  stop: string;
  stopPips: string;
  take: string;
  takePips: string;
}

// Reactive data
const pair = ref("");
const direccion = ref("compra");
const lote = ref<number | null>(null);
const entrada = ref<number | null>(null);
const stop = ref<number | null>(null);
const stopPips = ref<number | null>(null);
const take = ref<number | null>(null);
const takePips = ref<number | null>(null);
const resultado = ref<Resultado | null>(null);
const notification = ref<Notification | null>(null);
const ayudaActiva = ref("");

const errors = ref<Errors>({
  pair: "",
  direccion: "",
  lote: "",
  entrada: "",
  stop: "",
  stopPips: "",
  take: "",
  takePips: "",
});

const pairsOptions = computed(() => {
  return Object.entries(tradingPairs).map(
    ([symbol, info]: [string, TradingPair]) => ({
      label: `${symbol} - ${info.nombre}`,
      value: symbol,
    })
  );
});

const direccionOptions = [
  { label: "Compra (Long)", value: "compra" },
  { label: "Venta (Short)", value: "venta" },
];

const ayudas: Record<string, string> = {
  pair: "Selecciona el par de divisas o activo que vas a operar. Cada instrumento tiene diferentes unidades por lote estándar.",
  direccion:
    "Indica si vas a abrir una posición de compra (long) o venta (short).",
  lote: "El tamaño de la posición en lotes. Un lote estándar equivale a 100,000 unidades de la divisa base.",
  entrada: "El precio al que planeas abrir la operación.",
  stop: "El precio donde colocarás tu stop loss. En una compra debe ser menor que la entrada, en una venta debe ser mayor.",
  stopPips:
    "La distancia en pips desde el precio de entrada hasta el stop loss.",
  take: "El precio objetivo donde planeas tomar ganancias. En una compra debe ser mayor que la entrada, en una venta debe ser menor.",
  takePips:
    "La distancia en pips desde el precio de entrada hasta el take profit.",
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
};

// Computed properties
const isFormValid = computed(() => {
  return (
    pair.value &&
    direccion.value &&
    lote.value &&
    lote.value > 0 &&
    entrada.value &&
    entrada.value > 0 &&
    stop.value &&
    stop.value > 0 &&
    take.value &&
    take.value > 0 &&
    !Object.values(errors.value).some((error) => error)
  );
});

const calculoHTML = computed(() => {
  if (!resultado.value) return "";

  const info = tradingPairs[pair.value] as any;
  const pipSize = Math.pow(10, -info.decimales);

  return `\\begin{align*}
    \\text{Riesgo} &= \\frac{|${entrada.value} - ${
    stop.value
  }|}{${pipSize}} = ${resultado.value.pipsRiesgo.toFixed(2)}\\text{ pips} \\\\
    &= ${resultado.value.pipsRiesgo.toFixed(2)} \\times ${
    (info as any).valorPip
  } \\times ${lote.value} = $${resultado.value.riesgoUSD.toFixed(2)} \\\\
    \\text{Recompensa} &= \\frac{|${entrada.value} - ${
    take.value
  }|}{${pipSize}} = ${resultado.value.pipsRecompensa.toFixed(
    2
  )}\\text{ pips} \\\\
    &= ${resultado.value.pipsRecompensa.toFixed(2)} \\times ${
    (info as any).valorPip
  } \\times ${lote.value} = $${resultado.value.gananciaUSD.toFixed(2)} \\\\
    \\text{R:R} &= \\frac{${resultado.value.pipsRecompensa.toFixed(
      2
    )}}{${resultado.value.pipsRiesgo.toFixed(
    2
  )}} = 1:${resultado.value.relacion.toFixed(2)}
  \\end{align*}`;
});

// Methods
function setAyuda(id: string) {
  ayudaActiva.value = id;
}

function showNotification(
  type: "error" | "warning" | "success",
  title: string,
  message: string,
  duration = 5000
) {
  notification.value = { type, title, message };
  setTimeout(() => (notification.value = null), duration);
}

function getPipSize(): number {
  if (!pair.value || !tradingPairs[pair.value]) return 0.0001;
  return Math.pow(10, -tradingPairs[pair.value].decimales);
}

function roundToPrecision(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

function validateField(field: keyof Errors) {
  // Limpiar el error específico
  errors.value[field] = "";

  switch (field) {
    case "pair":
      if (!pair.value) {
        errors.value.pair = "Selecciona un par";
      }
      break;

    case "direccion":
      if (!direccion.value) {
        errors.value.direccion = "Selecciona una dirección";
      }
      break;

    case "lote":
      if (!lote.value || lote.value <= 0 || lote.value > 100) {
        errors.value.lote = "El lote debe estar entre 0.01 y 100";
      }
      break;

    case "entrada":
      if (!entrada.value || entrada.value <= 0) {
        errors.value.entrada = "El precio de entrada debe ser mayor a 0";
      }
      break;

    case "stop":
      if (!stop.value || stop.value <= 0) {
        errors.value.stop = "El stop loss debe ser mayor a 0";
      } else if (entrada.value) {
        // Solo validar si hay precio de entrada
        if (direccion.value === "compra" && stop.value >= entrada.value) {
          errors.value.stop =
            "En una compra, el stop loss debe estar por debajo del precio de entrada";
          showNotification(
            "error",
            "Error en Stop Loss",
            "En una operación de compra, el stop loss debe estar por debajo del precio de entrada"
          );
        } else if (direccion.value === "venta" && stop.value <= entrada.value) {
          errors.value.stop =
            "En una venta, el stop loss debe estar por encima del precio de entrada";
          showNotification(
            "error",
            "Error en Stop Loss",
            "En una operación de venta, el stop loss debe estar por encima del precio de entrada"
          );
        }
      }
      break;

    case "take":
      if (!take.value || take.value <= 0) {
        errors.value.take = "El take profit debe ser mayor a 0";
      } else if (entrada.value) {
        // Solo validar si hay precio de entrada
        if (direccion.value === "compra" && take.value <= entrada.value) {
          errors.value.take =
            "En una compra, el take profit debe estar por encima del precio de entrada";
          showNotification(
            "error",
            "Error en Take Profit",
            "En una operación de compra, el take profit debe estar por encima del precio de entrada"
          );
        } else if (direccion.value === "venta" && take.value >= entrada.value) {
          errors.value.take =
            "En una venta, el take profit debe estar por debajo del precio de entrada";
          showNotification(
            "error",
            "Error en Take Profit",
            "En una operación de venta, el take profit debe estar por debajo del precio de entrada"
          );
        }
      }
      break;

    case "stopPips":
      if (!stopPips.value || stopPips.value <= 0) {
        errors.value.stopPips = "Los pips deben ser mayores a 0";
      }
      break;

    case "takePips":
      if (!takePips.value || takePips.value <= 0) {
        errors.value.takePips = "Los pips deben ser mayores a 0";
      }
      break;
  }

  // Validar campos relacionados cuando cambia la dirección o el precio de entrada
  if (field === "direccion" || field === "entrada") {
    if (stop.value) validateField("stop");
    if (take.value) validateField("take");
  }
}

function validateInputs(): boolean {
  // Validar todos los campos
  validateField("pair");
  validateField("direccion");
  validateField("lote");
  validateField("entrada");
  validateField("stop");
  validateField("take");

  // Retornar true si no hay errores
  return !Object.values(errors.value).some((error) => error);
}

function handleClick() {
  if (!validateInputs()) return;
  simular();
  showNotification(
    "success",
    "Simulación exitosa",
    "La relación riesgo:recompensa se ha calculado correctamente."
  );

  // Renderizar MathJax después del cálculo
  nextTick(() => {
    if (window.MathJax) {
      window.MathJax.typeset();
    }
  });
}

function simular() {
  if (validateInputs()) {
    const info = tradingPairs[pair.value];
    const pipSize = Math.pow(10, -info.decimales);

    // Calcular pips de riesgo y recompensa
    const pipsRiesgo = Math.abs(entrada.value! - stop.value!) / pipSize;
    const pipsRecompensa = Math.abs(entrada.value! - take.value!) / pipSize;

    // Calcular valores en USD
    const riesgoUSD = pipsRiesgo * info.valorPip * lote.value!;
    const gananciaUSD = pipsRecompensa * info.valorPip * lote.value!;

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

    resultado.value = {
      pipsRiesgo,
      pipsRecompensa,
      riesgoUSD,
      gananciaUSD,
      relacion,
      recomendacion,
      colorClass,
    };

    setAyuda("result");
    localStorage.setItem(
      "simulador_lastResultado",
      JSON.stringify(resultado.value)
    );
  }
}

function updateStopPips() {
  if (entrada.value && stop.value && pair.value) {
    const pipSize = getPipSize();
    stopPips.value = Math.abs(
      Math.round((entrada.value - stop.value) / pipSize)
    );
  }
}

function updateStopPrice() {
  if (entrada.value && stopPips.value != null && pair.value) {
    const pipSize = getPipSize();
    const pipsValue = stopPips.value * pipSize;
    const decimals = (tradingPairs[pair.value] as any).decimales;
    stop.value = roundToPrecision(
      direccion.value === "compra"
        ? entrada.value - pipsValue
        : entrada.value + pipsValue,
      decimals
    );
    validateField("stop");
  }
}

function updateTakePips() {
  if (entrada.value && take.value && pair.value) {
    const pipSize = getPipSize();
    takePips.value = Math.abs(
      Math.round((take.value - entrada.value) / pipSize)
    );
  }
}

function updateTakePrice() {
  if (entrada.value && takePips.value != null && pair.value) {
    const pipSize = getPipSize();
    const pipsValue = takePips.value * pipSize;
    const decimals = tradingPairs[pair.value].decimales;
    take.value = roundToPrecision(
      direccion.value === "compra"
        ? entrada.value + pipsValue
        : entrada.value - pipsValue,
      decimals
    );
    validateField("take");
  }
}

// Watchers
watch(pair, (newVal) => {
  localStorage.setItem("simulador_lastPair", newVal || "");
});

watch(direccion, (newVal) => {
  // Cuando cambia la dirección, actualizar los precios basados en los pips
  if (stopPips.value) updateStopPrice();
  if (takePips.value) updateTakePrice();
  localStorage.setItem("simulador_lastDireccion", newVal || "");
});

watch(lote, (newVal) => {
  localStorage.setItem("simulador_lastLote", newVal?.toString() || "");
});

watch(entrada, (newVal) => {
  // Cuando cambia la entrada, actualizar los precios basados en los pips
  if (stopPips.value) updateStopPrice();
  if (takePips.value) updateTakePrice();
  localStorage.setItem("simulador_lastEntrada", newVal?.toString() || "");
});

watch(stop, (newVal) => {
  localStorage.setItem("simulador_lastStop", newVal?.toString() || "");
});

watch(take, (newVal) => {
  localStorage.setItem("simulador_lastTake", newVal?.toString() || "");
});

watch(stopPips, (newVal) => {
  localStorage.setItem("simulador_lastStopPips", newVal?.toString() || "");
});

watch(takePips, (newVal) => {
  localStorage.setItem("simulador_lastTakePips", newVal?.toString() || "");
});

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

// Lifecycle
onMounted(() => {
  // Cargar valores guardados sin mostrar notificación
  const lastPair = localStorage.getItem("simulador_lastPair");
  const lastDireccion = localStorage.getItem("simulador_lastDireccion");
  const lastLote = localStorage.getItem("simulador_lastLote");
  const lastEntrada = localStorage.getItem("simulador_lastEntrada");
  const lastStop = localStorage.getItem("simulador_lastStop");
  const lastTake = localStorage.getItem("simulador_lastTake");
  const lastResultado = localStorage.getItem("simulador_lastResultado");
  const lastStopPips = localStorage.getItem("simulador_lastStopPips");
  const lastTakePips = localStorage.getItem("simulador_lastTakePips");

  if (lastPair) pair.value = lastPair;
  if (lastDireccion) direccion.value = lastDireccion;
  if (lastLote) lote.value = Number(lastLote);
  if (lastEntrada) entrada.value = Number(lastEntrada);
  if (lastStop) stop.value = Number(lastStop);
  if (lastTake) take.value = Number(lastTake);
  if (lastResultado) resultado.value = JSON.parse(lastResultado);
  if (lastStopPips) stopPips.value = Number(lastStopPips);
  if (lastTakePips) takePips.value = Number(lastTakePips);

  // Mostrar ayuda por defecto
  ayudaActiva.value = "result";

  // MathJax typeset después del montaje
  nextTick(() => {
    if (window.MathJax) {
      window.MathJax.typeset();
    }
  });
});
</script>

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
