<template>
  <div id="app">
    <!-- adapted from https://jsfiddle.net/tbonz/80jkq0Ls/ -->
    <section class="hero is-fullheight is-info is-bold">
      <div class="hero-head">
        <nav class="navbar">
          <div class="navbar-brand">
            <a class="navbar-item" href="/">
              Deck Builder
            </a>
          <!--   <div class="navbar&#45;burger" @click="showNav = !showNav" :class="{ 'is&#45;active': showNav }"> -->
          <!--     <span></span> -->
          <!--     <span></span> -->
          <!--     <span></span> -->
          <!--   </div> -->
          </div>
          <!-- <div class="navbar&#45;menu" :class="{ 'is&#45;active': showNav }"> -->
          <!--   <div class="navbar&#45;end"> -->
          <!--     <router&#45;link to="/deck&#45;builder" class="navbar&#45;item">Deck Builder</router&#45;link> -->
          <!--   </div> -->
          <!-- </div> -->
        </nav>
      </div>

      <div class="hero-body">
        <div class="container has-text-centered">
          <router-view></router-view>
        </div>
      </div>
		</section>
  </div>
</template>

<script>
export default {
  name: 'mtg-demos',
  data () {
    return {
      showNav: false
    }
  }
}
</script>

<style scoped>
</style>
