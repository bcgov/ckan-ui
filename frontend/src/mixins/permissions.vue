<script>
    
    import { mapState, mapGetters } from "vuex";

    import { canDelete } from '@/lib/deletionAndVisibilityLogic';
    import { getUserRoleForDataset, getDatasetState } from '@/lib/util';

    export default {
        computed:{
            ...mapGetters("organization", {
                ancestorsByName: "ancestorsByName",
                hasAdmin: "hasAdmin",
                hasEditor: "hasEditor"
            }),

            ...mapState({
                dataset: state => state.dataset.dataset,
                userPermissions: state => state.user.userPermissions,
                sysAdmin: state => state.user.sysAdmin,
                dataLoading: state => state.dataset.resourceLoading,
                schemaLoading: state => state.dataset.schemaLoading,
                userLoading: state => state.user.loading,
                user: state => state.user,
                organizations: state => state.organization.orgList,
                userOrgs: state => state.organization.userO
            }),

            showEdit: function(){
                //editing is assumed to come from the data or property of the component we are mixed in to
                if (!this.dataset.organization){
                    return ( (!this.dataLoading) && (!this.schemaLoading) && (!this.editing) && (!this.userLoading) && ((this.sysAdmin) || (this.hasAdmin)) );
                }

                let ancestors = this.ancestorsByName(this.dataset.organization.name);
                if (this.dataLoading ||
                    this.userLoading ||
                    this.schemaLoading) {
                        return false;
                }
                // this function is used to determine whether the edit button is visible,
                // so with that in mind we say we "can't edit" if we're already editing.
                if (this.editing) return false;

                // sysadmins can edit anything
                if (this.sysAdmin) return true;

                // admins or editors for the current organization or ancestor organizations can edit this record
                return this.userOrgs.filter( userOrg => 
                    [this.dataset.organization.name, ...ancestors].includes(userOrg.name) &&
                    ["admin", "editor"].includes(userOrg.role)).length > 0;
            },

            showDatasetDeleteButton() {
                return this.showDatasetDeleteButtonForResourceOrDataset("dataset");
            },


            showResourceDeleteButton() {
                return this.showDatasetDeleteButtonForResourceOrDataset("resource");
            }

        },

        methods: {

            showDatasetDeleteButtonForResourceOrDataset(resourceOrDataset) {
                if (this.editing || this.createMode) return false;

                let roleForRecord = getUserRoleForDataset(
                    this.dataset, // The user's role is always calculated using the dataset.
                    this.user,
                    this.organizations
                );
                let datasetState;
                try {
                    datasetState = getDatasetState(this.dataset);
                    return canDelete(roleForRecord, resourceOrDataset, datasetState);
                } catch (e) {
                    return false;
                }
            },


            getUserPermissionsForOrganization(organization_name){
                let ancestors = []
                if (organization_name){
                    ancestors = this.ancestorsByName(organization_name);
                }

                let sysAdmin = this.sysAdmin;
                
                let admin = [organization_name, ...ancestors].some(
                    orgName => this.userPermissions[orgName] === "admin"
                );

                let editor = [organization_name, ...ancestors].some(
                    orgName => this.userPermissions[orgName] === "editor"
                );
                
                return {
                    sysAdmin,
                    admin,
                    editor
                };
            },

            getUserPermissionsStringForOrganization(organization_name){
                let {sysAdmin, admin, editor} = this.getUserPermissionsForOrganization(organization_name);

                if (sysAdmin){
                    return "sysadmin"
                }else if (admin){
                    return "admin"
                }else{
                    return editor ? "editor" : "public";
                }
            },
        },
    }
</script>