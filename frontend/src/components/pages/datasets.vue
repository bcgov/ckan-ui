<template>
  <div>
    <div v-if="loading">
      Loading...
    </div>
    <b-table v-else striped hover :items="items" />
  </div>
</template>

<script>
  //import {SolrApi} from '../../services/solrApi'
  import {CkanApi} from '../../services/ckanApi'
  //const solrServ = new SolrApi()
  const ckanServ = new CkanApi()

  export default {
    data() {
      return {
        loading: true,
        items: []
      }
    },

    methods: {
        getDatasets(){
            // solrServ.getDatasets("?q=title:*&wt=json&rows=10").then((data) => {
            //     this.loading = false
            //     // eslint-disable-next-line
            //     this.items = data.response.docs
            // });
            ckanServ.getDatasets("").then((data) => {
                this.loading = false
                // eslint-disable-next-line
                this.items = data.result.results
            });
        }
    },

    mounted(){
        this.getDatasets();
    }
  }
</script>
