<template>
  <div>
    <form @submit.prevent="subscribe">
      <div class="d-flex flex-column flex-md-row gap-2">
        <input
          v-model="email"
          type="email"
          name="email"
          required
          class="form-control"
          placeholder="Enter your email address"
          aria-describedby="emailHelp"
        />
        <button class="btn btn-primary">
          Join the Newsletter
          <span
            v-show="loading"
            class="spinner-grow spinner-grow-sm"
            role="status"
            aria-hidden="true"
          ></span>
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Newsletter",
  data() {
    return {
      email: "",
      loading: false,
    };
  },
  methods: {
    async subscribe() {
      this.loading = true;
      try {
        const response = await axios.post(
          "https://usebasin.com/f/bcf9ffcdd215.json",
          {
            email: this.email,
          }
        );
        if (200 === response.status) {
          this.loading = false;
          this.$emit('show:toast', 'Thank you for signing up!');
        }
      } catch (err) {
        console.error(err);
      }
    },
  },
};
</script>

<style lang="scss">
.btn {
  white-space: nowrap;
}
form {
  max-width: 600px;
}
</style>