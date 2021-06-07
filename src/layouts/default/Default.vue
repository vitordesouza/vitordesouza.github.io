<template>
  <div id="app" class="layout">
    <Header />
    <slot></slot>
    <Footer v-on:show:toast="toast" />
  </div>
</template>

<script>
import Header from "../partials/header/Header.vue";
import Footer from "../partials/footer/Footer.vue";


export default {
  props: ["footer", "primary-bg"],
  components: {
    Header,
    Footer
  },
  computed: {
    mainClass() {
      let classes = [];
      if (this.primaryBg) classes.push("main--bg-teritary");
      return classes;
    },
  },
};
</script>

<style lang="scss" src="./Default.scss"/>
