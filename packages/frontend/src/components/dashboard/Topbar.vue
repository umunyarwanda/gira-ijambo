<template>
  <div class="topbar" :class="{ 'scrolled': hasScrolled }">
    <div class="topbar-left">
      <button class="toggler crd" @click="globalStore.toggleNav">
        <span class="material-symbols-rounded">menu</span> 
      </button>
      <h2>{{ route.name }}</h2>
    </div>
    <div class="topbar-right" @click="toggleDrop" v-if="authStore.isAuthenticated && authStore.user">
      <div class="user-info">
        <div class="user-info-names">
          <h1>{{ authStore.user.firstName }} {{ authStore.user.lastName }}</h1>
          <p>{{ authStore.user.role.split('_').join(' ') }}</p>
        </div>
        <span class="material-symbols-rounded">expand_more</span>
      </div>
      <div class="user-drop" :class="{ active: isDropActive }">
        <ul>
          <!-- <li>
            <a href="">
              <span class="material-symbols-rounded">person</span>
              Profile
            </a>
          </li> -->
          <li>
            <a href="">
              <span class="material-symbols-rounded">logout</span>
              Logout
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { useGlobalStore } from '@/stores/global';
import { ref } from 'vue';
import { useRoute } from 'vue-router';

defineProps({
  hasScrolled: {
    type: Boolean,
    default: false,
  }
});

const isDropActive = ref(false);
const route = useRoute();
const globalStore = useGlobalStore();
const authStore = useAuthStore();

const toggleDrop = () => {
  isDropActive.value = !isDropActive.value;
}

</script>

<style scoped lang="scss">
  .topbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 15px;
    width: 100%;
    position: sticky;
    top: 0;
    background: transparent;
    z-index: 10;
    transition: all 0.3s ease;
    &.scrolled {
      box-shadow: var(--shadow-primary);
      background: var(--white);
    }

    .topbar-left {
      display: flex;
      align-items: center;
      gap: 17px;
      .toggler {
        cursor: pointer;
        width: 43px;
        height: 43px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
        outline: none;
        span {
          font-size: 1.5rem;
          opacity: .6;
        }
      }
      h2 {
        font-size: 1.2rem;
        font-weight: 600;
        text-transform: capitalize;
      }
    }

    .topbar-right {
      position: relative;
      .user-info {
        display: flex;
        align-items: center;
        gap: 10px;
        cursor: pointer;
        .user-info-names {
          h1 {
            font-size: .96rem;
            font-weight: 600;
          }
          p {
            font-size: .85rem;
            opacity: .6;
          }
        }
      }
      .user-drop {
        position: absolute;
        top: 120%;
        right: 0;
        width: 180px;
        background-color: var(--white);
        box-shadow: 0 3px 16px rgba(142, 134, 171, .25);
        border-radius: 10px;
        overflow: hidden;
        opacity: 0;
        transition: all .3s ease;
        pointer-events: none;
        z-index: 5;
        ul {
          li {
            padding: 9px 15px;
            cursor: pointer;
            transition: all .3s ease;
            &:hover {
              background-color: var(--pale-blue);
            }

            a {
              display: flex;
              align-items: center;
              gap: 10px;
              font-size: .86rem;
              span {
                font-size: 1.3rem;
              }
            }
          }
        }
        &.active {
          opacity: 1;
          pointer-events: auto;
        }
      }
    }
  }
</style>