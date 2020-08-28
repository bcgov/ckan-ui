<template>
    <div v-show="maxFilters > 1">
        <v-expansion-panels tile flat :key="'facetPanel'+name+updates" multiple v-model="model" class="mb-3">
            <v-expansion-panel class="no-background">

                <v-expansion-panel-header @click="togglePanel" class="filterPanelHeader headerHeight py-0">
                    <v-row dense >
                        <v-col cols="10" class="headerHeight py-0">
                            <!-- <v-badge inline color="red" v-if="numApplied>0">
                                <template v-slot:badge>
                                    <span>{{numApplied}}</span>
                                </template>
                                <span>{{$tc(name)}}</span>
                            </v-badge> -->
                            <span>{{$tc(name)}}</span>
                        </v-col>
                    </v-row>
                </v-expansion-panel-header>

                <v-expansion-panel-content class=" mt-4 facet-no-border">
                    <div>
                        <v-row wrap v-for="(facet, key) in field.facets" :key="'facet-'+key">
                            <span v-for="(f, k) in facet" :key="'facet-facet-'+k">
                                <v-row v-if="typeof(filters[k]) !== 'undefined' && filters[k].length > 1">
                                    <div
                                        v-for="(filter, i) in filters[k]"
                                        :class="filteredOn.indexOf(filter.name) === -1 ? 'order-last' : ' active order-first'"
                                        :key="'filter-'+key+'-'+i"
                                    >
                                        <v-chip
                                            :id="'facet-filterOn-'+facet[k]+'-'+filter.name"
                                            label
                                            :class="'chip pointer mr-2 py-0 mb-2' + (filteredOn.indexOf(filter.name) === -1 ? '' : ' active')"
                                            :key="'filterchip-'+key+'-'+i"
                                            v-on:click="filterOn(filter, k)">
                                            <span>
                                                {{filter.display_name}}
                                                <v-icon small class="chipIcon" v-if="filteredOn.indexOf(filter.name) === -1">mdi-plus-circle</v-icon>
                                                <v-icon small class="chipIcon" v-else>mdi-close-circle</v-icon>

                                            </span>
                                        </v-chip>
                                    </div>
                                </v-row>
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

import { mapState, mapActions } from 'vuex'

export default{
    props: {
        name: String,
        field: Object,
        found: Number,
    },

    data: function(){
        return {
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
            updates: 0,
        }
    },

    computed: {
        ...mapState({
            filtered: state => state.search.facets,
            facets: state => state.dataset.facets,
            open(state){
                return state.dataset.facetOpen[this.field.name];
            }
        }),
        maxFilters: function(){
            var keys = Object.keys(this.filters);
            let rv = 2;
            for (var j=0; j<keys.length; j++){
                rv += this.filters[keys[j]].length;
            }
            return rv;
        },
        filters: function(){
            let filters = {};
            for (let i=0; i<this.field.facets.length; i++){
                let fk = Object.keys(this.field.facets[i])[0];
                if ( (typeof(this.facets) === "object") && (typeof(this.facets[fk]) !== "undefined") ){
                    filters[fk] = this.facets[fk][fk];
                }
            }
            return filters;
        },
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

        ...mapActions({
            getFacet: 'dataset/getFacet'
        }),

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
        this.getFacet({facets: this.field.facets, facetName: this.name});
        this.preFilter();
    }
}
</script>

<style scoped>

    .borderless{
        border: none;
        background: none;
    }

    .chip{
        height: 42px;
        color: var(--v-label_colour-base);
        font-weight: normal;
        font-size: 16px;
        background: var(--v-text_background-base) !important;
        border: 1px solid var(--v-label_border-base)
    }

    .chip.active{
        color: var(--v-text-base);
        font-weight: bold;
        background: var(--v-label_colour-base) !important;
        border: none;
    }

    .chipIcon{
        color: var(--v-label_colour-base);
    }

    .chip.active .chipIcon{
        color: var(--v-text-base);
    }

    .filterPanelHeader{
        background: var(--v-filter_colour-base) !important;
        color: var(--v-text-base) !important;
        font-weight: bold;
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

    .v-expansion-panels .no-background.v-expansion-panel {
        background: none;
    }

    .v-expansion-panel:before{
        box-shadow: none;
    }


</style>

<style>
.headerHeight{
    height: 40px;
    line-height: 40px;
    min-height: 40px;
    vertical-align: middle;
}

.v-expansion-panel--active>.v-expansion-panel-header.headerHeight{
    min-height: unset;
}

</style>
