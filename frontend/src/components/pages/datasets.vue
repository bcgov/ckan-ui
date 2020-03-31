<template>
    <v-container v-if="error">
        <div row align-center justify-center>
            <h1><v-icon x-large>mdi-alert-circle</v-icon> An Error Occured: {{error.code}}</h1>
            <p><v-icon x-large>mdi-emoticon-sad-outline</v-icon> Please try again or contact your system administrator</p>
        </div>
    </v-container>
    <v-container fluid v-else class="px-0">
        <v-row wrap>
            <v-col cols=11 sm=8>
                <ListPage
                    :key="'listPage-'+facetFilterIndex"
                ></ListPage>
            </v-col>
            <v-col cols=1 sm=4>
                <FacetFilters
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
    }
  }
</script>
