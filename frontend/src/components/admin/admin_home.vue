<template>
    <v-container v-if="error">
        <div row align-center justify-center>
            <h1><v-icon x-large>error</v-icon> An Error Occurred: {{error.code}}</h1>
            <p><v-icon x-large>sentiment_very_dissatisfied</v-icon> Please try again or contact your system administrator</p>
        </div>
    </v-container>
    <v-container v-else-if="loading" fluid class="raise">
        <v-progress-circular
          v-if="loading"
          :size="70"
          :width="7"
          color="grey"
          indeterminate
        ></v-progress-circular>
    </v-container>
    <v-container v-else fluid class="raise">
        <v-row>
            <v-col cols=10 offset-md=1 class="mt-8">
                <v-expansion-panels v-model="orgPanel" flat>
                    <v-expansion-panel class="expansion-panel">
                        <v-expansion-panel-header color="primary" class="expansion-header">
                            <template v-slot:actions>
                                <v-icon color="white" large>$expand</v-icon>
                            </template>
                            Organizations
                        </v-expansion-panel-header>
                        <v-expansion-panel-content class="expansion-content">
                            <AdminOrgTable></AdminOrgTable>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols=10 offset-md=1>
                <v-expansion-panels v-model="groupPanel" flat>
                    <v-expansion-panel class="expansion-panel">
                        <v-expansion-panel-header color="primary" class="expansion-header">
                            <template v-slot:actions>
                                <v-icon color="white" large>$expand</v-icon>
                            </template>
                            Groups
                        </v-expansion-panel-header>
                        <v-expansion-panel-content class="expansion-content">
                            <AdminGroupTable></AdminGroupTable>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import {CkanApi} from '../../services/ckanApi';
    import { mapGetters, mapState } from "vuex";
    import AdminOrgTable from './admin_org_table';
    import AdminGroupTable from './admin_group_table';

    const ckanServ = new CkanApi();
    import {Analytics} from '../../services/analytics';
    const analyticsServ = new Analytics();


    export default {
        name: "admin-home",
        components: {
            AdminOrgTable,
            AdminGroupTable
        },
        data () {
            return {
                loading: true,
                error: null,
                orgPanel: 0,
                groupPanel: undefined
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
        font-size: 18px;
    }
    .expansion-content {
        background: var(--v-data_background-base);
        border: thin solid grey;
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
    }
</style>
