<template>
    <div class="grey lighten-3" style="margin:auto;height:100%" justify-center fill-height>
        <v-toolbar color="primary" dark>
            <v-toolbar-title>Data and Resources</v-toolbar-title>
        </v-toolbar>
        <v-container fluid grid-list-md>
            <v-layout column align-space-around justify-start fill-height>
                <ResourceCard
                    v-for="resource in resources"
                    v-bind:key="resource.id"
                    :resource="resource"
                ></ResourceCard>
            </v-layout>
        </v-container>
    </div>
</template>

<script>
import { mapState } from "vuex";
import ResourceCard from "./ResourceCard";
export default {
    components: {
        ResourceCard
    },
    props: {
        resources: Array
    },
    computed: {
        ...mapState({
            dataset: state => state.dataset.dataset
        })
    }
};
</script>

<style scoped>
@import "https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css";
</style>
