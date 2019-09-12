<template>
    <div class="grey lighten-3" style="margin:auto;height:100%" justify-center fill-height>
        <v-toolbar color="primary" dark>
            <v-toolbar-title>Data and Resources</v-toolbar-title>
        </v-toolbar>
        <v-container fluid grid-list-md>
            <v-layout column align-space-around justify-start fill-height>
                <ResourceCard
                    v-for="(resource, index) in resources"
                    v-bind:key="resource.id"
                    :resource="resource"
                    :resourceIndex="index"
                    :showEdit="createMode || showEdit"
                ></ResourceCard>
                <v-dialog
                    v-if="!createMode && showEdit"
                    v-model="createDialog"
                    fullscreen
                    style="z-index: 10000"
                    transition="dialog-bottom-transition"
                >
                    <template v-slot:activator="{ on }">
                        <v-btn v-on="on" color="primary">Add Resource<v-icon>add_circle</v-icon></v-btn>
                    </template>
                    <EditResource
                        :resource="{}"
                        :resourceIndex="0"
                        :create="true"
                        v-on:closePreviewDialog="createDialog = false"
                    ></EditResource>
                </v-dialog>

            </v-layout>
        </v-container>
    </div>
</template>

<script>
import { mapState } from "vuex";
import ResourceCard from "./ResourceCard";
import EditResource from '../resources/edit';
export default {
    components: {
        ResourceCard,
        EditResource: EditResource,
    },
    props: {
        resources: Array,
        showEdit: Boolean,
        createMode: Boolean,
    },
    computed: {
        ...mapState({
            dataset: state => state.dataset.dataset
        })
    },
    data(){
        return{
            createDialog: false,
        }
    }
};
</script>

<style scoped>
@import "https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css";
</style>
