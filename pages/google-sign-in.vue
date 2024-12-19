<template>
  <GoogleSignInButton
    @success="handleLoginSuccess"
    @error="handleLoginError"
  ></GoogleSignInButton>
</template>

<script setup>
import { ref } from "vue";
import { decodeCredential } from "vue3-google-signin";

const userInfo = ref(null);

const handleLoginSuccess = (response) => {
  const { credential } = response;
  const decoded = decodeCredential(credential);
  console.log("Decoded User:", decoded);
};

const handleLoginError = () => {
  console.error("Login failed");
};
</script>
