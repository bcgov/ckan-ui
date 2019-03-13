<template>
    <div>
        <v-list class="noBack" v-if="!noResults">
            <i v-if="loading" class="fa fa-circle-o-notch fa-spin"></i>
            <div v-else>
                <v-subheader>{{name}}</v-subheader>
                <v-divider></v-divider>
                <v-list-tile
                    v-for="(filter, i) in filters.slice(0,COLLAPSE_SIZE)"
                    v-on:click="filterOn(filter.name)"
                    :key="'facet-' + field + '-filter-' + i">
                    <v-list-tile-content :class="filteredOn === filter.name ? ['active'] : ['']">
                        <span>{{filter.display_name}}</span><span class="badge">{{filter.count}}</span>
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-tile v-if="!showCollapse"
                    v-for="(filter, i) in filters.slice(COLLAPSE_SIZE)"
                    v-on:click="filterOn(filter.name)"
                    :key="'facet-' + field + '-filter-' + (i+3)">
                    <v-list-tile-content>
                        <span class="list-group-item">
                            {{filter.display_name}}
                            <span class="badge">{{filter.count}}</span>
                        </span>
                    </v-list-tile-content>
                </v-list-tile>
                <a v-if="filters.length>COLLAPSE_SIZE"
                         class="pointer-hover"
                         @click="showCollapse = !showCollapse">
                         {{showCollapse? "Show " + (filters.length - COLLAPSE_SIZE) + " More" : "Show Less"}}
                     </a>
            </div>
        </v-list>
     </div>
</template>

<script>
import {CkanApi} from '../../services/ckanApi'
const ckanServ = new CkanApi()

export default{
    props: {
        name: String,
        field: String,
    },

    data: function(){
        return {
            filters: [],
            loading: true,
            noResults: false,
            collapseId: "facet-"+this.field+"-collapse",
            collapseProp: "v-b-toggle.collapse"+this.collapseId,
            showCollapse: true,
            COLLAPSE_SIZE: 3,
            filteredOn: ""
        }
    },

    methods: {

        filterOn: function(filter){
            if (this.filteredOn === filter){
                this.filteredOn = ""
            }else{
                this.filteredOn = filter
            }
            // eslint-disable-next-line
            console.log("filteredOn", this.filteredOn);
            this.$emit('facetFilter', this.field, filter)
        },

        getFacet(){
            if (typeof(sessionStorage["facet-"+this.field]) !== "undefined"){

                this.filters = JSON.parse(sessionStorage["facet-"+this.field])
                if (this.filters.length <= 0) {
                    this.noResults = true
                }
                this.loading = false
                return
            }
            let query = "?facet.field=[\""+this.field+"\"]&facet.limit=-1&rows=0";
            ckanServ.getDatasets(query).then((data) => {

                this.filters = data.result.search_facets[this.field].items
                if (this.filters.length <= 0) {
                    this.noResults = true
                }
                this.filters.sort(function(a, b){
                    return (a.count < b.count) ? 1 : -1
                })

                sessionStorage["facet-"+this.field] = JSON.stringify(this.filters)

                this.loading = false
            });
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


    a.v-list__tile{
        padding: 0px;
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
    div.v-list__tile__content.active{
        background: lightblue;
    }
</style>