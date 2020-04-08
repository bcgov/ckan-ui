<template>
  <v-container class="mb-2 py-0 px-0" v-if="typeof(org.org) !== 'undefined'">
    <v-expansion-panels flat tile :readonly="count === 0" :class="'noShadow' + (count === 0 ? ' noPointer' : '')">
      <v-expansion-panel>
        <v-expansion-panel-header :class="top ? 'filterPanelHeader' : 'subHeader'">
          <span>
            <v-icon v-if="count > 0" :color="top ? 'text' : 'label_colour'">mdi-chevron-down</v-icon>
            <router-link v-if="typeof(id) !== 'undefined'" :id="'orgLink-'+id" :to="{ name: 'organization_view', params: { organizationId: org.org.name }}" class="hoverHighlight orgLink">{{orgName}} {{count > 0 ? '' : ''}}</router-link>
            <p v-else>{{orgName}} {{count > 0 ? '' : ''}}</p>
          </span>
          <template v-slot:actions>
            <span></span>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content class="pt-3" v-if="count > 0">
          <org-tree :top="false" v-for="org in children" :key="'org-tree-'+id+'-'+org.id" :passedOrg="{key: org.title, org: org}"></org-tree>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>

  </v-container>

</template>

<script>
import {mapState} from 'vuex';

export default{

    name: 'org-tree',

    props: {
        passedOrg: Object,
        top: Boolean
    },
    data() {
        return {
            orgName: this.passedOrg.key ? this.passedOrg.key : '',
            children: [],
            count: 0,
            id: this.passedOrg.org.id,
            expanded: false,
            org: {}
        }
    },

    computed: {
      ...mapState({
          organizations: state => state.organization.orgList,
      }),
    },

    mounted() {
        if (typeof(this.organizations[this.id]) !== "undefined"){
          this.org = {
            org: this.organizations[this.id],
            key: this.orgName
          }
        }else{
          this.org = this.passedOrg;
        }
        
        this.children =  this.org.org.children ? this.org.org.children.sort() : [];
        this.count = this.children.length;

    }

}
</script>

<style scoped>
  .clickable{
    cursor: pointer;
  }

  .noShadow{
    box-shadow: none;
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
    background: var(--v-menu_secondary-base);
    color: var(--v-text-base);
    font-weight: bold;
    font-size: 16px;
  }

  .subHeader{
    color: var(--v-primary-base);
    background: var(--v-text-base);
  }

  .filterPanelHeader .orgLink{
    color: var(--v-text-base);
  }

  .subHeader .orgLink{
    color: var(--v-label_colour-base);
  }

  [type=button].noPointer, button.noPointer{
    cursor: auto !important;
  }


</style>

<style>
  .noShadow .v-expansion-panel:before{
    box-shadow: none;
  }
</style>