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
