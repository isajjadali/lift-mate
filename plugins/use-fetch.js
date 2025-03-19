const useApi = async (url, options) => {
  const { serverUrl } = useNuxtApp().$config.public;
  url = `${serverUrl}${url}`;
  const tokenCookie = useCookie("token");

  const headers = options.headers || {};
  if (tokenCookie.value) {
    headers.Authorization = `Bearer ${tokenCookie.value}`;
  }

  try {
    const { data, error } = await useFetch(url, {
      headers,
      ...options,
    });
    if (error?.value?.data) {
      return error.value.data;
    }
    return data.value || {};
  } catch (error) {
    console.error(error, "error");
    return { error };
  }
};

export const $useFetch = {
  get: async (url, options) => {
    return await useApi(url, {
      method: "GET",
      ...options,
    });
  },
  post: async (url, payload, options) => {
    return await useApi(url, {
      body: payload,
      method: "POST",
      ...options,
    });
  },
  put: async (url, payload, options) => {
    return await useApi(url, {
      body: payload,
      method: "PUT",
      ...options,
    });
  },
  delete: async (url, options) => {
    return await useApi(url, {
      method: "DELETE",
      ...options,
    });
  },
};

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide("useFetch", $useFetch);
});
