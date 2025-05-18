<template>
  <div class="dashboard-layout">
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
  import { onBeforeMount, onMounted, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import Logo from '@/assets/images/logo.svg';
  import Navbar from '@/components/dashboard/Navbar.vue';
  import Topbar from '@/components/dashboard/Topbar.vue';
  import { useGlobalStore } from '@/stores/global';
  defineOptions({
    name: 'Dashboard'
  })

  // Variables
  const navOpen = ref(false);
  const hasScrolled = ref(false);
  const showNote = ref(false);
  const globalStore = useGlobalStore();

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
  });

</script>

<style scoped lang="scss">
  .dashboard-layout {
    display: flex;
    height: 100vh;
    overflow: hidden;
    .dashboard-aside {
      width: 290px;
      border-right: 2px dashed transparent;
      transition: all 0.3s ease;
      &.scrolled {
        border-color: var(--pale-gray);
      }

      &.close {
        width: 0;
      }
    }

    main {
      flex: 1;
      overflow: auto;
      .dashboard-content {
        padding: 3px 17px 15px;
      }
    }
  }
</style>