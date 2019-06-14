<template>
  <v-container class="color-data padding" flush>
    <v-layout row justify-left align-left>
      <v-flex xs1 v-on:click="expanded = !expanded">
        <v-icon v-if="!expanded && count>0" class="clickable">expand_more</v-icon>
        <v-icon v-else-if="expanded && count>0" class="clickable">expand_less</v-icon>
      </v-flex>
      <v-flex xs11>
        <router-link v-if="typeof(id) !== 'undefined'" :id="'orgLink-'+id" :class="orgLink" :to="{ name: 'organization_view', params: { organizationId: id }}" class="hoverHighlight">{{orgName}} {{count > 0 ? count : ''}}</router-link>
        <p v-else>{{orgName}} {{count > 0 ? count : ''}}</p>
      </v-flex>
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
            id: this.org.org.id,
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
  .clickable{
    cursor: pointer;
  }

  .hoverHighlight{
    text-decoration: none;
  }

  .hoverHighlight:hover{
    text-decoration: underline;
  }

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