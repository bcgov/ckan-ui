<template>
    <v-card hover style="margin-bottom:.5rem">
        <v-container fluid>
            <v-layout row wrap align-center fill-height>
                <v-flex xs12>
                    <h4>
                        <i class="fa fa-file"></i>
                        {{resource.name}}
                    </h4>
                    <span>
                        <strong>Type:</strong>
                        {{resource.format}}
                    </span>
                </v-flex>
            </v-layout>
            <v-layout row wrap align-center fill-height>
                <v-flex xs6>
                    <v-btn flat block color="secondary" :href="resource.url">
                        Download&nbsp;
                        <i class="fa fa-download float-right"></i>
                    </v-btn>
                </v-flex>
                <v-flex xs6>
                    <v-menu offset-y>
                        <template v-slot:activator="{ on }">
                            <v-btn flat block color="secondary" v-on="on">
                                More&nbsp;
                                <i class="fa fa-caret-down"></i>
                            </v-btn>
                        </template>
                        <v-list>
                            <v-dialog
                                v-model="dialog"
                                fullscreen
                                hide-overlay
                                transition="dialog-bottom-transition"
                            >
                                <template v-slot:activator="{ on }">
                                    <v-list-tile v-on="on">Preview</v-list-tile>
                                </template>
                                <Preview
                                    :resource="resource"
                                    v-on:closePreviewDialog="dialog = false"
                                ></Preview>
                            </v-dialog>
                        </v-list>
                    </v-menu>
                </v-flex>
            </v-layout>
        </v-container>
    </v-card>
</template>

<script>
import Preview from "../resources/preview";

export default {
    props: {
        resource: Object
    },
    components: {
        Preview: Preview
    },
    methods: {},
    data() {
        return {
            dialog: false
        };
    }
};
</script>

<style scoped>

.container {
    padding-bottom: 15px;
}
</style>
