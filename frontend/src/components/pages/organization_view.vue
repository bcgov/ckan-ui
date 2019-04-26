<template>
    <v-container fluid>
        <Breadcrumb :breadcrumbs="breadcrumbs"></Breadcrumb>
        <v-progress-circular
          v-if="loading"
          :size="70"
          :width="7"
          color="grey"
          indeterminate
        ></v-progress-circular>
        <v-layout row wrap v-else class="text-xs-center" align-center justify-center>
            <v-flex xs3>
                <Profile :group="group"></Profile>
            </v-flex>
        </v-layout>
        <v-layout row wrap align-center>
            <v-flex xs12>
                <h2 class="text-xs-center">{{count}} {{$tc('Dataset', count)}}</h2>
            </v-flex>
        </v-layout>
        <v-layout row wrap>
            <v-flex xs12>
                <i v-if="!datasetsLoaded" class="fa fa-circle-o-notch fa-spin"></i>
                <div v-else-if="noResults">
                    No results
                </div>
                <div v-else>
                    <ListCard v-for="dataset in datasets" :key="'dataset-'+dataset.id" :record="dataset"></ListCard>
                    <infinite-loading @infinite="scroll">
                        <div slot="no-results">{{$tc('No datasets')}}</div>
                        <div slot="no-more">{{$tc('No more datasets')}}</div>
                    </infinite-loading>
                </div>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import Breadcrumb from '../breadcrumb/Breadcrumb'
    import Profile from '../organizations/profile'
    import ListCard from '../dataset/ListCard'

    import {CkanApi} from '../../services/ckanApi'

    const ckanServ = new CkanApi()
    import {Analytics} from '../../services/analytics'
    const analyticsServ = new Analytics()


    export default {
        name: "organization_view",
        components: {
            Breadcrumb: Breadcrumb,
            Profile: Profile,
            ListCard: ListCard
        },
        data () {
            return {
                loading: true,
                error: "",
                breadcrumbs: [
                    {icon: "home", label: 'Home', route: '/'},
                    {label: 'Organizations', route: '/organization'}
                ],
                group: {},
                skip: 0,
                rows: 10,
                noResults: false,
                count: 0,
                datasets: [],
                children: [],
                organizations: {},
                datasetsLoaded: false,
                datasetsLoading: false,
            }
        },
        computed: {
            organizationId: function organizationId() {
                return this.$route.params.organizationId;
            },
        },
        methods: {
            findOrgs(){
                if (localStorage.orgList) {
                    this.organizations = JSON.parse(localStorage.orgList);
                } else {
                    ckanServ.getOrgList().then((data) => {
                        localStorage.orgList = JSON.stringify(data.orgList);
                        this.organizations = data.orgList;
                        if (!this.datasetsLoading){
                            this.datasetsLoading = true;
                            this.getDatasets();
                        }
                    });
                }
            },

            getOrganization: function(){
                ckanServ.getOrganization(this.organizationId).then( (data) => {
                    this.group = data.result;
                    this.loading = false;
                    if (!this.datasetsLoading){
                        this.datasetsLoading = true;
                        this.getDatasets();
                    }
                });
            },

            scroll: function(state){
                this.skip += this.rows
                if (this.count>this.skip) {
                    this.getDatasets(state)
                }else{
                    state.complete()
                }
            },

            getDatasets(state){

                let q = "?rows=" + this.rows+"&include_drafts=true&include_private=true&"

                // eslint-disable-next-line
                console.log(this.organizations);
                let fq = "&fq=organization:("+this.group.name+""
                if (typeof(this.organizations[this.group.title]) !== "undefined"){
                    for (var i=0; i<this.organizations[this.group.title].children.length; i++){
                        fq += " OR " + this.organizations[this.group.title].children[i].name
                    }
                }
                fq += ")"

                if ( (this.skip !== 0) ){
                    q += "start=" + this.skip + "&"
                }

                q = q.substring(0, q.length - 1)
                q += fq;

                ckanServ.getDatasets(q).then((data) => {
                    this.datasetsLoaded = true;
                    if (!data.result){
                        this.noResults = true;
                        this.count = 0;
                        return;
                    }
                    this.datasets = this.datasets.concat(data.result.results)
                    this.count = data.result.count

                    if (data.result.results.length <= 0){
                        this.noResults = true
                    }else{
                        this.noResults = false
                    }

                    this.loading = false
                    if (state != null) {
                        if (this.skip+this.rows > this.count) {
                            state.complete()
                        }else{
                            state.loaded();
                        }
                    }
                });

            },
        },
        mounted(){
            analyticsServ.get(window.currentUrl, this.$route.meta.title, window.previousUrl);
            this.findOrgs();
            this.getOrganization();
        }

    }
</script>

<style scoped>

</style>
