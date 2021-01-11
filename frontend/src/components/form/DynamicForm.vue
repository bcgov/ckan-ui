<template>
    <v-container>
        <v-row v-for="(field, fieldKey) in processedSchema" :key="'field-'+fieldKey">
                <div v-if="field.label !== ''" style="width: 100%;">
                    <Title
                        v-if="field.preset==='title' || field.field_name === 'title'"
                        :name="field.field_name"
                        :value="values[field.field_name]"
                        :label="field.label"
                        :editing="editing"
                        :placeholder="field.form_placeholder"
                        :field="field"
                        :scope="scope"
                        :disabled="disabled"
                        @edited="(newValue) => { updateValues(field.field_name, newValue) }"
                        >
                    </Title>
                    <Select
                        v-else-if="field.preset==='dataset_organization' && ( (field.field_name=='owner_org') || (field.field_name=='org') )"
                        :name="field.field_name"
                        :value="values[field.field_name]"
                        :label="field.label"
                        :editing="editing"
                        :placeholder="field.form_placeholder"
                        :options="orgArray"
                        :selectableOptions="selectableUserOrgs"
                        emitOnChange="orgSelect"
                        @orgSelect="(newValue) => { updateValues(field.field_name, newValue) }"
                        :field="field"
                        :scope="scope"
                        :disabled="disabled"
                        :translate="false"
                        :includeBlank="field.form_include_blank_choice ? field.form_include_blank_choice : false">
                    </Select>
                    <Select
                        v-else-if="field.preset==='select' && field.field_name=='dataset_type'"
                        :name="field.field_name"
                        :value="values.dataset_type"
                        :label="field.label"
                        :editing="editing"
                        :placeholder="field.form_placeholder"
                        :options="field.choices"
                        emitOnChange="edited"
                        @edited="(newValue) => { updateValues(field.field_name, newValue) }"
                        :field="field"
                        :scope="scope"
                        :disabled="disabled"
                        :includeBlank="field.form_include_blank_choice ? field.form_include_blank_choice : false">
                    </Select>
                    <Select
                        v-else-if="field.preset==='select' && ( (field.field_name=='projection_name') || (field.field_name==='resource_storage_format') )"
                        :name="field.field_name"
                        :value="values[field.field_name]"
                        :label="field.label"
                        :editing="editing"
                        :placeholder="field.form_placeholder"
                        :options="field.choices"
                        emitOnChange="edited"
                        @edited="(newValue) => { updateValues(field.field_name, newValue) }"
                        :field="field"
                        :scope="scope"
                        :disabled="disabled"
                        :translate="false"
                        :includeBlank="field.form_include_blank_choice ? field.form_include_blank_choice : false">
                    </Select>
                    <Select
                        v-else-if="field.preset==='select'"
                        :name="field.field_name"
                        :value="values[field.field_name]"
                        :label="field.label"
                        :editing="editing"
                        :placeholder="field.form_placeholder"
                        :options="field.choices"
                        emitOnChange="edited"
                        @edited="(newValue) => { updateValues(field.field_name, newValue) }"
                        :field="field"
                        :scope="scope"
                        :disabled="disabled"
                        :includeBlank="field.form_include_blank_choice ? field.form_include_blank_choice : false">
                    </Select>
                    <Slug
                        v-else-if="field.preset==='dataset_slug' || field.form_snippet==='slug.html'"
                        :name="field.field_name"
                        :value="values[field.field_name]"
                        :label="field.label"
                        :editing="editing"
                        @edited="(newValue) => { updateValues(field.field_name, newValue) }"
                        :field="field"
                        :disabled="disabled"
                        :scope="scope"
                        :area="area"
                        :placeholder="field.form_placeholder">
                    </Slug>
                    <Markdown
                        v-else-if="field.form_snippet==='markdown.html'"
                        :name="field.field_name"
                        :value="values[field.field_name]"
                        :label="field.label"
                        :editing="editing"
                        @edited="(newValue) => { updateValues(field.field_name, newValue) }"
                        :field="field"
                        :disabled="disabled"
                        :placeholder="field.form_placeholder">
                    </Markdown>
                    <Tags
                        v-else-if="field.preset==='tag_string_autocomplete'"
                        :name="field.field_name"
                        :value="values['tags'] ? values['tags'] : ''"
                        :label="field.label"
                        :editing="editing"
                        :placeholder="field.form_placeholder"
                        :autoCompleteSource="field.form_attrs['data-module-source']"
                        :field="field"
                        :scope="scope"
                        :disabled="disabled"
                        @edited="(newValue) => { updateValues(field.field_name, newValue) }"
                    >
                    </Tags>
                    <Autocomplete
                        v-else-if="field.preset==='autocomplete' && field.choices_helper && field.choices_helper=='available_parent_orgs'"
                        :name="field.field_name"
                        :multi="false"
                        :value="available_parent_org_value"
                        :label="field.label"
                        :editing="editing"
                        :placeholder="field.form_placeholder"
                        :field="field"
                        :scope="scope"
                        :items="selectableUserOrgs"
                        :disabled="disabled"
                        @edited="(newValue) => { updateValues('groups', newValue) }"
                    >
                    </Autocomplete>
                    <Autocomplete
                        v-else-if="field.preset==='autocomplete'"
                        :name="field.field_name"
                        :value="values[field.field_name] ? values[field.field_name] : ''"
                        :label="field.label"
                        :editing="editing"
                        :placeholder="field.form_placeholder"
                        :field="field"
                        :scope="scope"
                        :items="field.choices"
                        :disabled="disabled"
                        @edited="(newValue) => { updateValues(field.field_name, newValue) }"
                    >
                    </Autocomplete>
                    <CompositeRepeating
                        v-else-if="field.preset==='composite_repeating'"
                        :dataset="values"
                        :editing="editing"
                        :orgArray="orgArray"
                        @edited="(newValue) => { updateValues(field.field_name, newValue) }"
                        :scope="scope"
                        :form-defaults="formDefaults[field.field_name]"
                        :disabled="disabled"
                        :field="field">
                    </CompositeRepeating>
                    <CompositeRepeating
                        v-else-if="field.preset==='contact_repeating'"
                        :dataset="values"
                        :editing="editing"
                        :orgArray="orgArray"
                        :scope="scope"
                        :disabled="disabled"
                        :form-defaults="formDefaults.contacts"
                        @edited="(newValue) => { updateValues(field.field_name, newValue) }"
                        :field="field">
                    </CompositeRepeating>
                    <License
                        v-else-if="field.form_snippet==='license.html'"
                        :name="field.field_name"
                        :value="values[field.field_name]"
                        :label="field.label"
                        :editing="editing"
                        :disabled="disabled"
                        @edited="(newValue) => { updateValues(field.field_name, newValue) }"
                        :field="field"
                        :scope="scope"
                        :placeholder="field.form_placeholder">
                    </License>
                    <Composite
                        v-else-if="field.preset==='composite'"
                        :editing="editing"
                        :value="values[field.field_name]"
                        :scope="scope"
                        :disabled="disabled"
                        @edited="(newValue) => { updateValues(field.field_name, newValue) }"
                        :field="field">
                    </Composite>
                    <TableRepeating
                        v-show="!editing"
                        v-else-if="field.display_snippet==='bcgw_details.html'"
                        :editing="false"
                        :disabled="disabled"
                        :scope="scope"
                        :field="field"
                        :dataset="values"
                        :orgArray="orgArray">
                    </TableRepeating>
                    <TextInput
                        v-else-if="textFields.indexOf(field.field_name)>=0"
                        :name="field.field_name"
                        :value="values[field.field_name]"
                        :label="field.label"
                        @edited="(newValue) => { updateValues(field.field_name, newValue) }"
                        :field="field"
                        :disabled="disabled"
                        :scope="scope"
                        :editing="editing">
                    </TextInput>
                    <Json
                        v-else-if="field.form_snippet==='json.html'"
                        :name="field.field_name"
                        :value="values[field.field_name]"
                        :label="field.label"
                        @edited="(newValue) => { updateValues(field.field_name, newValue) }"
                        :field="field"
                        :disabled="disabled"
                        :editing="editing">
                    </Json>
                    <Upload
                        v-else-if="field.form_snippet==='upload.html'"
                        :name="field.field_name"
                        :value="values[field.field_name]"
                        :label="field.label"
                        @edited="(isUrl, newValue) => { updateUploadValues(field.field_name, isUrl, newValue) }"
                        :field="field"
                        :disabled="disabled"
                        :scope="scope"
                        :parentObject="values"
                        :editing="editing">
                    </Upload>
                    <ImageUrl
                        v-else-if="field.label === 'Image URL'"
                        :name="field.field_name"
                        :value="values[field.field_name]"
                        :label="field.label"
                        @edited="(isUrl, newValue) => { updateUploadValues(field.field_name, isUrl, newValue) }"
                        :field="field"
                        :disabled="disabled"
                        :scope="scope"
                        :parentObject="values"
                        :editing="editing"
                        :placeholder="field.form_placeholder">
                    </ImageUrl>
                    <Checkbox
                        v-else-if="field.field_name==='private'"
                        v-show="loggedIn"
                        :name="field.field_name"
                        :value="values[field.field_name]"
                        :label="field.label"
                        :editing="editing"
                        :field="field"
                        :scope="scope"
                        trueDisplay="yes"
                        falseDisplay="no"
                        :disabled="disabled"
                        @edited="(newValue) => { updateValues(field.field_name, newValue) }"
                        >
                    </Checkbox>

                    <!-- <code>{{fieldKey}} - {{field}} - {{values[field.field_name]}}</code> -->
                    <code v-else>Oops, we don't know how to render {{fieldKey}} - {{field}} - {{values[field.field_name]}}, please report this entire message to our dev team</code>
                </div>
        </v-row>
        <!-- <span v-if="!editing">
            <v-col
            cols=6
            v-for="(field, fieldKey) in nonSchemaFields"
            :key="'field-'+fieldKey">
                <TextInput
                    :name="field"
                    :value="dataset[field]"
                    :label="field"
                    :field="{required: false}"
                    :editing="editing">
            </TextInput>
            </v-col>
        </span> -->
    </v-container>
</template>

<script>
import { mapState } from "vuex";
import Vue from 'vue';

import Title from './components/Title';
import Select from './components/Select';
import Slug from './components/Slug';
import Markdown from './components/Markdown';
import Tags from './components/Tags';
import Autocomplete from './components/Autocomplete';
import Composite from './components/Composite';
import CompositeRepeating from './components/CompositeRepeating';
import License from './components/License';
import TextInput from './components/TextInput';
import Upload from './components/Upload';
import Json from "./components/Json";
import Checkbox from "./components/Checkbox";
import ImageUrl from "./components/ImageUrl";
import TableRepeating from "./components/TableRepeating";

export default {
    components: {
        Title: Title,
        Select: Select,
        Slug: Slug,
        Markdown: Markdown,
        Tags: Tags,
        Composite: Composite,
        CompositeRepeating: CompositeRepeating,
        License: License,
        TextInput: TextInput,
        Upload: Upload,
        Json: Json,
        Autocomplete: Autocomplete,
        Checkbox: Checkbox,
        ImageUrl: ImageUrl,
        TableRepeating: TableRepeating
    },
    props: {
        schema: Array,
        textFields: Array,
        editing: Boolean,
        values: Object,
        loggedIn: {
            type: Boolean,
            default: false
        },
        scope: {
            type: String,
            default: 'dataset'
        },
        selectableUserOrgs: {
            type: Array,
            default: () => {return [];}
        },
        disabled: {
            type: Boolean,
            default: false
        },
        area: {
            type: String,
            default: "/dataset/"
        },
        formDefaults: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
        }
    },

    computed:{
        ...mapState({
            orgList: state => state.organization.orgList,
            user: state => state.user.authUser,
            userPermissions: state => state.user.userPermissions,
            sysAdmin: state => state.user.sysAdmin,
            isAdmin: state => state.user.isAdmin,
        }),

        available_parent_org_value: function(){
            let val = (this.values.groups && this.values.groups[0] && this.values.groups[0].name) ? this.values.groups[0].name : ""
            if (val.length == 0){
                val = (this.values.groups && this.values.groups[0]) ? this.values.groups[0] : ""
            }
            return val;
        },

        orgArray: function(){
            let orgs = [];
            if (this.orgList){
                let keys = Object.keys(this.orgList);
                for (let i=0; i<keys.length; i++){
                    let item = {};
                    item.label = keys[i];
                    item.value = this.orgList[keys[i]].id;
                    orgs.push(item);
                    for (let j=0; j<this.orgList[keys[i]].children.length; j++){
                        let child = {};
                        child.label = this.orgList[keys[i]].children[j].title;
                        child.value = this.orgList[keys[i]].children[j].id;
                        orgs.push(child);
                    }
                }
            }
            return orgs;
        },

        processedSchema: function(){
            return this.schema ? this.schema.filter( field => {
                        // Only show on display if display snippet not specifically set to null
                return ((!this.editing && field.display_snippet !== null)
                            // Only show on editing if form snippet not specifically set to null
                            || (this.editing && field.form_snippet !== null))
                        // If field is conditional check if condition is met
                        && (typeof(field.conditional_field) === 'undefined'
                            || typeof(field.conditional_values) === 'undefined'
                            || (field.conditional_values.indexOf(this.values[field.conditional_field]) >= 0))
                        // If there are view permissions verify them
                        && (typeof(field.visibility) === 'undefined'
                            || field.visibility === 'user' && this.user
                            || field.visibility === 'editor' && this.user
                                && (this.sysAdmin || this.isAdmin
                                    || (this.values.organization && this.userPermissions[this.values.organization.name] === "editor")))
            }) : [];
        }
    },
    methods: {
        updateValues(field, newValue){
            Vue.set(this.values, field, newValue);
            this.$emit("updated", field, newValue);
        },
        updateUploadValues(field, isUrl, newValue){
            this.$emit("updated", "isUrl", isUrl);
            this.$emit("updated", field, newValue);
        }
    },
}
</script>

<style>
label{
    font-weight: bold;
}
</style>
