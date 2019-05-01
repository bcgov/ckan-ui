<template>
    <v-container pa-0 ma-0 fluid>
        <v-layout row-wrap fill-height>
            <v-flex xs1 class="tertiary nav facetFilter">
                <!-- Facets  -->
                <FacetFilter
                    v-for="(facet, facetKey) in facets"
                    :key="'facet-section-'+facetKey"
                    :name="facet.name"
                    :found="count"
                    :field="facet"
                    :totalFilters="totalFilters"
                    v-on:facetFilter="facetFilter"
                    v-on:openDrawer="openDrawer"
                    v-on:clearAll="clearAll"
                ></FacetFilter>
            </v-flex>
            <v-flex xs1></v-flex>
            <v-flex xs11>
                <v-layout row wrap pb-3>
                </v-layout>
                <v-layout row wrap>
                    <v-flex xs1></v-flex>
                    <v-flex xs9>
                        <v-text-field v-model="searchText" :label="$tc('SearchDatasets')" v-on:keyup="search" outline append-icon="search"></v-text-field>
                    </v-flex>
                </v-layout>
                <v-layout row wrap>
                    <v-flex xs1></v-flex>
                    <v-flex xs4>
                        <h3>
                            {{count}} {{$tc('datasets')}} {{$tc('found')}}
                            <span v-if="searchedText !== ''"> {{$tc('matching')}} "{{searchedText}}"</span>
                            <span v-if="searchedText !== '' && totalFilters > 0"> {{$tc('and')}}</span>
                            <span v-if="totalFilters > 0"> {{$tc('with')}} {{totalFilters}} {{$tc('filters applied')}}</span>
                        </h3>
                    </v-flex>
                    <v-flex xs3>
                    </v-flex>
                    <v-flex xs2>
                        <v-select append-icon="arrow_drop_down" persistent-hint v-model="sortOrder" :items="sortOptions" item-text="text" item-value="value" :label="$tc('Order By')" v-on:change="sort"></v-select>
                    </v-flex>
                </v-layout>
                <v-layout row wrap align-center justify-center pt-2 pb-3>
                    <!-- <v-flex xs2><a v-on:click="advanced = !advanced">{{advanced ? 'Switch to basic' : "Switch to advanced"}}</a></v-flex> -->
                </v-layout>
                <!-- <v-layout row wrap style="border-bottom: 1px solid;">
                </v-layout> -->

                <v-layout row wrap>
                    <v-flex xs10>
                        <!-- Search  -->
                        <i v-if="loading" class="fa fa-circle-o-notch fa-spin"></i>
                        <div v-else-if="noResults">
                            No results
                        </div>
                        <div v-else>
                            <ListCard v-for="dataset in datasets" :key="'dataset-'+dataset.id" :record="dataset"></ListCard>
                            <infinite-loading @infinite="scroll">
                                <div slot="no-results">No more datasets</div>
                                <div slot="no-more">No more datasets</div>
                            </infinite-loading>
                        </div>
                    </v-flex>
                </v-layout>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
  import {CkanApi} from '../../services/ckanApi'
  const ckanServ = new CkanApi()

  import {Analytics} from '../../services/analytics'
  const analyticsServ = new Analytics()

  import ListCard from '../dataset/ListCard'
  import FacetFilter from '../dataset/FacetFilter'

  export default {
    components: {
        ListCard: ListCard,
        FacetFilter: FacetFilter
    },

    data() {
      return {
          loading: true,
          advanced: false,
          datasets: [],
          noResults: false,
          facets: {},
          totalFilters: 0,
          searchText: (this.$route.query.q) ? this.$route.query.q : "",
          searchedText: "",
          count: 0,
          rows: 10,
          skip: 0,
          facetFilters: {},
          sortOrder: "score desc",
          sortOptions:[
              { value: "score desc", text: this.$tc("Relevance") },
              { value: "views_total desc", text: this.$tc("Popular") },
              { value: "name asc", text: this.$tc("Name") + " " + this.$tc("Ascending") },
              { value: "name desc", text: this.$tc("Name") + " " + this.$tc("Descending") },
              { value: "record_publish_date desc", text: this.$tc("Publish Date") },
              { value: "record_last_modified desc", text: this.$tc("Last Modified") }
          ],
      }
    },

    watch: {
        "$route.query.q": function(){
            this.searchText = this.$route.query.q
            this.getDatasets()
        },
        "$route.query.advanced": function(){
            if (this.$route.query.advanced == 'true'){
                this.advanced = true;
            }
        }
    },

    methods: {

        openDrawer: function(name){
            this.$emit('closeDrawer', name);
        },

        clearAll: function(){
            this.$emit('clearAll');
            this.facetFilters = {};
            this.totalFilters = 0;
            this.getDatasets();
        },

        scroll: function(state){
            this.skip += this.rows
            if (this.count>this.skip) {
                this.getDatasets(true, state)
            }else{
                state.complete()
            }
        },

        search: function(e){
            if (e.keyCode === 13) {
                this.getDatasets()
            }
        },

        sort: function(){
            this.getDatasets()
        },

        getDatasets(append, state){
            if (typeof(append) === "undefined"){
                append = false;
            }

            if (!append){
                this.loading = true;
                this.noResults = false;
            }

            let q = "?rows=" + this.rows+"&sort="+this.sortOrder+"&include_drafts=true&include_private=true&"

            let fq = "&fq="

            if (this.searchText !== ""){
                this.searchedText = this.searchText;
                if (this.advanced){
                   q += "q=" + this.searchText + "&"
                }else{
                    q += "q=*" + this.searchText + "*&"
                }
                //fq = " AND "
            }else{
                //fq= "&q="
            }

            let facetKeys = Object.keys(this.facetFilters);

            for (let i=0; i<facetKeys.length; i++){
                if (this.facetFilters[facetKeys[i]].length > 0){
                    fq += facetKeys[i]+":("
                }
                for (let j=0; j<this.facetFilters[facetKeys[i]].length; j++){
                    let value = this.facetFilters[facetKeys[i]][j]
                    if (parseInt(value) != value) {
                        fq += '"'
                    }
                    fq += value
                    if (parseInt(value) != value) {
                        fq += '"'
                    }
                    fq += " OR "
                }
                if (fq.length > 0){
                    fq = fq.substring(0, fq.length-" OR ".length)
                }
                
                if (this.facetFilters[facetKeys[i]].length > 0){
                    fq += ")";
                }
                fq += " AND ";
            }

            if (fq.length > 0){
                fq = fq.substring(0, fq.length-" AND ".length)
                q = q.substring(0, q.length - 1)
                q += fq + "&"
            }

            if ( (this.append) && (this.skip !== 0) ){
                q += "start=" + this.skip + "&"
            }

            q = q.substring(0, q.length - 1)

            ckanServ.getDatasets(q).then((data) => {
                if (!data.result){
                    this.noResults = true;
                    this.loading = false;
                    this.count = 0;
                    return;
                }
                if (append) {
                    this.datasets = this.datasets.concat(data.result.results)
                }else{
                    this.datasets = data.result.results
                }
                this.count = data.result.count
                if (data.result.results.length <= 0){
                    this.noResults = true
                }else{
                    this.noResults = false
                }
                this.loading = false
                if (state != null) {
                    if (this.skip+this.rows > this.count) {
                        state.complete()
                    }else{
                        state.loaded();
                    }
                }
            });

        },

        getFacets(){
           if (typeof(localStorage.facetList) !== "undefined"){
               this.facets = JSON.parse(localStorage.facetList);
               return;
           }

            ckanServ.getFacets().then((data) => {
                this.facets = data
                localStorage.facetList = JSON.stringify(data);
            });
        },

        facetFilter: function(facet, filter){

            if (typeof(this.facetFilters[facet]) === "undefined"){
                this.facetFilters[facet] = [];
            }

            if (this.facetFilters[facet].indexOf(filter) !== -1){
               this.facetFilters[facet].splice(this.facetFilters[facet].indexOf(filter), 1)
               this.totalFilters -= 1;
            }else {
                this.facetFilters[facet].push(filter);
                this.totalFilters += 1;
            }

            this.getDatasets()
        }
    },

    mounted(){
        analyticsServ.get(window.currentUrl, this.$route.meta.title, window.previousUrl);
        this.getDatasets();
        this.getFacets();
    }
  }
</script>

<style scoped>
    .facetFilter{
        position: fixed;
        bottom: 0px;
        top: 48px;
        width: 110px;
        z-index: 9002;
    }

    .tertiary{
        background: var(--v-tertiary-base);
    }

    .secondary{
        background: var(--v-secondary-base);
    }
</style>
