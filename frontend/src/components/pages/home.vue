<template>
  <v-container fluid align-center justify-center fill-height class="raise">

        <v-row>
            <v-col cols=12>
                <v-row align="center" justify="center">
                    <v-card tile class="mx-3 pa-6" height="200px" width="200px" ><p style="font-size: 50pt">BC</p></v-card>
                    <v-card tile class="mx-3 pa-6" height="200px" width="200px"><p style="font-size: 50pt">💖</p></v-card>
                    <v-card tile class="mx-3 pa-6" height="200px" width="200px"><p style="font-size: 50pt">{{$tc('Data')}}</p></v-card>
                </v-row>
            </v-col>
            <v-col cols=12>
                <v-row align="center" justify="center">
                    <v-col xs="12" md="8">
                        <v-text-field ref="searchBox" outlined background-color="text_background" color="primary" append-icon="mdi-magnify" v-model="searchText" :label="$tc('SearchDatasets')" v-on:keyup="search"></v-text-field>
                    </v-col>
                </v-row>
            </v-col>
            <v-col cols=12>
                <p>{{$tc('TrySearchingFor')}}</p>
                <v-carousel interval="3000" cycle xs6 :show-arrows="false" hide-delimiters height="40px">
                    <v-carousel-item v-for="(item, i) in searchSuggestions" :key="i">
                        <p><a v-on:click="termClick">{{item}}</a></p>
                    </v-carousel-item>
                </v-carousel>
            </v-col>
        </v-row>
  </v-container>
</template>

<script>

    import {Analytics} from '../../services/analytics'
    const analyticsServ = new Analytics()

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
                this.$store.commit('search/setSearchText', this.searchText );
                this.$router.push('/datasets');
            }
        },
        termClick: function(e){
            this.searchText=e.srcElement.innerText
            this.$refs.searchBox.focus()
        }
      },
      mounted() {
          analyticsServ.get(window.currentUrl, this.$route.meta.title, window.previousUrl);
      }
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
        /* color: white !important; */
        font-size: 20px;
        text-align: center;
    }
    .raise {
        margin-bottom: 45px;
    }
</style>
