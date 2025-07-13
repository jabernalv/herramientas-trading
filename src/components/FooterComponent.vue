<script setup lang="ts">
import { onMounted, ref } from "vue";

const visitas = ref("...");

onMounted(() => {
  fetch(
    "https://intranet.dirigiendoproyectos.com/contador-visitas.php?type=trading"
  )
    .then((res) => res.json())
    .then((data) => {
      visitas.value = `Visitas: ${data.visitas}`;
    })
    .catch(() => {
      visitas.value = "Visitas: error";
    });
});
</script>

<template>
  <footer
    class="bg-white border-t fixed bottom-0 left-0 w-full z-50 text-sm flex justify-between items-center py-4 px-4 text-gray-600"
  >
    <p class="m-0">Liberado bajo licencia MIT | Jairo Bernal, 2025</p>
    <span class="text-gray-400 text-xs m-0">{{ visitas }}</span>
  </footer>
</template>

<style scoped>
/* Sin wrapper restrictivo, footer 100% flotante y fijo abajo */
footer {
  box-sizing: border-box;
}
</style>
