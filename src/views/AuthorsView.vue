<template>
  <div class="Authors">
    <h1>Authors</h1>
    <Authors></Authors>
  </div>
</template>

<script>
import Authors from '@/components/Authors.vue'

export default {
  name: "AuthorsView",
  components: {
      Authors
  },
  created() { 
      document.title = "Library | Authors"
  }
}
</script>

