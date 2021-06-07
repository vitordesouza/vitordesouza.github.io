<template>
  <header>
    <div class="header-inner container flex gap-30">
      <ToggleTheme />
      <g-link class="logo" to="/"><strong>SOUZA</strong></g-link>
    </div>
  </header>
</template>

<script>
import ToggleTheme from "@/components/toggleTheme/ToggleTheme.vue";

export default {
  components: {
    ToggleTheme
  },
};
</script>

<style lang="scss" src="./Header.scss" />