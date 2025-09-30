<template>
  <!-- Navbar Start -->
  <div class="container-fluid sticky-top">
    <div class="container">
      <nav
        class="navbar navbar-expand-lg navbar-light border-bottom border-2 border-white"
      >
        <button
          type="button"
          class="navbar-toggler ms-auto me-0"
          data-bs-toggle="collapse"
          data-bs-target="#navbarCollapse"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarCollapse">
          <div class="navbar-nav ms-auto">
            <router-link :to="{ name: 'home' }">الصفحه الرئيسيه</router-link>
            <router-link :to="{ name: 'vaccine' }">حجز اللقاحات</router-link>
            <router-link :to="{ name: 'medicine' }">الادوية</router-link>
            <router-link :to="{ name: 'doctor' }">الاطباء</router-link>
          </div>
        </div>
        <a href="index.html" class="navbar-brand">
          <h1>صحتي</h1>
        </a>
      </nav>
    </div>
  </div>
  <!-- Navbar End -->
</template>
