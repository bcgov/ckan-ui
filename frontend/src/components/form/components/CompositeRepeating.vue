<template>
    <v-col cols=12 class="pb-0 pt-1 mb-4">
        <label class="label">
            {{$tc(displayLabel)}}&nbsp;
            <v-tooltip right v-if="field.help_text">
                <template v-slot:activator="{ on }">
                    <v-icon color="label_colour" v-on="on">mdi-help-circle-outline</v-icon>
                </template>
                <span>{{field.help_text}}</span>
            </v-tooltip>
        </label>
        <div v-if="!editing">
            <div class="mb-2" v-for="(_, repeatedIndex) in model" :key="field.field_name+'-'+repeatedIndex">
                <div v-if="(!hasDisplayed || (model[repeatedIndex].displayed === true))">
                    <div v-for="(sub, key) in field.subfields" :key="field.field_name+'-'+repeatedIndex+'-'+key">
                        <v-row v-if="sub.display_snippet !== null" align="center">
                            <v-col cols=3 class="py-1">
                                <label class="sub-label">{{(sub.label !== '') ? $tc(sub.label) : $tc(sub.field_name)}}</label>
                            </v-col>
                            <v-col cols=9 class="py-1">
                                <span v-if="model[repeatedIndex]">
                                    <span v-if="sub.field_name === 'org'">
                                        <router-link :to="{ name: 'organization_view', params: { organizationId: orgName(model[repeatedIndex][sub.field_name]) }}">{{orgTitle(model[repeatedIndex][sub.field_name])}}</router-link>
                                    </span>
                                    <span v-else-if="sub.field_name === 'url'">
                                        <a :href="model[repeatedIndex][sub.field_name]">{{model[repeatedIndex][sub.field_name]}}</a>
                                    </span>
                                    <span v-else-if="sub.field_name === 'email'">
                                        <a :href="'mailto:'+model[repeatedIndex][sub.field_name]">{{model[repeatedIndex][sub.field_name]}}</a>
                                    </span>
                                    <span v-else-if="sub.preset === 'select'" class="value">{{getDisplayValue(sub, model[repeatedIndex][sub.field_name])}}</span>
                                    <span v-else class="value">{{model[repeatedIndex][sub.field_name]}}</span>
                                </span>
                                <span v-else></span>
                            </v-col>
                        </v-row>
                    </div>
                </div>
            </div>
            <hr>
        </div>
        <div v-else :key="'composite'+field.field_name">
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
                                @change="modified">
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
                                @change="modified">
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
                                        v-on="on"
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
                                @input="modified">
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
                                @input="modified">
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
                                @input="modified">
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
    },
    data() {
        return {
            model: [{}],
            hasDisplayed: false,
            dateMenuOpen: false,
        }
    },
    methods: {
        addRecord: function() {
            let model = {}
            for (let i=0; i<this.field.subfields.length; i++){
                model[this.field.subfields[i].field_name] = "";
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
        }
    },
    computed: {
        displayLabel: function(){
            return this.field.label + (this.editing && this.field.required ? '*' : '');
        },
        ...mapGetters("organization", {
            orgTitle: "titleByID",
            orgName: "nameByID"
        })
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
</style>
