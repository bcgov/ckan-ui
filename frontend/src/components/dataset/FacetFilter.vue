<template>
    <div v-show="maxFilters > 1">
        <v-expansion-panels :key="'facetPanel'+name+updates" multiple v-model="model" class="mb-3">
            <v-expansion-panel>
                
                <v-expansion-panel-header @click="togglePanel" class="filterPanelHeader">
                    <v-row dense>
                        <v-col cols="10">
                            <v-badge inline color="red" >
                                <template v-slot:badge>
                                    <span v-if="numApplied>0">{{numApplied}}</span>
                                </template>
                                <span>{{$tc(name)}}</span>
                            </v-badge>
                        </v-col>
                    </v-row>
                </v-expansion-panel-header>
                
                <v-expansion-panel-content class="facet-no-border">
                    <div>
                        <v-row wrap v-for="(facet, key) in field.facets" :key="'facet-'+key">
                            <span v-for="(f, k) in facet" :key="'facet-facet-'+k">
                                <span v-if="typeof(filters[k]) !== 'undefined' && filters[k].length > 1">
                                    <v-chip 
                                        v-for="(filter, i) in filters[k]" 
                                        :id="'facet-filterOn-'+facet[k]+'-'+filter.name"
                                        label
                                        :class="filteredOn.indexOf(filter.name) === -1 ? 'pointer mb-2 mr-2' : 'active pointer mb-2 mr-2'"
                                        :key="'filter-'+key+'-'+i"
                                        v-on:click="filterOn(filter, k)">
                                        <span class="bold">
                                            {{filter.display_name}}
                                            <v-icon v-if="filteredOn.indexOf(filter.name) === -1">mdi-plus-circle</v-icon>
                                            <v-icon v-else>mdi-close-circle</v-icon>
                                            
                                        </span>
                                    </v-chip>
                                </span>
                            </span>
                        </v-row>
                        <v-row wrap v-for="(info, header) in field.information" :key="'facet-info-'+header">
                            <v-col v-if="header !== 'banner'" cols=12 pb-2><h5>{{$tc(header)}}</h5></v-col>
                            <v-col v-if="header !== 'banner'" cols=12 pb-2><p>{{$tc(info)}}</p></v-col>
                            <v-col v-else cols=12 fluid class="banner"><h4>{{$tc(info)}}</h4></v-col>
                        </v-row>
                    </div>
                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-expansion-panels>

        
        <!-- <v-container px-0  :id="'facet-'+name" align-center align-content-center justify-center class="facet" fluid @click="toggleDrawer()" :class="{'open': showDrawer, 'closed': !showDrawer}">
            <v-badge overlap color="red" class="facetBadge">
                <template v-slot:badge>
                    <span v-if="numApplied>0">{{numApplied}}</span>
                </template>
                
                <v-container fluid pa-0 ma-0>
                    <v-row wrap>
                        <v-col cols=12 class="text-xs-center">
                            <v-icon x-large class="iconWidth facetIcon">{{field.icon}}</v-icon>
                        </v-col>
                    </v-row>
                    <v-row wrap>
                        <v-col cols=12 class="text-xs-center facetLabel">{{$tc(name)}}</v-col>
                    </v-row>
                </v-container>            
            </v-badge>
        </v-container>

        <v-container fluid class="leftDrawer" v-if="showDrawer" transition="slide-x-transition">
            <v-row wrap class="borderBottom">
                <v-col cols=11>
                    <h3>{{found}} {{$tc('datasets')}} {{$tc('found')}} {{$tc('using')}} {{totalFilters}} {{$tc('filter', totalFilters)}}</h3>
                </v-col>
                <v-col cols=1><v-icon :id="'facet-close-'+name" @click="toggleDrawer()">close</v-icon></v-col>
            </v-row>
            <v-row wrap>
                <v-progress-circular
                    v-if="loading"
                    indeterminate
                    color="light-blue"
                ></v-progress-circular>
                <div v-else>
                    <v-row wrap v-for="(facet, key) in field.facets" :key="'facet-'+key">
                        <span v-for="(f, k) in facet" :key="'facet-facet-'+k">
                            <span v-if="typeof(filters[k]) !== 'undefined' && filters[k].length > 1">
                                <v-col cols=12 pb-2>{{$tc(facet[k])}}</v-col>
                                <v-chip 
                                    v-for="(filter, i) in filters[k]" 
                                    :id="'facet-filterOn-'+facet[k]+'-'+filter.name"
                                    :class="filteredOn.indexOf(filter.name) === -1 ? 'pointer mb-2' : 'active pointer mb-2'"
                                    :key="'filter-'+key+'-'+i"
                                    v-on:click="filterOn(filter, k)">
                                    <span class="bold">{{filteredOn.indexOf(filter.name) === -1 ? "-" : "✓"}} {{filter.display_name}}</span>
                                </v-chip>
                            </span>
                        </span>
                    </v-row>
                    <v-row wrap v-for="(info, header) in field.information" :key="'facet-info-'+header">
                        <v-col v-if="header !== 'banner'" cols=12 pb-2><h5>{{$tc(header)}}</h5></v-col>
                        <v-col v-if="header !== 'banner'" cols=12 pb-2><p>{{$tc(info)}}</p></v-col>
                        <v-col v-else cols=12 fluid class="banner"><h4>{{$tc(info)}}</h4></v-col>
                    </v-row>
                </div>
            </v-row>
            <v-row wrap>
                <v-btn @click="clearClick" :id="'facet-clearAll-'+name" color="text">{{$tc('Clear all')}}</v-btn> -->
                <!--<v-btn @click="toggleDrawer" color="primary">{{$tc('OK')}}</v-btn>-->
            <!-- </v-row>
        </v-container>
        <v-container fluid class="dimmer" v-if="showDrawer" :id="'facet-dimmerClose-'+name" @click="toggleDrawer()">
            <v-row wrap fill-height>
                <v-col cols=12>
                </v-col>
            </v-row>
        </v-container> -->
    </div>
</template>

<script>
import {CkanApi} from '../../services/ckanApi'
const ckanServ = new CkanApi()

import { mapState } from 'vuex'

export default{
    props: {
        name: String,
        field: Object,
        found: Number,
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
            updates: 0,
        }
    },

    computed: {
        ...mapState({
            filtered: state => state.search.facets,
            facet: state => state.dataset.facets,
            open(state){
                return state.dataset.facetOpen[this.field.name];
            }
        }),
        model: {
            get: function(){
                return this.open ? [0] : [];
            },
            set: function(){
                this.updates += 1;
            }
        }
    },
    

    methods: {

        togglePanel: function(){
            this.$store.commit('dataset/setFacetOpen', {facet: this.field.name, open: !this.open})
        },

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

            this.$store.commit('search/toggleFacet', {facet: facet, filter: filter.name});
            this.$emit('facetFilter');
        },

        getFacet(){
            for (let i=0; i<this.field.facets.length; i++){
                if ( (typeof(localStorage["facet-"+Object.keys(this.field.facets[i])[0]]) !== "undefined") && (localStorage["facet-"+Object.keys(this.field.facets[i])[0]].length > 0) ){

                    this.filters = JSON.parse(localStorage["facet-"+Object.keys(this.field.facets[i])[0]]);
                    var keys = Object.keys(this.filters);
                    for (var j=0; j<keys.length; j++){
                        this.maxFilters += this.filters[keys[j]].length;
                    }
                }else{
                    let query = "?facet.field=[\""+Object.keys(this.field.facets[i])[0]+"\"]&facet.limit=-1&rows=0";
                    var self = this;
                    ckanServ.getDatasets(query).then((data) => {

                        this.filters[Object.keys(this.field.facets[i])[0]] = data.result.search_facets[Object.keys(self.field.facets[i])[0]].items
                        
                        this.filters[Object.keys(this.field.facets[i])[0]].sort(function(a, b){
                            return (a.name < b.name) ? -1 : 1
                        })

                        localStorage["facet-"+Object.keys(this.field.facets[i])[0]] = JSON.stringify(this.filters)
                        var keys = Object.keys(this.filters);
                        for (var j=0; j<keys.length; j++){
                            this.maxFilters += this.filters[keys[j]].length;
                        }
                        this.loading = false
                    });
                }
            }
        },

        preFilter: function(){

            for (let i=0; i<this.field.facets.length; i++){
                let keys = Object.keys(this.field.facets[i]);
                let facetName = keys[0];
                if (typeof(this.filtered[facetName]) !== "undefined"){
                    for (let j=0; j<this.filtered[facetName].length; j++){
                        let filter = this.filtered[facetName][j];
                        this.filteredOn.push(filter);
                        this.numApplied += 1;
                    }
                }
            }
        },
    },

    mounted(){
        this.getFacet()
        this.preFilter();
    }
}
</script>

<style scoped>

    .borderless{
        border: none;
        background: none;
    }

    .filterPanelHeader{
        background: var(--v-primary-base) !important;
        color: var(--v-text-base) !important
    }

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
    
    
    .theme--light.v-chip:not(.v-chip--active).active{
        background: var(--v-primary-base);
        color: var(--v-text-base)
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
        padding-left: 30px;
        overflow-x: hidden;
        height: calc(100vh - 62px);
        overflow-y: scroll;
        -moz-box-shadow: 5px 5px 5px lightgrey;
        -webkit-box-shadow: 5px 5px 5px lightgrey;
        box-shadow: 5px 5px 5px lightgrey;
    }
    .dimmer{
        position: fixed;
        top: 48px;
        left: 710px;
        background: black;
        width: 100%;
        height: 100%;
        z-index: 2;
        opacity: 0.2;
    }
</style>

<style>
    .pointer.v-chip .v-chip__content{
        cursor: pointer;
    }

    .theme--light.v-expansion-panels .v-expansion-panel-header .v-expansion-panel-header__icon .v-icon{
        color: var(--v-text-base) !important;
    }

    .facet-no-border{
        border: none;
        background: none;
        box-shadow: none;
    }

    .v-expansion-panel:before{
        box-shadow: none;
    }


</style>
