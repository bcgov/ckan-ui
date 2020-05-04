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

  @font-face{
    font-family: 'BC Sans';
    src: url("/fonts/BCSans-Regular.woff") format("woff");
    font-weight: normal;
    font-style: normal;
  }

  @font-face{
    font-family: 'BC Sans';
    src: url("/fonts/BCSans-Bold.woff") format("woff");
    font-weight: bold;
    font-style: normal;
  }

  @font-face{
    font-family: 'BC Sans';
    src: url("/fonts/BCSans-BoldItalic.woff") format("woff");
    font-weight: bold;
    font-style: italic;
  }

  @font-face{
    font-family: 'BC Sans';
    src: url("/fonts/BCSans-Italic.woff") format("woff");
    font-weight: normal;
    font-style: italic;
  }

  #app{
    font-family: "BC Sans",Roboto,sans-serif;
  }
  .v-card--flat{
    background-color: transparent !important;
  }
  *{
    text-transform: none !important;
  }
</style>
