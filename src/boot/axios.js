import {boot} from 'quasar/wrappers'
import axios from 'axios'
import {Notify} from 'quasar';
import {LocalStorage} from "quasar";

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create()
api.defaults.withCredentials = true;

if (process.env.PROD) {
  api.defaults.baseURL = 'https://api.controlapi.oo/';
} else {
  api.defaults.baseURL = 'http://localhost:8000/';
}

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    let status = error.response.status
    if (status === 401) {
      LocalStorage.remove('logged_in');
      location.href = '/auth/login';
    }
    if (status === 403) {
      location.href = '/auth/verify-email';
    }
    if (status === 422) {
      let errors_array = [];
      let errors_html = '';
      let errors = (error.response.data.errors);
      for (let key in errors) {
        errors_array[key] = errors[key][0];
        errors_html += errors[key][0] + '<br/>';
      }
      Notify.create({
        message: errors_html,
        icon: 'fa-light fa-xmark',
        html: true,
        type: 'negative',
        timeout: 5000,
      });
      return Promise.reject(errors_array);
    }
    if (status === 500) {
      Notify.create({message: error.response.data.message, type: 'negative', icon: 'fa-light fa-xmark'});
    }
    return Promise.reject(error);
  }
);

export default boot(({app}) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
})

export {api}
