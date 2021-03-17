<template>
    <v-container v-if="error">
        <div row align-center justify-center>
            <h1><v-icon x-large>error</v-icon> An Error Occurred: {{error.code}}</h1>
            <p><v-icon x-large>sentiment_very_dissatisfied</v-icon> Please try again or contact your system administrator</p>
        </div>
    </v-container>
    <v-container v-else fluid class="raise">
        <v-progress-circular
          v-if="loading"
          :size="70"
          :width="7"
          color="grey"
          indeterminate
        ></v-progress-circular>
        <v-row wrap v-else>
            <v-col cols=12>
                Site Usage
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import {CkanApi} from '../../services/ckanApi';

    const ckanServ = new CkanApi();
    import {Analytics} from '../../services/analytics';
    const analyticsServ = new Analytics();


    export default {
        name: "usage",
        components: {
        },
        data () {
            return {
                
                loading: false,
                error: null,
            }
        },
        computed:{
            
        },
        methods: {
            
        },
        mounted(){
            analyticsServ.get(window.currentUrl, this.$route.meta.title, window.previousUrl);
        }

    }
</script>

<style scoped>
    .raise {
        margin-bottom: 45px;
    }
</style>
