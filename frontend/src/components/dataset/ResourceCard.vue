<template>
    <v-card hover tile style="margin-bottom:.5rem">
        <v-container fluid>
            <v-row wrap align-center fill-height>
                <v-col cols=12 class="py-0">
                    <label class="label">
                        {{useResource.metadata.name}}
                    </label>
                </v-col>
            </v-row>
            <v-row wrap align-center fill-height>
                <v-col align-start cols=9 class="py-0">
                    <span left class="resource-info">
                        {{useResource.metadata.format}}
                    </span>
                    <span v-if="useResource.metadata.size" class="resource-info ml-4">
                        {{(useResource.metadata.size/1000).toFixed(1)}} MB
                    </span>
                </v-col>
                <v-col align-end cols=3 class="py-0">
                    <v-menu offset-y left nudge-left>
                        <template v-slot:activator="{ on: menu }">
                            <v-btn text block small v-on="{...menu}">
                                <v-icon>mdi-dots-horizontal</v-icon>
                            </v-btn>
                        </template>
                        <v-list dense>
                            <v-list-item v-if="!loadPOW" flat :href="useResource.metadata.url">Download</v-list-item>
                            <powButton v-else :resource="useResource.metadata"/>
                            <v-list-item v-if="!datasetBeingEdited" flat @click.stop="viewDialog = true">View</v-list-item>
                            <v-list-item v-if="!datasetBeingEdited" flat @click.stop="dialog = true">Preview</v-list-item>
                            <v-list-item v-if="!!useResource.hasSchema" flat @click.stop="schemaDialog = true">View Schema (JSON Table Schema)</v-list-item>
                            <v-list-item v-if="showEdit" @click.stop="editDialog = true">Edit</v-list-item>
                            <v-list-item v-if="canDelete" @click="deleteResource" color="error" >Delete</v-list-item>
                        </v-list>
                    </v-menu>
                </v-col>

            </v-row>
        </v-container>
    </v-card>
</template>

<script>
import powButton from "../pow/powButton"
import {CkanApi} from '../../services/ckanApi'
const ckanServ = new CkanApi()

export default {
    props: {
        resource: Object,
        resourceIndex: Number,
        showEdit: Boolean,
        datasetBeingEdited: Boolean,
        canDelete: {
            type: Boolean,
            default: false,
        },
    },

    components: {
        powButton: powButton
    },
    methods: {
        deleteResource: function(){
            ckanServ.deleteResource(this.resource.id).then( () => {
                location.reload();
            });
        }
    },
    computed: {
        loadPOW: function() {
            return (this.resource.bcdc_type=="geographic" && ("object_name" in this.resource) && this.resource.name.toLowerCase().indexOf("custom download") !== -1);
        }
    },

    mounted() {
        let self = this;
        this.$store.dispatch('dataset/getResource', {datasetResourceIndex: this.resourceIndex, id: this.resource.id});
        let unsub = this.$store.subscribe(
            (mutation, state) => {
                if(mutation.type == "dataset/setResource") {
                    if (mutation.payload.id === self.resource.id){
                        self.useResource = state.dataset.resources[self.resource.id];
                        unsub();
                    }
                }
            }
        )

    },

    data() {
        return {
            dialog: false,
            schemaDialog: false,
            editDialog: false,
            viewDialog: false,
            useResource: {metadata: this.resource},
        };
    }
};
</script>

<style scoped>

label.label{
    color: var(--v-label_text-base);
}

.resource-info{
    color: var(--v-label_text-lighten3);
}

.container {
    padding-bottom: 15px;
}

div[role="listitem"]{
    padding-left: 5px;
    padding-right: 5px;
    width: 100%;
}

</style>
