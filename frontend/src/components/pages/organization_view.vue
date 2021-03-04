<template>
    <v-container v-if="error" class="orgContainer px-md-10 py-4">
        <div row align-center justify-center>
            <h1><v-icon x-large>error</v-icon> An Error Occurred: {{error.code}}</h1>
            <p><v-icon x-large>sentiment_very_dissatisfied</v-icon> Please try again or contact your system administrator</p>
        </div>
    </v-container>
    <v-container v-else fluid class="orgContainer px-md-10 py-4">
        <v-row wrap class="mt-0 py-4 px-md-15 fauxbar">
            <v-col cols=10 class="my-0 py-0" v-if="showFormError || showFormSuccess || group.state === 'deleted'">
                <v-alert
                    :value="group.state === 'deleted'"
                    type="warning">
                    You are viewing a deleted organization
                </v-alert>
                <v-alert
                    :value="showFormSuccess"
                    dismissible
                    type="success">
                    {{formSuccess}}
                </v-alert>
                <v-alert
                    :value="showFormError"
                    dismissible
                    type="error">
                    {{formError}}
                </v-alert>
            </v-col>
            <v-col cols=12>
                
                <v-btn text small depressed color="primary" class="noBack" to='/organization'>
                    <v-icon color="primary">mdi-arrow-left</v-icon> 
                    {{$tc('Back to')}} {{$tc('Organizations', 2)}} {{$tc('list')}}
                </v-btn>

                <v-btn text small depressed color="primary" v-clipboard="() => permalink" @click="snackbar = true">
                    <v-icon>mdi-share-variant</v-icon>
                    &nbsp;{{$tc('Copy Permalink')}}
                </v-btn>

                <v-dialog
                    v-model="infoDialog"
                    width="75%"
                >
                    <template v-slot:activator="{ on }">
                        <v-btn v-on="on" text small depressed color="primary">
                            <v-icon>mdi-information-outline</v-icon> 
                            &nbsp;{{$tc('Learn more about this')}} {{$tc('organizations', 1)}}</v-btn>
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
                            <v-row wrap class="py-5" v-if="group.description">
                                <Markdown
                                    name="desc"
                                    :value="group.description"
                                    label=""
                                    :editing="false"
                                    :field="group.description"
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

                <v-dialog
                    v-if="showEdit"
                    v-model="editDialog"
                    width="75%"
                >
                    <template v-slot:activator="{ on }">
                        <v-btn v-on="on" text small depressed color="primary"><v-icon>mdi-pencil-outline</v-icon>&nbsp;{{$tc('Edit') + ' ' + $tc('Organizations', 1)}}</v-btn>
                    </template>
                    <Edit
                        v-on:closeEdit='editDialog = false'
                        v-on:editStatus="editStatus"
                    >
                    </Edit>
                </v-dialog>

                <v-btn v-if="canDeleteResources" text small depressed color="error" @click="deleteOrg"><v-icon>mdi-delete-outline</v-icon>&nbsp;{{$tc('Delete') + ' ' + $tc('Organizations', 1)}}</v-btn>

            </v-col>
        </v-row>

        <v-snackbar v-model="snackbar" :timeout=2000><span class="mx-auto permalink">{{$tc('Share link copied')}}</span></v-snackbar>

        <v-row class="mt-12 mb-12" v-if="showFormError || showFormSuccess || group.state === 'deleted'"></v-row>

        <v-row class="mt-7 mb-7"></v-row>

        <v-row class="workingSpinner" v-if="disabled">
            <v-progress-circular :size="70" :width="7" color="primary" indeterminate></v-progress-circular>
        </v-row>

        <v-row class="mr-1 md-1">
            <v-col cols=12 sm=8 class="pl-6"><h3 class="pt-4"><Breadcrumb :breadcrumbs="breadcrumbs"></Breadcrumb></h3></v-col>
        </v-row>
        <v-row wrap class="mr-1 md-1">
            <v-col cols=10 sm=7>
                <v-progress-circular
                    v-if="loading"
                    indeterminate
                    color="light-blue"
                ></v-progress-circular>
                <ListPage
                    v-else
                    :key="'listPage-'+facetFilterIndex+forceLoad"
                    :replaceSearchTip="true"
                    addToSearchTip="Search for Datasets in this organization"
                    :forceFilter="forceFilter"
                ></ListPage>
            </v-col>
            <!-- <v-col cols=0 sm=1></v-col> -->
            <v-col cols=2 sm=5 class="mt-9 pt-0">
                <FacetFilters
                    v-on:facetFilter="facetFilter"
                    :hideFacets="hideFacets"
                ></FacetFilters>
                <v-container class="d-none d-sm-block text-left">
                    <v-row v-if="loggedIn">
                        <!-- <v-btn text v-if="following" small depressed class="noHover mx-0 basicText" color="secondary" @click="unfollow"><v-icon>mdi-minus-circle-outline</v-icon>{{$tc('Unfollow') + ' ' + $tc('Organizations',1)}}</v-btn>
                        <v-btn text v-else           small depressed class="noHover mx-0 basicText" color="secondary" @click="follow"><v-icon>mdi-plus-circle-outline</v-icon>{{$tc('Follow') + ' ' + $tc('Organizations',1)}}</v-btn> -->
                    </v-row>

                    <v-row></v-row>
                </v-container>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import Breadcrumb from '../breadcrumb/Breadcrumb'
    import FacetFilters from '../dataset/FacetFilters'
    import ListPage from '../dataset/ListPage'
    import MemberList from '../groups/MemberList'
    import Markdown from '../form/components/Markdown';
    import Edit from '../organizations/edit';

    import {Analytics} from '../../services/analytics'
    const analyticsServ = new Analytics()

    import { CkanApi } from '../../services/ckanApi';
    const ckanServ = new CkanApi();

    import { mapState } from 'vuex';


    export default {
        name: "organization_view",
        components: {
            Breadcrumb: Breadcrumb,
            FacetFilters: FacetFilters,
            ListPage: ListPage,
            MemberList: MemberList,
            Markdown: Markdown,
            Edit: Edit,
        },
        data () {
            return {
                error: null,
                breadcrumbs: [
                    {label: 'Organizations', route: '/organization'},
                    {label: "Loading"}
                ],
                skip: 0,
                rows: 10,
                noResults: false,
                count: 0,
                datasets: [],
                children: [],
                organizations: {},
                datasetsLoaded: false,
                datasetsLoading: false,
                showFormSuccess: false,
                showFormError: false,
                formError: "",
                formSuccess: "",
                facetFilterIndex: 0,
                infoDialog: false,
                editDialog: false,
                imgError: false,
                snackbar: false,
                forceLoad: 0,
                disabled: false,
                hideFacets: ['Organizations'],
            }
        },
        computed: {

            ...mapState({
                members: state => state.organization.groupMembers,
                group: state => state.organization.unmodifiedOrg,
                sysAdmin: state => state.user.sysAdmin,
                isAdmin: state => state.user.isAdmin,
                isEditor: state => state.user.isEditor,
                userLoading: state => state.user.userLoading,
                loggedIn: state => state.user.loggedIn,
                ckanUser: state => state.user.ckanUser,
                loading: state => state.organization.loading,
                following: state => state.organization.currUserFollowingCurrGroup,
                orgList: state => state.organization.orgList,
            }),

            forceFilter: function(){
                let fq = 'organization:(';
                if (this.orgList[this.group.title]){
                    let orgListEntry = this.orgList[this.group.title];
                    if (orgListEntry && orgListEntry.children && (orgListEntry.children.length > 0)){
                        for (let i=0; i<orgListEntry.children.length; i++){
                            fq += orgListEntry.children[i].name + ' OR ';
                        }
                    }
                }
                
                fq += this.group.name+')';
                return fq;
            },

            organizationId: function organizationId() {
                return this.$route.params.organizationId;
            },
            imgSrc: function(){
                let imgUrl = (this.group.image_display_url) ? this.group.image_display_url : this.group.url;
                if ( (this.imgError) || (imgUrl === "") ){
                    return "/placeholder-organization.png"
                }
                return imgUrl;
            },
            permalink: function(){
                return window.location.origin+'/organization/'+this.group.id
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
            group(){
                this.forceLoad += 1;
            },
            loading(newVal){
                this.breadcrumbs[1].label = (newVal) ? "Loading" : this.group.title;
            }
        },
        methods: {
            follow(){
                this.$store.dispatch('organization/followGroup', this.ckanUser.apikey);
            },

            unfollow(){
                this.$store.dispatch('organization/unfollowGroup', this.ckanUser.apikey);
            },

            async deleteOrg(){
                this.disabled = true;
                if (this.createMode){
                    this.disabled = false;
                    return;
                }
                const response = await ckanServ.deleteOrg(this.organizationId);

                this.formSuccess = "";
                this.formError = "";

                if (response.success && response.success === true && (!response.error || response.error === false)){
                    this.formSuccess = "Successfully deleted";
                    this.showFormSuccess = true;
                    this.showFormError = false;
                    this.$router.push({name: 'Organizations'});
                    this.disabled = false;
                    return;
                }else if (response.error){
                    this.formError = response.error;
                    this.showFormSuccess = false;
                    this.showFormError = true;
                    this.disabled = false;
                    return;
                }
                this.formError = "Unknown error deleting organization";
                this.showFormSuccess = false;
                this.showFormError = true;
                this.disabled = false;
            },

            editStatus(status){
                this.formSuccess = status.success;
                this.formError = status.error;
                this.showFormError = status.showError;
                this.showFormSuccess = status.showSuccess;
                if (this.showFormSuccess){
                    this.editDialog = false;
                }
            },

            onImgError(){
                this.imgError = true;
            },

            facetFilter(){
                this.facetFilterIndex += 1;
            },

            getOrganization: function(){
                this.$store.dispatch('organization/getOrg', {id: this.organizationId});
            },
        },


        mounted(){
            analyticsServ.get(window.currentUrl, this.$route.meta.title, window.previousUrl);
            this.getOrganization();
        }

    }
</script>

<style scoped>
    .raise {
        margin-bottom: 45px;
    }

    .basicText{
        font-size: 16px;
        font-weight: normal;
    }

    .deleteText{
        font-size: 16px;
        font-weight: normal;
        color: var(--v-error_text-base);
    }

    .orgContainer{
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
        font-size: 16px;
        color: var(--v-label_colour-base);
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

    .noBack.v-btn:before{
        background: none;
    }

    .fauxbar{
        position: fixed;
        top: 65px;
        left: 0px;
        background-color: var(--v-data_background-base);
        z-index: 5;
        right: 0px;
        border-bottom: 1px solid;
        border-color: var(--v-label_border-base);
    }

    .permalink{
        font-size: 16px;
        font-weight: bold;
    }
    
    .workingSpinner{
        position: fixed;
        top: 50%;
        left: 50%;
        margin-left: -35px;
        margin-top: 35px;
    }
</style>
