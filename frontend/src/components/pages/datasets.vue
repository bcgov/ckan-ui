<template>
  <b-container class="main-area">
      <b-row class="text-center">
          <b-col cols="2"></b-col>
          <b-col cols="8">
            <b-form-input v-model="searchText" type="text" placeholder="Search Datasets..." v-on:keyup="search" />
          </b-col>
      </b-row>
      <b-row>
          <b-col cols="2">
          </b-col>
          <b-col cols="4" class="row2Text font-weight-bold">
              {{count}} datasets found
          </b-col>
          <b-col cols="1">
              <label class="row2Text" for="sortOrder">Order by </label>
          </b-col>
          <b-col cols="3">
              <b-form-select id="sortOrder" name="sortOrder" v-model="sortOrder" :options="sortOptions" v-on:change="sort" />
          </b-col>
      </b-row>
      <b-row class="text-center">
          <b-col cols="2">
              <!-- Facets  -->
              <FacetFilter
                      v-for="(facet, facetKey) in facets"
                      :key="'facet-section-'+facetKey"
                      :name="facet"
                      :field="facetKey"
                      v-on:facetFilter="facetFilter"
              ></FacetFilter>
          </b-col>
          <b-col cols="10">
              <!-- Search  -->
              <i v-if="loading" class="fa fa-circle-o-notch fa-spin"></i>
              <div v-else-if="noResults">
                  No results
              </div>
              <div v-else>
                  <ListCard v-for="dataset in datasets" :key="'dataset-'+dataset.id" :record="dataset"></ListCard>
              </div>
          </b-col>

      </b-row>
  </b-container>
</template>

<script>
  import {CkanApi} from '../../services/ckanApi'
  const ckanServ = new CkanApi()

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
          ]
      }
    },

    methods: {

        scroll: function(){
            window.onscroll = () => {
                let bottomOfWindow = document.documentElement.scrollTop + window.innerHeight >= document.documentElement.offsetHeight - 150

                if (bottomOfWindow) {
                    this.skip += this.rows
                    this.getDatasets(true)
                }
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

        getDatasets(append){

            if (typeof(append) === "undefined"){
                append = false;
            }

            if (!append){
                this.loading = true;
            }

            let q = "?rows=" + this.rows+"&sort="+this.sortOrder+"&"

            let fq = ""
            if (this.searchText !==""){
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
        this.scroll();
    }
  }
</script>

<style scoped>
    .main-area{
        margin-top: 20px
    }

    .row2Text{
        line-height: 35px;
        vertical-align: bottom;
    }
</style>
