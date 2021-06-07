<template>
  <Layout>
    <main class="container">
      <section class="about-section">
        <g-image class="souza" alt="Souza" src="~/assets/img/souza.jpg" />
        <h3>
          I'm Vitor Souza — A developer based in Portugal. I create websites &
          apps. <br />
          Founder of <a href="https://boomich.com" target="_blank">Boomich</a>.
        </h3>
        <p class="home-links mt-4 mb-4">
          <a href="#"
            >Work</a
          >
          <a
            href="https://github.com/vitordesouza"
            target="_blank"
            rel="noopener"
            >GitHub</a
          >
          <a
            href="https://www.linkedin.com/in/souzavitor/"
            target="_blank"
            rel="noopener"
            >LinkedIn</a
          >
        </p>
      </section>
      <section class="newsletter-section">
        <Newsletter v-on:show:toast="toast" />
      </section>
    </main>
    <template slot="toast">
      <MyToast id="indexToast" :body="toastText" v-show="showToast" />
    </template>
  </Layout>
</template>

<script>
import Newsletter from "~/components/newsletter/Newsletter.vue";
import MyToast from "~/components/toast/Toast.vue";
import { Toast } from "bootstrap/dist/js/bootstrap.esm.min.js";

export default {
  data() {
    return {
      showToast: false,
      toastText: ''
    };
  },
  metaInfo: {
    title: "Hello, world!",
  },
  components: {
    Newsletter,
    MyToast,
  },
  methods: {
    toast(text) {
      this.showToast = true;
      this.toastText = text;
      console.log("here");
      let toastEl = this.$el.querySelector("#indexToast.toast");
      let toast = new Toast(toastEl);
      toast.show();
      toastEl.addEventListener("hidden.bs.toast", function () {
        this.showToast = false;
      });
      console.log(toast);
    },
  },
};
</script>

<style>
.about-section {
  max-width: 800px;
}
.souza {
  margin-bottom: 20px;
  margin-top: 10px;
  width: 100%;
}
.home-links a {
  margin-right: 1rem;
}
</style>
