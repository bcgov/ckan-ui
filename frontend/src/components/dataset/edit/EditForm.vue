<template>
    <v-form ref="datasetForm">
        <v-layout row wrap justify-space-between>
            <v-flex xs6>
                <v-btn color="primary">Manage Resources</v-btn>
                <v-spacer></v-spacer>
            </v-flex>
            <v-flex xs6 class="text-right">
                <v-spacer></v-spacer>
                <v-btn color="error" @click="cancel()">Cancel</v-btn>
                <v-btn color="primary" @click="save()">Save</v-btn>
            </v-flex>
        </v-layout>
        <v-layout row wrap fill-height>
            <v-flex xs12 md8>
                <h2>Dataset Details</h2>
                <v-container pa-0 ma-0>
                    <v-layout row>
                        <v-flex xs12>
                            <v-text-field v-model="dataset.title" label="Title" :rules="[rules.required]"></v-text-field>
                        </v-flex>
                    </v-layout>
                    <v-layout row>
                        <v-flex xs12>
                            <v-text-field
                                small
                                v-model="dataset.name"
                                label="URL"
                                prefix="/dataset/"
                                :rules="[rules.required]"
                            ></v-text-field>
                        </v-flex>
                    </v-layout>
                    <v-layout row>
                        <v-flex xs6>
                            <v-select
                                class="text-truncate"
                                v-model="dataset.org"
                                :items="topOrgs"
                                item-text="title"
                                item-value="id"
                                label="Organization"
                                :rules="[rules.required]"
                            ></v-select>
                        </v-flex>
                        <v-flex xs6>
                            <v-select
                                class="text-truncate"
                                v-model="dataset.owner_org"
                                :items="subOrgs(dataset.org)"
                                item-text="title"
                                item-value="id"
                                label="Sub Organization"
                                :rules="[rules.required]"
                            ></v-select>
                        </v-flex>
                    </v-layout>
                    <v-layout row>
                        <v-flex xs12>
                            <v-textarea v-model="dataset.notes" label="Description" :rules="[rules.required]"></v-textarea>
                        </v-flex>
                    </v-layout>
                    <v-layout row>
                        <v-flex xs12>
                            <v-textarea v-model="dataset.purpose" label="Purpose"></v-textarea>
                        </v-flex>
                    </v-layout>
                    <v-layout row>
                        <v-flex xs12>
                            <v-textarea v-model="dataset.data_quality" label="Data Quality"></v-textarea>
                        </v-flex>
                    </v-layout>
                    <v-layout row>
                        <v-flex xs12>
                            <v-textarea
                                v-model="dataset.lineage_statement"
                                label="Lineage Statement"
                            ></v-textarea>
                        </v-flex>
                    </v-layout>
                    <h4>
                        More Info
                        <v-btn
                            flat
                            small
                            color="secondary"
                            @click.stop="addMoreInfo()"
                            name="Add Another Link"
                        >
                            <v-icon>add</v-icon>
                        </v-btn>
                    </h4>
                    <v-layout
                        row
                        v-for="(more_info, index) in dataset.more_info"
                        :key="'more_info' + index"
                    >
                        <v-flex xs10>
                            <v-text-field
                                small
                                v-model="more_info.link"
                                label="URL"
                                placeholder="http://www.data.gov.bc.ca/dbc/geographic"
                            ></v-text-field>
                        </v-flex>
                        <v-flex xs2>
                            <v-btn
                                flat
                                small
                                color="error"
                                @click.stop="removeMoreInfo({ index: index })"
                            >
                                <v-icon>delete</v-icon>
                            </v-btn>
                        </v-flex>
                    </v-layout>
                    <v-layout row>
                        <v-flex xs12>
                            <v-combobox
                                v-model="tags"
                                :items="allTags"
                                small-chips
                                label="Keywords"
                                multiple
                                :search-input.sync="search"
                                hide-selected
                                :rules="[rules.required]"
                            >
                                <template v-slot:no-data>
                                    <v-list-tile>
                                        <v-list-tile-content>
                                            <v-list-tile-title>
                                                No results matching "
                                                <strong>{{ search }}</strong>". Press
                                                <kbd>enter</kbd> to create a new one
                                            </v-list-tile-title>
                                        </v-list-tile-content>
                                    </v-list-tile>
                                </template>
                            </v-combobox>
                        </v-flex>
                    </v-layout>
                    <v-divider></v-divider>
                    <v-layout row>
                        <v-flex xs6>
                            <h3>Data Currency/Update</h3>
                            <v-layout row>
                                <v-flex xs12>
                                    <v-select
                                        class="text-truncate"
                                        v-model="dataset.resource_status"
                                        :items="vocabs.resource_status"
                                        label="Resource Status"
                                        :rules="[rules.required]"
                                    ></v-select>
                                </v-flex>
                            </v-layout>
                            <v-layout
                                row
                                v-for="(date, index) in dataset.dates"
                                :key="'date' + index"
                            >
                                <v-flex xs5>
                                    <v-select
                                        class="text-truncate"
                                        v-model="date.type"
                                        :items="vocabs.dataset_date_type"
                                        label="Date Type"
                                        :rules="[rules.required]"
                                    ></v-select>
                                </v-flex>
                                <v-flex xs5>
                                    <v-menu
                                        v-model="datePickers[index]"
                                        :close-on-content-click="false"
                                        :nudge-right="40"
                                        lazy
                                        transition="scale-transition"
                                        offset-y
                                        full-width
                                        min-width="290px"
                                    >
                                        <template v-slot:activator="{ on }">
                                            <v-text-field
                                                v-model="date.date"
                                                label="Date"
                                                prepend-icon="event"
                                                readonly
                                                v-on="on"
                                                :rules="[rules.required]"
                                            ></v-text-field>
                                        </template>
                                        <v-date-picker v-model="date.date" @input="datePickers[index] = false" no-title></v-date-picker>
                                    </v-menu>
                                </v-flex>
                                <v-flex xs2>
                                    <v-btn
                                        flat
                                        fab
                                        small
                                        color="error"
                                        @click.stop="removeDate({ index: index })"
                                    >
                                        <v-icon>delete</v-icon>
                                    </v-btn>
                                </v-flex>
                            </v-layout>
                            <v-layout row>
                                <v-flex xs12>
                                    <v-btn block color="secondary" @click="addDate">Add Date</v-btn>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                        <v-flex xs6>
                            <h3>Access & Security</h3>
                            <v-layout row>
                                <v-flex xs12>
                                    <v-select
                                        class="text-truncate"
                                        v-model="dataset.view_audience"
                                        :items="vocabs.viewable"
                                        label="Who can VIEW this data?"
                                        :rules="[rules.required]"
                                    ></v-select>
                                    <v-select
                                        class="text-truncate"
                                        v-model="dataset.metadata_visibility"
                                        :items="vocabs.metadata_visibility"
                                        label="Who can VIEW this RECORD?"
                                        :rules="[rules.required]"
                                    ></v-select>
                                    <v-select
                                        class="text-truncate"
                                        v-model="dataset.download_audience"
                                        :items="vocabs.downloadable"
                                        label="Who can DOWNLOAD this data?"
                                        :rules="[rules.required]"
                                    ></v-select>
                                    <v-select
                                        class="text-truncate"
                                        v-model="dataset.license_title"
                                        :items="licenses"
                                        item-text="title"
                                        item-value="title"
                                        label="License"
                                        :rules="[rules.required]"
                                    ></v-select>
                                    <v-select
                                        class="text-truncate"
                                        v-model="dataset.security_class"
                                        :items="vocabs.security_class"
                                        label="Security Classification"
                                        :rules="[rules.required]"
                                    ></v-select>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-flex>
            <v-flex xs12 md4>
                <h2>Contacts</h2>
                <v-container
                    pa-0
                    ma-0
                    v-for="(contact, index) in dataset.contacts"
                    :key="'contact' + index"
                >
                    <v-layout row>
                        <v-flex xs6>
                            <v-text-field v-model="contact.name" label="Name" :rules="[rules.required]"></v-text-field>
                        </v-flex>
                        <v-flex xs6>
                            <v-text-field v-model="contact.email" label="e-mail" :rules="[rules.required, rules.email]"></v-text-field>
                        </v-flex>
                    </v-layout>
                    <v-layout row>
                        <v-flex xs6>
                            <v-container pa-0 ma-0>
                                <v-layout row>
                                    <v-flex xs12>
                                        <v-select
                                            class="text-truncate"
                                            v-model="contact.organization"
                                            :items="topOrgs"
                                            item-text="title"
                                            item-value="id"
                                            label="Organization"
                                            :rules="[rules.required]"
                                        ></v-select>
                                    </v-flex>
                                </v-layout>
                            </v-container>
                        </v-flex>
                        <v-flex xs6>
                            <v-container pa-0 ma-0>
                                <v-select
                                    class="text-truncate"
                                    v-model="contact.branch"
                                    :items="subOrgs(contact.organization)"
                                    item-text="title"
                                    item-value="id"
                                    label="Sub Organization"
                                    :rules="[rules.required]"
                                ></v-select>
                            </v-container>
                        </v-flex>
                    </v-layout>
                    <v-layout row>
                        <v-flex xs6>
                            <v-select
                                class="text-truncate"
                                v-model="contact.role"
                                :items="vocabs.contact_roles"
                                label="Role"
                                :rules="[rules.required]"
                            ></v-select>
                        </v-flex>
                        <v-flex xs3>
                            <v-checkbox
                                v-model="contact.private"
                                label="Display?"
                                true-value="Display"
                                false-value="Private"
                                on-icon="check_box"
                                off-icon="check_box_outline_blank"
                                color="info"
                            ></v-checkbox>
                        </v-flex>
                        <v-flex xs3 align-self-center>
                            <v-btn
                                flat
                                small
                                color="error"
                                @click.stop="showRemoveContactDialog(contact, index)"
                            >
                                <v-icon>delete</v-icon>
                            </v-btn>
                        </v-flex>
                    </v-layout>
                    <v-divider v-if="index != dataset.contacts.length - 1"></v-divider>
                </v-container>
                <v-btn block color="secondary" v-on:click="addContact()">Add Contact</v-btn>
            </v-flex>
        </v-layout>
        <v-dialog v-model="deleteContactDialog" persistent max-width="400">
            <v-card v-if="dialogContact.contact">
                <v-card-title>Delete this contact?</v-card-title>
                <v-card-text>Are you sure you want to remove contact info for {{dialogContact.contact.name}}? This can only be undone by canceling all current changes.</v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn @click="cancelContactDialog()">Cancel</v-btn>
                    <v-btn @click="removeContact(dialogContact.index)" color="error">I'm Sure</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
         <v-dialog v-model="errorDialog" persistent max-width="400">
            <v-card>
                <v-card-title>Validation Error</v-card-title>
                <v-card-text>The dataset update failed due to the following error: {{errorDict}}</v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn @click="errorDialog = false">Got it!</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-form>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";

export default {
    props: {
        datasetOrg: String,
        datasetBranch: String
    },
    data() {
        return {
            deleteContactDialog: false,
            dialogContact: {},
            errorDialog: false,
            errorDict: {},
            tags: [],
            search: null,
            datePickers: [],
            rules: {
                required: value => !!value || 'Required.',
                email: value => {
                    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                    return pattern.test(value) || 'Invalid e-mail.'
                }
            }
        };
    },
    computed: {
        ...mapState({
            dataset: state => state.dataset.dataset,
            orgList: state => state.organization.orgList,
            allTags: state => state.tag.tagList,
            vocabs: state => state.tag.vocabs,
            licenses: state => state.tag.licenses
        }),
        ...mapGetters("organization", {
            subOrgs: "getSubOrgs",
            topOrgs: "getTopOrgs"
        })
    },
    methods: {
        ...mapActions("dataset", {
            addContact: "addContact",
            addMoreInfo: "addMoreInfo",
            removeMoreInfo: "removeMoreInfo",
            addDate: "addDate",
            removeDate: "removeDate"
        }),
        removeContact(index) {
            this.$store.dispatch("dataset/removeContact", { index: index });
            this.deleteContactDialog = false;
            this.dialogContact = {};
        },
        showRemoveContactDialog(contact, index) {
            this.dialogContact = {
                contact: contact,
                index: index
            };
            this.deleteContactDialog = true;
        },
        cancelContactDialog() {
            this.deleteContactDialog = false;
            this.dialogContact = {};
        },
        cancel() {
            this.$store.dispatch("dataset/resetDataset");
            this.$emit('done', true);
        },
        save() {
            if (this.$refs.datasetForm.validate()) {
                // eslint-disable-next-line
                //console.log("Form is valid!");
                this.$store.dispatch("dataset/setDataset").then(data => {
                    if (data.success) {
                        this.$emit('done', true);
                    } else {
                        this.errorDialog = true;
                        this.errorDict = JSON.stringify(data.error);
                        // eslint-disable-next-line
                        //console.log('Save Response: ', data);
                    }
                });

            } else {
                // eslint-disable-next-line
                //console.log("Form ain't valid!");
            }
        }
    },
    mounted() {
        this.$store.dispatch("tag/getTags");
        this.$store.dispatch("tag/getVocabs");
        this.$store.dispatch("tag/getLicenses");
        this.tags = this.dataset.tags.map(x => x.name);
        if (!this.dataset.more_info || this.dataset.more_info.length < 1) {
            this.addMoreInfo();
        }
        if (!this.dataset.dates || this.dataset.dates.length < 1) {
            this.addDate();
        }
        for (let i = 0; i < this.dataset.dates.length; i++) {
            this.datePickers.push(false);
        }
    }
};
</script>

<style scoped>
.text-right {
    text-align: right;
}
</style>
