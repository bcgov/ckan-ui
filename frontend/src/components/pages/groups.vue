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
            <v-btn
                v-if="showCreate"
                fab
                fixed
                bottom
                right
                color="info"
                class="text-xs-center"
                :to="{name: 'group_create'}"
            >
                    <v-icon>edit</v-icon>
            </v-btn>
            <v-col cols=4 v-for="group in groups" :key="'group-card-'+group.id">
                <GroupCard :group="group"></GroupCard>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import Breadcrumb from '../breadcrumb/Breadcrumb'
    import GroupCard from '../groups/GroupCard'

    import { mapState } from "vuex";

    import {Analytics} from '../../services/analytics'
    const analyticsServ = new Analytics()

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
                searchText: (this.st) ? this.st : "",
                count: 0,
                error: null,
                loading: false,
            }
        },
        mounted() {
            analyticsServ.get(window.currentUrl, this.$route.meta.title, window.previousUrl);
            this.$store.dispatch('group/getGroups');
        },
        computed: {
            ...mapState({
                st: state => state.group.searchText,
                groupList: state => state.group.groups,
                groups: state => state.group.searchedGroups,
                sysAdmin: state => state.user.sysAdmin,
                isAdmin: state => state.user.isAdmin,
                isEditor: state => state.user.isEditor,
                userLoading: state => state.user.userLoading,
            }),
            showCreate: function(){
                // TODO: IF you aren't overriding the admin functionality like BCDC CKAN does then this is what you want
                //return ( ((this.sysAdmin) || (this.userPermissions[this.dataset.organization.name] === "admin") || (this.userPermissions[this.dataset.organization.name] === "editor")));

                return ( (!this.loading) && (!this.userLoading) && ((this.sysAdmin) || (this.isAdmin) || (this.isEditor)) );
            },
        },
        methods:{
            search: function(e){
                if (e.keyCode === 13) {
                    this.findGroups();
                }
            },

            findGroups() {   
                this.$store.dispatch('group/searchGroups', {searchText: this.searchText})
            }
        }
    }
</script>

<style scoped>
    .raise {
        margin-bottom: 45px;
    }
</style>
