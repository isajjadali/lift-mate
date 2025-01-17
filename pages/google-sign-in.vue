<template>
  <GoogleSignInButton
    @success="handleLoginSuccess"
    @error="handleLoginError"
  ></GoogleSignInButton>
</template>

<script setup>
import { decodeCredential } from "vue3-google-signin";

const urlParams = new URLSearchParams(window.location.search);

console.log(urlParams, "url");

const handleLoginSuccess = (response) => {
  console.log("hekkk");
  const { credential } = response;
  const decoded = decodeCredential(credential);
  console.log("Decoded User:", decoded);
};

const handleLoginError = () => {
  console.error("Login failed");
};
const check = () => {
  console.log("check");
};
</script>
<!-- for redirect mode but data is not being returned -->
<!-- <template>
  <GoogleSignInButton
    ux-mode="redirect"
    @success="handleLoginSuccess"
    @error="handleLoginError"
  ></GoogleSignInButton>
</template>

<script setup>
import { decodeCredential } from "vue3-google-signin";

const urlParams = new URLSearchParams(window.location.search);

console.log(urlParams, "url");

const handleLoginSuccess = (response) => {
  console.log("hekkk");
  const { credential } = response;
  const decoded = decodeCredential(credential);
  console.log("Decoded User:", decoded);
};

const handleLoginError = () => {
  console.error("Login failed");
};
const check = () => {
  console.log("check");
};
</script> -->