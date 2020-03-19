<template>
  <v-container class="mb-2 py-0 px-0">
    <v-expansion-panels flat tile :readonly="count === 0" :class="count === 0 ? 'noPointer' : ''">
      <v-expansion-panel>
        <v-expansion-panel-header :class="top ? 'filterPanelHeader' : 'subHeader'">
          <span>
            <router-link v-if="typeof(id) !== 'undefined'" :id="'orgLink-'+id" :to="{ name: 'organization_view', params: { organizationId: id }}" class="hoverHighlight orgLink">{{orgName}} {{count > 0 ? '' : ''}}</router-link>
            <p v-else>{{orgName}} {{count > 0 ? '' : ''}}</p>
          </span>
          <template v-slot:actions>
            <v-icon v-if="count > 0">mdi-chevron-down</v-icon>
            <span v-else></span>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content v-if="count > 0">
          <org-tree :top="false" v-for="org in children" :key="'org-tree-'+id+'-'+org.id" :org="{key: org.title, org: org}"></org-tree>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>

  </v-container>

</template>

<script>

export default{

    name: 'org-tree',

    props: {
        org: Object,
        top: Boolean
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

  .filterPanelHeader{
    background: var(--v-primary-base);
    color: var(--v-text-base);
  }

  .subHeader{
    color: var(--v-primary-base);
    background: var(--v-text-base);
  }

  .filterPanelHeader .orgLink{
    color: var(--v-text-base);
  }

  .subHeader .orgLink{
    color: var(--v-primary-base);
  }

  [type=button].noPointer, button.noPointer{
    cursor: auto !important;
  }


</style>