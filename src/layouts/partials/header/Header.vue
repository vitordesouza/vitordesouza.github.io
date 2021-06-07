<template>
  <header>
    <div class="header-inner container flex gap-30">
      <ToggleTheme />
      <g-link class="logo" to="/"><strong>{{ $static.metadata.siteName }}</strong></g-link>
    </div>
  </header>
</template>

<static-query>
query {
  metadata {
    siteName
  }
}
</static-query>

<script>
import ToggleTheme from "@/components/toggleTheme/ToggleTheme.vue";

export default {
  components: {
    ToggleTheme
  },
};
</script>

<style lang="scss" src="./Header.scss" />