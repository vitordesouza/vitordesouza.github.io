<template>
  <div id="app" class="layout">
    <ToastContainer>
      <MyToast id="defaultToast" :body="toastText" v-show="showToast" />
      <slot name="toast"></slot>
    </ToastContainer>
    <Header />
    <slot></slot>
    <Footer v-on:show:toast="toast" />
  </div>
</template>

<script>
import Header from "../partials/header/Header.vue";
import Footer from "../partials/footer/Footer.vue";
import ToastContainer from "~/components/toastContainer/ToastContainer.vue";
import MyToast from "~/components/toast/Toast.vue";
import { Toast } from "bootstrap/dist/js/bootstrap.esm.min.js";

export default {
  props: ["footer", "primary-bg"],
  data() {
    return {
      showToast: false,
      toastText: ''
    };
  },
  components: {
    Header,
    Footer,
    ToastContainer,
    MyToast,
  },
  methods: {
    toast(text) {
      this.toastText = text;
      this.showToast = true;
      let toastEl = this.$el.querySelector("#defaultToast.toast");
      let toast = new Toast(toastEl);
      toast.show();
      toastEl.addEventListener("hidden.bs.toast", function () {
        this.showToast = false;
      });
      console.log(toast);
    },
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
