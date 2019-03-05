<template>
  <v-card flat style="margin-bottom:.5rem">
    <p>{{desc}}</p>
  </v-card>
</template>

<script>
export default{
    props: {
        desc: String
    },
}
</script>

<style scoped>
    @import "https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css";

    .container{
        padding-bottom:15px;
    }
</style>