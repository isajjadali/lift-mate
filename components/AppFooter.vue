<template>
  <v-row
    class="bg-grey-darken-4 ma-3 py-10 px-16 rounded-xl footer-container"
  >
    <v-col cols="4">
      <div class="w-75">
        <h1 class="app-name text-uppercase">Lift Mate</h1>
        
        <p class="mt-5 text-white">
          Rent high-quality SUVs, for fun vacation or road trip
        </p>
      </div>
    </v-col>

    <v-col cols="3">
      <h4>Quick Links</h4>

      <p class="mt-5 mb-1">Login</p>
      <p class="mb-1">SUVs</p>
      <p class="mb-1">Insurance</p>
      <p class="mb-1">Payment</p>
    </v-col>

    <v-col cols="2">
      <h4>Menu</h4>

      <p class="mt-5 mb-1">Home</p>
      <p class="mb-1">About Us</p>
      <p class="mb-1">Cars</p>
      <p class="mb-1">Features</p>
      <p class="mb-1">Help</p>
    </v-col>

    <v-col cols="3" class="d-flex justify-end">
      <div class="w-75">
        <h2>Subscribe to the newsletter</h2>
        
        <v-text-field
          placeholder="Email.."
          variant="outlined"
          bg-color="white"
          density="compact"
          class="subscribe-field mt-5"
        >
          <template v-slot:append-inner="{ props }">
            <v-btn
              varaint="flat"
              density="compact"
              class="pa-0"
              color="grey-darken-4"
              size="30"
            >
              <v-icon>mdi-arrow-right</v-icon>
            </v-btn>
          </template>
        </v-text-field>
      </div>
    </v-col>

    <v-col cols="12" class="mt-5">
      <v-divider color="grey-lighten-4" />
    </v-col>

    <v-col cols="12">
      <v-row justify="space-between">
        <v-col cols="3">
          © 2023 LIFT MATE
        </v-col>
        
        <v-col cols="4" class="d-flex justify-space-between">
          <p>Terms</p>
          <p>Privacy Policy</p>
          <p>Legal Notice</p>
          <p>Accessibility</p>
        </v-col>
      
        <v-col cols="5" class="d-flex justify-end">
          <v-icon class="mr-5" color="grey">mdi-youtube</v-icon>
          <v-icon class="mr-5" color="grey">mdi-facebook</v-icon>
          <v-icon class="mr-5" color="grey">mdi-instagram</v-icon>
        </v-col>
      </v-row>
    </v-col>

  </v-row>
</template>

<script setup></script>

<style lang="scss">
  .app-name {
    color: #00ffcb;
  }

  .footer-container {
    p {
      color: rgb(182, 182, 182);
    }
  }

  .subscribe-field {
    .v-field {
      border-radius: 8px;
    }
  }
</style>
