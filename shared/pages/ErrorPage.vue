<template>
  <v-container align="center">
    <v-row>
      <v-col
        cols="12"
        sm="12"
      >
        <v-card
          rounded="lg"
          min-height="268"
          class="d-flex justify-center align-center"
        >
          <h3>{{ error }}</h3>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
    name: 'ErrorPage',
    props:{
        error:{
            type: String,
            required: true,
        }
    }
};
</script>