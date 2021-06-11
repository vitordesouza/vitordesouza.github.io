<template>
  <header>
    <div class="header-inner container flex gap-30">
      <g-link class="logo" to="/"><strong>SOUZA</strong></g-link>
      <ul class="nav justify-content-end">
        <li class="nav-item">
          <span class="nav-link pt-1 animate__animated animate__repeat-3 animate__heartBeat animate__slow">
            <ToggleTheme />
          </span>
        </li>
        <li class="nav-item">
          <a class="nav-link active" aria-current="page" href="#">Work</a>
        </li>
        <li class="nav-item">
          <a class="nav-link pr-0" href="#">Blog</a>
        </li>
      </ul>
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