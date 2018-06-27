<template>
  <div class="modal" :class="{'is-active': open}">
    <div class="modal-background" @click="close"></div>
    <div class="modal-content">
      <div class="box">
        <slot></slot>
        <div class="buttons is-right">
          <button class="button is-primary" @click="close">Done</button>
        </div>
      </div>
    </div>
    <button class="modal-close is-large" aria-label="close" @click="close"></button>
  </div>
</template>

<script>
export default {
  props: ['open'],
  data () {
    return {
    }
  },
  computed: {
    active() {
      return this.open
    }
  },
  methods: {
    close() {
      this.$emit('close-modal')
    }
  }
}
</script>

<style scoped>
</style>

