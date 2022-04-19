<template>
    <v-col v-if="editing || hasValues" cols=12 class="py-2 mb-4">
        <label class="label">
            {{$tc(displayLabel)}}
        </label>
        <div v-if="!editing">
            <div v-if="(!hasDisplayed || (model[repeatedIndex].displayed === true))">
                <v-dialog v-if="!editing" v-model="expandDialog" width="100%">
                    <template v-slot:activator="{ on }">
                        <v-row>
                            <v-col cols=2>
                                <v-btn v-on="on" text small color="label_colour">
                                    <v-icon>mdi-fullscreen</v-icon>&nbsp;{{$tc("Expand")}}
                                </v-btn>
                            </v-col>
                        </v-row>
                    </template>
                    <v-card>
                        <v-card-title class="header">
                            <span>{{$tc(displayLabel)}}</span>
                            <v-spacer></v-spacer>
                            <v-btn text small depressed class="noHover" @click="expandDialog = false"><v-icon color="text">mdi-close</v-icon></v-btn>
                        </v-card-title>
                        <v-card-text>
                           <v-container>
                               <v-row>
                                   <v-col cols=12>
                                       <v-data-table
                                            :headers="headers"
                                            :items="model"
                                            :items-per-page="20"
                                        ></v-data-table>
                                   </v-col>
                               </v-row>
                           </v-container>
                        </v-card-text>
                    </v-card>
                </v-dialog>
                <v-data-table
                    dense
                    class="tableText"
                    :headers="headers"
                    :items="model"
                    :items-per-page="5"
                ></v-data-table>
            </div>
            <hr>
        </div>
        <div v-else :key="'composite'+field.field_name+rerenderKey">
            <span class="help-text">{{field.help_text}}</span>
            <div v-for="(_, repeatedIndex) in model" :key="field.field_name+'-'+repeatedIndex">
                <v-row v-for="(sub, key) in field.subfields" :key="field.field_name+'-'+repeatedIndex+'-'+key" align="center">
                    <v-col cols=2 class="pb-0">
                        <label class="sub-label">{{(sub.label !== '') ? $tc(sub.label) : $tc(sub.field_name)}}{{(sub.required) ? '*' : ''}}</label>
                    </v-col>
                    <v-col cols=10 class="pb-0">
                        <ValidationProvider v-if="sub.preset=='multiple_checkbox'" :rules="sub.required ? 'required' : ''" v-slot="{ errors }" :name="(sub.label !== '') ? $tc(sub.label) : $tc(sub.field_name)">
                            <v-checkbox
                                dense
                                class="mt-0"
                                :name="field.field_name+'['+repeatedIndex+']'+'.'+sub.field_name"
                                v-model="model[repeatedIndex][sub.field_name]"
                                :error-messages="errors.length > 0 ? [errors[0]] : []"
                                :disabled="disabled"
                                hide-details="auto"
                                @change="modified">
                            </v-checkbox>
                        </ValidationProvider>

                        <ValidationProvider v-else-if="sub.field_name==='org'" :rules="sub.required ? 'required' : ''" v-slot="{ errors }" :name="(sub.label !== '') ? $tc(sub.label) : $tc(sub.field_name)">
                            <v-select
                                :name="field.field_name+'['+repeatedIndex+']'+'.'+sub.field_name"
                                v-model="model[repeatedIndex][sub.field_name]"
                                :placeholder="sub.form_placeholder"
                                :items="orgArray"
                                item-text="label"
                                :disabled="disabled"
                                item-value="value"
                                outlined dense
                                hide-details="auto"
                                :error-messages="errors.length > 0 ? [errors[0]] : []"
                                @change="modified"
                                background-color="text">
                            </v-select>
                        </ValidationProvider>

                        <ValidationProvider v-else-if="sub.preset==='select'" :rules="sub.required ? 'required' : ''" v-slot="{ errors }" :name="(sub.label !== '') ? $tc(sub.label) : $tc(sub.field_name)">
                            <v-select
                                :name="field.field_name+'['+repeatedIndex+']'+'.'+sub.field_name"
                                v-model="model[repeatedIndex][sub.field_name]"
                                :placeholder="sub.form_placeholder"
                                :items="sub.choices"
                                item-text="label"
                                item-value="value"
                                outlined dense
                                hide-details="auto"
                                :disabled="disabled"
                                :error-messages="errors.length > 0 ? [errors[0]] : []"
                                @change="modified"
                                background-color="text">
                            </v-select>
                        </ValidationProvider>

                        <ValidationProvider v-else-if="field.field_name.toLowerCase().indexOf('date')>=0" :rules="(sub.required ? 'required|' : '') + 'date_format:yyyy-mm-dd'" v-slot="{ errors }" :name="(sub.label !== '') ? $tc(sub.label) : $tc(sub.field_name)">
                            <!-- <v-text-field
                                outlined dense
                                hide-details="auto"
                                :name="field.field_name+'['+repeatedIndex+'].'+sub.field_name"
                                v-model="model[repeatedIndex][sub.field_name]"
                                :placeholder="sub.form_placeholder"
                                :error-messages="errors.length > 0 ? [errors[0]] : []"
                                :disabled="disabled"
                                @input="modified">
                            </v-text-field> -->
                            <v-menu
                                :ref="field.field_name+'['+repeatedIndex+'].'+sub.field_name"
                                :nudge-right="40"
                                transition="scale-transition"
                                offset-y
                                min-width="290px"
                            >
                                <template v-slot:activator="{ on }">
                                    <v-text-field
                                        outlined dense
                                        hide-details="auto"
                                        :name="field.field_name+'['+repeatedIndex+'].'+sub.field_name"
                                        v-model="model[repeatedIndex][sub.field_name]"
                                        :placeholder="sub.form_placeholder"
                                        :error-messages="errors.length > 0 ? [errors[0]] : []"
                                        :disabled="disabled"
                                        readonly
                                        clearable
                                        @click:clear="clearField(repeatedIndex, sub.field_name);"
                                        v-on="on"
                                        background-color="text"
                                    ></v-text-field>
                                </template>
                                <v-date-picker :disabled="disabled" v-model="model[repeatedIndex][sub.field_name]" @input="modified(field.field_name+'['+repeatedIndex+'].'+sub.field_name);"></v-date-picker>
                            </v-menu>
                        </ValidationProvider>

                        <ValidationProvider v-else-if="sub.field_name.toLowerCase().indexOf('email')>=0" :rules="(sub.required ? 'required|' : '') + 'email'" v-slot="{ errors }" :name="(sub.label !== '') ? $tc(sub.label) : $tc(sub.field_name)">
                            <v-text-field
                                outlined dense
                                hide-details="auto"
                                :name="field.field_name+'['+repeatedIndex+'].'+sub.field_name"
                                v-model="model[repeatedIndex][sub.field_name]"
                                :placeholder="sub.form_placeholder"
                                :error-messages="errors.length > 0 ? [errors[0]] : []"
                                :disabled="disabled"
                                @input="modified"
                                background-color="text">
                            </v-text-field>
                        </ValidationProvider>

                        <ValidationProvider v-else-if="sub.field_name.toLowerCase().indexOf('url')>=0" :rules="{required: !!sub.required, url: {require_tld: true, require_host: true}}" v-slot="{ errors }" :name="(sub.label !== '') ? $tc(sub.label) : $tc(sub.field_name)">
                            <v-text-field
                                outlined dense
                                hide-details="auto"
                                :name="field.field_name+'['+repeatedIndex+'].'+sub.field_name"
                                v-model="model[repeatedIndex][sub.field_name]"
                                :placeholder="sub.form_placeholder"
                                :disabled="disabled"
                                :error-messages="errors.length > 0 ? [errors[0]] : []"
                                @input="modified"
                                background-color="text">
                            </v-text-field>
                        </ValidationProvider>

                        <ValidationProvider v-else :rules="sub.required ? 'required' : ''" v-slot="{ errors }" :name="(sub.label !== '') ? $tc(sub.label) : $tc(sub.field_name)">
                            <v-text-field
                                outlined dense
                                hide-details="auto"
                                :name="field.field_name+'['+repeatedIndex+']'+'.'+sub.field_name"
                                v-model="model[repeatedIndex][sub.field_name]"
                                :placeholder="sub.form_placeholder"
                                :disabled="disabled"
                                :error-messages="errors.length > 0 ? [errors[0]] : []"
                                @input="modified"
                                background-color="text">
                            </v-text-field>
                        </ValidationProvider>
                    </v-col>
                </v-row>
                <v-row class="mr-2" v-if="model.length > 1">
                    <v-spacer></v-spacer>
                    <v-btn right tabindex="-1" text icon small @click="removeRecord(repeatedIndex)">
                        <v-icon>mdi-trash-can-outline</v-icon>
                    </v-btn>
                </v-row>
            </div>
            <v-row>
                <v-col cols=12>
                    <v-btn tabindex="-1" text class="ml-0" color="primary" @click="addRecord">
                        Add {{displayLabel}}
                    </v-btn>
                </v-col>
            </v-row>
            <hr>
        </div>
    </v-col>
</template>

<script>
import { mapGetters } from "vuex";
export default {

    props: {
        field: Object,
        dataset: Object,
        orgArray: Array,
        editing: Boolean,
        scope: String,
        disabled: {
            type: Boolean,
            default: false
        },
        formDefaults: {
            type: Object,
            default: () => {}
        },
    },

    watch: {
        fieldValue: function(){
            this.updateValues();
        },
    },

    data() {
        return {
            model: [{}],
            hasDisplayed: false,
            dateMenuOpen: false,
            rerenderKey: 0,
            expandDialog: false,
            hasValues: false
        }
    },

    methods: {

        updateValues: function(){
            this.rerenderKey++;
            if (this.dataset[this.field.field_name]){
                let value = JSON.parse(this.dataset[this.field.field_name]);
                for (let i=0; i<value.length; i++){
                    this.model[i] = {};
                    for (let j=0; j<this.field.subfields.length; j++){
                        if (value && value[i] && value[i][this.field.subfields[j].field_name]){
                            this.model[i][this.field.subfields[j].field_name] = value[i][this.field.subfields[j].field_name];
                        }else{
                            this.model[i][this.field.subfields[j].field_name] = "";
                        }
                    }
                }
            }
        },
        
        addRecord: function() {
            let model = {}
            for (let i=0; i<this.field.subfields.length; i++){
                if ( (typeof(this.formDefaults) !== "undefined") && (this.formDefaults[this.field.subfields[i].field_name]) ){
                    model[this.field.subfields[i].field_name] = this.formDefaults[this.field.subfields[i].field_name];
                }else{
                    model[this.field.subfields[i].field_name] = "";
                }
                if (this.field.subfields[i].field_name.toLowerCase() === "displayed"){
                    this.hasDisplayed = true;
                }
            }
            this.model.push(model);
        },
        removeRecord: function(index) {
            this.model.splice(index,1);
        },

        modified: function(refName) {
            if ( (typeof(refName) !== "undefined") && (typeof(this.$refs[refName]) !== "undefined") ){
                this.$refs[refName] = false;
            }
            this.$emit('edited', JSON.stringify(this.model));
        },

        getDisplayValue: function(field, value) {
            if (field.choices) {
                for (let choice of field.choices) {
                    if (choice.value === value) {
                        return choice.label;
                    }
                }
            }
            return value;
        },
        clearField: function(index, field) {
            this.model[index][field] = '';
            this.$emit('edited', JSON.stringify(this.model));
        }
    },
    computed: {
        displayLabel: function(){
            let required = ( (this.field.required) || (this.field.validators && this.field.validators.indexOf('conditional_required')!==-1) )
            return this.field.label + (this.editing && required ? '*' : '');
        },

        headers: function(){
            var head = [];
            for (let i=0; i<this.field.subfields.length; i++){
                head.push({
                    text: this.field.subfields[i].label,
                    value: this.field.subfields[i].field_name,
                });
            }
            return head;
        },

        ...mapGetters("organization", {
            orgTitle: "titleByID",
            orgName: "nameByID"
        }),
        fieldValue: function(){
            return this.dataset[this.field.field_name];
        }
    },
    mounted(){
        if (this.dataset[this.field.field_name]){
            //THIS IS REQUIRED OR NOTHING WORKS FOR SOME REASON...:(
            this.model = [{}];
            let value = JSON.parse(this.dataset[this.field.field_name]);
            for (let i=0; i<value.length; i++){
                this.model[i] = {};
                for (let j=0; j<this.field.subfields.length; j++){
                    if (value && value[i] && value[i][this.field.subfields[j].field_name]){
                        this.model[i][this.field.subfields[j].field_name] = value[i][this.field.subfields[j].field_name];
                        this.hasValues = true;
                    }else{
                        this.model[i][this.field.subfields[j].field_name] = "";
                    }
                }
            }
            this.$emit('edited', JSON.stringify(this.model));
        }
    },
};
</script>

<style scoped>
    label.label{
        font-size: 16px;
        font-weight: bold;
        color: var(--v-faded_text-base);
    }
    label.sub-label{
        font-size: 16px;
        font-weight: bold;
        color: var(--v-faded_text-base);
    }
    .value{
        font-size: 16px;
        color: var(--v-faded_text-base);
    }
    hr{
        color: var(--v-icon-base);
        border-bottom: 0px;
    }
    .help-text {
        font-size: 12px;
        color: rgba(0, 0, 0, 0.6);
    }
</style>

<style>
    .tableText.v-data-table>.v-data-table__wrapper>table>tbody>tr>td{
        font-size: 10px;
    }
</style>
