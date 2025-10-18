<script setup>


</script>

<template>
  <nav class="navbar navbar-expand-md bg-body nav-style py-3 ">
    <div class="container">
      <template >
        <router-link class="navbar-brand d-flex align-items-center brand-style" to="/">
          <span class="bs-icon-sm bs-icon-rounded bs-icon-primary d-flex justify-content-center align-items-center bs-icon" style="margin-right: -10px;">
            <img src="@/assets/images/leftNavBar/home.svg" class="icon-style" alt="">
          </span>
        </router-link>

        <div class="arrow-style">
          <img src="@/assets/images/arrow.svg" class="arrow-icon" alt="">
        </div>

        <router-link :to="'/'" class="router-link link-style">
          <p class="fs-5 fw-semibold link-text">adaga</p>
        </router-link>
      </template>

      <template >
        <div class="arrow-style">
          <img src="@/assets/images/arrow.svg" class="arrow-icon" alt="">
        </div>
        <!-- <router-link v-if="contextStore.course" :to="'/course/' + contextStore.course.id + '/assignment/' + contextStore.assignment.id " class="router-link link-style">
          <p class="fs-5 fw-semibold link-text">{{ contextStore.assignment.name }}</p>
        </router-link> -->
      </template>

      <template >
        <div class="arrow-style">
          <img src="@/assets/images/arrow.svg" class="arrow-icon" alt="">
        </div>
        <!-- <router-link v-if="contextStore.assignment" :to="'/course/' + contextStore.course.id + '/assignment/' + contextStore.assignment.id + '/submission/' + contextStore.submission.id" class="router-link link-style">
          <p class="fs-5 fw-semibold link-text">{{ contextStore.submission.name }}</p>
        </router-link> -->
      </template>

      <template>
        <div class="arrow-style">
          <img src="@/assets/images/arrow.svg" class="arrow-icon" alt="">
        </div>
        <a type="button" @click="" class="link-style">
          <p class="fs-5 fw-semibold link-text">gdgdgdgdg</p>
        </a>
      </template>

      <button data-bs-toggle="collapse" class="navbar-toggler toggle-style" data-bs-target="#navcol-2">
        <span class="visually-hidden">Toggle navigation</span><span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse collapse-style" id="navcol-2">
        <div class="navbar-nav ms-auto">
          <slot name="addition"></slot>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
</style>



