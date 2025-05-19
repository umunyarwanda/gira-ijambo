<template>
  <div class="auth-page">
    <div class="auth-page-cover">
      <div class="auth-page-cover-text">
        <h1>Ikaze kurubuga <span>"Gira Ijambo"</span>!</h1>
        <p>Gira Ijambo ni urubuga rwizewe rufasha abaturage gutanga ibitekerezo n’ibibazo, gukurikirana ibisubizo by’inzego za Leta kugeza ikibazo gikemuwe, bityo twubakire hamwe u Rwanda rw’iterambere rirambye</p>
      </div>
    </div>

    <div class="auth-page-form">
      <div class="auth-page-form-container" :class="{'container-min': true}">
        <div class="auth-component">      
          <div class="auth-component-title">
            <h1>Ikaze nanone</h1>
            <p>Ikaze nanone kuri <span>Gira Ijambo</span> - Injira muri konti yawe</p>
          </div>
      
          <hr class="separator" />
      
          <form class="form" @submit.prevent="loginUser">
            <div class="form-group">
              <label for="usernameOrEmail">Emeyili (Email) <b>&nbsp; [Koresha admin@user.com]</b> <i>*</i></label>
              <div class="flex flex-row gap-2">
                <InputText 
                  id="email" 
                  aria-describedby="user-email"
                  type="email"
                  v-model="formPayload.email"
                  required
                />
              </div>
            </div>
            <div class="form-group">
              <div class="label-has-link">
                <label for="">Ijambobanga (Password) <b>&nbsp; [Koresha 123]</b> <i>*</i></label>
                <!-- <span @click="$emit('switchPage', 'FORGOT')">Wibagiwe ijambobanga ?</span> -->
              </div>
              <div class="flex flex-row gap-2">
                <Password 
                  toggleMask 
                  :feedback="false"
                  required
                  v-model="formPayload.password"
                />
              </div>
            </div>
            <Button label="Sign In" :loading="isLoading" type="submit" />
          </form>
          <!-- <div class="form-navigate">
            <p :class="{'disabled': isLoading}">
              Nta konti ufite ? <router-link to="/sign-up">Fungura konti hano</router-link>
            </p>
          </div> -->
      
          
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useHead } from '@unhead/vue';
  import InputText from 'primevue/inputtext';
  import Password from 'primevue/password';
  import { computed, defineEmits, onMounted } from 'vue';
  import { ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { ILoginAuthDto } from '@shared/interfaces/auth/request/ILoginAuthDto';
  import { useAuthStore } from '@/stores/auth';
  import { AuthActionTypes } from '@/stores/actions/action-types.enum';
  import axios from 'axios';
  import { useToast } from 'primevue/usetoast';
  import { EUserRole } from '@shared/enums/EUserRole.enum';
  import Button from 'primevue/button';

  // Define emits and options
  const emit = defineEmits(["switchPage"]);
  defineOptions({
    name: "Sign In",
  })

  // Local state
  const togglePassword = ref(false);
  const isLoading = ref(false);
  const checkErrors = ref(false);
  const router = useRouter();
  const route = useRoute()
  const formPayload = ref<ILoginAuthDto>({
    email: 'admin@user.com', // Default Admin
    password: '123' // Default Password
  })
  const authStore = useAuthStore();
  const toast = useToast();


  // Methods
  const togglePasswordVisibility = () => {
    togglePassword.value = !togglePassword.value;
  }

  const loginUser = async () => {
    isLoading.value = true;
    try {
      const response = await authStore[AuthActionTypes.LOGIN](formPayload.value);
      checkErrors.value = false;
      if(response.data.status == 'ok') {
        authStore[AuthActionTypes.SET_TOKEN](response.data.data.accessToken);
        toast.add({
          severity: 'success',
          summary: 'Success',
          detail: response.data.message,
          life: 3000
        })

        router.push({ name: 'dashboard' });

      }
    } catch (error: any) {
      if(axios.isAxiosError(error)) {
        if (Array.isArray(error.response?.data.message) && error.response?.data.message.length > 0) {
          error.response?.data.message.forEach((msg: string) => {
            toast.add({
              severity: 'error',
              summary: 'Error',
              detail: msg,
              life: 3000
            });
          });
        } else {
          toast.add({
            severity: 'error',
            summary: 'Error',
            detail: error.response?.data.message,
            life: 3000
          });
        }
      } else {
        console.error('Unexpected error:', error);
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'An unexpected error occurred, please try again later!',
          life: 300000
        })
      };
    } finally {
      isLoading.value = false;
    }
  }
  useHead({
    title: 'Sign In'
  })

</script>

<style scoped></style>
