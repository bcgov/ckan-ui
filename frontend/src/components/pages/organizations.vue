<template>
    <v-container v-if="error">
        <div row align-center justify-center>
            <h1><v-icon x-large>error</v-icon> An Error Occured: {{error.code}}</h1>
            <p><v-icon x-large>sentiment_very_dissatisfied</v-icon> Please try again or contact your system administrator</p>
        </div>
    </v-container>
    <v-container v-else fluid>
        <Breadcrumb :breadcrumbs="breadcrumbs"></Breadcrumb>
        <v-row wrap>
            <v-col cols=2></v-col>
            <v-col cols=8>
                <v-text-field v-model="searchText" label="Search Organizations" v-on:keyup="search"></v-text-field>
            </v-col>
        </v-row>
        <v-row wrap>
          <v-col cols=2></v-col>
          <v-col cols=4>
              {{count}} Organizations
          </v-col>
          <v-col cols=4>
          </v-col>
      </v-row>
        <v-row wrap align-center justify-center>
            <v-btn text v-on:click="what = !what"><v-icon>help</v-icon></v-btn>
            <v-col cols=12 v-if="what">
              <p>What are Organizations?</p>
              <p>
                  The responsibility to manage Datasets, APIs and Applications (collectively resources) and the
                  descriptive information about these resources (metadata), rests with the organizations that have Data
                  Custodial responsibility for the resources. In the public sector this is typically a branch of a
                  ministry. In this case the Data Custodian is the Director or Executive Director of the branch.
              </p>
            </v-col>
        </v-row>
        <OrgTree v-for="(org, key) in organizations" :key="'org-tree-'+key" :org="{key: key, org: org}"></OrgTree>
    </v-container>
</template>

<script>
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
                baseOrganizations: {},
                error: null,
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
                            if (data.success) {
                                localStorage.orgList = JSON.stringify(data.orgList);
                                this.organizations = data.orgList;
                                this.baseOrganizations = data.orgList;
                                this.count = Object.keys(this.organizations).length;
                            } else {
                                this.error = data.error;
                            }
                        });
                    }
                } else {
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
