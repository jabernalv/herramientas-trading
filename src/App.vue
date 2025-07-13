<script setup lang="ts">
import NavHeader from "@/components/NavHeader.vue";
import FooterComponent from "@/components/FooterComponent.vue";
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <NavHeader />
    <div class="h-16"></div>
    <router-view />
    <FooterComponent />
  </div>
</template>

<style scoped>
/* Sin estilos de centrado ni max-width */
</style>
