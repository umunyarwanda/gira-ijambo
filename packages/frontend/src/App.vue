<script setup lang="ts">
import { useHead } from '@unhead/vue';
import { onMounted, ref, watch, watchEffect } from 'vue';
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { AuthActionTypes } from './stores/actions/action-types.enum';
import { useAuthStore } from './stores/auth';
import axios from 'axios';
import router from './router';

const authStore = useAuthStore();
useHead({
  titleTemplate: 'Gira Ijambo - %s',
})


watchEffect(() => {
  authStore.isAuthenticated

  if (authStore.isAuthenticated) {
    getMyPermissions();
  } 
})


const getMyPermissions = async () => {
  // try {
  //   const response = await permissionsStore[PermissionsActionTypes.GET_MY_PERMISSIONS]();
  //   const data = response.data.slugs as IPermissionSlugsResDto['slugs']

  //   permissionsStore[PermissionsActionTypes.SET_PERMISSIONS](data);
  // } catch (error) {
  //   if (axios.isAxiosError(error)) {
  //     if (error.response?.status === 401) {
  //       authStore[AuthActionTypes.LOGOUT]();
  //     }
  //   }
  // }
}
</script>

<template>
  <RouterView />
  <Toast />
  <ConfirmPopup />
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
