<template>
  <v-card :id="'group-link-'+id" @click="toggleShowDatasets" class="cursor groupLink">
    <v-img alt="Logo" :src="image"></v-img>

    <v-card-title primary-title @click="gotoGroup">
      <div>
        <h3>{{name}}</h3>
        <div>{{description}}</div>
      </div>
    </v-card-title>
    <!-- <v-container fluid v-if="showDatasets">
      <v-progress-circular
                    v-if="loading"
                    indeterminate
                    color="light-blue"
                ></v-progress-circular>
      <v-row v-else wrap>
        <h4>Datasets</h4>
        <v-col cols=12 v-for="dataset in datasets" :key="'group-'+id+'-dataset-'+dataset.id" style="overflow: hidden; text-overflow: ellipsis">
          <v-btn text :to="'/dataset/'+dataset.name">{{dataset.title}}</v-btn>
        </v-col>
      </v-row>
    </v-container> -->
  </v-card>
</template>

<script>
import {CkanApi} from '../../services/ckanApi'
const ckanServ = new CkanApi()

export default{
    name: 'GroupCard',

    props: {
        group: Object
    },
    
    data() {
        return {
            id: this.group.id,
            image: this.group.image_display_url,
            name: this.group.display_name,
            description: this.group.description,
            datasets: [],
            showDatasets: false,
            searched: false,
            loading: true
        }
    },
    
    methods: {

      gotoGroup: function(){
        this.$router.push('/group/'+this.group.name);
      },

      toggleShowDatasets: function(){
        this.showDatasets = !this.showDatasets;
        if (this.showDatasets && !this.searched){
          this.searched = true;
          ckanServ.getGroup(this.id).then((data) => {
            
            this.datasets = data.result.packages;
            
            this.loading = false;
          });

        }
      }

    },

    mounted() {
    }

}
</script>

<style scoped>

  .cursor{
    cursor: pointer;
  }

</style>