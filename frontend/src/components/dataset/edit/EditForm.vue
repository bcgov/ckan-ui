<template>
    <v-form>
        <v-layout row wrap justify-space-between>
            <v-flex xs6>
                <v-btn color="primary">Manage Resources</v-btn>
                <v-spacer></v-spacer>
            </v-flex>
            <v-flex xs6 class="text-right">
                <v-spacer></v-spacer>
                <v-btn color="error">Cancel</v-btn>
                <v-btn color="primary">Save</v-btn>
            </v-flex>
        </v-layout>
        <v-layout row wrap fill-height>
            <v-flex xs12 md8>
                <h2>Dataset Details</h2>
                <v-container pa-0 ma-0>
                    <v-layout row>
                        <v-flex xs12>
                            <v-text-field v-model="dataset.title" label="Title"></v-text-field>
                        </v-flex>
                    </v-layout>
                    <v-layout row>
                        <v-flex xs12>
                            <v-text-field small v-model="dataset.name" label="URL" prefix="/dataset/"></v-text-field>
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
                            ></v-select>
                        </v-flex>
                    </v-layout>
                    <v-layout row>
                        <v-flex xs12>
                            <v-textarea v-model="dataset.notes" label="Description"></v-textarea>
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
                            <v-textarea v-model="dataset.lineage_statement" label="Lineage Statement"></v-textarea>
                        </v-flex>
                    </v-layout>
                    <h4>More Info
                        <v-btn flat small color="secondary" @click.stop="addMoreInfo()" name="Add Another Link">
                            <v-icon>add</v-icon>
                        </v-btn>
                    </h4>
                    <v-layout row v-for="(more_info, index) in dataset.more_info" :key="more_info.link">
                        <v-flex xs10>
                            <v-text-field small v-model="more_info.link" label="URL" placeholder="http://www.data.gov.bc.ca/dbc/geographic"></v-text-field>
                        </v-flex>
                        <v-flex xs2>
                            <v-btn flat small color="error" @click.stop="removeMoreInfo({ index: index })">
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
                            >
                                <template v-slot:no-data>
                                    <v-list-tile>
                                        <v-list-tile-content>
                                        <v-list-tile-title>
                                            No results matching "<strong>{{ search }}</strong>". Press <kbd>enter</kbd> to create a new one
                                        </v-list-tile-title>
                                        </v-list-tile-content>
                                    </v-list-tile>
                                </template>
                            </v-combobox>
                        </v-flex>
                    </v-layout>
                    <v-divider></v-divider>
                </v-container>
            </v-flex>
            <v-flex xs12 md4>
                <h2>Contacts</h2>
                <v-container pa-0 ma-0 v-for="(contact, index) in dataset.contacts" :key="contact.email">
                    <v-layout row>
                        <v-flex xs6>
                            <v-text-field v-model="contact.name" label="Name"></v-text-field>
                        </v-flex>
                        <v-flex xs6>
                            <v-text-field v-model="contact.email" label="e-mail"></v-text-field>
                        </v-flex>
                    </v-layout>
                    <v-layout row>
                        <v-flex xs6>
                            <v-select
                                class="text-truncate"
                                v-model="contact.organization"
                                :items="topOrgs"
                                item-text="title"
                                item-value="id"
                                label="Organization"
                            ></v-select>
                        </v-flex>
                        <v-flex xs6>
                            <v-select
                                class="text-truncate"
                                v-model="contact.branch"
                                :items="subOrgs(contact.organization)"
                                item-text="title"
                                item-value="id"
                                label="Sub Organization"
                            ></v-select>
                        </v-flex>
                    </v-layout>
                    <v-layout row>
                        <v-flex xs6>
                            <v-text-field v-model="contact.role" label="Role"></v-text-field>
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
                            <v-btn flat small color="error" @click.stop="showRemoveContactDialog(contact, index)">
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
            tags: [],
            search: null
        };
    },
    computed: {
        ...mapState({
            dataset: state => state.dataset.dataset,
            orgList: state => state.organization.orgList,
            allTags: state => state.tag.tagList
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
            removeMoreInfo: "removeMoreInfo"
        }),
        removeContact(index) {
            this.$store.dispatch("dataset/removeContact", { index: index });
            this.deleteContactDialog = false;
            this.dialogContact = {}
        },
        showRemoveContactDialog(contact, index) {
            this.dialogContact = {
                contact: contact,
                index: index
            }
            this.deleteContactDialog = true;
        },
        cancelContactDialog() {
            this.deleteContactDialog = false;
            this.dialogContact = {}
        }
    },
    mounted() {
        this.$store.dispatch("tag/getTags");
        this.tags = this.dataset.tags.map(x => x.name);
        if (!this.dataset.more_info || this.dataset.more_info.length < 1) {
            this.addMoreInfo();
        }
    }
};
</script>

<style scoped>
.text-right {
    text-align: right;
}
</style>
