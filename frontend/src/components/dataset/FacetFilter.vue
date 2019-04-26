<template>
    <div v-show="maxFilters > 1">
    <v-container px-0  align-center align-content-center justify-center class="facet" fluid @click="toggleDrawer()" :class="{'open': showDrawer, 'closed': !showDrawer}">
        <v-badge overlap color="red" class="facetBadge">
            <template v-slot:badge>
                <span v-if="numApplied>0">{{numApplied}}</span>
            </template>
            
            <v-container fluid pa-0 ma-0 dark>
                <v-layout row wrap>
                    <v-flex xs12 class="text-xs-center">
                        <v-icon x-large class="iconWidth facetIcon">{{field.icon}}</v-icon>
                    </v-flex>
                </v-layout>
                <v-layout row wrap>
                    <v-flex xs12 class="text-xs-center facetLabel">{{$tc(name)}}</v-flex>
                </v-layout>
            </v-container>            
        </v-badge>
    </v-container>

        <v-container fluid class="leftDrawer" v-if="showDrawer" transition="slide-x-transition">
            <v-layout row wrap class="borderBottom">
                <v-flex xs11>
                    <h3>{{found}} {{$tc('datasets')}} {{$tc('found')}} {{$tc('using')}} {{totalFilters}} {{$tc('filter', totalFilters)}}</h3>
                </v-flex>
                <v-flex xs1><v-icon @click="toggleDrawer()">close</v-icon></v-flex>
            </v-layout>
            <v-layout row wrap>
                <i v-if="loading" class="fa fa-circle-o-notch fa-spin"></i>
                <div v-else>
                    <v-layout row wrap v-for="(facet, key) in field.facets" :key="'facet-'+key">
                        <span v-for="(f, k) in facet" :key="'facet-facet-'+k">
                            <span v-if="filters[k].length > 1">
                                <v-flex xs12 pb-2>{{$tc(facet[k])}}</v-flex>
                                <v-chip 
                                    v-for="(filter, i) in filters[k]" 
                                    :class="filteredOn.indexOf(filter.name) === -1 ? 'pointer mb-2' : 'active pointer mb-2'"
                                    :key="'filter-'+key+'-'+i"
                                    v-on:click="filterOn(filter, k)">
                                    <span class="bold">{{filteredOn.indexOf(filter.name) === -1 ? "-" : "✓"}} {{filter.display_name}}</span>
                                </v-chip>
                            </span>
                        </span>
                    </v-layout>
                    <v-layout row wrap v-for="(info, header) in field.information" :key="'facet-info-'+header">
                        <v-flex v-if="header !== 'banner'" xs12 pb-2><h5>{{$tc(header)}}</h5></v-flex>
                        <v-flex v-if="header !== 'banner'" xs12 pb-2><p>{{$tc(info)}}</p></v-flex>
                        <v-flex v-else xs12 fluid class="banner"><h4>{{$tc(info)}}</h4></v-flex>
                    </v-layout>
                </div>
            </v-layout>
            <v-layout row wrap>
                <v-btn @click="clearClick" color="text">{{$tc('Clear all')}}</v-btn>
                <!--<v-btn @click="toggleDrawer" color="primary">{{$tc('OK')}}</v-btn>-->
            </v-layout>
        </v-container>
    </div>
</template>

<script>
import {CkanApi} from '../../services/ckanApi'
const ckanServ = new CkanApi()

export default{
    props: {
        name: String,
        field: Object,
        found: Number,
        totalFilters: Number,
    },

    data: function(){
        return {
            filters: {},
            loading: false,
            collapseId: "facet-"+this.field+"-collapse",
            collapseProp: "v-b-toggle.collapse"+this.collapseId,
            showCollapse: true,
            COLLAPSE_SIZE: 3,
            showDrawer: false,
            filteredOn: [],
            numApplied: 0,
            count: {},
            numFilters: 0,
            totalCount: 0,
            maxFilters: 0,
        }
    },

    methods: {

        closeDrawer: function(drawerName){
            if (drawerName !== this.name){
                this.showDrawer = false;
            }
        },

        clearClick: function(){
            this.$emit('clearAll');
            this.closeDrawer("X");
        },

        clearAll: function(){
            this.numApplied = 0;
            this.filteredOn = [];
        },

        toggleDrawer: function(){
            this.showDrawer = !this.showDrawer;
            if (this.showDrawer){
                this.$emit('openDrawer', this.name);
            }
        },

        filterOn: function(filter, facet){
            if (this.filteredOn.indexOf(filter.name) !== -1){
                this.filteredOn.splice(this.filteredOn.indexOf(filter.name), 1);
                this.numApplied -=1;
                this.count[facet] -= filter.count;
                this.totalCount -= filter.count;
                this.numFilters  -= 1;
            }else{
                this.filteredOn.push(filter.name);
                this.numApplied +=1;
                if (typeof(this.count[facet]) === "undefined"){
                    this.count[facet] = filter.count;
                }else{
                    this.count[facet] += filter.count;
                }
                this.totalCount += filter.count;
                this.numFilters  += 1;
            }

            this.$emit('facetFilter', facet, filter.name);
        },

        getFacet(){
            for (let i=0; i<this.field.facets.length; i++){
                if (typeof(localStorage["facet-"+Object.keys(this.field.facets[i])[0]]) !== "undefined"){

                    this.filters = JSON.parse(localStorage["facet-"+Object.keys(this.field.facets[i])[0]]);
                }else{
                    let query = "?facet.field=[\""+Object.keys(this.field.facets[i])[0]+"\"]&facet.limit=-1&rows=0";
                    var self = this;
                    ckanServ.getDatasets(query).then((data) => {

                        this.filters[Object.keys(this.field.facets[i])[0]] = data.result.search_facets[Object.keys(self.field.facets[i])[0]].items
                        
                        this.filters[Object.keys(this.field.facets[i])[0]].sort(function(a, b){
                            return (a.name < b.name) ? -1 : 1
                        })

                        localStorage["facet-"+Object.keys(this.field.facets[i])[0]] = JSON.stringify(this.filters)
                        this.loading = false
                    });
                }
            }

            var keys = Object.keys(this.filters);
            for (var i=0; i<keys.length; i++){
                this.maxFilters += this.filters[keys[i]].length;
            }

            // eslint-disable-next-line
                    console.log(this.maxFilters);
        }
    },

    mounted(){
        this.getFacet()
        this.$parent.$on('closeDrawer', this.closeDrawer)
        this.$parent.$on('clearAll', this.clearAll)
    }
}
</script>

<style scoped>

    .borderBottom{
        border-bottom: 1px solid grey;
    }

    .banner{
        background: var(--v-caution-base) !important;
    }

    .closed{
        background: none !important;
        box-shadow: none !important;
        cursor: pointer;
    }

    .closed:hover{
        background: var(--v-secondary-base) !important;
    }

    .open{
        background: var(--v-text-base) !important;
        box-shadow: none !important;
        cursor: pointer;
    }

    .facetIcon{
        color: var(--v-text-base);
    }

    .open .facetIcon{
        color: black;
    }

    .bold{
        font-weight: bold;
    }

    .facetLabel{
        color: var(--v-text-base);
    }

    .open .facetLabel{
        color: black;
    }
    
    .active{
        background: var(--v-highlight-base);
    }

    .iconWidth{
        width: 40px;
    }

    .leftDrawer{
        position: fixed;
        top: 48px;
        left: 110px;
        background: white;
        width: 600px;
        height: calc(100vh - 62px);
        overflow-y: scroll;
        -moz-box-shadow: 5px 5px 5px lightgrey;
        -webkit-box-shadow: 5px 5px 5px lightgrey;
        box-shadow: 5px 5px 5px lightgrey;
    }
</style>

<style>
    .pointer.v-chip .v-chip__content{
        cursor: pointer;
    }

    .facetBadge .v-badge__badge.red{
        top: 10px;
        right: 15px;
    }

    .facetBadge{
        text-align: center;
        align-content: center;
        width: 100%;
    }

</style>
