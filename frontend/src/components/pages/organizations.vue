<template>
    <v-container fluid>
        <Breadcrumb :breadcrumbs="breadcrumbs"></Breadcrumb>
        <v-layout row wrap>
            <v-flex xs2></v-flex>
            <v-flex xs8>
                <v-text-field v-model="searchText" label="Search Organizations" v-on:keyup="search"></v-text-field>
            </v-flex>
        </v-layout>
        <v-layout row wrap>
          <v-flex xs2></v-flex>
          <v-flex xs4>
              {{count}} Organizations
          </v-flex>
          <v-flex xs4>
          </v-flex>
      </v-layout>
        <v-layout row wrap align-center justify-center>
            <v-btn flat v-on:click="what = !what"><v-icon>help</v-icon></v-btn>

            <v-flex xs12 v-if="what">
              <p>What are Organizations?</p>
              <p>
                  The responsibility to manage Datasets, APIs and Applications (collectively resources) and the
                  descriptive information about these resources (metadata), rests with the organizations that have Data
                  Custodial responsibility for the resources. In the public sector this is typically a branch of a
                  ministry. In this case the Data Custodian is the Director or Executive Director of the branch.
              </p>
            </v-flex>


        </v-layout>
        <OrgTree v-for="(org, key) in organizations" :key="'org-tree-'+key" :org="{key: key, org: org}"></OrgTree>
    </v-container>
</template>

<script>
    /* eslint-disable */
    import Breadcrumb from '../breadcrumb/Breadcrumb'
    import OrgTree from '../organizations/OrgTree'
    import {CkanApi} from '../../services/ckanApi'

    let ckanServ = new CkanApi()
    import {Analytics} from '../../services/analytics'
    const analyticsServ = new Analytics()

    export default {
        components: {
            Breadcrumb: Breadcrumb,
            OrgTree: OrgTree
        },

        data() {
            return {
                breadcrumbs: [
                    {icon: "home", label: 'Home', route: '/'},
                    {label: 'Organizations'}
                ],
                searchText: '',
                count: 0,
                what: false,
                organizations: {},
                baseOrganizations: {}
            }
        },

        methods: {
            search: function(e){
                if (e.keyCode === 13) {
                    this.findOrgs();
                }
            },

            findOrgs(){
                if (this.searchText === '') {
                    if (localStorage.orgList) {
                        this.organizations = JSON.parse(localStorage.orgList);
                        this.baseOrganizations = this.organizations;
                        this.count = Object.keys(this.organizations).length;
                    } else {
                        ckanServ.getOrgList().then((data) => {
                            localStorage.orgList = JSON.stringify(data.orgList);
                            this.organizations = data.orgList;
                            this.baseOrganizations = data.orgList;
                            this.count = Object.keys(this.organizations).length;
                        });
                    }
                }else{
                    let result = {};
                    let okeys = Object.keys(this.baseOrganizations);
                    for (let i=0; i<okeys.length; i++){
                        if (okeys[i].toLowerCase().indexOf(this.searchText.toLowerCase()) >= 0){
                            result[okeys[i]] = this.baseOrganizations[okeys[i]];
                        }
                    }

                    this.organizations = result;
                    this.count = Object.keys(this.organizations).length;
                }


            }
        },

        mounted() {
            analyticsServ.get(window.currentUrl, this.$route.meta.title, window.previousUrl);
            this.findOrgs();
        }
    }

</script>
