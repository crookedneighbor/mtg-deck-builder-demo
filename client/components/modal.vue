<template>
  <div class="modal is-active">
    <div class="modal-background" @click="close"></div>
    <div class="modal-content">
      <div class="box">
        <slot></slot>
        <div class="buttons is-right">
          <button class="modal-button-close button is-primary" @click="close">Done</button>
        </div>
      </div>
    </div>
    <button class="modal-close is-large" aria-label="close" @click="close"></button>
  </div>
</template>

<script>
export default {
  methods: {
    close () {
      this.$emit('close')
    }
  }
}
</script>

<style scoped>
</style>
