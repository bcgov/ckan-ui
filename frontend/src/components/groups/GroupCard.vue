<template>
  <v-card :id="'group-link-'+id" @click="toggleShowDatasets" class="cursor groupLink">
    <v-img alt="Logo" @click="gotoGroup" :src="image" v-on:error="onImgError"></v-img>

    <v-card-title primary-title @click="gotoGroup">
      <div>
        <h3>{{name}}</h3>
        <div>{{description}}</div>
      </div>
    </v-card-title>
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
            name: this.group.display_name,
            description: this.group.description,
            datasets: [],
            showDatasets: false,
            searched: false,
            loading: true,
            imageError: false
        }
    },

    computed: {
      image: function(){
        return !this.imageError ? (this.group.image_display_url ? this.group.image_display_url : this.group.url) : '/placeholder-organization.png';
      }
    },
    
    methods: {

      gotoGroup: function(){
        this.$router.push('/group/'+this.group.name);
      },

      onImgError: function(){
        this.imageError = true;
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