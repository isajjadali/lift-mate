<template>
  <div class="parent d-flex align-center justify-center">
    <v-row class="h-100 w-100">
      <v-col
        cols="12"
        sm="12"
        md="12"
        lg="6"
        class="left-container d-flex align-center justify-center pa-0"
        :class="{ moveRight: isbckChange }"
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
                  @click="onLogin"
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
              <!-- <v-btn class="ma-2 pa-3 rounded-lg" variant="outlined" prepend-icon="mdi-facebook" stacked
                              height="40" min-width="40"></v-btn>
                          <v-btn class="ma-2 pa-3 rounded-lg " variant="outlined" prepend-icon="mdi-github" stacked
                              height="40" min-width="40"></v-btn> -->
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
                  v-model="firstName"
                  label="First Name"
                  placeholder="Enter your First Name"
                  type="input"
                  required
                  variant="outlined"
                ></v-text-field>
              </div>
              <div class="w-100">
                <v-text-field
                  v-model="lastName"
                  label="Last Name"
                  placeholder="Enter your Last Name"
                  type="input"
                  required
                  variant="outlined"
                ></v-text-field>
              </div>
              <div class="w-100">
                <v-text-field
                  v-model="phoneNumber"
                  label="Phone Number"
                  placeholder="Enter your Phone Number"
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
                  @click="onSignUp"
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
        :class="{ moveLeft: isClicked }"
      >
        <div
          class="signUp-button-container bg-primary d-flex flex-column align-center justify-center w-100 h-100"
          v-if="!toggle"
        >
          <h1
            class="heaidng-one text-white pa-4"
            :class="{ animy1: isAnimate }"
          >
            Welcome Back!
          </h1>
          <p
            class="text-one text-center text-white pa-4"
            :class="{ animy1: isAnimate }"
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
            :class="{ animy1: isAnimate }"
            variant="outlined"
            color="white"
            >SIGN UP</v-btn
          >
        </div>

        <div
          class="signIn-button-container bg-primary w-100 h-100 d-flex flex-column align-center justify-center"
          v-if="toggle"
        >
          <h1 class="text-white pa-4" :class="{ animy2: isAnimate }">
            Hello Friends!
          </h1>

          <p class="text-center text-white pa-4" :class="{ animy2: isAnimate }">
            Register With your personal details to use all <br />of site feature
          </p>
          <v-btn
            @click="
              handleClick();
              toggleHandler();
              animyHandler();
            "
            class="rounded-lg mt-4"
            :class="{ animy2: isAnimate }"
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

<script setup>
import axios from "axios";
import store from "@/stores";
import { SysEntities, SysActions } from "@/enums";
import { useRouter } from "vue-router";

const isClicked = ref(false);
const isbckChange = ref(false);
const toggle = ref(false);
const isAnimate = ref(false);
const password = ref("");
const firstName = ref("");
const lastName = ref("");
const phoneNumber = ref("");
const email = ref("");
const sysEntities = ref(SysEntities);
const sysActions = ref(SysActions);

const router = useRouter();
const $store = store();

const handleClick = () => {
  isbckChange.value = !isbckChange.value;
  isClicked.value = !isClicked.value;
  // Reset the class after the animation duration
  setTimeout(() => {
    // isClicked = false;
    // isbckChange = false
  }, 1000); // Match this duration with the CSS transition
};
const toggleHandler = () => {
  toggle.value = !toggle.value;
};
const animyHandler = () => {
  isAnimate.value = true;
};
const onLogin = async () => {
  try {
    const response = await $store.login({
      email: email.value,
      password: password.value,
      companyId: "0655816b-04d2-49f7-8c16-41d12f56af90",
    });
    console.log(response, "response");
  } catch (e) {
    console.error(e, "error");
  }
  router.push({ path: "/dashboard" });
};
const onSignUp = async () => {
  try {
    const response = await $store.signup({
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      password: password.value,
      companyId: "79365c17-334a-4147-a0fd-3c982d94ec2a",
    });
    console.log(response, "response");
    await router.push({ path: "/reservation" });

    // navigateTo("/dashboard", { replace: true });
  } catch (e) {
    console.error(e, "error");
  }
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap");
.parent {
  font-family: "Montserrat", sans-serif;
  width: 100vw;
  height: 100vh;
  /* border: 2px solid red; */
  position: relative;
  /* overflow: hidden; */
}
.left-container {
  width: 100%;
  position: relative;
  transition: transform 0.6s, backgorund-color 0.5s;
}
.moveRight {
  transform: translateX(50vw);
  /* background-color: rgb(156, 176, 176); */
}
#button {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.6s, background-color 0.5s;
  /* border: 1px solid red; */
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
.animy1 {
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
.animy2 {
  animation: slideInLeft 1s ease-in-out;
}
.hiddenBtn {
  font-family: "Montserrat", sans-serif;
}
</style>
