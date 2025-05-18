<template>
  <div class="auth-component">
    <div class="auth-page-form-container-logo logo-bg">
      <!-- <img :src=Logo alt=""> -->
    </div>

    <div class="auth-component-title">
      <h1>Reset Your Password</h1>
      <p>Forgot your <span>Gira Ijambo</span> password? No problem. Just let us know your email address and we will email you a password reset link that will allow you to choose a new one.</p>
    </div>

    <hr class="separator" />

    <form class="form" method="POST">
      <div class="form-group">
        <label for="usernameOrEmail">Email <i title="This field is required">*</i></label>
        <div class="flex flex-row gap-2">
          <InputText 
            :invalid="false" 
            id="email" 
            aria-describedby="user-email"
            type="email"
            required
          />
          <!-- <small id="user-email" class="text-[red]">This field is required</small> -->
        </div>
      </div>
      <div class="form-group">
        <label for="otp">OTP <i title="This field is required">*</i></label>
        <div class="flex flex-row gap-2">
          <InputText 
            :invalid="false" 
            id="email" 
            aria-describedby="user-email"
            type="email"
            required
          />
          <!-- <small id="user-email" class="text-[red]">This field is required</small> -->
        </div>
      </div>
      <Button label="Reset Password" :loading="false" type="submit" />
    </form>
    <div class="form-navigate">
      <p>
        Remember password ? <span @click="$emit('switchPage', 'SIGN_IN')">Sign in here</span>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
  // import Logo from 'http://localhost:5173/src/assets/images/keep_2020q4_48dp.png';
  import { useHead } from '@unhead/vue';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
  import { ref } from 'vue';

  // Define emits and options
  defineEmits(["switchPage"]);
  defineOptions({
    name: "Forgot Password",
  })

  // Local state
  const togglePassword = ref(false);
  const payLoad = ref({
    usernameOrEmail: '',
    password: ''
  })

  // Methods
  const togglePasswordVisibility = () => {
    togglePassword.value = !togglePassword.value;
  }

  useHead({
    title: 'Reset Password',
  })
</script>

<style scoped></style>
