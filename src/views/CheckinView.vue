<template>
  <div class="CheckinView">
    <h3>Check In</h3>
      <BookTransaction action="in" />
  </div>
</template>

<script>
import BookTransaction from '@/components/BookTransaction.vue'

export default {
  name: 'CheckinView',
  components: {
    BookTransaction
  },
  created() { 
      document.title = "Library | Checkin"
  }
}
</script>