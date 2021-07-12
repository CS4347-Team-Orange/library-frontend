<template>
    <div> <a v-bind:href="url">
        <fa-icon :icon="['fab', 'github']" /> Repo
    </a> <br /> </div>
</template>

<script>
export default {
  name: 'Repo',
  props: {
    name: String
  },
  data() {
      return {
          url: 'https://github.com/CS4347-Team-Orange/' + this.name
      }
  }
}
</script>
