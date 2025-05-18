<template>
  <section class="not-found section-wrapper">
    <div class="section-container">
      <div class="not-found__content">
        <h1 class="not-found__title">404</h1>
        <h2 class="not-found__subtitle">Paji ntibashije kuboneka</h2>
        <p class="not-found__desc">
          Paji mwashakaga ntibashije kuboneka. Mwongere mugerageze cyangwa musubire inyuma.
        </p>
        <router-link to="/" class="not-found__link">
          <ion-icon name="arrow-back-outline"></ion-icon>
          Subira kuri paji ibanza
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
</script>

<style scoped lang="scss">
.not-found {
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fcfcfc;

  &__content {
    text-align: center;
    padding: 2rem;
  }

  &__title {
    font-size: 8rem;
    font-weight: 800;
    color: var(--blue);
    margin: 0;
    line-height: 1;
  }

  &__subtitle {
    font-size: 2rem;
    font-weight: 700;
    color: #101820;
    margin: 1rem 0;
  }

  &__desc {
    font-size: 1.1rem;
    color: #555;
    max-width: 500px;
    margin: 0 auto 2rem;
    line-height: 1.5;
  }

  &__link {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1rem;
    color: var(--blue);
    text-decoration: none;
    font-weight: 500;
    padding: 10px 30px;
    border: 2px solid var(--blue);
    border-radius: 2rem;
    transition: all 0.2s ease;

    &:hover {
      background: var(--blue);
      color: white;

      ion-icon {
        right: 5px;
      }
    }

    ion-icon {
      font-size: 1.3rem;
      position: relative;
      right: 0;
      transition: all 0.2s ease;
    }
  }
}
</style>
