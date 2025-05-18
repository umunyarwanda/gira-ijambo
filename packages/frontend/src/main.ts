import './assets/scss/tailwind.css'

import './assets/scss/main.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { useAuthStore } from './stores/auth'

import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config';
// import Aura from '@primevue/themes/aura';
import Aura from '@primeuix/themes/aura';
import { createHead } from '@unhead/vue';
import 'primeicons/primeicons.css'
import Ripple from 'primevue/ripple'
import { AuthActionTypes } from './stores/actions/action-types.enum'
import axiosInstance from '../axios.config';
import ToastService from 'primevue/toastservice';
import Toast from 'primevue/toast';
import ConfirmationService from 'primevue/confirmationservice';
import ConfirmPopup from 'primevue/confirmpopup';
const app = createApp(App)


app.use(createPinia())
useAuthStore()[AuthActionTypes.CHECK_TOKEN]();
app.use(router)
app.use(createHead())
app.component('Toast', Toast)
app.component('ConfirmPopup', ConfirmPopup)
app.use(ConfirmationService);
app.use(ToastService)
app.config.globalProperties.$axios = axiosInstance;
app.use(PrimeVue, {
  ripple: true,
  theme: {
    preset: Aura,
    options: {
      // prefix: 'my',
      darkModeSelector: '.fake-dark-selector'
    }
  },
});
app.directive('ripple', Ripple);



app.mount('#app')
