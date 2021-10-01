<template>
    <v-card tile class="about-card">
        <v-card-title class="header">
            <span>{{$tc('About')}}</span>
            <v-btn text small depressed class="noHover closeButton mr-7" @click="close"><v-icon color="text">mdi-close</v-icon></v-btn>
        </v-card-title>
        <v-card-text class="px-0 content">
            <div class="my-4 mr-3">
                <v-progress-circular
                   indeterminate
                   color="light-blue"
                   v-if="loading"
                ></v-progress-circular>
                <Markdown
                   v-else
                   name="about"
                   :value="about"
                   label=""
                   :field="{}"
                   scope="about"
                ></Markdown>
            </div>
        </v-card-text>
    </v-card>
</template>

<script>

    import {CkanApi} from '../../services/ckanApi';
    import {Analytics} from '../../services/analytics';
    const analyticsServ = new Analytics;
    const ckanServ = new CkanApi;


    import Markdown from '../form/components/Markdown';

    export default {
        components: {
            Markdown: Markdown
        },

        data() {
            return {
                about: '',
                aboutUrl: 'https://raw.githubusercontent.com/bcgov/ckan-ui/pages/pages/about.md',
                loading: true
            }
        },

        mounted() {
            this.getAbout();
            analyticsServ.get(window.currentUrl, this.$route.meta.title, window.previousUrl);
        },

        methods: {
            async getAbout(){
                this.loading = true;
                let about = (await ckanServ.getAbout()).content;
                this.loading = false;
                this.about = about;
            },
            
            close(){
                this.$emit('closeDialog');
            }
        }
    }

</script>


<style>
    .header{
        background: var(--v-menu_secondary-base);
        color: var(--v-text-base);
        font-size: 16px;
        font-weight: normal;
    }

    .editing{
        background: var(--v-data_background-base);
    }

    .wide{
        width: 100%;
    }

    .closeButton{
        position: absolute !important;
        right: 0px;
    }

    .content p{
        font-size: 16px;
        color: var(--v-faded_text-base);
    }

    .content{
        font-size: 16px;
        color: var(--v-faded_text-base);
    }

    .content ol{
        font-size: 16px;
        color: var(--v-faded_text-base);
    }

    .content * a{
        text-decoration: none;
        font-size: 16px;
        color: var(--v-label_colour-base) !important;
    }

    .v-btn.v-btn--depressed.cancelButton{
        background: var(--v-text_background-base);
        border: 2px solid var(--v-primary-base);
        color: var(--v-primary-base);
        font-weight: normal;
        font-size: 16px;
    }

    .v-btn.v-btn--depressed.control-button{
        font-weight: normal;
        font-size: 16px;
    }

    .about-card {
        background-color: var(--v-data_background-base) !important;
    }
</style>
