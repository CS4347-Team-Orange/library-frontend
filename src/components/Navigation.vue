<template>
  <div>
      <router-link class="spacing" v-for="routes in links" 
      v-bind:key="routes.id"
      :to="`${routes.page}`">{{routes.text}}</router-link>
  </div>
</template>

<script>
export default {
  name: 'Navigation',
  data() {
    return {
      links: [
        {
          id: 1,
          text: 'Home',
          page:'/'
        },
        {
          id: 2,
          text: 'Catalog',
          page:'/catalog'
        },
        {
          id: 3,
          text: 'Authors',
          page:'/authors'
        },
        {
          id: 4,
          text: 'Borrowers',
          page:'/borrowers'
        },
        {
          id: 5,
          text: 'Check-In',
          page:'/checkin'
        },
        {
          id: 6,
          text: 'Check-Out',
          page:'/checkout'
        },
        {
          id: 7,
          text: 'Functions',
          page:'/functions'
        }
      ]
    }
  }
}
</script>
<style>
.spacing {
  margin-right: 10px;
}
</style>