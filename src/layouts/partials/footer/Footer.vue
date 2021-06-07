<template>
  <footer class="container">
    <!-- <h6>Subscribe</h6> -->
    <!-- <Newsletter v-on:show:toast="toast" /> -->
    <div class="copyright mt-3">
      <small>© 2021 Vitor Souza. All Rights Reserved.</small>
    </div>
  </footer>
</template>


<script>
import Newsletter from '~/components/newsletter/Newsletter.vue'

export default {
  components: {
    Newsletter
  },
  methods: {
    toast() {
      this.$emit('show:toast', 'signup');
    }
  }
};
</script>

<style lang="scss" src="./Footer.scss" />