<template>
  <v-row
    justify="center"
  >
    <v-col
      cols="12"
      sm="4"
      md="3"
      lg="2"
      xl="2"
    >
      <v-card class="mx-auto">
        <div class="mx-auto text-center">
          <shared-custom-loading type="profileSidebar" />
        </div>
      </v-card>
    </v-col>
    <v-col
      cols="12"
      sm="8"
      md="9"
      lg="10"
      xl="10"
    >
      <v-card class="mx-auto">
        <div class="mx-auto text-center">
          <shared-custom-loading type="profileInfo" />
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'UserProfileLoader',
}
</script>

<style>

</style>