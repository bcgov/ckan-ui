<template>
    <v-container fluid class="px-0">
        <v-row wrap class="rotate d-sm-none d-block">
            <v-btn @click="show = true" text class="anchorText">{{$tc('Filter')}} {{$tc('Result', 2)}}</v-btn>
        </v-row>
        <v-row wrap dense class="mb-8 d-sm-block d-none fixedHeight">
            <v-col cols=12 class="px-0 pb-0 pt-1 my-0">
                <h3 class="facetHeader">
                    {{$tc('Filter Search Results')}}
                </h3>
            </v-col>
            <v-col cols=12 class="px-0">
                <span>
                    <v-btn tile depressed class="fixedHeight ml-3 px-0 filterControls" @click="expand">{{$tc('Expand All')}}</v-btn>
                    <v-btn tile depressed text class="noCursor px-0 fixedHeight filterControls filterControlNoClick" width="1em" min-width="1em"> | </v-btn>
                    <v-btn tile depressed class="fixedHeight px-0 filterControls" @click="collapse">{{$tc('Collapse All')}}</v-btn>
                    <v-btn tile depressed text class="noCursor px-0 fixedHeight filterControls filterControlNoClick" width="1em" min-width="1em"> | </v-btn>
                    <v-btn tile depressed class="fixedHeight px-0 filterControls" @click="reset">{{$tc('Reset')}}</v-btn>
                </span>
            </v-col>
        </v-row>
        <span :class="show ? 'full' : ''">
            <v-row v-show="show">
                <v-btn tile depressed @click="show = false"><v-icon color="primary">mdi-arrow-left</v-icon>{{$tc('Back to')}} {{$tc('result', 2)}}</v-btn>
            </v-row>
            <v-row v-show="show" wrap dense class="mb-3 text-left">
                <v-col cols=5 class="flex pr-0">
                    <v-btn tile depressed class="filterColour filterSize fixedHeight" @click="expand">{{$tc('Expand All')}}</v-btn>
                </v-col>

                <v-col cols=2 class="flex px-0">
                    <v-btn tile depressed class="filterColour noCursor noBorder filterSize fixedHeight" width="1em" min-width="1em"> | </v-btn>
                </v-col>

                <v-col cols=5 class="flex pl-0">
                    <v-btn tile depressed class="filterColour filterSize fixedHeight" @click="collapse">{{$tc('Collapse All')}}</v-btn>
                </v-col>
            </v-row>
            <span v-for="(facet, facetKey) in facets" :key="'facet-section-'+facetKey" :class="'d-sm-block d-none' + ( show ? ' d-block' : '')">
                <span v-if="hideFacets.indexOf(facet.name)===-1" :key="'facetFilterSpan-'+facetKey+'-'+redrawKey">
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
            show: false,
            redrawKey: 0
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

            this.$gtag.event('facet_view', {
                'facet': 'open_all_facets'
            })
        },

        collapse: function(){
            this.changeFacetsOpen(false);

            this.$gtag.event('facet_view', {
                'facet': 'close_all_facets'
            })
        },

        changeFacetsOpen(open){
            let keys = Object.keys(this.facets);
            for (let i=0; i<keys.length; i++){
                if (open){
                    this.openFacet(this.facets[keys[i]].name);
                }else{
                    this.closeFacet(this.facets[keys[i]].name);
                }
            }
        },

        reset: function(){
            this.$store.commit('search/clearAllFacets', {});
            this.redrawKey++;
            this.$emit('facetFilter');

            this.$gtag.event('remove_filter', {
                'facet': 'all_facets',
                'filter': 'all_filters'
            })
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

.facetHeader{
    font-weight: bold;
    color: var(--v-faded_text-base);
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
    height: 40px;
}

.fixedHeight.v-btn:not(.v-btn--round).v-size--default{
    height: 40px;
}

.filterColour{
    background: var(--v-filter_colour-base) !important;
    color: var(--v-text-base);
}

.filterColour:hover{
    opacity: unset;
}

.filterControls{
    color: var(--v-label_colour-base);
    
}

.filterControlNoClick{
    pointer-events: none;
}

.filterControls.v-btn:not(.v-btn--text):not(.v-btn--outlined):hover:before {
    opacity: 0;
}

.floatRight{
    float: right;
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
