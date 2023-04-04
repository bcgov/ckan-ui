<template>
    <v-container v-if="error">
        <div row align-center justify-center>
            <h1><v-icon x-large>mdi-alert-circle</v-icon> An Error Occurred: {{error.code}}</h1>
            <p><v-icon x-large>mdi-emoticon-sad-outline</v-icon> Please try again or contact your system administrator</p>
        </div>
    </v-container>
    <v-container fluid v-else class="px-md-11 main-area">
        <Banner></Banner>
        <v-row wrap class="mr-md-1">
            <v-col cols=10 sm=7>
                <ListPage
                    :key="'listPage-'+facetFilterIndex"
                ></ListPage>
            </v-col>
            <!-- <v-col cols=1 sm=1></v-col> -->
            <v-col cols=2 sm=5 class="mt-9 pt-9">
                <FacetFilters
                    class="mt-6 pt-6"
                    v-on:facetFilter="facetFilter"
                ></FacetFilters>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>

  import {Analytics} from '../../services/analytics'
  const analyticsServ = new Analytics()
  import { mapState, mapActions } from 'vuex'


  import ListPage from '../dataset/ListPage'
  import FacetFilters from '../dataset/FacetFilters'
  import Banner from '../banner/Banner'

  export default {
    components: {
        ListPage: ListPage,
        FacetFilters: FacetFilters,
        Banner: Banner
    },

    data() {
      return {
          error: null,
          facetFilterIndex: 0,
      }
    },

    computed:{
        ...mapState({
            facets: state => state.dataset.facetList,
            searchText: state => state.search.searchText
        }),
    },

    methods: {
        ...mapActions({
            getFacetList: 'dataset/getFacetList'
        }),

        facetFilter: function(){
            this.facetFilterIndex += 1;
        },

        // Returns facets object based on facets supplied in url string
        facetStringToObject(str) {
            let result = {};
            let regex = /(\w+):\(([^)]+)\)/g;
            let match = regex.exec(str);
            while (match != null) {
                let key = match[1];
                let values = match[2].replace(/"/g, '').split(' OR ');
                if (key in result) {
                result[key].push(...values);
                } else {
                result[key] = values;
                }
                match = regex.exec(str);
            }
            return result;
        },

        // Returns an object with facet keys mapped to Facet Name and Facet ID for easy access
        convertFacetList: function(facetList) {
            let newObj = {};
            for (let key in facetList) {
                if (facetList.hasOwnProperty(key)) {
                    let obj = facetList[key];
                    let facet = obj.facets[0];
                    let facetID = Object.keys(facet)[0];
                    newObj[key] = { name: obj.name, facetID: facetID };
                }
            }
            return newObj;
        }
    },

    created(){
        const urlSearchText = this.$route.query.q;
        // eslint-disable-next-line no-console
        console.log("urlSearchText= ", urlSearchText, " this.searchText= ", this.searchText)
        const urlFacets = this.facetStringToObject(this.$route.query.fq);
        this.$store.commit('search/setFacets', urlFacets);
        if (urlSearchText) {
            this.$store.commit('search/setSearchText', urlSearchText);
        }else{
            this.$store.commit('search/setSearchText', '');
        }
    },

    async mounted(){
        analyticsServ.get(window.currentUrl, this.$route.meta.title, window.previousUrl);

        await this.$store.dispatch('dataset/getFacetList')
        const urlFacets = this.facetStringToObject(this.$route.query.fq);
        let facetIdArray = Object.keys(urlFacets);
    
        const facets = this.convertFacetList(this.facets);

        for (const key in facets) {
            if (facets.hasOwnProperty(key)) {
                const facetID = facets[key].facetID;
                if (facetIdArray.includes(facetID)) {
                    this.$store.commit('dataset/setFacetOpen', { facet: facets[key].name, open: true})  
                }
            }
        }
    },
    updated() {
        window.snowplow('refreshLinkClickTracking');
    },
  }
</script>

<style>
    .fixed{
        position: fixed;
        top: 0px;
        right: 0px;
    }
    .main-area {
        margin-bottom: 45px;
        background: var(--v-data_background-base);
        min-height: calc(100% - 115px);
    }
</style>
