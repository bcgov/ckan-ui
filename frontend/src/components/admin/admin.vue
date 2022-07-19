<template>
    <v-container v-if="pageLoading || loading" fluid>
        <v-row row align-center justify-center>
            <v-progress-circular :size="70" :width="7" color="grey" indeterminate></v-progress-circular>
        </v-row>
    </v-container>
    <v-container v-else-if="!(sysAdmin || hasAdmin || userGroups.length > 0)">
        <div row align-center justify-center>
            <h1><v-icon x-large>error</v-icon> Unauthorized:</h1>
            <p>This page is only viewable to administrators. <router-link to="/">Return Home</router-link></p>
        </div>
    </v-container>
    <router-view v-else />
</template>

<script>
    import { mapGetters, mapState } from "vuex";
    import {Analytics} from '../../services/analytics';
    const analyticsServ = new Analytics();


    export default {
        name: "admin",
        components: {
        },
        data () {
            return {
                pageLoading: true
            }
        },
        computed:{
            ...mapGetters("organization", {
                hasAdmin: "hasAdmin"
            }),
            ...mapState({
                sysAdmin: state => state.user.sysAdmin,
                loading: state => state.organization.userOrgsLoading,
                userGroups: state => state.group.userGroups
            }),
        },
        methods: {
        },
        mounted(){
            this.pageLoading = false;
        },
        updated() {
            window.snowplow('refreshLinkClickTracking');
        },

    }
</script>

<style scoped>
    .raise {
        margin-bottom: 45px;
    }
    .expansion-header {
        color: white !important;
        font-weight: bold;
    }
    .expansion-content {
        background: var(--v-data_background-base);
        border: thin solid grey;
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
    }
</style>
