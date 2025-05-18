<template>
  <nav class="navbar section-wrapper" ref="navbar" :class="{ 'scrolled': isAuthPage }">
    <div class="responsive-warn">
      <p>This page is not responsive yet, for the best experience please use a desktop or computer to access this page.</p>
    </div>
    <div class="section-container">
      <router-link :to="{ name: 'home' }" class="logo">
        <span class="logo-main">Gira</span>
        <span class="logo-dot">.</span>
        <span class="logo-bold">Ijambo</span>
      </router-link>
      <ul class="navbar__links">
        <router-link :to="{ name: 'home' }">Ahabanza</router-link>
        <router-link :to="{ name: 'submit-complaint' }">Ohereza Ikibazo</router-link>
        <router-link :to="{ name: 'site-complaints' }" :class="{ 'router-link-active router-link-exact-active': $route.path.includes('ibibazo') }">Kurikirana Ikibazo</router-link>
        <router-link to="/about">Abo Turi Bo</router-link>
      </ul>
      <router-link :to="{ name: 'login' }" class="navbar__login">
        <ion-icon name="log-in-outline"></ion-icon>
        Kwinjira
      </router-link>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { Message } from 'primevue';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const navbar = ref<HTMLElement | null>(null);
const router = useRouter();

onMounted(() => {
  window.addEventListener('scroll', () => {
    if (navbar.value && !isAuthPage.value) {
      if (window.scrollY > 50) {
        navbar.value.classList.add('scrolled');
      } else {
        navbar.value.classList.remove('scrolled');
      }
    }
  });
});

const isAuthPage = computed(() => {
  return router.currentRoute.value.meta.authPage;
});

</script>

<style scoped lang="scss">
@use '@/assets/scss/_variables.scss' as *;

.navbar {
  // padding: 2rem 4vw 1.5rem 4vw;
  
  background: transparent;
  font-family: 'Raleway', sans-serif;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  transition: background 0.2s, box-shadow 0.2s;

  &.scrolled {
    background: white;
    box-shadow: 0 0 100px -10px rgba(0, 0, 0, 0.225);
  }

  .responsive-warn {
    z-index: 1000;
    background: var(--blue-dark);
    color: #fff;
    padding: 7px 20px;
    font-size: .94rem;
    font-weight: 600;
    text-align: center;
  }

  .section-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 20px;
  }
  

  &__links {
    display: flex;
    align-items: center;
    gap: 2.2rem;
    list-style: none;
    font-weight: 500;
    a {
      cursor: pointer;
      color: var(--black);
      padding-bottom: 0.2rem;
      transition: color 0.2s;
      font-size: .97rem;
      border-bottom: 3px solid transparent;
      transition: .2s;
      &.router-link-active.router-link-exact-active {
        color: var(--blue);
        border-bottom: 3px solid var(--blue);
      }
      &:hover {
        color: var(--blue);
      }
    }
  }

  &__login {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: var(--blue-dark);
    color: #fff;
    border: none;
    border-radius: 8px;
    padding: 0.5rem 1.3rem;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
    ion-icon {
      font-size: 1.2rem;
    }
    &:hover {
      background: var(--blue);
    }
  }
}

@media (max-width: 900px) {
  .navbar {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    &__links {
      gap: 1.2rem;
      font-size: 1rem;
    }
    &__logo {
      font-size: 1.5rem;
    }
  }
}
</style>
