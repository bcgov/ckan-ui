<template>
    <v-container v-if="error">
        <div row align-center justify-center>
            <h1><v-icon x-large>error</v-icon> An Error Occured: {{error.code}}</h1>
            <p><v-icon x-large>sentiment_very_dissatisfied</v-icon> Please try again or contact your system administrator</p>
        </div>
    </v-container>
    <v-container v-else fluid>
        <v-row wrap>
            <v-col cols=12 class="">
                <h2 class="primary-text">{{$tc('Groups', 2)}}</h2>
            </v-col>
        </v-row>
        <v-row wrap dense class="d-flex d-sm-none">
            <v-col cols=12 v-if="sysAdmin">
                <v-expansion-panels v-model="manageExpanded">
                    <v-expansion-panel>
                        <v-expansion-panel-header class="header">{{$tc('Manage')}}</v-expansion-panel-header>
                        <v-expansion-panel-content dense class="manageSection">
                            <v-btn class="primary" :to="{name: 'group_create'}">Add Group</v-btn>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
            </v-col>
            <v-col cols=12>
                <v-expansion-panels v-model="aboutExpanded">
                    <v-expansion-panel>
                        <v-expansion-panel-header class="header">{{$tc('Groups', 2)}}</v-expansion-panel-header>
                        <v-expansion-panel-content>
                            {{$tc('groupAbout')}}
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
            </v-col>
        </v-row>
        <v-row wrap dense class="mb-0 pb-0 d-none">
            <v-col cols=12 sm=8>
                <v-text-field solo v-model="searchText" append-icon="search" :label="$tc('Search') + ' ' + $tc('Groups', 2)" v-on:keyup="search"></v-text-field>
            </v-col>
        </v-row>
        <v-row wrap dense class="mt-0 pt-0 d-none">
          <v-col cols=4>
              {{count}} {{$tc('Groups', count)}}
          </v-col>
      </v-row>
        <v-row wrap align="start" class="mb-8">
            <v-col cols=12 sm=8>
                <GroupCard v-for="(group, key) in groups" :key="'group-'+key" :group="group" v-on:groupClicked="navTo(group)" class="pointer"></GroupCard>
            </v-col>
            <v-col cols=4 class="d-none d-sm-block">
                <v-row class="manageSection mb-0" v-if="sysAdmin">
                    <v-card elevation=0>
                        <v-card-title class='header mb-2'>{{$tc('Manage', 2)}}</v-card-title>
                    </v-card>
                </v-row>
                <v-row class="manageSection mb-5" v-if="sysAdmin">
                    <v-btn class="primary" :to="{name: 'group_create'}">Add Group</v-btn>
                </v-row>
                <v-row>
                    <v-card elevation=0>
                        <v-card-title class='header mb-2'>{{$tc('Groups', 2)}}</v-card-title>
                        <v-card-text>
                            {{$tc('groupAbout')}}
                        </v-card-text>
                    </v-card>
                </v-row>
            </v-col>
        </v-row>
        <v-row>
        </v-row>
    </v-container>
</template>

<script>
    import GroupCard from '../groups/GroupCard'

    import { mapState } from "vuex";

    import {Analytics} from '../../services/analytics'
    const analyticsServ = new Analytics()

    export default {
        name: "groups",
        components: {
            GroupCard: GroupCard,
        },

        data() {
            return {
                searchText: (this.st) ? this.st : "",
                count: 0,
                error: null,
                loading: false,
                aboutExpanded: 0,
                manageExpanded: 0
            }
        },
        mounted() {
            analyticsServ.get(window.currentUrl, this.$route.meta.title, window.previousUrl);
            this.$store.dispatch('group/getGroups');
            this.count = this.groups.length;
        },
        
        watch: {
            groups(newVal){
                this.count = newVal.length;
            }
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
                this.$store.dispatch('group/searchGroups', {searchText: this.searchText});
                this.count = this.groups.length;
            },

            navTo(group){
                this.$router.push({name: "group_view",  params: { groupId: group.name } })
            }
        }
    }
</script>

<style scoped>
    .raise {
        margin-bottom: 45px;
    }

    .header{
        background-color: var(--v-primary-base);
        color: var(--v-text-base);
    }
    
    .primary-text{
        color: var(--v-primary-base)
    }

    .manageSection .v-card, .manageSection .v-card__title, .manageSection a.primary{
        width: 100%;
    }

    .pointer{
        cursor: pointer;
    }

</style>

<style>
    .theme--light.v-expansion-panels .v-expansion-panel-header .v-expansion-panel-header__icon .v-icon{
        color: var(--v-text-base) !important;
    }

    .manageSection .v-expansion-panel-content__wrap{
        padding: 0 !important;
        padding-top: 5px !important;
    }
</style>