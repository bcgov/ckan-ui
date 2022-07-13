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
          sort-by="title"
        >
          <template v-slot:item="{ item, expand, isExpanded, headers }">
            <tr class="blue-hover">
              <td>
                <v-btn icon @click="expand(!isExpanded)" v-if="item.children.length > 0">
                  <v-icon>{{ isExpanded ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
                </v-btn>
              </td>
              <td class="default-cursor bolder">{{item.title}}</td>
              <td>
                <span v-if="item.showEdit" class="float-right">
                  <v-btn icon :to="{name: 'adminOrgMembers', params: {orgId: item.id}}" color="primary"><v-icon>mdi-account-multiple-plus</v-icon></v-btn>
                  <v-btn icon disabled color="primary"><v-icon>mdi-pencil</v-icon></v-btn>
                  <v-btn icon disabled color="red"><v-icon>mdi-delete</v-icon></v-btn>
                </span>
              </td>
            </tr>
          </template>
          <template v-slot:expanded-item="{ headers, item }">
            <tr v-for="(child, i) in item.children" :key="child.name" :colspan="headers.length" class="blue-hover">
              <td :class="{ borderless: i !== item.children.length-1 }"></td>
              <td class="default-cursor">{{child.title}}</td>
              <td>
                <span class="float-right">
                  <v-btn icon :to="{name: 'adminOrgMembers', params: {orgId: child.name}}" color="primary"><v-icon>mdi-account-multiple-plus</v-icon></v-btn>
                  <v-btn icon disabled color="primary"><v-icon>mdi-pencil</v-icon></v-btn>
                  <v-btn icon disabled color="red"><v-icon>mdi-delete</v-icon></v-btn>
                </span>
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

    name: 'admin-org-table',

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
      hasOrgAdmin(id) {
        if (this.sysAdmin) {
          return true;
        } else {
          for (let userOrg of this.userOrgs) {
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
  .default-cursor {
    cursor: default;
  }
  .bolder {
    font-weight: bolder;
  }
  .blue-hover:hover {
    background: var(--v-accent-lighten3) !important;
  }
</style>
