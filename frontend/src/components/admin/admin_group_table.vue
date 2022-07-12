<template>
  <v-container>
    <v-row>
      <v-col cols=10 offset-md=1>
        <v-data-table
          :headers="headers"
          :items="userGroups"
          item-key="id"
          hide-default-header
          sort-by="title"
        >
          <template v-slot:item="{ item, expand, isExpanded, headers }">
            <tr class="blue-hover">
              <td class="pl-8 group-title">{{item.title}}</td>
              <td>
                <span class="float-right">
                  <v-btn icon :to="{name: 'adminGroupMembers', params: {orgId: item.name}}" color="primary"><v-icon>mdi-account-multiple-plus</v-icon></v-btn>
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

    name: 'admin-group-table',

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
          userGroups: state => state.group.userGroups,
          sysAdmin: state => state.user.sysAdmin
      }),
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
      this.$store.dispatch('group/getUserGroups');
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
  .group-title {
    cursor: default;
    font-weight: bolder;
  }
  .blue-hover:hover {
    background: var(--v-accent-lighten3) !important;
  }
</style>
