<template>
  <div class="dashboard-layout" :class="{ 'nav-open': globalStore.navOpen }">
    <div class="dashboard-layout-overlay" @click="globalStore.toggleNav"></div>
    <div class="dashboard-aside" :class="{ 'scrolled': hasScrolled, 'close': !globalStore.navOpen }">
      <Navbar />
    </div>
    <main ref="myEl">
      <Topbar :hasScrolled="hasScrolled" />
      <div class="dashboard-content">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
  import { onBeforeMount, onMounted, ref, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import Logo from '@/assets/images/logo.svg';
  import Navbar from '@/components/dashboard/Navbar.vue';
  import Topbar from '@/components/dashboard/Topbar.vue';
  import { useGlobalStore } from '@/stores/global';
  defineOptions({
    name: 'Dashboard'
  })

  // Variables
  const router = useRouter();
  const navOpen = ref(false);
  const hasScrolled = ref(false);
  const showNote = ref(false);
  const globalStore = useGlobalStore();

  // Watch for route changes to close nav on mobile
  watch(() => router.currentRoute.value, () => {
    if (window.innerWidth < 800) {
      globalStore.navOpen = false;
      localStorage.setItem('navOpen', 'false');
    }
  });

  const bodyScroll = () => {
    if (myEl.value !== null && myEl.value.scrollTop > 10) {
      hasScrolled.value = true;
    } else {
      hasScrolled.value = false;
    }
  }

  const myEl = ref<HTMLElement | null>(null)
  onMounted(() => {
    myEl.value?.addEventListener('scroll', bodyScroll);
  })

  // Lifecycle
  onMounted(() => {

    const navOpenState = localStorage.getItem('navOpen');
    if (navOpenState) {
      globalStore.navOpen = navOpenState === 'true';
    } else {
      globalStore.navOpen = true;
      localStorage.setItem('navOpen', 'true');
    }

    const screenWidth = window.innerWidth;
    if (screenWidth < 800) {
      console.log('screenWidth', screenWidth, globalStore.navOpen);
      globalStore.navOpen = false;
      localStorage.setItem('navOpen', 'false');
    }
  });

</script>

<style scoped lang="scss">
  .dashboard-layout {
    display: flex;
    height: 100vh;
    overflow: hidden;

    .dashboard-layout-overlay {
      // content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.43);
      z-index: 100;
      pointer-events: none;
      backdrop-filter: blur(10px);
      opacity: 0;
      transition: all 0.3s ease;
    }

    @media (max-width: 800px) {
      &.nav-open .dashboard-layout-overlay {
        opacity: 1;
        pointer-events: auto;
      }
    }

    .dashboard-aside {
      width: 290px;
      border-right: 2px dashed transparent;
      transition: all 0.3s ease;

      &.scrolled {
        border-color: var(--pale-gray);
      }
      
      @media (max-width: 800px) {
        position: fixed;
        top: 0;
        left: 0px;
        z-index: 100;
        border-color: transparent; 
        box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
      }

      &.close {
        width: 0;

        @media (max-width: 800px) {
          width: 290px;
          left: -290px;
        }
      }
    }

    main {
      flex: 1;
      overflow: auto;
      position: relative;
      .dashboard-content {
        padding: 3px 17px 15px;

        :deep(.p-datatable-header) {
          padding: 0;
        }

        :deep(.table-filters-headers) {
          gap: 10px;
          flex-wrap: wrap;

          .table-filters-headers-actions {
            flex-wrap: wrap;
            gap: 10px;
          }
        }
      }
    }
  }
</style>