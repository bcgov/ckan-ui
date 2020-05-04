<template>
  <v-container splash-container fluid align-center justify-center fill-height class="raise">

        <v-row>
            <v-col cols=12>
                <v-row align="center" justify="center">
                    <v-card class="mx-3 pitch-card" height="180px" width="160px" >
                        <v-container py-0>
                            <v-row class="pitch-header" align-content="center">
                                <v-col cols=12>
                                    <h3 class="pitch-title">Browse thousands of government datasets</h3>
                                </v-col>
                            </v-row>
                            <v-row align-content="center" class="pitch-lower">
                                <v-col cols=12>
                                    <v-icon color="data_background" size=100 class="mt-12 watermark-icon">mdi-chart-donut</v-icon>
                                    <v-icon color="govYellow" class="yellow-icon" x-large>mdi-chart-donut</v-icon>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-card>
                    <v-card class="mx-3 pitch-card" height="180px" width="160px" >
                        <v-container py-0>
                            <v-row class="pitch-header" align-content="center">
                                <v-col cols=12>
                                    <h3 class="pitch-title">Download data in a wide variety of file formats</h3>
                                </v-col>
                            </v-row>
                            <v-row align-content="center" class="pitch-lower">
                                <v-col cols=12>
                                    <v-icon color="data_background" size=100 class="mt-12 watermark-icon">mdi-cloud-download-outline</v-icon>
                                    <v-icon color="govYellow" class="yellow-icon" x-large>mdi-cloud-download-outline</v-icon>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-card>
                    <v-card class="mx-3 pitch-card" height="180px" width="160px" >
                        <v-container py-0>
                            <v-row class="pitch-header" align-content="center">
                                <v-col cols=12>
                                    <h3 class="pitch-title">Login with IDIR and gain access to even more data</h3>
                                </v-col>
                            </v-row>
                            <v-row align-content="center" class="pitch-lower">
                                <v-col cols=12>
                                    <v-icon color="data_background" size=100 class="mt-12 watermark-icon">mdi-account-details</v-icon>
                                    <v-icon color="govYellow" class="yellow-icon" x-large>mdi-account-details</v-icon>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-card>
                </v-row>
            </v-col>
            <v-col cols=12>
                <v-row align="center" justify="center">
                    <v-col xs="12" md="8">
                        <v-text-field
                            class="home-search mx-auto"
                            ref="searchBox"
                            solo
                            hide-details
                            background-color="text_background"
                            color="home_label"
                            append-icon="mdi-magnify"
                            v-model="searchText" :label="$tc('SearchDatasets')"
                            v-on:keyup="search"
                            @click:append="search">
                        </v-text-field>
                    </v-col>
                </v-row>
            </v-col>
            <v-col cols=12>
                <p class="search-suggestion mb-0 mx-auto">{{$tc('TrySearchingFor')}}</p>
                <v-carousel interval="3000" cycle xs6 :show-arrows="false" hide-delimiters height="40px" class="search-suggestion mx-auto">
                    <v-carousel-item v-for="(item, i) in searchSuggestions" :key="i">
                        <p><a v-on:click="termClick" class="search-suggestion shadow">{{item}}</a></p>
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
            // eslint-disable-next-line no-console
            if (e.keyCode === 13 || e.type === 'click') {
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
    .pitch-card {
        border-radius: 5px !important;
        box-shadow: 0px 5px 5px black;
    }
    .home-search {
        border-radius: 3px;
        border: 2px solid var(--v-primary-base);
        max-width: 720px;
    }
    .search-suggestion {
        font-size: 23px;
        color: var(--v-text-base);
        max-width: 720px;
    }
    .shadow {
        text-shadow: 0px 0px 16px rgba(0, 0, 0, 0.4);
    }
    .splash-container {
        background-image: url("../../assets/images/500_F_291596098_6nXL0nza5UgVMniyp8e92v1JKyANtgbq.jpg");
        background-size: cover;
    }
    .pitch-header {
        background-color: var(--v-menu_secondary-base);
        height: 120px;
        border-top-left-radius: inherit;
        border-top-right-radius: inherit;
        box-shadow: 0px 2px 2px;
    }
    .pitch-title {
        color: var(--v-text-base);
        font-size: 16px;
        text-align: center;
    }
    .pitch-lower {
        text-align: center;
        height: 60px;
        overflow: hidden;
        text-overflow: clip;
    }
    .watermark-icon {
        opacity: 68%;
    }
    .yellow-icon {
        margin-left: -100px;
    }
</style>
