<template>
  <div>
    <v-breadcrumbs :items="breadcrumbs" divider="/">
      <template v-slot:item="props">
        <router-link v-if="props.item.route && props.item.icon" :to="props.item.route" exact><v-icon>{{props.item.icon}}</v-icon></router-link>
        <router-link v-else-if="props.item.route" :to="props.item.route" exact>{{props.item.label}}</router-link>
        <span v-else>{{props.item.label}}</span>
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

    span {
      color: gray;
    }
</style>