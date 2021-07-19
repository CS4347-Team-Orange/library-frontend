<template>
  <div class="CheckoutView">
    <h3>Check Out</h3>
      <center>
          <BookTransaction action="out" />
      </center>
  </div>
</template>

<script>
import BookTransaction from '@/components/BookTransaction.vue'

export default {
  name: 'CheckoutView',
  components: {
    BookTransaction
  },
  created() { 
      document.title = "Library | Checkout"
  }
}
</script>