<template>
  <VitePwaManifest />
  <NuxtPage />
</template>

<script setup>
import logo from "@/assets/images/logo.png";

useHead({
  title: "PersonaAI",
  link: [{ rel: "icon", type: "image/png", href: logo }],
});
</script>
