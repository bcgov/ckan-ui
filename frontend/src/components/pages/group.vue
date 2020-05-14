<template>
    <v-container v-if="error" class="groupContainer px-md-10 py-4">
        <div row align-center justify-center>
            <h1><v-icon x-large>error</v-icon> An Error Occured: {{error.code}}</h1>
            <p><v-icon x-large>sentiment_very_dissatisfied</v-icon> Please try again or contact your system administrator</p>
        </div>
    </v-container>
    <v-container v-else fluid class="groupContainer px-md-11 py-4">
        <v-alert
            :value="group.state === 'deleted'"
            type="warning">
            You are viewing a deleted group
        </v-alert>
        <v-alert
            :value="showFormSuccess"
            class="fixed"
            dismissible
            type="success">
            {{formSuccess}}
        </v-alert>
        <v-alert
            :value="showFormError"
            class="fixed"
            dismissible
            type="error">
            {{formError}}
        </v-alert>

        <v-row>
            <v-col cols=12 class="ml-6">
                <router-link to='/groups' class="nounderline labelText"><v-icon color="primary">mdi-arrow-left</v-icon> {{$tc('Back to')}} {{$tc('Groups', 2)}} {{$tc('list')}}</router-link>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols=12 sm=8 class="pl-6"><h3><Breadcrumb :breadcrumbs="breadcrumbs"></Breadcrumb></h3></v-col>
            <v-col cols=12 sm=4 class="pl-0">
                <v-dialog
                    v-model="infoDialog"
                    width="75%"
                >
                    <template v-slot:activator="{ on }">
                        <v-btn v-on="on" text small depressed class="noHover labelText pl-0">{{$tc('Learn more about this')}} {{$tc('groups', 1)}}</v-btn>
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
                                <Markdown
                                    name="desc"
                                    :value="group.description"
                                    label=""
                                    :editing="false"
                                    :field="{}"
                                    :disabled="false"
                                    placeholder="">
                                </Markdown>
                            </v-row>
                            <v-row class="borderTop">
                                <MemberList :groupId="group.id" :members="members"></MemberList>
                            </v-row>
                        </v-card-text>
                    </v-card>
                </v-dialog>
            </v-col>
        </v-row>
        <v-row wrap class="mr-md-1">
            <v-col cols=10 sm=7>
                <ListPage
                    :key="'listPage-'+facetFilterIndex"
                    :replaceSearchTip="true"
                    addToSearchTip="Search Datasets in this group"
                    :forceFilter="'groups:('+group.name+')'"
                ></ListPage>
            </v-col>
            <v-col cols=0 sm=1></v-col>
            <v-col cols=1 sm=4 class="mt-9 pt-9">
                <FacetFilters
                    class="mt-9 pt-9"
                    v-on:facetFilter="facetFilter"
                ></FacetFilters>
                <v-container class="d-none d-sm-block text-left">
                    <v-row>
                        <v-btn text small depressed class="noHover mx-0 px-0 labelText" v-clipboard="() => permalink"><v-icon>mdi-content-copy</v-icon>{{$tc('Copy Permalink')}}</v-btn>
                    </v-row>
                    <v-row v-if="loggedIn">
                        <v-btn text v-if="following" small depressed class="noHover mx-0 px-0 labelText" @click="unfollow"><v-icon>mdi-minus-circle-outline</v-icon>{{$tc('Unfollow') + ' ' + $tc('Groups',1)}}</v-btn>
                        <v-btn text v-else           small depressed class="noHover mx-0 px-0 labelText" @click="follow"><v-icon>mdi-plus-circle-outline</v-icon>{{$tc('Follow') + ' ' + $tc('Groups',1)}}</v-btn>

                    </v-row>

                    <v-row></v-row>

                    <v-row v-if="showEdit" class="mt-6">
                        <v-dialog
                            v-model="editDialog"
                            width="75%"
                        >
                            <template v-slot:activator="{ on }">
                                <v-btn v-on="on" text small depressed class="noHover mx-0 px-0 labelText"><v-icon>mdi-pencil</v-icon>{{$tc('Edit') + ' ' + $tc('Groups', 1)}}</v-btn>
                            </template>
                            <Edit
                                v-on:closeEdit='editDialog = false'
                                v-on:editStatus="editStatus"
                            >
                            </Edit>
                        </v-dialog>
                    </v-row>

                    <v-row class="mb-5" v-if="canDeleteResources">
                        <v-btn text small depressed class="noHover mx-0 px-0 errorText" @click="deleteGroup"><v-icon>mdi-delete</v-icon>{{$tc('Delete') + ' ' + $tc('Groups', 1)}}</v-btn>
                    </v-row>
                </v-container>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import Breadcrumb from '../breadcrumb/Breadcrumb'
    import ListPage from '../dataset/ListPage'
    import FacetFilters from '../dataset/FacetFilters';
    import MemberList from '../groups/MemberList';
    import Markdown from '../form/components/Markdown';
    import Edit from '../groups/edit';

    import { mapState } from 'vuex';

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
            Markdown: Markdown,
            Edit: Edit,
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
                editDialog: false,
                imgError: false,
                disabled: false,
                facetFilterIndex: 0,
                formError: "",
                showFormError: false,
                formSuccess: "",
                showFormSuccess: false,
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
                if (this.imgError){
                    return "/placeholder-organization.png"
                }
                return (this.group.image_display_url) ? this.group.image_display_url : this.group.url;
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

            editStatus(status){
                this.formSuccess = status.success;
                this.formError = status.error;
                this.showFormError = status.showError;
                this.showFormSuccess = status.showSuccess;
                if (this.showFormSuccess){
                    this.editDialog = false;
                }
            },

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

        },

        mounted(){
            this.getGroup();
            analyticsServ.get(window.currentUrl, this.$route.meta.title, window.previousUrl);
        }

    }
</script>

<style scoped>

.labelText{
    font-size: 16px;
    font-weight: normal;
    color: var(--v-label_colour-base);
}

.errorText{
    font-size: 16px;
    font-weight: normal;
    color: var(--v-error_text-base);
}

.groupContainer{
    background: var(--v-data_background-base);
}

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
