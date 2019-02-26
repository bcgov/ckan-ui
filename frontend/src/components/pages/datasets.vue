<template>
  <div>
    <div v-if="loading">
      <ListCard :record="{}" :loading="true"></ListCard>
    </div>
    <div v-else-if="noResults">
        No results
    </div>
    <div v-else>
        <ListCard v-for="dataset in datasets" :key="'dataset-'+dataset.id" :record="dataset" :loading="false"></ListCard>
    </div>
  </div>
</template>

<script>
  import {CkanApi} from '../../services/ckanApi'
  const ckanServ = new CkanApi()
  import ListCard from '../dataset/ListCard'

  export default {
    components: {
        ListCard: ListCard
    },

    data() {
      return {
          loading: true,
          datasets: [],
          noResults: false,
      }
    },

    methods: {
        getDatasets(){
            // solrServ.getDatasets("?q=title:*&wt=json&rows=10").then((data) => {
            //     this.loading = false
            //     // eslint-disable-next-line
            //     this.datasets = data.response.docs
            // });
            ckanServ.getDatasets("").then((data) => {
                this.loading = false
                this.datasets = data.result.results
                if (data.result.results.length <= 0){
                    this.noResults = true
                }
            });
        }
    },

    mounted(){
        this.getDatasets();
    }
  }
</script>
