<template>
  <div>
    <v-breadcrumbs :items="breadcrumbs" divider="/">
      <template v-slot:item="props">
        <router-link :to="props.item.route" exact>{{props.item.label}}</router-link>
      </template>
    </v-breadcrumbs>
  </div>
</template>

<script>
export default{
    props: {
        breadcrumbs: Array
    },
}
</script>

<style scoped>
    @import "https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css";
</style>