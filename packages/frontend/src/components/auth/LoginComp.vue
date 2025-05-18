<template>
  <div class="auth-component">
    <div class="auth-page-form-container-logo logo-bg">
      <!-- <img :src=Logo alt=""> -->
    </div>

    <div class="auth-component-title">
      <h1>Welcome Back</h1>
      <p>Welcome back to <span>Gira Ijambo</span> - Sign in to your account</p>
    </div>

    <hr class="separator" />

    <form class="form" @submit.prevent="loginUser">
      <div class="form-group">
        <label for="usernameOrEmail">Email <small title="This field is required">*</small></label>
        <div class="flex flex-row gap-2">
          <InputText 
            :invalid="false" 
            id="email" 
            aria-describedby="user-email"
            type="email"
            v-model="formPayload.email"
            required
          />
          <!-- <small id="user-email" class="text-[red]">This field is required</small> -->
        </div>
      </div>
      <div class="form-group">
        <div class="label-has-link">
          <label for="">Password <i>*</i></label>
          <span @click="$emit('switchPage', 'FORGOT')">Forgot ?</span>
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
        Have no account ? <span @click="$emit('switchPage', 'SIGN_UP')">Sign up</span>
      </p>
    </div> -->

    
  </div>
</template>

<script setup lang="ts">
  import { useHead } from '@unhead/vue';
  import Button from 'primevue/button';
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
    email: '',
    password: ''
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
              life: 300000
            });
          });
        } else {
          toast.add({
            severity: 'error',
            summary: 'Error',
            detail: error.response?.data.message,
            life: 300000
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
