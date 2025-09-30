<template>
  <Nav></Nav>
  <router-view />
  <the-footer></the-footer>
</template>
<script>
import TheFooter from "@/components/FooterComponent.vue";
import Nav from "@/components/HeaderComponent.vue";

export default {
  components: {
    TheFooter,
    Nav,
  },
};
TheFooter;
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  background: #ffffff;
  padding: 1.5rem 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  border-bottom: 1px solid #e5e7eb;

  a {
    font-weight: 600;
    color: #6b7280;
    text-decoration: none;
    padding: 0.75rem 1.25rem;
    border-radius: 8px;
    transition: all 0.2s ease;
    margin: 0 0.25rem;

    &:hover {
      color: #374151;
      background: #f9fafb;
    }

    &.router-link-exact-active {
      color: #059669;
      background: #ecfdf5;
      border: 1px solid #d1fae5;
    }
  }
}
</style>
