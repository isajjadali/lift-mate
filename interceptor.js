import axios from 'axios';

axios.defaults.baseURL = process.env.VUE_APP_SERVER_URL;

// this.$axios.interceptors.request.use(
//     (config) => {
//         const token = localStorage.getItem('token');
//         if (token) {
//             config.headers.common['Authorization'] = `Bearer ${token}`;
//         }
//         return config;
//     },
//     (error) => Promise.reject(error)
// );

// axios.interceptors.response.use(
//     (response) => {
//         if ([200, 201].includes(response.status)) {
//             return Promise.resolve(response.data);
//         }
//         return Promise.reject(response);
//     },
//     (error) => {
//         console.error(error.response, 'error');
//         // TODO: Need to work on it

//         if (error.response.status) {
//             switch (error.response.status) {
//             // case 400:

//             //     //do something
//             //     break;

//             case 401:
//                 localStorage.clear();
//                 // this.$$window.location.replace('/');
//                 break;
//         // case 403:
//         //     router.replace({
//         //         path: '/login',
//         //         query: { redirect: router.currentRoute.fullPath }
//         //     });
//         //     break;
//         // case 404:
//         //     alert('page not exist');
//         //     break;
//         // case 502:
//         //     setTimeout(() => {
//         //         router.replace({
//         //             path: '/login',
//         //             query: {
//         //                 redirect: router.currentRoute.fullPath
//         //             }
//         //         });
//         //     }, 1000);
//             }

//             return Promise.reject(error.response.error);
//         }
//     }
// );
