<template>
    <v-container v-if="error">
        <div row align-center justify-center>
            <h1><v-icon x-large>error</v-icon> An Error Occured: {{error.code}}</h1>
            <p><v-icon x-large>sentiment_very_dissatisfied</v-icon> Please try again or contact your system administrator</p>
        </div>
    </v-container>
    <v-container v-else fluid class="raise">
        <Breadcrumb :breadcrumbs="breadcrumbs"></Breadcrumb>
        <v-row wrap>
            <v-col cols=2></v-col>
            <v-col cols=8>
                <v-text-field v-model="searchText" label="Search groups..." v-on:keyup="search"></v-text-field>
            </v-col>
        </v-row>
        <v-row wrap>
          <v-col cols=2></v-col>
          <v-col cols=4>
              {{count}} {{$tc('Groups', count)}}
          </v-col>
          <v-col cols=4>
          </v-col>
      </v-row>
        <v-row wrap align-center justify-center>
            <v-btn text v-on:click="what = !what"><v-icon>help</v-icon></v-btn>

            <v-col cols=12 v-if="what">
              <p>What are Groups?</p>
              <p>
                  You can use CKAN Groups to create and manage collections of datasets. This could be to catalogue
                  datasets for a particular project or team, or on a particular theme, or as a very simple way to help
                  people find and search your own published datasets.
              </p>
            </v-col>


        </v-row>
        <v-row wrap>
            <v-col cols=4 v-for="group in groups" :key="'group-card-'+group.id">
                <GroupCard :group="group"></GroupCard>
            </v-col>
        </v-row>
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
                groups: [],
                error: null
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
                        if (data.success) {
                            this.groups = data.result;
                            this.count = data.result.length;
                            localStorage.groupList = JSON.stringify(this.groups);
                        } else {
                            this.error = data.error;
                        }
                    });
                }
            }
        }
    }
</script>

<style scoped>
    .raise {
        margin-bottom: 45px;
    }
</style>
