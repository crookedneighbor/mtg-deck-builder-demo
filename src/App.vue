<template>
  <div id="app">
    <!-- adapted from https://jsfiddle.net/tbonz/80jkq0Ls/ -->
    <section class="hero is-fullheight is-info is-bold">
      <!-- <div class="hero&#45;head"> -->
      <!--   <nav class="navbar"> -->
      <!--     <div class="navbar&#45;brand"> -->
      <!--       <a class="navbar&#45;item" href="/"> -->
      <!--         Deck Builder -->
      <!--       </a> -->
      <!--       <div class="navbar&#45;burger" @click="showNav = !showNav" :class="{ 'is&#45;active': showNav }"> -->
      <!--         <span></span> -->
      <!--         <span></span> -->
      <!--         <span></span> -->
      <!--       </div> -->
      <!--     </div> -->
      <!--     <div class="navbar&#45;menu" :class="{ 'is&#45;active': showNav }"> -->
      <!--       <div class="navbar&#45;end"> -->
      <!--         <router&#45;link to="/deck&#45;builder" class="navbar&#45;item">Deck Builder</router&#45;link> -->
      <!--       </div> -->
      <!--     </div> -->
      <!--   </nav> -->
      <!-- </div> -->

      <div class="hero-body">
        <div class="container has-text-centered">
          <router-view></router-view>
        </div>
      </div>

      <div class="hero-footer">
        <div class="container has-text-centered">
          Version v{{version}}. Made by <a class="link" href="https://twitter.com/bladebarringer">Blade Barringer</a> using the <a class="link" href="https://scryfall.com/docs/api">Scryfall API</a>, with inspiration from <a class="link" href="https://scryfall.com/">Scryfall</a> and <a class="link" href="http://tappedout.net/">Tappedout.net</a>. Report any issues to <a class="link" href="https://github.com/crookedneighbor/mtg-deck-builder-demo/issues">the issue tracker on Github</a>.
        </div>
      </div>
    </section>
  </div>
</template>

<script>
const version = require('../package.json').version

export default {
  name: 'mtg-demos',
  data () {
    return {
      showNav: false,
      version
    }
  }
}
</script>

<style>
.link {
  font-weight: bold;
  text-decoration: underline;
}
</style>
