<template>
    <v-card hover tile>
        <v-container fluid>
            <v-row wrap align-center fill-height>
                <v-col cols=12 class="py-0">
                    <router-link class="label label-link" :to="{ name: 'resource_view', params: { datasetId: dataset.name, resourceId: resource.id}}">
                        {{useResource.metadata.name}}
                    </router-link>
                </v-col>
            </v-row>
            <v-row wrap align-center fill-height class="py-0">
                <v-col cols=12 class="py-0">
                    <p class="faded pb-0 mb-2 normalWordBreak" v-line-clamp:1.5="2" >{{useResource.metadata.resource_description}}</p>
                </v-col>
            </v-row>
            <v-row wrap align-center fill-height class="py-0">
                <v-col align-start cols=12 class="py-0">
                    <span>
                        <label left class="sublabel">
                            {{useResource.metadata.format}}
                        </label>
                        <span v-if="useResource.metadata.size && useResource.metadata.size > 0" class="sublabel ml-4">
                            {{humanReadableFileSize(useResource.metadata.size)}}
                        </span>
                    </span>
                    <span class="floatRight">
                        <v-btn v-if="!loadPOW" class="px-0" small depressed text :href="useResource.metadata.url" color="label_colour">
                            {{$tc("Access/Download")}}&nbsp;
                        </v-btn>
                        <powButton v-else :btn="true" :dataset="dataset" :resource="useResource.metadata"/>
                        <v-btn v-if="!datasetBeingEdited" small depressed text class="px-0" color="label_colour"
                                :to="{ name: 'resource_view', params: { datasetId: dataset.name, resourceId: resource.id}}">
                            {{$tc("View")}}
                        </v-btn>
                        <v-btn v-if="!!useResource.hasSchema" small depressed text class="px-0" @click.stop="schemaDialog = true" color="label_colour">
                            View Schema (JSON Table Schema)
                        </v-btn>
                        <v-btn v-if="showEdit" small depressed text class="px-0 mx-0" color="label_colour"
                            :to="{ name: 'resource_view', query: { editing: true }, params: { datasetId: dataset.name, resourceId: resource.id }}">
                            <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                        <DeleteButton
                                v-if="canDelete"
                                buttonClass="px-0 mx-0"
                                confirmationMessage="Are you sure you want to delete this resource?"
                                @delete="deleteResource">
                        </DeleteButton>
                    </span>
                </v-col>

            </v-row>
        </v-container>
    </v-card>
</template>

<script>
import { mapState } from 'vuex';
import powButton from "../pow/powButton";
import DeleteButton from '../DeleteButton';
import { CkanApi } from '../../services/ckanApi';
const ckanServ = new CkanApi()
import { humanReadableFileSize } from '@/lib/util';

export default {
    props: {
        resource: Object,
        resourceIndex: Number,
        showEdit: Boolean,
        datasetBeingEdited: Boolean,
        canDelete: {
            type: Boolean,
            default: false,
        }
    },

    components: {
        powButton: powButton,
        DeleteButton
    },
    methods: {
        deleteResource: function(){
            ckanServ.deleteResource(this.resource.id).then( () => {
                location.reload();
            });
        },

        humanReadableFileSize
    },
    computed: {
        loadPOW: function() {
            return (this.resource.bcdc_type=="geographic" && ("object_name" in this.resource) && this.resource.name.toLowerCase().indexOf("custom download") !== -1);
        },
        ...mapState({
            dataset: state => state.dataset.dataset
        })
    },

    // mounted() {
    //     let self = this;
    //     this.$store.dispatch('dataset/getResource', {datasetResourceIndex: this.resourceIndex, id: this.resource.id});
    //     let unsub = this.$store.subscribe(
    //         (mutation, state) => {
    //             if(mutation.type == "dataset/setResource") {
    //                 if (mutation.payload.id === self.resource.id){
    //                     self.useResource = state.dataset.resources[self.resource.id];
    //                     unsub();
    //                 }
    //             }
    //         }
    //     )

    // },

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

.label{
    color: var(--v-faded_text-base);
    font-weight: bold;
    font-size: 16px;
    text-decoration-line: none;
}

.label-link:hover{
    text-decoration-line: underline;
}

.sublabel{
    color: var(--v-faded_text-base);
    font-weight: bold;
    font-size: 14px;
}

.container {
    padding-bottom: 15px;
}

div[role="listitem"]{
    padding-left: 5px;
    padding-right: 5px;
    width: 100%;
}

.dot-button {
    float: right;
    padding-right: 0px !important;
}

.theme--light.v-list-item:not(.v-list-item--active):not(.v-list-item--disabled).label_colour--text{
    color: var(--v-label_colour-base) !important;
}

.theme--light.v-list-item:not(.v-list-item--active):not(.v-list-item--disabled).error_text--text{
    color: var(--v-error_text-base) !important;
}

.faded{
    color: var(--v-faded_text-base);
    font-size: 14px;
}

.floatRight{
    float: right;
}

.normalWordBreak{
        word-break: normal !important;
    }
</style>
