<template>
  <!-- <v-card :id="'group-link-'+id" @click="toggleShowDatasets" class="cursor groupLink">
    <v-img alt="Logo" @click="gotoGroup" :src="image" v-on:error="onImgError"></v-img>

    <v-card-title primary-title @click="gotoGroup">
      <div>
        <h3>{{name}}</h3>
        <div>{{description}}</div>
      </div>
    </v-card-title>
  </v-card> -->
    <v-container class="mb-2 py-0 px-0 data elevation-5" @click="$emit('groupClicked')">
        <v-row dense class="data">
          <v-col cols=2>
            <v-img position="left top" alt="Logo" height="100px" contain :src="image" v-on:error="onImgError"></v-img>
          </v-col>
          <v-col cols=9>
            <v-row dense>
              <h3>{{name}}</h3>
            </v-row>
            <v-row dense>
              <p>{{datasets.length}} {{$tc('datasets', datasets.length)}}</p>
            </v-row>
          </v-col>
          <v-col cols=1 class="text-right" align-self="center">
            <v-icon large color="primary">mdi-arrow-right-thick</v-icon>
          </v-col>
        </v-row>
    </v-container>
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

    },

    mounted() {
      ckanServ.getGroup(this.id).then((data) => {
            
        this.datasets = data.result.packages;
            
        this.loading = false;
      });
    }

}
</script>

<style scoped>

  .cursor{
    cursor: pointer;
  }

  .data{
    background: var(--v-text-base);
  }

</style>