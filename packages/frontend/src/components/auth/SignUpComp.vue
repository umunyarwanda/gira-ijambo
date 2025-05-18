<template>
  <div class="auth-component">
    <div class="auth-page-form-container-logo logo-bg">
      <!-- <img :src="Logo" alt="" /> -->
    </div>

    <div class="auth-component-title">
      <h1>Get Started</h1>
      <p>Welcome to <span>Ingaji PMS</span> - Let's create your account</p>
    </div>
    
    <hr class="separator" />
    <form class="form">
      <div class="form-split">
        <div class="form-group">
          <label for="first-name">First Name <i title="This field is required">*</i></label>
          <div class="flex flex-row gap-2">
            <InputText 
              :invalid="false" 
              id="firstname" 
              v-model="formPayload.firstName" 
              aria-describedby="first-name"
            />
            <!-- <small id="first-name" class="text-[red]">This field is required</small> -->
          </div>
        </div>
        <div class="form-group">
          <label for="last-name">Last Name <i title="This field is required">*</i></label>
          <div class="flex flex-row gap-2">
            <InputText 
              :invalid="false" 
              id="lastname" 
              v-model="formPayload.lastName" 
              aria-describedby="last-name"
            />
            <!-- <small id="last-name" class="text-[red]">This field is required</small> -->
          </div>
        </div>
      </div>
      <div class="form-split">
        <div class="form-group">
          <label for="email">Email <i title="This field is required">*</i></label>
          <div class="flex flex-row gap-2">
            <InputText 
              :invalid="false" 
              id="email" 
              v-model="formPayload.email"
              aria-describedby="user-email"
              type="email"
            />
            <!-- <small id="user-email" class="text-[red]">This field is required</small> -->
          </div>
        </div>
        <div class="form-group">
          <label for="username">Phone Number</label>
          <InputMask 
            id="phone" 
            mask="9999-999-999" 
            placeholder="07xx-xxx-xxx" 
            v-model="formPayload.phone"
            fluid 
          />
        </div>
      </div>
      <div class="form-split">
        <div class="form-group">
          <label for="password">Password <i title="This field is required">*</i></label>
          <div class="form-group-input">
            <Password 
              v-model="formPayload.password" 
              toggleMask 
              :feedback="false"
            />
          </div>
        </div>
        <div class="form-group">
          <label for="confirm-password">Confirm Password <i title="This field is required">*</i></label>
          <div class="form-group-input">
            <Password 
              v-model="formPayload.confirmPassword" 
              toggleMask 
              :feedback="false"
            />
          </div>
        </div>
      </div>

      <Button label="Sign Up" :loading="false" type="submit" />
    </form>
    <div class="form-navigate">
      <p :class="{'disabled': isLoading}">
        Already have an account ?
        <span @click="$emit('switchPage', 'SIGN_IN')">Sign in</span>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
// import Logo from "http://localhost:5173/src/assets/images/keep_2020q4_48dp.png";
import { useHead } from "@unhead/vue";
import Button from "primevue/button";
import InputMask from "primevue/inputmask";
import InputText from "primevue/inputtext";
import Password from "primevue/password";
import { computed, ref, watchEffect } from "vue";

// Define emits and options
const emit = defineEmits(["switchPage"]);
defineOptions({
  name: "Sign Up",
})

// Local state
const togglePassword = ref<boolean>(false);
const toggleConfirmPassword = ref<boolean>(false);
const firstName = ref<string>("");
const lastName = ref<string>("");
const phone = ref<string>("250")
const isLoading = ref<boolean>(false);
const checkErrors = ref<boolean>(false);
const formPayload = ref<any>({
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  password: '',
  confirmPassword: ''
})

// Methods
const togglePasswordVisibility = () => {
  togglePassword.value = !togglePassword.value;
};

const toggleConfirmPasswordVisibility = () => {
  toggleConfirmPassword.value = !toggleConfirmPassword.value;
};

const generateStrongPassword = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?';
  const passwordLength = 9;
  let password = '';

  for (let i = 0; i < passwordLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    password += characters[randomIndex];
  }
}

useHead({
  title: 'Sign Up',
})

</script>

<style scoped></style>
