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
          id: 0,
          text: 'Home',
          page:'/'
        },
        {
          id: 1,
          text: 'About',
          page:'/about'
        },
        {
          id: 2,
          text: 'Search',
          page:'/search'
        },
        {
          id: 3,
          text: 'Authors',
          page:'/authors'
        },
        {
          id: 4,
          text: 'Books',
          page:'/books'
        },
        {
          id: 5,
          text: 'Borrowers',
          page:'/borrowers'
        },
        {
          id: 6,
          text: 'Check-In',
          page:'/checkin'
        },
        {
          id: 7,
          text: 'Check-Out',
          page:'/checkout'
        },
        {
          id: 8,
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