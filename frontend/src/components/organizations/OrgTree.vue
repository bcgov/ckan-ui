<template>
  <v-container class="mb-2 py-0 px-0" v-if="typeof(org.org) !== 'undefined'">
    <v-expansion-panels flat tile :readonly="count === 0" :class="'noShadow' + (count === 0 ? ' noPointer' : '')">
      <v-expansion-panel class="no-background">
        <v-expansion-panel-header :class="top ? 'py-2 filterPanelHeader' + (count > 0 ? ' px-0' : ' pl-10') : 'py-2 subHeader' + (count > 0 ? ' px-0' : ' pl-10')" @click="trackOrg(orgName)">
          <span>
            <v-icon v-if="count > 0" class="px-2" :color="top ? 'text' : 'label_colour'">mdi-chevron-down</v-icon>
            <router-link v-if="typeof(id) !== 'undefined'" :id="'orgLink-'+id" :to="{ name: 'organization_view', params: { organizationId: org.org.name }}" class="hoverHighlight orgLink">{{orgName}} {{count > 0 ? '' : ''}}</router-link>
            <p v-else class="d-inline">{{orgName}} {{count > 0 ? '' : ''}}</p>
          </span>
          <template v-slot:actions>
            <span></span>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content class="pt-3 mr-n6 mb-n4" v-if="count > 0">
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

    methods: {
      trackOrg(orgName) {
        this.$gtag.event('view_org', {
          'org_name': orgName
        })
      }
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
    height: 40px;
    line-height: 40px;
    min-height: 40px;
    vertical-align: middle;
  }

  .subHeader{
    color: var(--v-primary-base);
    background: var(--v-text-base);
    height: 40px;
    line-height: 40px;
    min-height: 40px;
    vertical-align: middle;
  }

  .v-expansion-panel--active>.v-expansion-panel-header.filterPanelHeader{
    min-height: unset;
  }

  .v-expansion-panel--active>.v-expansion-panel-header.subHeader{
    min-height: unset;
  }

  .filterPanelHeader .orgLink{
    color: var(--v-text-base);
  }

  .subHeader .orgLink{
    color: var(--v-label_colour-base);
    font-weight: bold;
    font-size: 16px;
  }

  .v-expansion-panels .no-background.v-expansion-panel {
    background: none;
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
