<template>
  <v-app id="app">
      <Header></Header>
      <router-view />
      <Footer></Footer>
  </v-app>
</template>

<script>
import Header from './components/Header'
import Footer from './components/Footer'

export default {
  name: 'app',
  components: {
      Header,
      Footer
  }
}
</script>

<style>
  .v-card--flat{
    background-color: transparent !important;
  }
  *{
    text-transform: none !important;
  }
</style>
