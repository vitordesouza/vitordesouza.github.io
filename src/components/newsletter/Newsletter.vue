<template>
  <div>
    <form @submit.prevent="subscribe">
      <div class="d-flex flex-column flex-md-row">
        <input
          v-model="email"
          type="email"
          name="email"
          required
          class="form-control mb-2"
          placeholder="Enter your email address"
          aria-describedby="emailHelp"
        />
        <button class="btn btn-primary ml-md-2 mb-2">
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
          this.$bvToast.toast("Succesfully signed up!", {
            toaster: "b-toaster-bottom-right",
            title: "Thank You!",
            solid: true,
            variant: "primary",
          });
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