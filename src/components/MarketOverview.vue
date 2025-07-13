<template>
  <div class="flex items-center justify-center px-4 py-8">
    <div class="max-w-7xl w-full">
      <!-- Header Card -->
      <Card class="mb-6">
        <template #content>
          <div class="flex justify-between items-center">
            <h1 class="text-3xl font-bold text-gray-800">
              Estado de los Mercados Globales
            </h1>
            <div
              class="flex items-center gap-3 bg-blue-50 px-4 py-2 rounded-lg border border-blue-200"
            >
              <Clock class="w-5 h-5 text-blue-600" />
              <span class="text-blue-800 font-medium"
                >Hora local: {{ horaClienteActual }}</span
              >
            </div>
          </div>
        </template>
      </Card>

      <!-- Markets Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card
          v-for="mercado in mercados"
          :key="mercado.id"
          class="transition-all duration-300 hover:shadow-lg"
          :class="{
            'ring-2 ring-green-200 bg-green-50': mercado.estaAbierto,
            'ring-2 ring-red-200 bg-red-50': !mercado.estaAbierto,
          }"
        >
          <template #header>
            <div class="p-4 pb-0">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <img
                    :src="mercado.bandera"
                    :alt="mercado.pais"
                    class="w-8 h-6 object-cover rounded shadow-sm"
                  />
                  <h2 class="text-xl font-bold text-gray-800">
                    {{ mercado.nombre }}
                  </h2>
                </div>
                <Badge
                  :value="mercado.estaAbierto ? 'Abierto' : 'Cerrado'"
                  :severity="mercado.estaAbierto ? 'success' : 'danger'"
                  class="text-sm font-semibold"
                />
              </div>
            </div>
          </template>

          <template #content>
            <div class="space-y-4">
              <!-- Hora del mercado -->
              <div class="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <Clock class="w-5 h-5 text-gray-600" />
                <span class="text-gray-700 font-medium">
                  Hora del mercado: {{ mercado.horaMercado }}
                </span>
              </div>

              <!-- Horarios -->
              <div class="space-y-3">
                <div class="flex items-center gap-2 text-gray-600">
                  <Sunrise class="w-5 h-5 text-orange-500" />
                  <div>
                    <span class="font-medium">Apertura:</span>
                    <span class="ml-2">{{ mercado.horaAperturaMercado }}</span>
                    <span class="text-sm text-gray-500 ml-1">
                      ({{ mercado.horaAperturaLocal }} local)
                    </span>
                  </div>
                </div>
                <div class="flex items-center gap-2 text-gray-600">
                  <Sunset class="w-5 h-5 text-purple-500" />
                  <div>
                    <span class="font-medium">Cierre:</span>
                    <span class="ml-2">{{ mercado.horaCierreMercado }}</span>
                    <span class="text-sm text-gray-500 ml-1">
                      ({{ mercado.horaCierreLocal }} local)
                    </span>
                  </div>
                </div>
              </div>

              <!-- Estado del mercado -->
              <div
                v-if="mercado.estaAbierto"
                class="space-y-2 p-3 bg-green-50 rounded-lg border border-green-200"
              >
                <div class="flex items-center gap-2 text-green-700">
                  <Timer class="w-5 h-5" />
                  <span class="font-medium"
                    >Abierto hace: {{ mercado.tiempoTranscurrido }}</span
                  >
                </div>
                <div class="flex items-center gap-2 text-orange-600">
                  <AlarmClock class="w-5 h-5" />
                  <span class="font-medium"
                    >Cierra en: {{ mercado.tiempoRestante }}</span
                  >
                </div>
              </div>

              <div
                v-else
                class="p-3 bg-red-50 rounded-lg border border-red-200"
              >
                <div class="flex items-center gap-2 text-red-700">
                  <Calendar class="w-5 h-5" />
                  <span class="font-medium"
                    >Próxima apertura: {{ mercado.proximaApertura }}</span
                  >
                </div>
              </div>

              <!-- Horario info -->
              <div class="text-center">
                <span
                  class="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full"
                >
                  {{
                    mercado.horarioVerano
                      ? "Horario de Verano"
                      : "Horario Regular"
                  }}
                </span>
              </div>
            </div>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import {
  Clock,
  Sunrise,
  Sunset,
  Timer,
  AlarmClock,
  Calendar,
} from "lucide-vue-next";
import Card from "primevue/card";
import Badge from "primevue/badge";

interface Mercado {
  id: string;
  nombre: string;
  pais: string;
  bandera: string;
  zonaHoraria: string;
  horarioVerano: boolean;
  horarios: {
    regular: {
      apertura: string;
      cierre: string;
    };
  };
  // Campos calculados:
  horaMercado?: string;
  horaAperturaMercado?: string;
  horaCierreMercado?: string;
  horaAperturaLocal?: string;
  horaCierreLocal?: string;
  estaAbierto?: boolean;
  tiempoTranscurrido?: string | null;
  tiempoRestante?: string | null;
  proximaApertura?: string | null;
}

const horaClienteActual = ref("");
const mercados = ref<Mercado[]>([
  {
    id: "nyse",
    nombre: "NYSE",
    pais: "USA",
    bandera: new URL("@/assets/flags/us.svg", import.meta.url).href,
    zonaHoraria: "America/New_York",
    horarioVerano: true,
    horarios: { regular: { apertura: "09:30", cierre: "16:00" } },
  },
  {
    id: "lse",
    nombre: "London Stock Exchange",
    pais: "UK",
    bandera: new URL("@/assets/flags/gb.svg", import.meta.url).href,
    zonaHoraria: "Europe/London",
    horarioVerano: true,
    horarios: { regular: { apertura: "08:00", cierre: "16:30" } },
  },
  {
    id: "tse",
    nombre: "Tokyo Stock Exchange",
    pais: "Japan",
    bandera: new URL("@/assets/flags/jp.svg", import.meta.url).href,
    zonaHoraria: "Asia/Tokyo",
    horarioVerano: false,
    horarios: { regular: { apertura: "09:00", cierre: "15:30" } },
  },
  {
    id: "sse",
    nombre: "Shanghai Stock Exchange",
    pais: "China",
    bandera: new URL("@/assets/flags/cn.svg", import.meta.url).href,
    zonaHoraria: "Asia/Shanghai",
    horarioVerano: false,
    horarios: { regular: { apertura: "09:30", cierre: "15:00" } },
  },
  {
    id: "hkex",
    nombre: "Hong Kong Exchange",
    pais: "Hong Kong",
    bandera: new URL("@/assets/flags/hk.svg", import.meta.url).href,
    zonaHoraria: "Asia/Hong_Kong",
    horarioVerano: false,
    horarios: { regular: { apertura: "09:30", cierre: "16:00" } },
  },
  {
    id: "asx",
    nombre: "Australian Securities Exchange",
    pais: "Australia",
    bandera: new URL("@/assets/flags/au.svg", import.meta.url).href,
    zonaHoraria: "Australia/Sydney",
    horarioVerano: true,
    horarios: { regular: { apertura: "10:00", cierre: "16:00" } },
  },
]);

function convertirHoraMercadoALocal(
  hora: string,
  zonaHorariaMercado: string
): string {
  const [h, m] = hora.split(":").map(Number);
  const fechaMercado = new Date();
  fechaMercado.setHours(h, m, 0, 0);
  // Crear fecha en zona horaria del mercado
  const fechaISO = fechaMercado.toLocaleString("en-US", {
    timeZone: zonaHorariaMercado,
    hour12: false,
  });
  // Convertir a hora local
  const fechaLocal = new Date(fechaISO);
  return fechaLocal.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatearTiempo(minutos: number): string {
  const horas = Math.floor(minutos / 60);
  const mins = minutos % 60;
  return `${horas}h ${mins}m`;
}

function calcularEstadoMercado(
  horaMercado: string,
  horarios: { regular: { apertura: string; cierre: string } },
  zonaHoraria: string
) {
  // Obtener el día de la semana en la zona horaria del mercado
  const fechaMercado = new Date();
  const diaSemana = new Date(
    fechaMercado.toLocaleString("en-US", { timeZone: zonaHoraria })
  ).getDay();

  // Los mercados están cerrados sábados (6) y domingos (0)
  const esFinDeSemana = diaSemana === 0 || diaSemana === 6;

  if (esFinDeSemana) {
    // Calcular próxima apertura (lunes)
    const diasHastaLunes = diaSemana === 0 ? 1 : 2; // Si es domingo, 1 día; si es sábado, 2 días
    const proximaApertura =
      diasHastaLunes === 1
        ? `Lunes ${horarios.regular.apertura}`
        : `Lunes ${horarios.regular.apertura}`;

    return {
      estaAbierto: false,
      tiempoTranscurrido: null,
      tiempoRestante: null,
      proximaApertura,
    };
  }

  const [horaActual, minutosActual] = horaMercado.split(":").map(Number);
  const tiempoActual = horaActual * 60 + minutosActual;
  const [horaApertura, minApertura] = horarios.regular.apertura
    .split(":")
    .map(Number);
  const [horaCierre, minCierre] = horarios.regular.cierre
    .split(":")
    .map(Number);
  const tiempoApertura = horaApertura * 60 + minApertura;
  const tiempoCierre = horaCierre * 60 + minCierre;
  const estaAbierto =
    tiempoActual >= tiempoApertura && tiempoActual < tiempoCierre;

  if (estaAbierto) {
    const transcurrido = tiempoActual - tiempoApertura;
    const restante = tiempoCierre - tiempoActual;
    return {
      estaAbierto: true,
      tiempoTranscurrido: formatearTiempo(transcurrido),
      tiempoRestante: formatearTiempo(restante),
      proximaApertura: null,
    };
  } else {
    let proximaApertura;
    if (tiempoActual < tiempoApertura) {
      proximaApertura = `Hoy ${horarios.regular.apertura}`;
    } else {
      // Si es viernes después del cierre, próxima apertura es lunes
      if (diaSemana === 5) {
        proximaApertura = `Lunes ${horarios.regular.apertura}`;
      } else {
        proximaApertura = `Mañana ${horarios.regular.apertura}`;
      }
    }
    return {
      estaAbierto: false,
      tiempoTranscurrido: null,
      tiempoRestante: null,
      proximaApertura,
    };
  }
}

function actualizarEstadoMercados() {
  const ahora = new Date();
  horaClienteActual.value = ahora.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });
  mercados.value = mercados.value.map((mercado) => {
    const horaMercado = ahora.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: mercado.zonaHoraria,
    });
    const horaAperturaLocal = convertirHoraMercadoALocal(
      mercado.horarios.regular.apertura,
      mercado.zonaHoraria
    );
    const horaCierreLocal = convertirHoraMercadoALocal(
      mercado.horarios.regular.cierre,
      mercado.zonaHoraria
    );
    const estado = calcularEstadoMercado(
      horaMercado,
      mercado.horarios,
      mercado.zonaHoraria
    );
    return {
      ...mercado,
      horaMercado,
      horaAperturaMercado: mercado.horarios.regular.apertura,
      horaCierreMercado: mercado.horarios.regular.cierre,
      horaAperturaLocal,
      horaCierreLocal,
      estaAbierto: estado.estaAbierto,
      tiempoTranscurrido: estado.tiempoTranscurrido,
      tiempoRestante: estado.tiempoRestante,
      proximaApertura: estado.proximaApertura,
    };
  });
}

onMounted(() => {
  actualizarEstadoMercados();
  setInterval(actualizarEstadoMercados, 60000);
});
</script>

<style scoped>
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
