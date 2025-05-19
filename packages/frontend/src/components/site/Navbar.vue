<template>
  <nav class="navbar section-wrapper" ref="navbar" :class="{ 'scrolled': isAuthPage }">
    
    <div class="section-container">
      <router-link :to="{ name: 'home' }" class="logo">
        <span class="logo-main">Gira</span>
        <span class="logo-dot">.</span>
        <span class="logo-bold">Ijambo</span>
      </router-link>
      <ul class="navbar__links">
        <router-link :to="{ name: 'home' }">Ahabanza</router-link>
        <router-link :to="{ name: 'submit-complaint' }">Ohereza Ikibazo</router-link>
        <router-link :to="{ name: 'site-complaints' }"
          :class="{ 'router-link-active router-link-exact-active': $route.path.includes('ibibazo') }">Kurikirana
          Ikibazo</router-link>
        <router-link to="/about">Abo Turi Bo</router-link>
      </ul>
      <div class="navbar__login-container">
        <router-link :to="{ name: 'login' }" class="navbar__login">
          <ion-icon name="log-in-outline"></ion-icon>
          Kwinjira
        </router-link>
        <ion-icon name="menu-outline" class="navbar__menu-icon" @click="visible = true"></ion-icon>

      </div>
    </div>
  </nav>

  <Drawer v-model:visible="visible" position="right">
    <template #container="{ closeCallback }">
      <div class="drawer-container">
        <div class="drawer-header">
          <div class="logo">
            <span class="logo-main">Gira</span>
            <span class="logo-dot">.</span>
            <span class="logo-bold">Ijambo</span>
          </div>
          <span class="drawer-close-btn" @click="closeCallback">
            <ion-icon name="close-outline"></ion-icon>
          </span>
        </div>
        <div class="drawer-body">
          <ul class="drawer-body-nav-list">
            <li>
              <router-link :to="{ name: 'home' }">Ahabanza</router-link>
            </li>
            <li>
              <router-link :to="{ name: 'submit-complaint' }">Ohereza Ikibazo</router-link>
            </li>
            <li>
              <router-link :to="{ name: 'site-complaints' }">Kurikirana Ikibazo</router-link>
            </li>
          </ul>
          <p>
            
          </p>
        </div>
      </div>
    </template>
  </Drawer>
</template>

<script setup lang="ts">
import { Drawer, Message } from 'primevue';
import { computed, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const navbar = ref<HTMLElement | null>(null);
const router = useRouter();
const visible = ref(false);

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

// Watch for route changes to close the drawer
watch(() => router.currentRoute.value, () => {
  visible.value = false;
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
    
    @media (max-width: 946px) {
      display: none;

    }

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

  &__login-container {
    display: flex;
    align-items: center;
    gap: 10px;

    ion-icon {
      font-size: 1.7rem;
      cursor: pointer;
      transition: .5s;
      &.navbar__menu-icon {
        display: none;
      }

      @media (max-width: 946px) {
        display: block;
        &.navbar__menu-icon {
          display: block;
        }
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
.drawer-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 15px 20px;

  .drawer-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;

    .drawer-close-btn {
      cursor: pointer;
      font-size: 1.5rem;
      color: var(--black);
      background: rgba(148, 148, 148, 0.241);
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      padding: 5px;
      transition: .5s;
      width: 40px;
      height: 40px;

      ion-icon {
        font-size: 1.5rem;
      }

      &:hover {
        color: var(--black);
        background: rgba(114, 114, 114, 0.497);
      }
      
    }
  }
  .drawer-body {
    .drawer-body-nav-list {
      list-style: none;
      padding: 0;
      margin: 0;
      gap: 1rem;
      display: flex;
      flex-direction: column;
      gap: 10px;

      a {
        text-decoration: none;
        color: var(--black);
        font-size: .97rem;
        font-weight: 500;
        padding: 10px 0;
        border-bottom: 1px solid var(--gray);
        position: relative;
        transition: .5s;
        padding-left: 15px;

        &:hover {
          color: var(--blue);
        }

        &::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          width: 3px;
          height: 100%;
          background: var(--blue);
          opacity: 0;
          transition: .5s;
          border-radius: 50px;
        }

        &.router-link-active.router-link-exact-active {
          color: var(--blue);

          &::before {
            opacity: 1;
          }
        }
        
      }
      
      
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
