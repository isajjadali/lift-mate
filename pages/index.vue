<template>
  <div class="parent d-flex align-center justify-center">
    <v-row class="h-100 w-100">
      <v-col
        cols="12"
        sm="12"
        md="12"
        lg="6"
        class="left-container d-flex align-center justify-center pa-0"
        :class="{ moveRight: onBackChange }"
      >
        <div class="form1 w-75 h-100">
          <div
            class="signIn h-100 w-100 d-flex flex-column align-center justify-center"
            v-if="!toggle"
          >
            <h1
              class="heading-cnt font-weight-medium text-center text-h4 text-sm-h3 text-md-h3 text-xs-h4 my-4"
            >
              Sign In
            </h1>

            <div
              class="w-100 d-flex flex-wrap align-center justify-center my-3"
            >
              <v-btn
                variant="outlined"
                height="40"
                min-width="40"
                class="ma-2 pa-3 rounded-lg"
                stacked
              >
                <v-img
                  src="/public/google-icon.svg"
                  width="24"
                  height="24"
                  contain
                />
              </v-btn>

              <v-btn
                variant="outlined"
                height="40"
                min-width="40"
                class="ma-2 pa-3 rounded-lg"
                stacked
              >
                <v-img
                  src="/public/linkedin-icon.svg"
                  width="24"
                  height="24"
                  contain
                >
                </v-img>
              </v-btn>
            </div>
            <p class="w-100 text-center text-primary mb-4">
              or use your email password
            </p>

            <v-form ref="form" class="formm w-100">
              <div class="">
                <v-text-field
                  v-model="email"
                  label="Email"
                  placeholder="Your email"
                  :rules="emailRules"
                  required
                  type="input"
                  variant="outlined"
                ></v-text-field>
              </div>

              <div class="">
                <v-text-field
                  v-model="password"
                  label="Password"
                  placeholder="Enter Your Password"
                  :rules="passwordRules"
                  type="password"
                  required
                  variant="outlined"
                ></v-text-field>
              </div>
              <div class="d-flex align-center justify-center">
                <router-link
                  class="text-decoration-none text-primary"
                  to="/forgot-password"
                  >Forgot Your Pasword?</router-link
                >
              </div>

              <div
                class="hidden-lg-and-up mt-5"
                style="display: flex; justify-content: center"
              >
                <v-btn
                  class="hiddenBtn text-primary"
                  @click="toggleHandler"
                  variant="text"
                  >Don't have account, Register</v-btn
                >
              </div>

              <div
                class="d-flex flex-column align-center justify-space-between mt-5"
              >
                <v-btn
                  class="rounded-lg"
                  color="primary"
                  size="large"
                  width="35%"
                  min-height="50"
                  @click="submit"
                  >SIGN IN</v-btn
                >
              </div>
            </v-form>
          </div>

          <div
            class="signUp w-100 h-100 d-flex flex-column align-center justify-center"
            v-if="toggle"
          >
            <div
              class="heading-cnt font-weight-medium text-center text-h4 text-sm-h3 text-md-h3 text-xs-h4"
            >
              Create Account
            </div>
            <div class="d-flex align-center justify-center w-100 my-3">
              <v-btn
                class="ma-2 pa-3 rounded-lg"
                variant="outlined"
                height="40"
                min-width="40"
                stacked
              >
                <v-img
                  src="/public/google-icon.svg"
                  width="24"
                  height="24"
                  stacked
                >
                </v-img>
              </v-btn>
              <v-btn
                class="ma-2 pa-3 rounded-lg"
                variant="outlined"
                stacked
                height="40"
                min-width="40"
              >
                <v-img
                  src="/public/linkedin-icon.svg"
                  width="24"
                  height="24"
                  stacked
                >
                </v-img>
              </v-btn>
            </div>
            <div
              class="w-100 d-flex align-center justify-center my-4 text-primary"
            >
              or use your email for registration
            </div>
            <v-form class="w-100">
              <div class="w-100">
                <v-text-field
                  v-model="name"
                  label="Name"
                  placeholder="Your name"
                  type="input"
                  required
                  variant="outlined"
                ></v-text-field>
              </div>
              <div class="w-100">
                <v-text-field
                  v-model="email"
                  label="Email"
                  placeholder="Your email"
                  type="email"
                  required
                  variant="outlined"
                ></v-text-field>
              </div>
              <div class="w-100">
                <v-text-field
                  v-model="password"
                  label="Password"
                  placeholder="Enter password"
                  type="password"
                  required
                  variant="outlined"
                ></v-text-field>
              </div>

              <div
                class="hidden-lg-and-up mb-3"
                style="display: flex; justify-content: center"
              >
                <v-btn
                  class="hiddenBtn text-primary"
                  @click="toggleHandler"
                  variant="text"
                  >Already have an account signin</v-btn
                >
              </div>
              <div class="d-flex align-center justify-center">
                <v-btn
                  class="rounded-lg"
                  color="primary"
                  width="35%"
                  height="50"
                  >SIGN UP</v-btn
                >
              </div>
            </v-form>
          </div>
        </div>
      </v-col>

      <v-col
        cols="12"
        sm="12"
        md="12"
        lg="6"
        class="hidden-md-and-down"
        id="button"
        :class="{ moveLeft: isOnButtonClicked }"
      >
        <div
          class="signUp-button-container bg-primary d-flex flex-column align-center justify-center w-100 h-100"
          v-if="!toggle"
        >
          <h1
            class="heaidng-one text-white pa-4"
            :class="{ 'animation-right': isAnimating }"
          >
            Welcome Back!
          </h1>
          <p
            class="text-one text-center text-white pa-4"
            :class="{ 'animation-right': isAnimating }"
          >
            Enter your personal details to use all of site <br />
            feature
          </p>
          <v-btn
            @click="
              handleClick();
              toggleHandler();
            "
            width="200"
            elevation="3"
            height="40"
            class="btn3 rounded-lg mt-4"
            :class="{ 'animation-right': isAnimating }"
            variant="outlined"
            color="white"
            >SIGN UP</v-btn
          >
        </div>

        <div
          class="signIn-button-container bg-primary w-100 h-100 d-flex flex-column align-center justify-center"
          v-if="toggle"
        >
          <h1
            class="text-white pa-4"
            :class="{ 'animation-left': isAnimating }"
          >
            Hello Friends!
          </h1>

          <p
            class="text-center text-white pa-4"
            :class="{ 'animation-left': isAnimating }"
          >
            Register With your personal details to use all <br />of site feature
          </p>
          <v-btn
            @click="
              handleClick();
              toggleHandler();
              animationHandler();
            "
            class="rounded-lg mt-4"
            :class="{ 'animation-left': isAnimating }"
            variant="outlined"
            color="white"
            width="200"
            height="40"
            >SING IN</v-btn
          >
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
definePageMeta({
  hideLayout: true,
});

export default {
  data() {
    return {
      isOnButtonClicked: false,
      onBackChange: false,
      toggle: false,
      isAnimating: false,
    };
  },
  methods: {
    handleClick() {
      this.onBackChange = !this.onBackChange;
      this.isOnButtonClicked = !this.isOnButtonClicked;
      setTimeout(() => {}, 1000);
    },
    toggleHandler() {
      this.toggle = !this.toggle;
    },
    animationHandler() {
      this.isAnimating = true;
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap");

.parent {
  font-family: "Montserrat", sans-serif;
  width: 100vw;
  height: 100vh;
  position: relative;
}
.left-container {
  width: 100%;
  position: relative;
  transition: transform 0.6s, backgorund-color 0.5s;
}
.moveRight {
  transform: translateX(50vw);
}
#button {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.6s, background-color 0.5s;
  padding: 0;
  position: relative;
}
.moveLeft {
  transform: translateX(-50vw);
}
.signIn {
  position: relative;
}
.signUp {
  position: relative;
}
.signUp-button-container {
  border-radius: 12em 0px 0px 8em;
  position: absolute;
}
.signIn-button-container {
  border-radius: 0px 12em 8em 0px;
  position: absolute;
}
@keyframes slideInRight {
  from {
    transform: translateX(300px);
    opacity: 0;
  }
  to {
    transform: translateX(0px);
    opacity: 1;
  }
}
.animation-right {
  animation: slideInRight 1s ease-in-out;
}
@keyframes slideInLeft {
  from {
    transform: translateX(-300px);
    opacity: 0;
  }
  to {
    transform: translateX(0px);
    opacity: 1;
  }
}
.animation-left {
  animation: slideInLeft 1s ease-in-out;
}
.hiddenBtn {
  font-family: "Montserrat", sans-serif;
}
</style>
