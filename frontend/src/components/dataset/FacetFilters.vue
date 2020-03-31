<template>
    <span>
        <v-row class="rotate d-sm-none d-block">
            <v-btn @click="show = true" text class="anchorText">{{$tc('Filter')}} {{$tc('Result', 2)}}</v-btn>
        </v-row>
        <v-row class="ml-1 mb-3 text-left d-sm-block d-none">
            <span class="primary">
                <a class="anchorText" @click="expand">{{$tc('Expand All')}}</a>
                <span class="anchorText"> | </span>
                <a class="anchorText" @click="collapse">{{$tc('Collapse All')}}</a>
            </span>
        </v-row>
        <span :class="show ? 'full' : ''">
            <v-row v-show="show">
                <v-btn text @click="show = false"><v-icon color="primary">mdi-arrow-left</v-icon>{{$tc('Back to')}} {{$tc('result', 2)}}</v-btn>
            </v-row>
            <v-row v-show="show" class="ml-1 mb-3 text-left">
                <span class="primary">
                    <a class="anchorText" @click="expand">{{$tc('Expand All')}}</a>
                    <span class="anchorText"> | </span>
                    <a class="anchorText" @click="collapse">{{$tc('Collapse All')}}</a>
                </span>
            </v-row>
            <span v-for="(facet, facetKey) in facets" :key="'facet-section-'+facetKey" :class="'d-sm-block d-none' + ( show ? ' d-block' : '')">
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
            show: false
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

.rotate{
    transform: rotate(-90deg);
    background: var(--v-primary-base);
    color: var(--v-text-base);
    width: 150px;
    position: absolute;
    right: 0px;
    margin-right: -65px;
    cursor: pointer;
}

.v-btn:not(.v-btn--round).v-size--default{
    margin-left: 0px;
    margin-right: 0px;
}

@media (max-width: 599px){
    .full{
        width: 100%;
        height: 100%;
        background: var(--v-text-base);
        position: absolute;
        top: 50px;
        left: 0px;
    }
}
</style>