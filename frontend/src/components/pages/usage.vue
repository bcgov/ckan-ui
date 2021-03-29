<template>
    <v-container v-if="error">
        <div row align-center justify-center>
            <h1><v-icon x-large>error</v-icon> An Error Occurred: {{error.code}}</h1>
            <p><v-icon x-large>sentiment_very_dissatisfied</v-icon> Please try again or contact your system administrator</p>
        </div>
    </v-container>
    <v-container v-else fluid class="raise">
        <v-row v-if="loading">
            {{$tc('Loading Graph Data Please Wait...')}}
            <v-progress-circular
            v-if="loading"
            :size="70"
            :width="7"
            color="grey"
            indeterminate
            ></v-progress-circular>
        </v-row>
        <v-row wrap v-show="!loading">
            <v-col cols=12>
                Site Usage
            </v-col>
            <v-col col=3></v-col>
            <v-col col=3>
                <v-select
                    v-model="start"
                    :items="startMonths"
                    label="Start">
                </v-select>
            </v-col>
            <v-col col=3>
                <v-select
                    v-model="end"
                    :items="endMonths"
                    label="End">
                </v-select>
            </v-col>
            <v-col col=3></v-col>
            <v-col cols=12>
                <GChart
                    type="LineChart"
                    :data="lineChartData"
                    :options="chartOptions">
                </GChart>
            </v-col>
        </v-row>
        
        <v-row v-if="lowerLoading">
            {{$tc('Loading Historical Data Please Wait...')}}
            <v-progress-circular
            v-if="loading"
            :size="70"
            :width="7"
            color="grey"
            indeterminate
            ></v-progress-circular>
        </v-row>
        <v-row v-else>

            <v-col col=3></v-col>
            <v-col col=3>
                <v-select
                    v-model="bottomMonth"
                    :items="allTimeMonths"
                    label="Month">
                </v-select>
            </v-col>
            <v-col col=3>
                <v-select
                    v-model="selectedPub"
                    :items="publishers"
                    label="Publisher">
                </v-select>
            </v-col>
            <v-col col=3></v-col>
            <v-col cols=12>
                <v-data-table
                    :headers="allTimeHeaders"
                    :items="allTimeData"
                    :items-per-page="count"
                    hide-default-footer
                ></v-data-table>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import { mapState } from 'vuex'
    import {CkanApi} from '../../services/ckanApi';
    import { GChart } from 'vue-google-charts'

    const ckanServ = new CkanApi();
    import {Analytics} from '../../services/analytics';
    const analyticsServ = new Analytics();


    export default {
        name: "usage",
        components: {
            GChart: GChart
        },
        data () {
            let d = new Date();
            let baseMonthV = ( ((d.getMonth()+1)<10) ? ("0"+(d.getMonth()+1)) : (d.getMonth()+1) );
            return {
                
                count: 20,
                chartOptions: {
                    titlePosition: "out",
                    title: 'Dataset Views',
                    chartArea: {
                        right: 300,   // set this to adjust the legend width
                        left: 60,     // set this eventually, to adjust the left margin
                    },
                    height: 600
                },
                start: (d.getFullYear()-5) + "-" + baseMonthV,
                end: d.getFullYear() + "-" + baseMonthV,
                baseMonthV: baseMonthV,
                allTimeHeaders: [
                    {text: "Dataset", value: "dataset"},
                    {text: "Views", value: "views"},
                    {text: "Downloads", value: "downloads"}
                ],
                bottomMonth: "All",
                selectedPub: "All",

            }
        },
        computed: {
            ...mapState({
                usage: state => state.usage.usage,
                loading: state => state.usage.loading,
                error: state => state.usage.error,

                lowerUsage: state => state.usage.lowerUsage,
                lowerLoading: state => state.usage.lowerLoading,
                lowerError: state => state.usage.lowerError,

                statePublishers: state => state.usage.publishers,
                
            }),
            lineChartData: function(){
                if (this.usage && this.usage.data && this.usage.data[0]){
                    let c = []
                    
                    let headerRow = ['Month']
                    for (let i=0; i<this.usage.data.length; i++){
                        headerRow.push(this.usage.data[i].title);
                    }
                    //headerRow = headerRow.sort()
                    c.push(headerRow);

                    let keys = Object.keys(this.usage.data[0].month_info).sort();
                    for (let i=0; i<keys.length; i++){
                        let row = [];
                        row.push(keys[i])
                        for (let j=0; j<this.usage.data.length; j++){
                            row.push(this.usage.data[j].month_info[keys[i]].views);
                        }
                        c.push(row);
                    }

                    return c;
                }
                return [[]];
            },
            allTimeData: function(){
                if (this.lowerUsage && this.lowerUsage.data && this.lowerUsage.data[0]){
                    let c = []

                    for (let i=0; i<this.lowerUsage.data.length; i++){
                        let row = {};
                        row.dataset = this.lowerUsage.data[i].title;
                        row.views = this.lowerUsage.data[i].all_time_views;
                        row.downloads = this.lowerUsage.data[i].all_time_downloads;
                        c.push(row);
                    }

                    return c;
                }
                return [];
            },
            months: function(){
                let cd = new Date();
                let endYear = cd.getFullYear()
                let endMonth = cd.getMonth() // 0 based
                let startYear = "2014"
                let startMonth = "11" // 0 based december

                let currYear = startYear;
                let currMonth = startMonth;

                let m = [];
                let mNames = [
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                    "October",
                    "November",
                    "December",
                ]

                while (currYear <= endYear){
                    m.push({text: currYear + " " + mNames[currMonth], value: currYear + "-" + ( ((currMonth+1)<10) ? "0"+(currMonth+1) : (currMonth+1))})
                    currMonth++;
                    if (currMonth >= mNames.length){
                        currYear++;
                        currMonth = 0;
                    }
                    if ( (currYear >= endYear) && (currMonth > endMonth) ){
                        currYear++;
                    }
                }

                return m;
            },
            startMonths: function(){
                let p = this.months.slice(0,-1); 
                return p;
            },
            endMonths: function(){
                let p = this.months.slice(1); 
                return p;
            },
            allTimeMonths: function(){
                let p = JSON.parse(JSON.stringify(this.months));
                p.unshift({text: "All Months", value: "All"});
                return p;
            },
            publishers: function(){
                let publishers = [{text: "All Publishers", value: "All"}];
                for (let i=0; i<this.statePublishers.length; i++){
                    publishers.push({text: this.statePublishers[i][1], value: this.statePublishers[i][0]})
                }
                return publishers;
            },
        },

        watch: {
            start(){
                this.$store.dispatch('usage/getUsage', {start: this.start, end: this.end, count: this.count})
            },
            end(){
                this.$store.dispatch('usage/getUsage', {start: this.start, end: this.end, count: this.count})
            },
            bottomMonth(){
                this.$store.dispatch('usage/getLowerUsage', {month: this.bottomMonth, publishers: this.selectedPub, count: this.count})
            },
            selectedPub(){
                this.$store.dispatch('usage/getLowerUsage', {month: this.bottomMonth, publishers: this.selectedPub, count: this.count})
            },
        },

        methods: {
            
        },

        mounted(){
            this.$store.dispatch('usage/getUsage', {start: this.start, end: this.end, count: this.count});
            this.$store.dispatch('usage/getLowerUsage', {month: this.bottomMonth, publishers: this.selectedPub, count: this.count});
            this.$store.dispatch('usage/getPublishers');
            analyticsServ.get(window.currentUrl, this.$route.meta.title, window.previousUrl);
        }

    }
</script>

<style scoped>
    .raise {
        margin-bottom: 45px;
    }
</style>
