<template>
  <v-container class="main-area">
      <Breadcrumb :breadcrumbs="breadcrumbs"></Breadcrumb>
      <v-layout row wrap>
          <v-flex xs2></v-flex>
          <v-flex xs8>
              <v-text-field v-model="searchText" label="Search Datasets..." v-on:keyup="search"></v-text-field>
          </v-flex>
      </v-layout>
      <v-layout row wrap>
          <v-flex xs2></v-flex>
          <v-flex xs4>
              {{count}} datasets found
          </v-flex>
          <v-flex xs4>
              <v-select persistent-hint v-model="sortOrder" :items="sortOptions" item-text="text" item-value="value" label="Order By"></v-select>
          </v-flex>
      </v-layout>
      <v-layout row wrap>
          <v-flex xs2>
              <!-- Facets  -->
              <FacetFilter
                      v-for="(facet, facetKey) in facets"
                      :key="'facet-section-'+facetKey"
                      :name="facet"
                      :field="facetKey"
                      v-on:facetFilter="facetFilter"
              ></FacetFilter>
          </v-flex>
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
  </v-container>
</template>

<script>
  import {CkanApi} from '../../services/ckanApi'
  const ckanServ = new CkanApi()

  import ListCard from '../dataset/ListCard'
  import FacetFilter from '../dataset/FacetFilter'
  import Breadcrumb from "../breadcrumb/Breadcrumb"

  export default {
    components: {
        Breadcrumb: Breadcrumb,
        ListCard: ListCard,
        FacetFilter: FacetFilter
    },

    data() {
      return {
          loading: true,
          datasets: [],
          noResults: false,
          facets: {},
          searchText: "",
          count: 0,
          rows: 10,
          skip: 0,
          facetFilters: {},
          sortOrder: "record_publish_date desc",
          sortOptions:[
              { value: "relevance desc", text: "Relevance" },
              { value: "score desc", text: "Popular" },
              { value: "name asc", text: "Name Ascending" },
              { value: "name desc", text: "Name Descending" },
              { value: "record_publish_date desc", text: "Publish Date" },
              { value: "record_last_modified desc", text: "Last Modified" }
          ],
          breadcrumbs: [
              {icon: "home", label: 'Home', route: '/'},
              {label: 'Datasets'}
          ]
      }
    },

    methods: {

        scroll: function(state, ){
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
            }

            let q = "?rows=" + this.rows+"&sort="+this.sortOrder+"&include_drafts=true&include_private=true&"

            let fq = ""

            if (this.searchText !== ""){
                q += "q=title:" + this.searchText + "*&"
                fq = " AND "
            }else{
                fq= "&q="
            }

            let facetKeys = Object.keys(this.facetFilters);

            for (let i=0; i<facetKeys.length; i++){
                fq += facetKeys[i] + ":"
                let value = this.facetFilters[facetKeys[i]]
                if (parseInt(value) != value) {
                    fq += '"'
                }
                fq += value
                if (parseInt(value) != value) {
                    fq += '"'
                }
                fq += " AND "
            }

            if (fq.length > 0){
                fq = fq.substring(0, fq.length-" AND ".length)
                q = q.substring(0, q.length - 1)
                q += fq + "&"
            }

            if (this.skip !== 0){
                q += "start=" + this.skip + "&"
            }

            q = q.substring(0, q.length - 1)

            ckanServ.getDatasets(q).then((data) => {
                if (append) {
                    this.datasets = this.datasets.concat(data.result.results)
                }else{
                    this.datasets = data.result.results
                }
                this.count = data.result.count
                if (data.result.results.length <= 0){
                    this.noResults = true
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
           if (typeof(sessionStorage.facetList) !== "undefined"){
               this.facets = JSON.parse(sessionStorage.facetList);
               return;
           }

            ckanServ.getFacets().then((data) => {
                this.facets = data
                sessionStorage.facetList = JSON.stringify(data);
            });
        },

        facetFilter: function(facet, filter){
            if (this.facetFilters[facet] === filter){
               delete this.facetFilters[facet];
            }else {
                this.facetFilters[facet] = filter;
            }
            this.getDatasets()
        }
    },

    mounted(){
        this.getDatasets();
        this.getFacets();
    }
  }
</script>