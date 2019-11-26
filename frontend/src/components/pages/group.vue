<template>
    <v-container v-if="error">
        <div row align-center justify-center>
            <h1><v-icon x-large>error</v-icon> An Error Occured: {{error.code}}</h1>
            <p><v-icon x-large>sentiment_very_dissatisfied</v-icon> Please try again or contact your system administrator</p>
        </div>
    </v-container>
    <v-container v-else fluid>
        <Breadcrumb :breadcrumbs="breadcrumbs"></Breadcrumb>
        <v-progress-circular
          v-if="loading"
          :size="70"
          :width="7"
          color="grey"
          indeterminate
        ></v-progress-circular>
        <ValidationObserver ref="observer" v-slot="{ validate }" slim>
            <v-form ref="form" @submit.prevent="nothing">
                <v-row v-if="showEdit" class="button-container">
                    <v-btn
                        v-if="canDeleteResources"
                        fab
                        color="error"
                        class="text-xs-center"
                        @click="deleteGroup"
                    >
                        <v-icon>delete</v-icon>
                    </v-btn>
                    <v-btn
                        v-if="showEdit"
                        fab
                        color="info"
                        class="text-xs-center"
                        right
                        @click="toggleEdit"
                    >
                        <v-icon>edit</v-icon>
                    </v-btn>
                </v-row>
                <v-row v-else-if="editing" class="button-container">
                    <v-btn
                        xs2
                        color="error"
                        class="text-xs-center"
                        @click="cancel"
                    >
                        Cancel
                    </v-btn>
                    <v-btn
                        xs2
                        color="primary"
                        class="text-xs-center"
                        type="submit"
                        @click="submit(errors)"
                    >
                        Save
                    </v-btn>
                </v-row>
                <v-row wrap class="text-xs-center" align-center justify-center>
                    <v-col cols=3>
                        <!--<Profile :group="group"></Profile>-->
                        <DynamicForm v-if="typeof(schema) === 'object' && typeof(schema.fields) === 'object'"
                            :schema="schema.fields"
                            :textFields="textFields"
                            :editing="editing"
                            :values="group"
                            :disabled="disabled"
                            ref="dynoForm"
                            @updated="(field, value) => updateGroup(field, value)"
                        >
                        </DynamicForm>
                        <v-progress-circular
                            v-else
                            indeterminate
                            color="light-blue"
                        ></v-progress-circular>
                    </v-col>
                </v-row>
            </v-form>
        </ValidationObserver>
        <v-row wrap align-center>
            <v-col cols=12>
                <h2 class="text-xs-center">{{count}} {{$tc('Dataset', count)}}</h2>
            </v-col>
        </v-row>
        <v-row wrap>
            <v-col cols=12>
                <v-progress-circular
                    v-if="loadingDatasets"
                    indeterminate
                    color="light-blue"
                ></v-progress-circular>
                <div v-else-if="count == 0">
                    No results
                </div>
                <div v-else-if="!createMode">
                    <ListCard v-for="dataset in datasets" :key="'dataset-group-'+dataset.id" :record="dataset"></ListCard>
                    <infinite-loading @infinite="scroll">
                        <div slot="no-results">{{$tc('No datasets')}}</div>
                        <div slot="no-more">{{$tc('No more datasets')}}</div>
                    </infinite-loading>
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import Breadcrumb from '../breadcrumb/Breadcrumb'
    import DynamicForm from '../form/DynamicForm'
    import ListCard from '../dataset/ListCard'

    import {CkanApi} from '../../services/ckanApi'

    import {mapState} from 'vuex';
    import { ValidationObserver } from "vee-validate";

    const ckanServ = new CkanApi()
    import {Analytics} from '../../services/analytics'
    const analyticsServ = new Analytics()


    export default {
        name: "group_view",
        components: {
            Breadcrumb: Breadcrumb,
            ListCard: ListCard,
            DynamicForm: DynamicForm,
            ValidationObserver: ValidationObserver,
        },
        data () {
            return {
                loading: true,
                breadcrumbs: [
                    {icon: "home", label: 'Home', route: '/'},
                    {label: 'Groups', route: '/groups'},
                    {label: "Loading..."}
                ],
                group: {},
                count: 0,
                rows: 10,
                skip: 0,
                datasets: [],
                loadingDatasets: true,
                error: null,
                createMode: this.$route.name === "group_create",
                editing: this.$route.name === "group_create",
                disabled: false,
                schema: this.$store.state.group.groupSchemas.group ? this.$store.state.group.groupSchemas.group : {},
                textFields: []
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
            }),
            showEdit: function(){
                // TODO: IF you aren't overriding the admin functionality like BCDC CKAN does then this is what you want
                //return ( ((this.sysAdmin) || (this.userPermissions[this.dataset.organization.name] === "admin") || (this.userPermissions[this.dataset.organization.name] === "editor")));

                return ( (!this.loading) && (!this.userLoading) && ((this.sysAdmin) || (this.isAdmin) || (this.isEditor)) );
            },
            canDeleteResources: function(){
                return this.sysAdmin;
            },
        },
        methods: {

            updateGroup(field, value){
                this.group[field] = value;
            },

            getGroup(){
                ckanServ.getGroup(this.groupId).then( (data) => {
                    if (data.success) {
                        this.group = data.result;
                        this.breadcrumbs[2].label = this.group.title
                        this.loading = false;
                        this.getDatasets();
                    } else {
                        this.error = data.error;
                    }
                });
            },

            deleteGroup: function(){

            },

            toggleEdit: function(){
                this.editing = !this.editing;
            },

            scroll: function(state){
                this.skip += this.rows
                if (this.count>=this.skip) {
                    this.getDatasets(state)
                }else{
                    state.complete()
                }
            },

            getDatasets(state){
                //this.datasets = this.group.packages;
                this.count = this.group.packages.length;

                let q = "?rows=" + this.rows+"&include_drafts=true&include_private=true&"

                let fq = "&fq=groups:("+this.group.name+")";

                if ( (this.skip !== 0) ){
                    q += "start=" + this.skip + "&"
                }

                q = q.substring(0, q.length - 1)
                q += fq;

                ckanServ.getDatasets(q).then((data) => {
                    if (data.success) {
                        if (!data.result){
                            this.count = 0;
                            return;
                        }
                        this.datasets = this.datasets.concat(data.result.results)
                        this.count = data.result.count

                        this.loadingDatasets = false
                        if (state != null) {
                            if (this.skip+this.rows > this.count) {
                                state.complete()
                            }else{
                                state.loaded();
                            }
                        }
                    } else {
                        this.error = data.error;
                    }
                });

            },

        },
        mounted(){
            analyticsServ.get(window.currentUrl, this.$route.meta.title, window.previousUrl);
            this.getGroup();
            let self = this;
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

.button-container{
    position: fixed;
    bottom: 50px;
    right: 0;
    z-index: 10;
}

</style>
