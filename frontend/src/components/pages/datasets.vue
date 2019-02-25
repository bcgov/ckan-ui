<template>
  <div>
    <div v-if="loading">
      Loading...
    </div>
    <b-table v-else striped hover :items="items" />
  </div>
</template>

<script>
  import {SolrApi} from '../../services/solrApi'
  const solrServ = new SolrApi()

  export default {
    data() {
      return {
        loading: true,
        items: []
      }
    },

    methods: {
        getDatasets(){
            solrServ.getDatasets("?q=title:*&wt=json&rows=10").then((data) => {
                this.loading = false
                // eslint-disable-next-line
                this.items = data.response.docs
            });
        }
    },

    mounted(){
        this.getDatasets();
    }
  }
</script>
