<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
</script>

<template>
  <header>
    <div class="wrapper">
      <nav class="main-nav">
        <v-text-field
            density="compact"
            placeholder="Search"
            prepend-inner-icon="mdi-magnify"
            width="200"
            max-width="200px"
            flat
            hide-details
            single-line
        ></v-text-field>
        <RouterLink to="/" class="nav-link">Home</RouterLink>
        <RouterLink to="/about" class="nav-link">About</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView/>
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
  background-color: var(--color-background-soft);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.main-nav {
  width: 100%;
  text-align: center;
  padding: 1rem 0;
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.nav-link {
  display: inline-block;
  padding: 0.5rem 1.25rem;
  color: var(--neutral-700);
  text-decoration: none;
  font-weight: 500;
  border-radius: var(--card-radius);
  transition: all 0.3s ease;
}

.nav-link:hover {
  color: var(--primary-color);
  background-color: var(--neutral-200);
}

.nav-link.router-link-exact-active {
  color: var(--neutral-100);
  background-color: var(--primary-color);
}

.nav-link.router-link-exact-active:hover {
  background-color: var(--primary-dark);
}

@media (min-width: 1024px) {
  header {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem 2rem;
  }

  .wrapper {
    max-width: 1200px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .main-nav {
    justify-content: flex-end;
    padding: 0;
    margin: 0;
  }
}
</style>
