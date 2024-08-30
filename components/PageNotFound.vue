<template>
  <error-page :error="error" />
</template>

<script>
import ErrorPage from '@/shared/pages/ErrorPage.vue';
export default {
    name: 'PageNotFound',
    components: {
        ErrorPage,
    },
    data: () => ({
        error: '404 Page Not Found',
    }),
};
</script>
