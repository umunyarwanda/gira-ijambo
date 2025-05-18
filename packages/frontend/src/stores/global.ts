import { defineStore } from "pinia";

export const useGlobalStore = defineStore('global', {
  state: () => ({
    navOpen: true,
  }),
  actions: {
    toggleNav() {
      this.navOpen = !this.navOpen;
      localStorage.setItem('navOpen', this.navOpen.toString());
    },
  }
});
