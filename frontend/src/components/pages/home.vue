<template>
  <v-container fluid dark primary align-center justify-center>
    <v-layout column align-space-around>

        <v-flex xs12>
            <p>BC 💖 Data</p>
        </v-flex>


        <v-layout row>
            <v-text-field ref="searchBox" box background-color="text" append-icon="search" light v-model="searchText" label="Search Datasets..." v-on:keyup="search"></v-text-field>
        </v-layout>

        <v-flex xs12>
            <p>Try searching for...</p>
            <v-carousel interval="3000" xs6 hide-controls hide-delimiters height="40px">
                <v-carousel-item v-for="(item, i) in searchSuggestions" :key="i">
                    <p><a v-on:click="termClick">{{item}}</a></p>
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
        },
        termClick: function(e){
            this.searchText=e.srcElement.innerText
            this.$refs.searchBox.focus()
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
</style>

<style scoped>
    a,p{
        color: white !important;
        font-size: 20px;
        text-align: center;
    }
</style>