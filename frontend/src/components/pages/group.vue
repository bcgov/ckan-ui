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
        <v-row wrap v-else class="text-xs-center" align-center justify-center>
            <v-col cols=3>
                <Profile :group="group"></Profile>
            </v-col>
        </v-row>
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
                <div v-else>
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
    import Profile from '../groups/profile'
    import ListCard from '../dataset/ListCard'

    import {CkanApi} from '../../services/ckanApi'

    const ckanServ = new CkanApi()
    import {Analytics} from '../../services/analytics'
    const analyticsServ = new Analytics()


    export default {
        name: "group_view",
        components: {
            Breadcrumb: Breadcrumb,
            ListCard: ListCard,
            Profile: Profile
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
                error: null
            }
        },
        computed: {
            groupId: function groupId() {
                return this.$route.params.groupId;
            },
        },
        methods: {

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
        }

    }
</script>

<style scoped>

</style>
