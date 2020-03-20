<template>
    <span>
        <v-row class="ml-1 mb-3 text-left">
            <span class="primary">
                <a class="anchorText" @click="expand">{{$tc('Expand All')}}</a>
                <span class="anchorText"> | </span>
                <a class="anchorText" @click="collapse">{{$tc('Collapse All')}}</a>
            </span>
        </v-row>
        <span v-for="(facet, facetKey) in facets" :key="'facet-section-'+facetKey">
            <span v-if="hideFacets.indexOf(facet.name)===-1">
                <FacetFilter
                    :name="facet.name"
                    :found="0"
                    :field="facet"
                    v-on:facetFilter="facetFilter"
                ></FacetFilter>
            </span>
        </span>
    </span>
</template>

<script>
import { mapState } from 'vuex';

import FacetFilter from './FacetFilter';

export default{

    props:{
        hideFacets: {
            type: Array,
            default: () => []
        }
    },

    components: {
        FacetFilter: FacetFilter
    },

    data: function(){
        return {

        }
    },

    computed: {
        ...mapState({
            facets: state => state.dataset.facetList,
            facetOpen: state => state.dataset.facetOpen,
        }),
    },
    

    methods: {

        facetFilter: function(){
            this.$emit('facetFilter');
        },

        expand: function(){
            this.changeFacetsOpen(true);
        },

        collapse: function(){
            this.changeFacetsOpen(false);
        },

        changeFacetsOpen(open){
            let keys = Object.keys(this.facetOpen);
            for (let i=0; i<keys.length; i++){
                if (open){
                    this.openFacet(keys[i]);
                }else{
                    this.closeFacet(keys[i]);
                }
            }
        },

        openFacet: function(name){
            this.$store.commit('dataset/setFacetOpen', { facet: name, open: true})
        },

        closeFacet: function(name){
            this.$store.commit('dataset/setFacetOpen', { facet: name, open: false})
        },

    },

    mounted(){
    }
}
</script>

<style scoped>
.anchorText{
    color: var(--v-text-base);    
}
</style>