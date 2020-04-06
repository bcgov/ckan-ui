<template>
    <v-container fluid class="px-0">
        <v-row wrap class="rotate d-sm-none d-block">
            <v-btn @click="show = true" text class="anchorText">{{$tc('Filter')}} {{$tc('Result', 2)}}</v-btn>
        </v-row>
        <v-row wrap dense class="mb-3 d-sm-block d-none fixedHeight">
            <v-col cols=5 class="flex pr-0">
                <v-btn class="filterColour leftRadius filterSize fixedHeight" @click="expand">{{$tc('Expand All')}}</v-btn>
            </v-col>

            <v-col cols=2 class="flex px-0">
                <v-btn class="filterColour noCursor noBorder filterSize fixedHeight"> | </v-btn>
            </v-col>

            <v-col cols=5 class="flex pl-0">
                <v-btn class="filterColour rightRadius filterSize fixedHeight" @click="collapse">{{$tc('Collapse All')}}</v-btn>
            </v-col>
        </v-row>
        <span :class="show ? 'full' : ''">
            <v-row v-show="show">
                <v-btn text @click="show = false"><v-icon color="primary">mdi-arrow-left</v-icon>{{$tc('Back to')}} {{$tc('result', 2)}}</v-btn>
            </v-row>
            <v-row v-show="show" wrap dense class="mb-3 text-left">
                <v-col cols=5 class="flex pr-0">
                    <v-btn class="filterColour leftRadius filterSize fixedHeight" @click="expand">{{$tc('Expand All')}}</v-btn>
                </v-col>

                <v-col cols=2 class="flex px-0">
                    <v-btn class="filterColour noCursor noBorder filterSize fixedHeight"> | </v-btn>
                </v-col>

                <v-col cols=5 class="flex pl-0">
                    <v-btn class="filterColour rightRadius filterSize fixedHeight" @click="collapse">{{$tc('Collapse All')}}</v-btn>
                </v-col>
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
    </v-container>
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

.flex{
    display: inline-flex;
}

.rotate{
    transform: rotate(-90deg);
    background: var(--v-primary-base);
    color: var(--v-text-base);
    width: 150px;
    position: fixed;
    right: 0px;
    top: calc(50% - 75px);
    margin-right: -65px;
    cursor: pointer;
}

.v-btn:not(.v-btn--round).v-size--default{
    margin-left: 0px;
    margin-right: 0px;
}

.noCursor{
    cursor: auto;
}

.noBorder{
    border: 0px;
}

.filterSize{
    width: 100%;
    padding-top: 16px;
    padding-bottom: 16px;
    border-radius: 0px;
}

.leftRadius{
    border-top-left-radius: 4px;
    border-right: 0px;
}

.rightRadius{
    border-top-right-radius: 4px;
    border-left: 0px;
}

.fixedHeight{
    height: 55px;
}

.fixedHeight.v-btn:not(.v-btn--round).v-size--default{
    height: 55px;
}

.filterColour{
    background: var(--v-filter_colour-base) !important;
    color: var(--v-text-base);
}

@media (max-width: 599px){
    .full{
        width: 100%;
        height: 100%;
        background: var(--v-text-base);
        position: absolute;
        top: 70px;
        left: 0px;
    }
}
</style>