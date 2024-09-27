<template>
  <section class="d-flex align-center justify-center">
    <GoogleSignInButton 
      client_id="523959052177-oe79b4jsegrirt9his4qum6iuoete343.apps.googleusercontent.com"
      @success="handleLoginSuccess"
      @error="handleLoginError"
    />
  </section>
</template> 

<script setup>
import { GoogleSignInButton } from "vue3-google-signin";

// Handle successful Google Sign-In
const handleLoginSuccess = async (response) => {
  const { credential } = response;
  let user;

  if (credential) {
    try {
      user = await $fetch("/api/google-login", {
        method: "POST",
        body: {
          token: credential,
        },
      });
      console.log("User:", user);
    } catch (error) {
      console.error("Error during login:", error);
    }
  } else {
    console.error("No credential found");
  }
};

// Handle login error
const handleLoginError = () => {
  console.error("Login failed");
};
</script>

<style lang="scss" scoped>
/* Add your styles here */
</style>
