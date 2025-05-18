<template>
  <div class="auth-page">
    <div class="auth-page-cover">
      <!-- <img src="https://images.unsplash.com/photo-1517842645767-c639042777db?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Auth cover" /> -->
      <div class="auth-page-cover-text">
        <div class="auth-page-cover-text-logo">
          <img :src="Logo" alt="Gira Ijambo Logo">
          <!-- <h1>Gira Ijambo</h1> -->
        </div>
        <h1>Welcome to <span>Gira Ijambo</span>!</h1>
        <p>Our platform is your one-stop solution for managing both attendance and payroll. With user-friendly features and powerful automation, we make it easy to handle the essential aspects of employee management, freeing you up to focus on what truly matters—growing your business.</p>
      </div>
    </div>

    <div class="auth-page-form">
      <div class="auth-page-form-container" :class="{'container-min': true}">
        <Transition name="fade" mode="out-in">
          <LoginComp key="login" @switchPage="switchPage" v-if="currentPage == 'SIGN_IN'"/>
          <SignUpComp key="signup" @switchPage="switchPage" v-else-if="currentPage == 'SIGN_UP'"/>
          <ForgotComp key="forgot" @switchPage="switchPage" v-else/>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import Logo from '@/assets/images/logo.svg'
  import LoginComp from '@/components/auth/LoginComp.vue';
  import SignUpComp from '@/components/auth/SignUpComp.vue';
  import ForgotComp from '@/components/auth/ForgotComp.vue';
  import { computed, ref } from 'vue';

  type currentPage = 'SIGN_UP' | 'SIGN_IN' | 'FORGOT'

  // Variables
  const currentPage = ref<currentPage>('SIGN_IN');

  // Methods
  const switchPage = (page: currentPage) => {
    currentPage.value = page;
  };
</script>

<style scoped>

</style>