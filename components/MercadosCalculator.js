const MercadosCalculator = {
  template: `
    <div class="flex items-center justify-center px-4 py-8">
      <div class="bg-white shadow-md rounded p-6 max-w-7xl w-full">
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-2xl font-bold text-center">
            Estado de los Mercados Globales
          </h1>
          <div class="text-gray-600 flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg">
            <i data-lucide="clock" class="w-5 h-5"></i>
            <span>Hora local: {{ horaClienteActual }}</span>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <!-- Tarjeta de mercado -->
          <div v-for="mercado in mercados" :key="mercado.id" 
            class="border rounded-lg p-4 shadow-sm"
            :class="{
              'bg-green-50 border-green-200': mercado.estaAbierto,
              'bg-red-50 border-red-200': !mercado.estaAbierto
            }"
          >
            <div class="flex items-center justify-between mb-2">
              <h2 class="text-lg font-semibold flex items-center gap-2">
                <img :src="mercado.bandera" :alt="mercado.pais" class="w-6 h-4 object-cover rounded">
                {{ mercado.nombre }}
              </h2>
              <span 
                class="px-2 py-1 rounded text-sm font-medium"
                :class="{
                  'bg-green-100 text-green-800': mercado.estaAbierto,
                  'bg-red-100 text-red-800': !mercado.estaAbierto
                }"
              >
                {{ mercado.estaAbierto ? 'Abierto' : 'Cerrado' }}
              </span>
            </div>

            <div class="text-sm space-y-2">
              <div class="flex items-center gap-1 text-gray-600">
                <i data-lucide="clock" class="w-4 h-4"></i>
                <span>Hora del mercado: {{ mercado.horaMercado }}</span>
              </div>
              
              <div class="border-t pt-2 space-y-1">
                <div class="flex items-center gap-1 text-gray-600">
                  <i data-lucide="sunrise" class="w-4 h-4"></i>
                  <span>Apertura: {{ mercado.horaAperturaMercado }} ({{ mercado.horaAperturaLocal }} hora local)</span>
                </div>
                <div class="flex items-center gap-1 text-gray-600">
                  <i data-lucide="sunset" class="w-4 h-4"></i>
                  <span>Cierre: {{ mercado.horaCierreMercado }} ({{ mercado.horaCierreLocal }} hora local)</span>
                </div>
              </div>
              
              <template v-if="mercado.estaAbierto">
                <div class="border-t pt-2 space-y-1">
                  <p class="text-green-600 flex items-center gap-1">
                    <i data-lucide="timer" class="w-4 h-4"></i>
                    Abierto hace: {{ mercado.tiempoTranscurrido }}
                  </p>
                  <p class="text-orange-600 flex items-center gap-1">
                    <i data-lucide="alarm-clock" class="w-4 h-4"></i>
                    Cierra en: {{ mercado.tiempoRestante }}
                  </p>
                </div>
              </template>
              <template v-else>
                <div class="border-t pt-2">
                  <p class="text-gray-600 flex items-center gap-1">
                    <i data-lucide="calendar" class="w-4 h-4"></i>
                    Próxima apertura: {{ mercado.proximaApertura }}
                  </p>
                </div>
              </template>

              <div class="text-xs text-gray-500 border-t pt-2">
                <p>{{ mercado.horarioVerano ? '(Horario de Verano)' : '(Horario Regular)' }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      horaClienteActual: "",
      mercados: [
        {
          id: "nyse",
          nombre: "NYSE",
          pais: "USA",
          bandera: "assets/flags/us.svg",
          zonaHoraria: "America/New_York",
          horarioVerano: true,
          horarios: {
            regular: {
              apertura: "09:30",
              cierre: "16:00",
            },
          },
        },
        {
          id: "lse",
          nombre: "London Stock Exchange",
          pais: "UK",
          bandera: "assets/flags/gb.svg",
          zonaHoraria: "Europe/London",
          horarioVerano: true,
          horarios: {
            regular: {
              apertura: "08:00",
              cierre: "16:30",
            },
          },
        },
        {
          id: "tse",
          nombre: "Tokyo Stock Exchange",
          pais: "Japan",
          bandera: "assets/flags/jp.svg",
          zonaHoraria: "Asia/Tokyo",
          horarioVerano: false,
          horarios: {
            regular: {
              apertura: "09:00",
              cierre: "15:30",
            },
          },
        },
        {
          id: "sse",
          nombre: "Shanghai Stock Exchange",
          pais: "China",
          bandera: "assets/flags/cn.svg",
          zonaHoraria: "Asia/Shanghai",
          horarioVerano: false,
          horarios: {
            regular: {
              apertura: "09:30",
              cierre: "15:00",
            },
          },
        },
        {
          id: "hkex",
          nombre: "Hong Kong Exchange",
          pais: "Hong Kong",
          bandera: "assets/flags/hk.svg",
          zonaHoraria: "Asia/Hong_Kong",
          horarioVerano: false,
          horarios: {
            regular: {
              apertura: "09:30",
              cierre: "16:00",
            },
          },
        },
        {
          id: "asx",
          nombre: "Australian Securities Exchange",
          pais: "Australia",
          bandera: "assets/flags/au.svg",
          zonaHoraria: "Australia/Sydney",
          horarioVerano: true,
          horarios: {
            regular: {
              apertura: "10:00",
              cierre: "16:00",
            },
          },
        },
      ],
    };
  },
  methods: {
    actualizarEstadoMercados() {
      const ahora = new Date();

      // Actualizar hora local del cliente
      this.horaClienteActual = ahora.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      });

      this.mercados = this.mercados.map((mercado) => {
        // Obtener la hora actual en la zona horaria del mercado
        const horaMercado = ahora.toLocaleTimeString("es-ES", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: mercado.zonaHoraria,
        });

        // Convertir horarios del mercado a hora local
        const horaAperturaLocal = this.convertirHoraMercadoALocal(
          mercado.horarios.regular.apertura,
          mercado.zonaHoraria
        );

        const horaCierreLocal = this.convertirHoraMercadoALocal(
          mercado.horarios.regular.cierre,
          mercado.zonaHoraria
        );

        const estado = this.calcularEstadoMercado(
          horaMercado,
          mercado.horarios
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
    },
    convertirHoraMercadoALocal(hora, zonaHorariaMercado) {
      const [h, m] = hora.split(":").map(Number);
      const fechaMercado = new Date();
      fechaMercado.setHours(h, m, 0);

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
    },
    calcularEstadoMercado(horaMercado, horarios) {
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
          tiempoTranscurrido: this.formatearTiempo(transcurrido),
          tiempoRestante: this.formatearTiempo(restante),
          proximaApertura: null,
        };
      } else {
        let proximaApertura;
        if (tiempoActual < tiempoApertura) {
          proximaApertura = "Hoy " + horarios.regular.apertura;
        } else {
          proximaApertura = "Mañana " + horarios.regular.apertura;
        }

        return {
          estaAbierto: false,
          tiempoTranscurrido: null,
          tiempoRestante: null,
          proximaApertura,
        };
      }
    },
    formatearTiempo(minutos) {
      const horas = Math.floor(minutos / 60);
      const mins = minutos % 60;
      return `${horas}h ${mins}m`;
    },
    iniciarActualizacionAutomatica() {
      this.actualizarEstadoMercados();
      // Actualizar cada minuto
      setInterval(this.actualizarEstadoMercados, 60000);
    },
  },
  mounted() {
    this.iniciarActualizacionAutomatica();
    lucide.createIcons();
  },
};

// Exportar el componente
if (typeof exports !== "undefined") {
  exports.MercadosCalculator = MercadosCalculator;
} else {
  window.MercadosCalculator = MercadosCalculator;
}
