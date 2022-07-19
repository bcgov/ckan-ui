<template>
    <v-container v-if="loading" fluid class="raise">
        <v-row row align-center justify-center>
            <v-progress-circular :size="70" :width="7" color="grey" indeterminate></v-progress-circular>
        </v-row>
    </v-container>
    <v-container v-else-if="!(sysAdmin || permitted)">
        <div row align-center justify-center>
            <h1><v-icon x-large>error</v-icon> Unauthorized:</h1>
            <p>You are not authorized to manage {{org.title}}. <router-link :to="{name: 'adminHome'}">Go Back</router-link></p>
        </div>
    </v-container>
    <v-container v-else fluid class="raise">
        <v-row>
            <v-col cols=12 md=10 offset-md=1>
                <v-breadcrumbs :items="crumbs" divider=">">
                    <template v-slot:item="{ item }">
                        <v-breadcrumbs-item exact :to="item.to" :disabled="item.disabled">
                            {{ item.text === 'org_title' ? (isOrg ? org.title : group.title) : item.text }}
                        </v-breadcrumbs-item>
                    </template>
                </v-breadcrumbs>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols=12 md=10 offset-md=1>
                <v-card outlined class="pa-6" color="data_background">
                    <v-data-table :headers="headers" :items="isOrg ? org.users : group.users" sort-by="fullname">
                        <template v-slot:top>
                            <v-toolbar flat>
                                <v-toolbar-title>Manage Members</v-toolbar-title>
                                <v-divider class="mx-4" inset vertical></v-divider>
                                <v-spacer></v-spacer>
                                <v-dialog v-model="dialog" max-width="500px">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                                            Add Member
                                        </v-btn>
                                    </template>
                                    <v-card>
                                        <v-card-title><span class="text-h5">Add Member</span></v-card-title>
                                        <v-card-text>
                                            <v-container>
                                                <v-row>
                                                    <v-col cols="12">
                                                        <v-autocomplete
                                                            v-model="newUser.username"
                                                            :loading="userSearchLoading"
                                                            :items="userSearchItems"
                                                            item-value="id"
                                                            item-text="text"
                                                            :search-input.sync="userSearch"
                                                            dense outlined full-width
                                                            hide-details
                                                            hide-no-data
                                                            label="Search by full name or username"
                                                        ></v-autocomplete>
                                                    </v-col>
                                                    <v-col cols="12">
                                                        <label>Role</label>
                                                        <v-select dense hide-details outlined :items="roles" v-model="newUser.role"></v-select>
                                                    </v-col>
                                                </v-row>
                                            </v-container>
                                        </v-card-text>
                                        <v-card-actions>
                                            <v-spacer></v-spacer>
                                            <v-btn color="secondary" small @click="close">Cancel</v-btn>
                                            <v-btn color="primary" small @click="addMember">Add</v-btn>
                                        </v-card-actions>
                                    </v-card>
                                </v-dialog>
                                <v-dialog v-model="dialogDelete" max-width="500px">
                                    <v-card>
                                        <v-card-title color="error">Confirm Removal</v-card-title>
                                        <v-card-text>Are you sure you want to remove <strong>{{ memberForRemoval ? memberForRemoval.fullname : 'this user' }}</strong> from <strong>{{ isOrg ? org.title : group.title }}</strong>?</v-card-text>
                                        <v-card-actions>
                                            <v-spacer></v-spacer>
                                            <v-btn color="secondary" outlined small @click="closeDelete">Cancel</v-btn>
                                            <v-btn color="error" small @click="removeMember">DELETE</v-btn>
                                            <v-spacer></v-spacer>
                                        </v-card-actions>
                                    </v-card>
                                </v-dialog>
                            </v-toolbar>
                        </template>
                        <template v-slot:item.fullname="{ item }">
                            <span class="default-cursor">{{item.fullname}}</span>
                        </template>
                        <template v-slot:item.name="{ item }">
                            <span class="default-cursor">{{item.name}}</span>
                        </template>
                        <template v-slot:item.role="{ item }">
                            <v-select v-if="roles.length > 1" dense hide-details outlined :items="roles" v-model="item.capacity" @change="changeUserRole(item)"></v-select>
                            <span v-else>{{item.capacity}}</span>
                        </template>
                        <template v-slot:item.actions="{ item }">
                            <v-btn icon color="red" @click="confirmRemoveMember(item)"><v-icon>mdi-delete</v-icon></v-btn>
                        </template>
                    </v-data-table>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import { CkanApi } from '../../services/ckanApi';
    import { mapGetters, mapState } from "vuex";
    import Vue from 'vue';

    const ckanServ = new CkanApi();
    import { Analytics } from '../../services/analytics';
    const analyticsServ = new Analytics();


    export default {
        name: "manage-members",
        components: {
            
        },
        props: {
            isOrg: {
                type: Boolean,
                default: true
            }
        },
        data () {
            return {
                loading: true,
                error: null,
                crumbs: [
                    {
                    text: 'Admin',
                    disabled: false,
                    to: {name: 'adminHome'},
                    },
                    {
                    text: 'org_title',
                    disabled: true
                    },
                    {
                    text: 'Members',
                    disabled: true
                    },
                ],
                headers: [
                    { text: 'Full Name', value: 'fullname', align: "start" },
                    { text: 'Username', value: 'name', align: "start" },
                    { text: 'Role', value: 'role', sortable: false, width: "20%" },
                    { text: '', value: 'actions', sortable: false, align: "end", width: "10%" }
                ],
                roles: [
                    "admin", "editor"
                ],
                userSearch: null,
                userSearchItems: [],
                userSearchLoading: false,
                newUser: { username: null, role: 'editor' },
                dialog: false,
                dialogDelete: false,
                memberForRemoval: null
            }
        },
        computed:{
            ...mapGetters("organization", {
                hasAdmin: "hasAdmin",
                ancestorsByName: "ancestorsByName"
            }),
            ...mapState({
                sysAdmin: state => state.user.sysAdmin,
                userOrgs: state => state.organization.userOrgs,
                userGroups: state => state.group.userGroups,
                org: state => state.organization.organization,
                group: state => state.group.group
            }),
            organizationId: function organizationId() {
                return this.$route.params.orgId;
            },
            permitted: function() {
                if (this.isOrg) {
                    let ancestors = this.ancestorsByName(this.organizationId);
                    for (let org of this.userOrgs) {
                        if (((org.value === this.organizationId || org.name === this.organizationId) 
                            || ancestors.includes(org.name)) && org.role === 'admin') {
                            return true;
                        }
                    }
                } else {
                    for (let group of this.userGroups) {
                        if (group.id === this.organizationId || group.name === this.organizationId) {
                            return true;
                        }
                    }
                }
                return false;
            }
        },
        methods: {
            getOrg() {
                if (this.isOrg) {
                    this.$store.dispatch('organization/getOrg', {id: this.organizationId}).then( () => {
                        this.loading = false;
                    });
                } else {
                    this.$store.dispatch('group/getGroup', {id: this.organizationId}).then( () => {
                        this.loading = false;
                    });
                }
            },
            queryUserAutocomplete(q) {
                this.userSearchLoading = true;
                let self = this;
                ckanServ.getUserAutocomplete(q).then((data) => {
                    self.userSearchItems = data.result.map( obj => {
                        return { text: obj.fullname + ' | ' + obj.name, id: obj.id }
                    })
                    this.userSearchLoading = false;
                });
            },
            changeUserRole(user) {
                if (user.id) {
                    let self = this;
                    ckanServ.postOrganizationMember({ id: this.organizationId, username: user.id, role: user.capacity }).then( () => {
                        self.getOrg();
                    });
                    this.dialog = false;
                }
            },
            addMember() {
                if (this.newUser.username) {
                    this.newUser.id = this.organizationId;
                    let self = this;
                    ckanServ.postOrganizationMember( this.newUser ).then( () => {
                        self.newUser = { username: null, role: 'editor' };
                        self.getOrg();
                    });
                    this.dialog = false;
                }
            },
            clearAutocomplete() {
                this.userSearchItems = [];
            },
            close() {
                this.dialog = false;
            },
            closeDelete() {
                this.dialogDelete = false;
            },
            confirmRemoveMember(member) {
                this.memberForRemoval = member;
                this.dialogDelete = true;
            },
            removeMember() {
                if (this.memberForRemoval) {
                    let self = this;
                    ckanServ.deleteOrganizationMember({ username: this.memberForRemoval.id, id: this.organizationId }).then( (res) => {
                        // eslint-disable-next-line no-console
                        console.log("Res: ", res);
                        self.memberForRemoval = null;
                        self.getOrg();
                    })
                    this.dialogDelete = false;
                }
            }
        },
        watch: {
            userSearch (val) {
                if (val.indexOf('|') < 0) {
                    val ? this.queryUserAutocomplete(val) : this.clearAutocomplete();
                }
            }
        },
        mounted(){
            this.getOrg();
            if (!this.isOrg) {
                this.roles.pop();
                this.newUser.role = 'admin';
                this.$store.dispatch('group/getUserGroups');
            }
        },
        updated() {
            window.snowplow('refreshLinkClickTracking');
        },

    }
</script>

<style scoped>
    .raise {
        margin-bottom: 45px;
    }
    .expansion-header {
        color: white !important;
        font-weight: bold;
    }
    .expansion-content {
        background: var(--v-data_background-base);
        border: thin solid grey;
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
    }
    >>> th span {
        font-size: 14px;
    }
    >>> tbody tr:hover {
        background: var(--v-accent-lighten3) !important;
    }
    .default-cursor {
        cursor: default;
    }
</style>
