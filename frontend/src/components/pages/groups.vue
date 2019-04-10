<template>
    <v-container fluid>
        <Breadcrumb :breadcrumbs="breadcrumbs"></Breadcrumb>
        <v-layout row wrap>
            <v-flex xs2></v-flex>
            <v-flex xs8>
                <v-text-field v-model="searchText" label="Search groups..." v-on:keyup="search"></v-text-field>
            </v-flex>
        </v-layout>
        <v-layout row wrap>
          <v-flex xs2></v-flex>
          <v-flex xs4>
              {{count}} {{$tc('Groups', count)}}
          </v-flex>
          <v-flex xs4>
          </v-flex>
      </v-layout>
        <v-layout row wrap align-center justify-center>
            <v-btn flat v-on:click="what = !what"><v-icon>help</v-icon></v-btn>

            <v-flex xs12 v-if="what">
              <p>What are Groups?</p>
              <p>
                  You can use CKAN Groups to create and manage collections of datasets. This could be to catalogue
                  datasets for a particular project or team, or on a particular theme, or as a very simple way to help
                  people find and search your own published datasets.
              </p>
            </v-flex>


        </v-layout>
        <v-layout row wrap>
            <v-flex xs4 v-for="group in groups" :key="'group-card-'+group.id">
                <GroupCard :group="group"></GroupCard>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import Breadcrumb from '../breadcrumb/Breadcrumb'
    import GroupCard from '../groups/GroupCard'

    import {Analytics} from '../../services/analytics'
    const analyticsServ = new Analytics()


    import {CkanApi} from '../../services/ckanApi'
    let ckanServ = new CkanApi()

    export default {
        name: "groups",
        components: {
            Breadcrumb: Breadcrumb,
            GroupCard: GroupCard,
        },

        data() {
            return {
                breadcrumbs: [
                    {icon: "home", label: 'Home', route: '/'},
                    {label: 'Groups'}
                ],
                what: false,
                searchText: "",
                count: 0,
                groups: []
            }
        },
        mounted() {
            analyticsServ.get(window.currentUrl, this.$route.meta.title, window.previousUrl);
            this.findGroups()
        },
        methods:{
            search: function(e){
                if (e.keyCode === 13) {
                    this.findGroups();
                }
            },

            findGroups() {
                if (localStorage.groupList) {
                    this.groups = JSON.parse(localStorage.groupList);
                    if (this.searchText !== ""){
                        let result = [];
                        for (let i=0; i<this.groups.length; i++){
                            if (this.groups[i].display_name.toLowerCase().indexOf(this.searchText.toLowerCase()) >= 0){
                                result.push(this.groups[i]);
                            }
                        }

                        this.groups = result;
                    }
                    this.count = this.groups.length;
                } else {
                    ckanServ.getGroupList().then((data) => {
                        this.groups = data.result;
                        this.count = data.result.length;
                        localStorage.groupList = JSON.stringify(this.groups);
                    });
                }
            }
        }
    }
</script>

<style scoped>

</style>