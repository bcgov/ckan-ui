<template>
    <router-view />
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
            }
        },
        computed:{
            ...mapGetters("organization", {
                hasAdmin: "hasAdmin"
            }),
            ...mapState({
                sysAdmin: state => state.user.sysAdmin,
            }),
        },
        methods: {
        },
        mounted(){
            this.loading = false;
            if (!(this.sysAdmin || this.hasAdmin)) {
                this.$router.push('/');
            }
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
