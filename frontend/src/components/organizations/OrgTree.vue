<template>
  <v-container class="color-data padding" flush>
    <v-layout row justify-left align-left v-on:click="expanded = !expanded">
      <v-flex xs1>
        <v-icon v-if="!expanded && count>0">expand_more</v-icon>
        <v-icon v-else-if="expanded && count>0">expand_less</v-icon>
      </v-flex>
      <v-flex xs11>{{orgName}} {{count > 0 ? count : ''}}</v-flex>
    </v-layout>
    <v-container flush v-if="expanded">
      <org-tree v-for="org in children" :key="'org-tree-'+id+'-'+org.id" :org="{key: org.title, org: org}"></org-tree>
    </v-container>
  </v-container>
</template>

<script>

export default{

    name: 'org-tree',

    props: {
        org: Object
    },
    data() {
        return {
            orgName: this.org.key ? this.org.key : '',
            children: [],
            count: 0,
            id: this.org.id,
            expanded: false
        }
    },

    mounted() {
        this.children =  this.org.org.children ? this.org.org.children : [];
        this.count = this.children.length;

    }

}
</script>

<style scoped>
  .color-data{
     background-color: var(--v-data-base);
  }

  .padding{
    padding: 10px;
  }

  div.container.flush:not(.padding){
    padding: 0px;
  }

</style>