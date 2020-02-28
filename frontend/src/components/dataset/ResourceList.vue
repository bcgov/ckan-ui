<template>
    <v-container fluid grid-list-md>
        <v-row align-space-around justify-start fill-height>
            <v-col cols=12>
                <ResourceCard
                    v-for="(resource, index) in resources"
                    v-bind:key="resource.id"
                    :resource="resource"
                    :resourceIndex="index"
                    :canDelete="canDelete"
                    :showEdit="createMode || showEdit"
                    :datasetBeingEdited="datasetBeingEdited"
                ></ResourceCard>
            </v-col>
            <v-col cols=12>
                <v-btn v-if="!createMode && showEdit" @click.stop="createDialog = true" color="primary">Add Resource<v-icon>mdi-plus-circle</v-icon></v-btn>
                <v-dialog
                    v-if="!createMode && showEdit"
                    v-model="createDialog"
                    fullscreen
                    transition="dialog-bottom-transition"
                >
                    <EditResource
                        :resource="{}"
                        :resourceIndex="0"
                        :create="true"
                        v-on:closePreviewDialog="createDialog = false"
                    ></EditResource>
                </v-dialog>
            </v-col>

        </v-row>
    </v-container>
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
</style>
