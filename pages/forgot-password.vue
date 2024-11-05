<template>
  <v-container class="m-auto mt-10">
    <v-row>
      <v-col
        class="col-1 hidden-xs"
        cols="6"
        d-none
        md="6"
        sm="12"
        lg="6"
        xl="6"
      >
        <div id="image">
          <v-img class="image" src="/public/undraw_safe_re_kiil.svg"></v-img>
        </div>
      </v-col>
      <v-col
        class="col-2 d-flex flex-column align-center justify-center"
        cols="12"
        md="6"
        xs=""
        sm="12"
        lg="6"
        xl="6"
      >
        <div class="forgot_page m-auto pa-5">
          <p class="heading mb-6">
            Forgot <br />
            Your Password
          </p>
          <v-form ref="form" v-model="valid" lazy-validation class="form">
            <v-text-field
              class=""
              variant="outlined"
              v-model="email"
              :rules="emailRules"
              label="Email Address"
              required
            ></v-text-field>

            <v-btn class="button bg-primary" @click="submit"
              >forgot password</v-btn
            >
            <router-link
              to="/"
              class="text-decoration-none text-primary mt-5 text-center"
              >back to sign</router-link
            >
            <!-- <v-card>back to sign</v-card> -->
          </v-form>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {};
</script>

<style lang="scss">
.col-1 {
  height: 80vh;
  background-color: white;
  display: flex;
}
#image {
  z-index: 9;
  width: 100%;
  display: flex;
  justify-content: center;
}
@media screen and (max-width: 700px) {
  .col-1 {
    height: 100vh;
  }
}
@media screen and (max-width: 1025px) {
  .col-1 {
    height: 40vh;
  }
}
.col-2 {
  background-color: white;
}
@media screen and (max-width: 600px) {
  .col-2 {
    height: 80vh;
  }
}
.form {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.heading {
  font-size: xx-large;
  font-weight: 400;
}
.button {
  width: 100%;
  color: white;
}
</style>