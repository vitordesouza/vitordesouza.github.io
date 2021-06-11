<template>
  <Layout>
    <main class="container">
      <section class="about-section">
        <g-image class="souza" alt="Souza" src="~/assets/img/souza.jpg" />
        <h3>
          I'm Vitor Souza — A developer based in Portugal. I create websites &
          apps. 
          <!-- <br /> -->
          <!-- Founder of <a href="https://boomich.com" target="_blank">Boomich</a>. -->
        </h3>
        <p class="home-links mt-4 mb-4">
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
          <a
            href="mailto:contatovitorsouza@gmail.com"
            >Email</a
          >
        </p>
      </section>
      <section class="newsletter-section">
        <Newsletter class="mb-5" />
      </section>
    </main>
  </Layout>
</template>

<script>
import Newsletter from "~/components/newsletter/Newsletter.vue";

export default {
  metaInfo: {
    title: "Home",
  },
  components: {
    Newsletter
  }
};
</script>

<style>
.about-section {
  max-width: 800px;
}
.souza {
  margin-bottom: 20px;
  width: 100%;
}
.home-links a {
  margin-right: 1rem;
}
</style>
