<template>
    <v-container v-if="loading" fluid>
        <v-layout row align-center justify-center>
            <v-progress-circular :size="70" :width="7" color="grey" indeterminate></v-progress-circular>
        </v-layout>
    </v-container>
    <v-container v-else-if="dataset && dataset.organization" grid-list-md class="main-area">
        <v-alert :value="true" type="error">
            There was an error loading the schema, showing the old layout
        </v-alert>
        <template>
            <Breadcrumb :breadcrumbs="breadcrumbs"></Breadcrumb>
            <v-layout row wrap fill-height>
                <v-flex xs12 md8>
                    <v-container class="metadata">
                        <v-card flat>
                            <h1 class="h2">{{dataset.title}}</h1>
                            <v-subheader
                                class="tracking-summary"
                            >{{dataset.tracking_summary.total}} views ({{dataset.tracking_summary.recent}} recent)</v-subheader>
                            <p>
                                Published by the
                                <a href>{{dataset.organization.full_title}}</a>
                                <br>Licensed under
                                <a href>{{dataset.license_title}}</a>
                            </p>
                        </v-card>
                        <v-divider></v-divider>
                        <br>
                        <v-layout row wrap>
                            <v-flex xs6>
                                <AboutCard :desc="dataset.notes"></AboutCard>
                            </v-flex>
                            <v-flex xs6>
                                <AdditionalInfoCard :info="additionalInfo"></AdditionalInfoCard>
                            </v-flex>
                        </v-layout>
                        <v-layout row wrap>
                            <v-flex xs4>
                                <ContactInfoCard :contact="contactInfo"></ContactInfoCard>
                            </v-flex>
                            <v-flex xs4>
                                <AccessSecurityCard :info="accessInfo"></AccessSecurityCard>
                            </v-flex>
                            <v-flex xs4>
                                <MetadataInformationCard :info="metadataInfo"></MetadataInformationCard>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-flex>
                <v-flex xs12 md4>
                    <ResourceList :resources="dataset.resources"></ResourceList>
                </v-flex>
            </v-layout>
        </template>
    </v-container>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import ResourceList from "../dataset/ResourceList";
import AboutCard from "../dataset/AboutCard";
import AdditionalInfoCard from "../dataset/AdditionalInfoCard";
import ContactInfoCard from "../dataset/ContactInfoCard";
import AccessSecurityCard from "../dataset/AccessSecurityCard";
import MetadataInformationCard from "../dataset/MetadataInformationCard";
import Breadcrumb from "../breadcrumb/Breadcrumb";
import {Analytics} from '../../services/analytics'
const analyticsServ = new Analytics()

export default {
    components: {
        ResourceList: ResourceList,
        AboutCard: AboutCard,
        AdditionalInfoCard: AdditionalInfoCard,
        ContactInfoCard: ContactInfoCard,
        AccessSecurityCard: AccessSecurityCard,
        MetadataInformationCard: MetadataInformationCard,
        Breadcrumb: Breadcrumb
    },
    data() {
        return {
            editing: false,
            breadcrumbs: [
                { icon: "home", label: "Home", route: "/" },
                { label: "Datasets", route: "/datasets" },
                { label: "Fetching Dataset..." }
            ],
            additionalInfo: {},
            contactInfo: {},
            accessInfo: {},
            metadataInfo: {}
        };
    },

    computed: {
        datasetId: function datasetId() {
            return this.$route.params.datasetId;
        },
        editLink: function editLink() {
            return "/dataset/" + this.datasetId + "/edit";
        },
        ...mapState({
            dataset: state => state.dataset.dataset,
            orgList: state => state.organization.orgList,
            userPermissions: state => state.user.userPermissions,
            sysAdmin: state => state.user.sysAdmin,
            isAdmin: state => state.user.isAdmin,
            loading: state => state.dataset.loading,
        }),
        ...mapGetters("organization", {
            getSubOrgs: "getSubOrgs",
        }),

        showEdit: function(){
            // TODO: IF you aren't overriding the admin functionality like BCDC CKAN does then this is what you want
            //return ( (!this.editing) && ((this.sysAdmin) || (this.userPermissions[this.dataset.organization.name] === "admin") || (this.userPermissions[this.dataset.organization.name] === "editor")));
            return ( (!this.editing) && ((this.sysAdmin) || (this.isAdmin) || (this.userPermissions[this.dataset.organization.name] === "editor")));
        }
    },

    methods: {
        getDataset() {
            this.$store.dispatch("dataset/getDataset", { id: this.datasetId });
        },
        toggleEdit() {
            this.editing = !this.editing;
        },
        // loading() {
        //     return !this.dataset || Object.entries(this.dataset).length <= 0
        // }
    },

    mounted(){
        analyticsServ.get(window.currentUrl, this.$route.meta.title, window.previousUrl);
        this.getDataset();
        this.$store.dispatch("organization/getOrgs");
    }
};
</script>

<style>
h1,
h2,
h3,
h4,
h5 {
    color: #444444;
}
</style>

<style scoped>
.main-area {
    margin-top: 20px;
}
ul {
    list-style-type: none;
}
.tracking-summary {
    height: inherit;
    padding: inherit;
}
.metadata {
    padding-top: 0px;
    padding-left: 0px;
}
</style>
