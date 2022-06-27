<template>
  <v-container>
    <v-row>
      <v-col cols=10 offset-md=1>
        <v-data-table
          :headers="headers"
          :items="userOrgHierarchy"
          item-key="id"
          hide-default-header
          single-expand
          show-expand
        >
          <template v-slot:item="{ item, expand, isExpanded, headers }">
            <tr>
              <td>
                <v-btn icon @click="expand(!isExpanded)">
                  <v-icon>{{ isExpanded ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
                </v-btn>
              </td>
              <td>{{item.title}}</td>
              <td>
                <span v-if="item.showEdit">
                  <v-btn icon small :to="{name: 'adminOrgMembers', params: {orgId: item.id}}"><v-icon small>mdi-account-multiple-plus</v-icon></v-btn>
                  <v-btn icon small disabled><v-icon small>mdi-pencil</v-icon></v-btn>
                  <v-btn icon small disabled color="red"><v-icon small>mdi-delete</v-icon></v-btn>
                </span>
              </td>
            </tr>
          </template>
          <template v-slot:expanded-item="{ headers, item }">
            <tr v-for="(child, i) in item.children" :key="child.id" :colspan="headers.length">
              <td :class="{ borderless: i !== item.children.length-1 }"></td>
              <td>{{child.title}}</td>
              <td>
                <v-btn icon small :to="{name: 'adminOrgMembers', params: {orgId: child.id}}"><v-icon small>mdi-account-multiple-plus</v-icon></v-btn>
                <v-btn icon small disabled><v-icon small>mdi-pencil</v-icon></v-btn>
                <v-btn icon small disabled color="red"><v-icon small>mdi-delete</v-icon></v-btn>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from 'vuex';

export default{

    name: 'admin-table',

    props: {
    },
    data() {
        return {
          headers: [
            { text: 'Name', value: 'title', align: "start" },
            { text: 'Actions', value: 'actions', sortable: false, align: "end" },
            { text: '', value: 'data-table-expand' }
          ]
        }
    },

    computed: {
      ...mapState({
          userOrgs: state => state.organization.userOrgs,
          orgDict: state => state.organization.orgList,
          sysAdmin: state => state.user.sysAdmin
      }),
      userOrgHierarchy: function() {
        let topOrgs = [];
        for (let org in this.orgDict) {
          let topOrg = this.orgDict[org];
          if (typeof(topOrg.id) === 'undefined') { continue; }
          if (this.hasOrgAdmin(topOrg.id)) {
            topOrg['showEdit'] = true;
            topOrgs.push(topOrg);
          } else {
            let editableChildren = [];
            for (let child of topOrg.children) {
              if (this.hasOrgAdmin(child.id)) {
                editableChildren.push(child);
              }
            }
            if (editableChildren.length > 0) {
              topOrg['showEdit'] = false;
              topOrg['children'] = editableChildren;
              topOrgs.push(topOrg);
            }
          }
        }
        return topOrgs;
      }
    },

    methods: {
      trackOrg(orgName) {
        this.$gtag.event(`Toggle ${orgName}`, {
          'event_category': 'Menu',
          'event_label': 'Sub-orgs'
        })
      },
      hasOrgAdmin(id) {
        if (this.sysAdmin) {
          return true;
        } else {
          for (let userOrg in this.userOrgs) {
            if (userOrg.value === id && userOrg.role === 'admin') {
              return true;
            }
          }
        }
        return false;
      }
    },

    mounted() {
      this.$store.dispatch('organization/getOrgs');
    }

}
</script>

<style>
  .v-data-table > .v-data-table__wrapper tbody tr.v-data-table__expanded__content {
    box-shadow: none;
  }
  .borderless {
    border: none !important;
  }
</style>
