<template>
  <v-footer
    :color="isDarkMode ? '': 'white'" 
    flat
    dense
  >
    <v-row>
      <v-col>
        <div
          :class="isDarkMode ? 'text-white': 'text-black'" 
          align="center"
        >
          © 2019 [-[app Name]-]
          <a
            class="ml-3 ; text-decoration-none"
            @click="onClick('/privacy-policy')"
          >Privacy Policy</a>
          <a
            class="ml-3 ; text-decoration-none"
            @click="onClick('/terms-and-conditions')"
          >Terms and Conditions</a>
        </div>
      </v-col>
    </v-row>
  </v-footer>
</template>

<script>
export default {
    name: 'AppFooter',
    methods:{
        onClick(path){
            if (this.$route.path !== path) this.$router.push(path).catch();
        }
    }
};
</script>
