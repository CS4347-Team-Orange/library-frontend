<template>
  <div class="about">
    <h1>About</h1>
      <a href="https://github.com/CS4347-Team-Orange"><fa-icon :icon="['fab', 'github']" /> Team</a>
      <br />
      <br />
      <br />
      
      <h2>Frontend</h2>
      <Repo name="library-frontend"/><br />
      The project uses 
      <a href=""><fa-icon :icon="['fab', 'vuejs']" />VueJS</a>
      to render the frontend components.  <br />
      The SPA uses <a href="">vue-router</a> to serve the frontend as a single page app. <br />
      It uses <a href=""><fa-icon :icon="['fab', 'font-awesome']" />FontAwesome</a> for the icons. <br />
      TypeScript...<br />
      Bootstrap...<br />
      vue-bootstrap-3 is currently under development (fork for this project)
      <br />
      <br />
      <br />
    <h2>Backend</h2>
      <Repo name="library-backend"/><br />
      <br />
      <br />
      <br />
    <h2>Database</h2> 
      <Repo name="library-db"/><br />
      <br />
      <br />
      <br />

  </div>
</template>

<script>
  
  import Repo from '@/components/Repo.vue'
  export default {
    name: "About",
    components: {
        Repo
    },
    created() { 
        document.title = "Library | About"
    }
  }
</script>

