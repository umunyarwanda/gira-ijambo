<template>
  <div class="site-layout">
    <Navbar />
    <main class="site-layout__main">
      <router-view />
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import Navbar from '@/components/site/Navbar.vue';
import Footer from '@/components/site/Footer.vue';
</script>

<style scoped lang="scss">
.site-layout {
  min-height: 100vh;
  background: var(--bg-primary);
  display: flex;
  flex-direction: column;

  &__main {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    margin-top: 0;
  }
}
</style> 