<template>
    <v-container fluid grid-list-md>
        <v-row align-space-around justify-start fill-height>
            <v-col cols=12 class="px-0">
                <ResourceCard
                    v-for="(resource, index) in resources"
                    v-bind:key="resource.id"
                    :resource="resource"
                    :resourceIndex="index"
                    :canDelete="canDelete"
                    :showEdit="createMode || showEdit"
                    :datasetBeingEdited="datasetBeingEdited"
                ></ResourceCard>
                <v-card
                    v-if="!createMode && showEdit"
                    hover outlined tile
                    :to="{ name: 'resource_create', params: { datasetId: dataset.name }}"
                    class="new-resource"
                    style="margin-bottom:.5rem">
                    <v-container fluid>
                        <v-row align-center>
                            <v-col cols=12 align-self="center">
                                <v-btn text block small color="secondary">Add New Resource</v-btn>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { mapState } from "vuex";
import ResourceCard from "./ResourceCard";

export default {
    components: {
        ResourceCard,
    },
    props: {
        resources: Array,
        showEdit: Boolean,
        createMode: Boolean,
        canDelete: {
            type: Boolean,
            default: false,
        },
        datasetBeingEdited: Boolean,
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
.v-toolbar__title{
    color: var(--v-text-base)
}
.new-resource{
    border-style: dashed !important;
}
</style>
