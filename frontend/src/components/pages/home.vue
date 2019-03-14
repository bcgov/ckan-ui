<template>
  <v-container fluid primary dark align-center justify-center>
    <v-layout column>

        <v-flex xs12>
            <p>BC 💖 Open Data</p>
        </v-flex>


        <v-layout row>
            <v-text-field full-width box background-color="text" append-icon="search" light v-model="searchText" label="Search Datasets..." v-on:keyup="search"></v-text-field>
        </v-layout>

        <v-flex xs12>
            <p>Try searching for...</p>
            <v-carousel xs6 hide-controls hide-delimiters height="40px">
                <v-carousel-item v-for="(item, i) in searchSuggestions" :key="i">
                    <p>{{item}}</p>
                </v-carousel-item>
            </v-carousel>
        </v-flex>

    </v-layout>
  </v-container>
</template>

<script>

  export default{
      data () {
        return {
          searchText: "",
          searchSuggestions: [
              "Crown",
              "Waste",
              "Fire",
              "Lightning"
          ]
        }
      },
      methods:{
        search: function(e){
            if (e.keyCode === 13) {
                this.$router.push('/datasets?q=' + this.searchText)
                this.showSearch = false
            }
        }
      },
  }

</script>

<style>
    div.v-carousel__item{
        background: none !important;
    }

    div.v-carousel{
        box-shadow: none;
    }


    p{
        color: white;
        text-align: center;
        font-size: 20px;
    }
</style>