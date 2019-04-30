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
                <i v-if="loadingDatasets" class="fa fa-circle-o-notch fa-spin"></i>
                <div v-else-if="count == 0">
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
                    this.group = data.result;
                    this.breadcrumbs[2].label = this.group.title
                    this.loading = false;
                    this.getDatasets();
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
                this.datasets = this.group.packages;
                this.count = this.group.packages.length;

                let q = "?rows=" + this.rows+"&include_drafts=true&include_private=true&"

                let fq = "&fq=groups:("+this.group.name+")";

                if ( (this.skip !== 0) ){
                    q += "start=" + this.skip + "&"
                }

                q = q.substring(0, q.length - 1)
                q += fq;

                ckanServ.getDatasets(q).then((data) => {
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
