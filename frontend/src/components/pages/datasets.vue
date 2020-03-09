<template>
    <v-container v-if="error">
        <div row align-center justify-center>
            <h1><v-icon x-large>error</v-icon> An Error Occured: {{error.code}}</h1>
            <p><v-icon x-large>sentiment_very_dissatisfied</v-icon> Please try again or contact your system administrator</p>
        </div>
    </v-container>
    <v-container fluid v-else class="px-0">
        <v-row wrap fill-height dense class="mx-0 mx-sm-2 mx-md-4 mx-lg-6 mx-xl-8">
            <v-col cols=12 order=2 order-sm=1 sm=8>
                <v-row wrap pb-1>
                </v-row>
                <v-row wrap dense>
                    <v-col cols=12>
                        <v-text-field id="dataset-search" class="searchbox" v-model="findText" :label="$tc('SearchDatasets')" v-on:keyup="search" outlined append-icon="search"></v-text-field>
                    </v-col>
                </v-row>
                <v-row wrap dense>
                    <v-col cols=4>
                        <span>
                            {{count}} {{$tc('datasets')}} {{$tc('found')}}
                            <span v-if="searchedText !== ''"> {{$tc('matching')}} "{{searchedText}}"</span>
                            <span v-if="searchedText !== '' && totalFilters > 0"> {{$tc('and')}}</span>
                            <span v-if="totalFilters > 0"> {{$tc('with')}} {{totalFilters}} {{$tc('filters applied')}}</span>
                        </span>
                    </v-col>
                    <v-col cols=3>
                    </v-col>
                    <v-col cols=2 class="text-right">
                        <span>{{$tc('Order By')}}:</span>
                    </v-col>
                    <v-col cols=3>
                        <v-select dense append-icon="mdi-menu-down" persistent-hint class="borderless mt-n1" v-model="sortOrder" :items="sortOptions" item-text="text" item-value="value" v-on:change="sort"></v-select>
                    </v-col>
                </v-row>
                <!-- <v-row wrap align-center justify-center pt-2 pb-3> -->
                    <!-- <v-col cols=2><a v-on:click="advanced = !advanced">{{advanced ? 'Switch to basic' : "Switch to advanced"}}</a></v-col> -->
                <!-- </v-row> -->
                <!-- <v-row wrap style="border-bottom: 1px solid;">
                </v-row> -->

                <v-row wrap dense>
                    <v-col cols=12>
                        <!-- Search  -->
                        <v-progress-circular
                            v-if="loading"
                            indeterminate
                            color="light-blue"
                        ></v-progress-circular>
                        <div v-else-if="noResults">
                            No results
                        </div>
                        <div v-else>
                            <ListCard v-for="dataset in datasets" :key="'dataset-'+dataset.id" :record="dataset"></ListCard>
                            <v-row class="mb-3">
                                <v-col cols=8>
                                    <v-pagination prev-icon="mdi-chevron-double-left" next-icon="mdi-chevron-double-right" :length="Math.ceil(count/rows)" :total-visible="pageButtonLimit" v-model="currentPage"></v-pagination>
                                </v-col>
                            </v-row>
                            <v-row>
                            </v-row>
                        </div>
                    </v-col>
                </v-row>
            </v-col>
            <v-col cols=12 order=1 order-sm=2 sm=4>
                <v-row class="ml-1 mb-3 text-left">
                    <span class="primary">
                        <a class="anchorText" @click="expand">{{$tc('Expand All')}}</a>
                        <span class="anchorText"> | </span>
                        <a class="anchorText" @click="collapse">{{$tc('Collapse All')}}</a>
                    </span>
                </v-row>
                <FacetFilter
                    v-for="(facet, facetKey) in facets"
                    :open="facetOpen[facet.name]"
                    :key="'facet-section-'+facetKey"
                    :name="facet.name"
                    :found="count"
                    :field="facet"
                    :totalFilters="totalFilters"
                    v-on:facetFilter="facetFilter"
                    v-on:openFacet="openFacet"
                    v-on:closeFacet="closeFacet"
                ></FacetFilter>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
  import {CkanApi} from '../../services/ckanApi'
  const ckanServ = new CkanApi()

  import {Analytics} from '../../services/analytics'
  const analyticsServ = new Analytics()

  import { mapState } from 'vuex'

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
          pageButtonLimit: 7,
          currentPage: 1,
          datasets: [],
          error: null,
          noResults: false,
          searchedText: "",
          findText: this.$store.state.search.searchText ? this.$store.state.search.searchText : "",
          count: 0,
          rows: 10,
          skip: 0,
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
        currentPage(newVal){
            this.skip = this.rows*(newVal-1);
            this.getDatasets();
        }
    },

    computed: {
        ...mapState({
            facetFilters: state => state.search.facets,
            totalFilters: state => state.search.totalFilters,
            userPermissions: state => state.user.userPermissions,
            sysAdmin: state => state.user.sysAdmin,
            isAdmin: state => state.user.isAdmin,
            isEditor: state => state.user.isEditor,
            userLoading: state => state.user.userLoading,
            searchText: state => state.search.searchText,
            facets: state => state.dataset.facetList,
            facetOpen: state => state.dataset.facetOpen,
        }),

        showCreate: function(){
            // TODO: IF you aren't overriding the admin functionality like BCDC CKAN does then this is what you want
            //return ( ((this.sysAdmin) || (this.userPermissions[this.dataset.organization.name] === "admin") || (this.userPermissions[this.dataset.organization.name] === "editor")));

            return ( (!this.loading) && (!this.userLoading) && ((this.sysAdmin) || (this.isAdmin) || (this.isEditor)) );
        },

    },

    methods: {

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

        datasetCreate: function(){
            this.$store.commit('dataset/clearDataset');
            this.$router.push({name: "dataset_create"});
        },

        openDrawer: function(name){
            this.$emit('closeDrawer', name);
        },

        clearAll: function(){
            this.$emit('clearAll');
            this.$store.commit('search/clearAllFacets');
            this.totalFilters = 0;
            this.getDatasets();
        },

        // scroll: function(state){
        //     this.skip += this.rows;
        //     if (this.count>this.skip) {
        //         this.getDatasets(true, state)
        //     }else{
        //         state.complete()
        //     }
        // },

        search: function(e){
            if (e.keyCode === 13) {
                this.$store.commit('search/setSearchText', this.findText);
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
            
            this.searchedText = this.searchText;
            
            if (this.searchText !== ""){    
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

            if ( /*(append) &&*/ (this.skip !== 0) ){
                q += "start=" + this.skip + "&"
            }

            q = q.substring(0, q.length - 1)

            ckanServ.getDatasets(q).then((data) => {
                if (data.success) {
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
                } else {
                    this.error = data.error;
                    this.loading = false;
                }
            })
            .catch((e) => {
                this.error = e;
                this.loading = false;
            });
        },

        getFacets(){
            this.$store.dispatch('dataset/getFacetList');
            this.getDatasets();
        },

        facetFilter: function(facet, filter){

            this.$store.commit('search/toggleFacet', {facet, filter});

            this.getDatasets();
        }
    },

    mounted(){
        analyticsServ.get(window.currentUrl, this.$route.meta.title, window.previousUrl);
        this.getFacets();

        let self = this;
        this.$store.subscribe((mutation) => {
            if (mutation.type === 'search/setSearchText'){
                self.findText = this.$store.state.search.searchText;
                self.getDatasets();
            }

        });

    }
  }
</script>

<style scoped>
    .anchorText{
        color: var(--v-text-base);    
    }

    .facetFilter{
        position: fixed;
        bottom: 0px;
        top: 48px;
        width: 110px;
        z-index: 60;
    }

    .tertiary{
        background: var(--v-tertiary-base);
    }

    .secondary{
        background: var(--v-secondary-base);
    }

    .searchbox{
        height: 55px;
    }

    .borderless{
        margin: 0;
        padding-top: 0;
    }

</style>

<style>
    .borderless .v-input__slot:before{
        border: none !important;
    }
    .v-pagination__item.v-pagination__item--active.primary{
        margin: 0px;
    }
    .v-pagination__navigation.v-pagination__navigation--disabled{
        margin: 0px;
    }
    .v-pagination__item{
        margin: 0px;
    }

    .v-pagination__more{
        margin: 0px;
    }

    .v-pagination__navigation{
        margin: 0px;
    }
</style>