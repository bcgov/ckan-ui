<template>
    <v-container fluid pa-0>
        <v-badge overlap color="red" class="facetBadge">
            <template v-slot:badge>
                <span v-if="numApplied>0">{{numApplied}}</span>
            </template>
            <v-btn ma-0 pa-0 flat dark @click="toggleDrawer()">
                <v-icon dark x-large class="iconWidth">{{field.icon}}</v-icon>
                {{name}}
            </v-btn>
        </v-badge>

        <v-container class="leftDrawer" v-if="showDrawer" transition="slide-x-transition">
            <v-layout row wrap>
                <v-flex xs11></v-flex>
                <v-flex xs1><v-icon @click="toggleDrawer()">close</v-icon></v-flex>
            </v-layout>
            <v-layout row wrap>
                <i v-if="loading" class="fa fa-circle-o-notch fa-spin"></i>
                <div v-else>
                    <v-layout row wrap v-for="(facet, key) in field.facets" :key="'facet-'+key">
                        <span v-for="(f, k) in facet" :key="'facet-facet-'+k">
                            <v-flex xs12>{{facet[k]}}</v-flex>
                            <v-chip 
                                v-for="(filter, i) in filters[k]" 
                                :class="filteredOn.indexOf(filter.name) === -1 ? '' : 'active'"
                                :key="'filter-'+key+'-'+i"
                                v-on:click="filterOn(filter.name, k)">
                                <span>{{filteredOn.indexOf(filter.name) === -1 ? "-" : "+"}} {{filter.display_name}}</span><span class="badge">{{filter.count}}</span>
                            </v-chip>
                        </span>
                    </v-layout>
                </div>
            </v-layout>
            <v-layout row wrap>
                <v-btn @click="toggleDrawer" color="error">Clear all</v-btn>
                <v-btn @click="toggleDrawer" color="primary">Close</v-btn>
            </v-layout>
        </v-container>
    </v-container>
</template>

<script>
import {CkanApi} from '../../services/ckanApi'
const ckanServ = new CkanApi()

export default{
    props: {
        name: String,
        field: Object,
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
        }
    },

    methods: {

        toggleDrawer: function(){
            this.showDrawer = !this.showDrawer;
            this.$emit('openDrawer', this.name);
        },

        filterOn: function(filter, facet){
            if (this.filteredOn.indexOf(filter) !== -1){
                this.filteredOn.splice(this.filteredOn.indexOf(filter), 1);
                this.numApplied -=1;
            }else{
                this.filteredOn.push(filter);
                this.numApplied +=1;
            }

            this.$emit('facetFilter', facet, filter);
        },

        getFacet(){
            
            for (let i=0; i<this.field.facets.length; i++){
                // if (typeof(localStorage["facet-"+Object.keys(this.field.facets[i])[0]]) !== "undefined"){

                //     this.filters = JSON.parse(localStorage["facet-"+Object.keys(this.field.facets[i])[0]]);
                // }else{
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
                // }
            }
        }
    },

    mounted(){
        this.getFacet()
    }
}
</script>

<style>

    .noBack{
        background: none !important
    }

    .badge{
        font-size: 9px;
        background: lightblue;
    }

    div.v-list__tile__content{
        font-size: 13px;
        line-height: 13px;
    }

    .list-group-item{
        font-size: 13px;
        line-height: 13px;
        border: none;
        box-sizing: border-box;
        padding: 0px;
        padding-top: 5px;
        padding-bottom: 5px;
    }

    .pointer-hover{
        cursor: pointer;
        font-size: 13px;
        line-height: 13px;
        color: blue !important;

    }
</style>

<style scoped>
    .active{
        background: lightgreen;
    }

    .iconWidth{
        width: 40px;
    }

    .leftDrawer{
        position: fixed;
        top: 0px;
        left: 200px;
        background: white;
        z-index: 20;
        width: 600px;
        height: 100%;
        overflow-y: scroll
    }

    div.v-list__tile__content.active{
        background: lightblue;
    }
</style>

<style>

    .facetBadge .v-badge__badge.red{
        top: 10px;
    }

</style>
