<template>
  <div>
    <v-breadcrumbs :items="breadcrumbs" class="breadcrumbs pl-3 py-0" divider="/">
      <template v-slot:item="props">
        <router-link class="crumb" v-if="props.item.route && props.item.icon" :to="props.item.route" exact><v-icon>{{props.item.icon}}</v-icon></router-link>
        <router-link class="crumb" v-else-if="props.item.route" :to="props.item.route" exact>{{props.item.translate ? $tc(props.item.label) : props.item.label}}</router-link>
        <span class="crumb" v-else>{{props.item.translate ? $tc(props.item.label) : props.item.label}}</span>
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

    .breadcrumbs{
      font-weight: bold;
      font-size: 23px;
      color: var(--v-faded_text-base);
    }

    .crumb{
      color: var(--v-label_colour-base);
    }
</style>

<style>
  .breadcrumbs.v-breadcrumbs li{
    font-weight: bold;
    font-size: 23px;
    color: var(--v-faded_text-base);
  }
</style>
