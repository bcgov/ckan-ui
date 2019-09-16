<template>
    <v-layout row wrap>
        <v-flex 
        v-bind:class="'xs'+( ( (editing) || (field.preset==='title') || (field.form_snippet==='markdown.html') || (field.preset==='dataset_slug') ) ? '12' : '6')" 
        v-for="(field, fieldKey) in schema" 
        :key="'field-'+fieldKey">
            <span v-if="(!field.conditional_field || !field.conditional_values) || (field.conditional_values.indexOf(values[field.conditional_field]) >= 0)">
                <Title 
                    v-if="field.preset==='title'"
                    :name="field.field_name" 
                    :value="values[field.field_name]" 
                    :label="field.label"
                    :editing="editing"
                    :placeholder="field.form_placeholder"
                    :field="field"
                    :scope="scope"
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
                    :options="topOrgArray"
                    emitOnChange="orgSelect"
                    @orgSelect="(newValue) => { updateValues(field.field_name, newValue) }"
                    :field="field"
                    :scope="scope"
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
                    :includeBlank="field.form_include_blank_choice ? field.form_include_blank_choice : false">
                </Select>
                <Slug 
                    v-else-if="field.preset==='dataset_slug'" 
                    :name="field.field_name" 
                    :value="values[field.field_name]" 
                    :label="field.label"
                    :editing="editing"
                    @edited="(newValue) => { updateValues(field.field_name, newValue) }"
                    :field="field"
                    :scope="scope"
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
                    @edited="(newValue) => { updateValues(field.field_name, newValue) }"
                >
                </Tags>
                <CompositeRepeating 
                    v-else-if="field.preset==='composite_repeating'"
                    :dataset="values"
                    :editing="editing"
                    :orgArray="orgArray"
                    @edited="(newValue) => { updateValues(field.field_name, newValue) }"
                    :scope="scope"
                    :field="field">
                </CompositeRepeating>
                <CompositeRepeating 
                    v-else-if="field.preset==='contact_repeating'"
                    :dataset="values"
                    :editing="editing"
                    :orgArray="orgArray"
                    :scope="scope"
                    @edited="(newValue) => { updateValues(field.field_name, newValue) }"
                    :field="field">
                </CompositeRepeating>
                <License 
                    v-else-if="field.form_snippet==='license.html'"
                    :name="field.field_name"
                    :value="values[field.field_name]" 
                    :label="field.label"
                    :editing="editing"
                    @edited="(newValue) => { updateValues(field.field_name, newValue) }"
                    :field="field"
                    :scope="scope"
                    :placeholder="field.form_placeholder">
                </License>
                <Composite
                    v-else-if="field.preset==='composite'"
                    :editing="editing"
                    :value="values"
                    :scope="scope"
                    @edited="(newValue) => { updateValues(field.field_name, newValue) }"
                    :field="field">
                </Composite>
                <TextInput
                    v-else-if="textFields.indexOf(field.field_name)>=0"
                    :name="field.field_name" 
                    :value="values[field.field_name]" 
                    :label="field.label"
                    @edited="(newValue) => { updateValues(field.field_name, newValue) }"
                    :field="field"
                    :editing="editing">
                </TextInput>
                <Json
                    v-else-if="field.form_snippet==='json.html'"
                    :name="field.field_name" 
                    :value="values[field.field_name]" 
                    :label="field.label"
                    @edited="(newValue) => { updateValues(field.field_name, newValue) }"
                    :field="field"
                    :editing="editing">
                </Json>
                <Upload
                    v-else-if="field.form_snippet==='upload.html'"
                    :name="field.field_name" 
                    :value="values[field.field_name]" 
                    :label="field.label"
                    @edited="(newValue) => { updateValues(field.field_name, newValue) }"
                    :field="field"
                    :scope="scope"
                    :editing="editing">
                </Upload>

                <!-- <code>{{fieldKey}} - {{field}} - {{values[field.field_name]}}</code> -->
                <code v-else>Oops, we don't know how to render {{fieldKey}} - {{field}} - {{values[field.field_name]}}, please report this entire message to our dev team</code>
            </span>
        </v-flex>
        <!-- <span v-if="!editing">
            <v-flex 
            xs6 
            v-for="(field, fieldKey) in nonSchemaFields" 
            :key="'field-'+fieldKey">
                <TextInput
                    :name="field" 
                    :value="dataset[field]" 
                    :label="field"
                    :field="{required: false}"
                    :editing="editing">
            </TextInput>
            </v-flex>
        </span> -->
    </v-layout>
</template>

<script>
import { mapState } from "vuex";

import Title from './components/Title';
import Select from './components/Select';
import Slug from './components/Slug';
import Markdown from './components/Markdown';
import Tags from './components/Tags';
import Composite from './components/Composite';
import CompositeRepeating from './components/CompositeRepeating';
import License from './components/License';
import TextInput from './components/TextInput';
import Upload from './components/Upload';
import Json from "./components/Json"

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
    },
    props: {
        schema: Array,
        textFields: Array,
        editing: Boolean,
        values: Object,
        scope: {
            type: String,
            default: 'dataset'
        }
    },
    data() {
        return {

        }
    },
    computed:{
        ...mapState({
            orgList: state => state.organization.orgList,
        }),
        topOrgArray: function(){
            let orgs = [];
            if (this.orgList){
                let keys = Object.keys(this.orgList);
                for (let i=0; i<keys.length; i++){
                    let item = {};
                    item.label = keys[i];
                    item.value = this.orgList[keys[i]].id;
                    orgs.push(item);
                }
            }
            return orgs;
        },

        subOrgArray: function(){
            return this.getSubOrgs(this.dataset.org);
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
    },
    methods: {
        updateValues(field, newValue){
            this.$emit("updated", field, newValue);
        },
    },
}
</script>

<style scoped>
</style>