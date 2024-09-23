<template>
  <nuxt-layout :name="layoutName" >
    <nuxt-page></nuxt-page>
  </nuxt-layout>
</template>

<script setup>
const route = useRoute();
const layoutName = route.path === '/' ? false : 'default';
useHead({
  titleTemplate: () => {
    let pageTitle = "";

    pageTitle = route.meta.title;
    return pageTitle ? `LiftMate - ${pageTitle}` : "LiftMate";
  },
});
</script>

<style lang="scss">
/* Hide scrollbar for Chrome, Safari and Opera */
body::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
body {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

/* width */
::-webkit-scrollbar {
  width: 7px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 5px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.v-table__wrapper::-webkit-scrollbar {
  height: 7px;
}
.v-stepper-header::-webkit-scrollbar {
  height: 7px;
}

.v-btn,
.v-tab {
  text-transform: capitalize !important;
}

.v-label {
  opacity: 1 !important;
}

.main-container {
  padding: 65px 0 48px 0 !important;
  background-color: #eee;

  .v-main__wrap {
    height: calc(100vh - 65px);
    overflow-y: scroll;
    > .container {
      min-height: calc(100vh - 115px) !important;
    }
  }
}

.break-word {
  word-break: break-word;
}

.w-100 {
  width: 100% !important;
}

.postion-relative {
  position: relative;
}

.v-chip {
  box-shadow: 0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 0%),
    0px 1px 5px 0px rgb(0 0 0 / 0%);
  padding: 15px;
  width: 100px;
  justify-content: center;
}

$dark-mode-autofill-text-color: #1e1e1e;
$light-mode-autofill-text-color: rgba(0, 0, 0, 0.87);

// .theme--light.v-sheet,
// .theme--light.v-expansion-panels .v-expansion-panel,
// .theme--light.v-date-picker-header
//   .v-date-picker-header__value:not(.v-date-picker-header__value--disabled),
//   button:not(:hover):not(:focus) {
//   color: rgba(0, 0, 0, 0.6) !important;
// }

.dark-mode {
  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 30px $dark-mode-autofill-text-color inset !important;
  }

  /*Change text in autofill textbox*/
  input:-webkit-autofill {
    -webkit-text-fill-color: white !important;
  }

  .main-container {
    background-color: #121212;
  }
}

.light-mode {
  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 30px white inset !important;
  }

  /*Change text in autofill textbox*/
  input:-webkit-autofill {
    -webkit-text-fill-color: $light-mode-autofill-text-color !important;
  }
}

:root {
  --toastify-color-success: #008a7ce8;
  --toastify-color-error: #dd4c4ce0;
}
</style>
