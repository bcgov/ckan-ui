<template>
    <v-container v-if="error">
        <div row align-center justify-center>
            <h1><v-icon x-large>mdi-alert-circle</v-icon> An Error Occurred: {{error.code}}</h1>
            <p><v-icon x-large>mdi-emoticon-sad-outline</v-icon> Please try again or contact your system administrator</p>
        </div>
    </v-container>
    <v-container fluid v-else class="px-md-11 main-area">
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


  import ListPage from '../dataset/ListPage'
  import FacetFilters from '../dataset/FacetFilters'

  export default {
    components: {
        ListPage: ListPage,
        FacetFilters: FacetFilters

    },

    data() {
      return {
          error: null,
          facetFilterIndex: 0,
      }
    },

    methods: {
        facetFilter: function(){
            this.facetFilterIndex += 1;
        }
    },

    mounted(){
        analyticsServ.get(window.currentUrl, this.$route.meta.title, window.previousUrl);
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
    }
</style>
