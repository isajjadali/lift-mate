import Vue3Toastify, { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export default defineNuxtPlugin((nuxtapp) => {
    const defaultOptions = {
        newestOnTop: true,
        autoClose: 1000,
        theme: 'colored',
        position: toast.POSITION.TOP_CENTER,
        clearOnUrlChange: false,
    };

    nuxtapp.vueApp.use(Vue3Toastify, {
        ...defaultOptions,
        style: {
            opacity: '1',
            userSelect: 'initial',
        },
    });

    return {
        provide: { toast },
    };
})