<template>
    <v-container>
        <v-row>
            <v-col>
                <v-row wrap align-center justify-center>
                    <h3>We're sorry but we can't find the page requested</h3>
                </v-row>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import {Analytics} from '../../services/analytics'
    const analyticsServ = new Analytics()
    export default {
        mounted() {
            analyticsServ.get(window.currentUrl, this.$route.meta.title, window.previousUrl);
        }
    }

</script>

<style scoped>

</style>
