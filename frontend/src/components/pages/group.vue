<template>
    <v-container v-if="error">
        <div row align-center justify-center>
            <h1><v-icon x-large>error</v-icon> An Error Occured: {{error.code}}</h1>
            <p><v-icon x-large>sentiment_very_dissatisfied</v-icon> Please try again or contact your system administrator</p>
        </div>
    </v-container>
    <v-container v-else fluid>
        <v-alert
            :value="group.state === 'deleted'"
            type="warning">
            You are viewing a deleted group
        </v-alert>
        <v-row>
            <router-link to='/groups' class="nounderline"><v-icon color="primary">mdi-arrow-left</v-icon>Back to groups list</router-link>
        </v-row>
        <v-row>
            <v-col cols=12 sm=8><h3><Breadcrumb :breadcrumbs="breadcrumbs"></Breadcrumb></h3></v-col>
            <v-col cols=12 sm=4>
                <v-dialog
                    v-model="infoDialog"
                    width="75%"
                >
                    <template v-slot:activator="{ on }">
                        <v-btn v-on="on" text small depressed class="noHover" color="secondary">{{$tc('Learn more about this')}} {{$tc('groups', 1)}}</v-btn>
                    </template>
                    <v-card>
                        <v-card-title class="header">
                            <span>{{group.title}}</span>
                            <v-spacer></v-spacer>
                            <v-btn text small depressed class="noHover" @click="infoDialog = false"><v-icon color="text">mdi-close</v-icon></v-btn>
                        </v-card-title>
                        <v-card-text>
                            <v-row class="pt-3">
                                <v-img contain height="50px" :src="imgSrc" v-on:error="onImgError"></v-img>
                            </v-row>
                            <v-row wrap class="py-5">
                                {{group.description}}
                            </v-row>
                            <v-row class="borderTop">
                                <MemberList :groupId="group.id" :members="members"></MemberList>
                            </v-row>
                        </v-card-text>
                    </v-card>
                </v-dialog>
            </v-col>
        </v-row>
        <v-row wrap>
            <v-progress-circular
            v-if="loading"
            :size="70"
            :width="7"
            color="grey"
            indeterminate
            ></v-progress-circular>
        
            <v-row wrap>
                <v-col cols=12 sm=8 order=2 order-sm=1>
                    <ListPage
                        :key="'listPage-'+facetFilterIndex"
                        :replaceSearchTip="true" 
                        addToSearchTip="Search Datasets in this group"
                        :forceFilter="'groups:('+group.name+')'"
                    ></ListPage>
                </v-col>
                <v-col cols=12 sm=4 order=1 order-sm=2>
                    <v-row>
                        <v-col cols=12>
                            <FacetFilters
                                v-on:facetFilter="facetFilter"
                            ></FacetFilters>
                        </v-col>
                    </v-row>
                    <span class="d-none d-sm-block text-left">
                        <v-row>
                            <v-btn text small depressed class="noHover mx-0" color="secondary" v-clipboard="() => permalink"><v-icon>mdi-content-copy</v-icon>{{$tc('Copy Permalink')}}</v-btn>
                        </v-row>
                        <v-row v-if="loggedIn">
                            <v-btn text v-if="following" small depressed class="noHover mx-0" color="secondary" @click="unfollow"><v-icon>mdi-minus-circle-outline</v-icon>{{$tc('Unfollow') + ' ' + $tc('Groups',1)}}</v-btn>
                            <v-btn text v-else           small depressed class="noHover mx-0" color="secondary" @click="follow"><v-icon>mdi-plus-circle-outline</v-icon>{{$tc('Follow') + ' ' + $tc('Groups',1)}}</v-btn>
                            
                        </v-row>

                        <v-row></v-row>

                        <v-row v-if="showEdit" class="mt-6">
                            <v-btn text small depressed class="noHover mx-0" color="secondary"><v-icon>mdi-pencil</v-icon>{{$tc('Edit') + ' ' + $tc('Groups', 1)}}</v-btn>
                        </v-row>
                            
                        <v-row v-if="canDeleteResources">
                            <v-btn text small depressed class="noHover mx-0" color="error" @click="deleteGroup"><v-icon>mdi-delete</v-icon>{{$tc('Delete') + ' ' + $tc('Groups', 1)}}</v-btn>
                        </v-row>
                    </span>
                </v-col>
            </v-row>
        </v-row>
    </v-container>
</template>

<script>
    import Breadcrumb from '../breadcrumb/Breadcrumb'
    import ListPage from '../dataset/ListPage'
    import FacetFilters from '../dataset/FacetFilters';
    import MemberList from '../groups/MemberList';

    import {mapState} from 'vuex';

    import {Analytics} from '../../services/analytics';
    const analyticsServ = new Analytics();

    import { CkanApi } from '../../services/ckanApi';
    const ckanServ = new CkanApi();


    export default {
        name: "group_view",
        components: {
            Breadcrumb: Breadcrumb,
            ListPage: ListPage,
            FacetFilters: FacetFilters,
            MemberList: MemberList,
        },
        data () {
            return {
                loading: true,
                breadcrumbs: [
                    {label: 'Groups', route: '/groups'},
                    {label: "Loading"}
                ],
                count: 0,
                rows: 10,
                skip: 0,
                datasets: [],
                loadingDatasets: true,
                error: null,
                infoDialog: false,
                imgError: false,
                disabled: false,
                facetFilterIndex: 0,
                schema: this.$store.state.group.groupSchemas.group ? this.$store.state.group.groupSchemas.group : {},
            }
        },
        computed: {
            groupId: function groupId() {
                return this.$route.params.groupId;
            },
            ...mapState({
                sysAdmin: state => state.user.sysAdmin,
                isAdmin: state => state.user.isAdmin,
                isEditor: state => state.user.isEditor,
                userLoading: state => state.user.userLoading,
                loggedIn: state => state.user.loggedIn,
                group: state => state.group.group,
                abort: state => state.group.abort,
                activities: state => state.group.groupActivity,
                members: state => state.group.groupMembers,
                following: state => state.group.currUserFollowingCurrGroup,
                ckanUser: state => state.user.ckanUser
            }),

            imgSrc: function(){
                return (this.imgError) ? "/placeholder-organization.png" : this.group.image_display_url;
            },
            
            permalink: function(){
                return window.location.origin+'/group/'+this.group.id
            },
            
            showEdit: function(){
                // TODO: IF you aren't overriding the admin functionality like BCDC CKAN does then this is what you want
                //return ( ((this.sysAdmin) || (this.userPermissions[this.dataset.organization.name] === "admin") || (this.userPermissions[this.dataset.organization.name] === "editor")));

                return ( (!this.loading) && (!this.editing) && (!this.userLoading) && ((this.sysAdmin) || (this.isAdmin) || (this.isEditor)) );
            },
            canDeleteResources: function(){
                return this.sysAdmin;
            },
        },

        watch: {
            abort(newVal){
                if (newVal){
                    this.$store.commit('group/clearAbort');
                    this.$router.push({name: 'Groups'});
                }
            },

            group(newVal) {
                let currentlyLoadingGroup = this.loading;   
                this.facetFilterIndex += 1; 
                this.loading = Object.keys(newVal).length == 0;
                if (currentlyLoadingGroup != this.loading){
                    this.breadcrumbs[1].label = this.group.title;
                }
            },
        },

        methods: {

            nothing(){},

            follow(){
                this.$store.dispatch('group/followGroup', this.ckanUser.apikey);
            },

            unfollow(){
                this.$store.dispatch('group/unfollowGroup', this.ckanUser.apikey);
            },

            onImgError(){
                this.imgError = true;
            },

            facetFilter(){
                this.facetFilterIndex += 1;
            },

            // updateGroup(field, value){
            //     this.group[field] = value;
            //     this.$store.commit('group/setCurrentNotUnmod', { group: this.group } );
            // },

            // async submit(){
            //     this.disabled = true;
            //     const isValid = await this.$refs.observer.validate();

            //     if (!isValid){
            //         this.formError = "Please fix the fields in error before submitting";
            //         this.showFormError = true;
            //         this.showFormSuccess = false;
            //         this.disabled = false;
            //         return;
            //     }

            //     let result = {};
            //     try{
            //         if (this.createMode){
            //             result = await this.$store.dispatch("group/createGroup")
            //         }else{
            //             result = await this.$store.dispatch("group/setGroup");
            //         }
            //     }catch(e){
            //         this.formError = e;
            //         this.showFormError = true;
            //         this.showFormSuccess = false;
            //         this.disabled = false;
            //         return;
            //     }
            //     if (!result || !result.success || result.success === false){
            //         if (result.error.message){
            //             this.formError = result.error.message;
            //         }else if (result.error.type && result.error.type[0]){
            //             this.formError = result.error.type[0];
            //         }else if (result.error){
            //             this.formError = result.error;
            //         }else{
            //             this.formError = "Unknown Error";
            //         }
            //         this.showFormError = true;
            //         this.showFormSuccess = false;
            //     }else{
            //         this.toggleEdit();
            //         if (this.createMode){
            //             this.$router.push({name: "group_view", params:{groupId: result.result.name}});
            //         }
            //         this.formSuccess = "Successfully updated";
            //         this.showFormSuccess = true;
            //         this.showFormError = false;
            //     }
            //     this.disabled = false;
            // },

            getGroup(){
                return this.$store.dispatch('group/getGroup', {id: this.groupId})//.then(() => {
                //     this.$store.dispatch('group/getGroupActivity');
                // });
            },

            async deleteGroup(){
                this.disabled = true;
                if (this.createMode){
                    this.disabled = false;
                    return;
                }
                const response = await ckanServ.deleteGroup(this.groupId);

                this.formSuccess = "";
                this.formError = "";

                if (response.success && response.success === true && (!response.error || response.error === false)){
                    this.formSuccess = "Successfully deleted";
                    this.showFormSuccess = true;
                    this.showFormError = false;
                    this.$router.push({name: 'Groups'});
                    this.disabled = false;
                    return;
                }else if (response.error){
                    this.formError = response.error;
                    this.showFormSuccess = false;
                    this.showFormError = true;
                    this.disabled = false;
                    return;
                }
                this.formError = "Unknown error deleting group";
                this.showFormSuccess = false;
                this.showFormError = true;
                this.disabled = false;
            },

        //     toggleEdit: function(){
        //         this.editing = !this.editing;
        //     },

        },
        
        mounted(){
            this.getGroup();
            analyticsServ.get(window.currentUrl, this.$route.meta.title, window.previousUrl);
            var self = this;
            let unsub = this.$store.subscribe(
                (mutation, state) => {
                    if(mutation.type == "group/setSchema") {
                        self.schema = state.group.groupSchemas.group;
                        unsub();
                    }
                }
            )
            this.$store.dispatch('group/getGroupSchemas');
        }

    }
</script>

<style scoped>

.header{
    background: var(--v-primary-base);
    color: var(--v-text-base);
}

.button-container{
    position: fixed;
    bottom: 50px;
    right: 50px;
    z-index: 10;
}

.nounderline{
    text-decoration: none;
}

.noHover:hover{
    box-shadow: none;
    border: none;
    background: none;
}

.noHover:hover:before{
    opacity: 0;
}

.borderTop{
    border-top: 3px solid;
    border-color: var(--v-govYellow-base);
}

</style>
