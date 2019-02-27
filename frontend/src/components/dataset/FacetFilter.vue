<template>
     <b-card v-if="!noResults" :sub-title="name">
         <b-card-text>
             <i v-if="loading" class="fa fa-circle-o-notch fa-spin"></i>
             <b-list-group v-else>
                 <b-list-group-item
                         button
                         v-for="(filter, i) in filters.slice(0,COLLAPSE_SIZE)"
                         v-bind="filteredOn === filter.name ? [{'active': ''}] : ''"
                         v-on:click="filterOn(filter.name)"
                         :key="'facet-' + field + '-filter-' + i">
                     <div>
                        {{filter.display_name}}
                        <b-badge variant="primary" pill>{{filter.count}}</b-badge>
                     </div>
                 </b-list-group-item>
                 <b-collapse v-if="filters.length>COLLAPSE_SIZE" :id="collapseId" :style="'display: ' + (showCollapse? 'none' : 'block')">
                     <b-list-group-item
                             button
                             v-for="(filter, i) in filters.slice(COLLAPSE_SIZE)"
                             v-bind="filteredOn === filter.name ? [{'active': ''}] : ''"
                             v-on:click="filterOn(filter.name)"
                             :key="'facet-' + field + '-filter-' + i">
                         <div>
                            {{filter.display_name}}
                            <b-badge variant="primary" pill>{{filter.count}}</b-badge>
                         </div>
                     </b-list-group-item>
                 </b-collapse>
                 <a v-if="filters.length>COLLAPSE_SIZE"
                     class="pointer-hover"
                     @click="showCollapse = !showCollapse"
                     :aria-controls="collapseId"
                     :aria-expanded="showCollapse? 'true' : 'false'">
                     {{showCollapse? "Show " + (filters.length - COLLAPSE_SIZE) + " More" : "Show Less"}}
                 </a>
             </b-list-group>
         </b-card-text>
     </b-card>
</template>

<script>
import {CkanApi} from '../../services/ckanApi'
import BCollapse from "bootstrap-vue/src/components/collapse/collapse"
const ckanServ = new CkanApi()

export default{
    components: {BCollapse},
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

<style scoped>
    @import "https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css";
    div.card-body{
        padding-left: 0;
        padding-right: 0;
        padding-bottom: 0;
    }

    .list-group-item{
        font-size: 13px;
        line-height: 13px;
        border-left: 0;
        border-right: 0;
    }

    .pointer-hover{
        cursor: pointer;
        font-size: 13px;
        line-height: 13px;
        color: blue !important;
        padding-top: 5px;
        padding-bottom: 5px;
    }
</style>