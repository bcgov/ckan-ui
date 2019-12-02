<template>
    <v-card>
        <v-card-title>{{$tc(displayLabel)}}</v-card-title>
        <v-card-text>
            <div v-if="!editing">
                <v-card class="mb-2" v-for="(_, repeatedIndex) in model" :key="field.field_name+'-'+repeatedIndex">
                    <v-card-text v-if="!hasDisplayed || !model[repeatedIndex].displayed">
                        <div v-for="(sub, key) in field.subfields" :key="field.field_name+'-'+repeatedIndex+'-'+key">
                            <span v-if="sub.field_name !== 'displayed'">
                                <label>{{(sub.label !== '') ? $tc(sub.label) : $tc(sub.field_name)}}:</label>
                                <span v-if="model[repeatedIndex]">{{model[repeatedIndex][sub.field_name]}}</span>
                                <span v-else></span>
                            </span>
                        </div>
                    </v-card-text>
                </v-card>
            </div>
            <div v-else :key="'composite'+field.field_name">
                <v-card v-for="(_, repeatedIndex) in model" :key="field.field_name+'-'+repeatedIndex">
                    <v-card-actions v-if="repeatedIndex > 0">
                        <v-spacer></v-spacer>
                        <v-btn tabindex="-1" fab small color="error" @click="removeRecord(repeatedIndex)">
                            <v-icon>remove</v-icon>
                        </v-btn>
                    </v-card-actions>
                    <v-card-text>
                        <div v-for="(sub, key) in field.subfields" :key="field.field_name+'-'+repeatedIndex+'-'+key">
                            <ValidationProvider v-if="sub.preset=='multiple_checkbox'" :rules="sub.required ? 'required' : ''" v-slot="{ errors }" :name="(sub.label !== '') ? $tc(sub.label) : $tc(sub.field_name)">
                                <v-checkbox
                                    :name="field.field_name+'['+repeatedIndex+']'+'.'+sub.field_name"
                                    v-model="model[repeatedIndex][sub.field_name]"
                                    :label="((sub.label !== '') ? $tc(sub.label) : $tc(sub.field_name)) + (sub.required ? '*' : '')"
                                    :error-messages="errors.length > 0 ? [errors[0]] : []"
                                    :disabled="disabled"
                                    @change="modified">
                                </v-checkbox>
                            </ValidationProvider>

                            <ValidationProvider v-else-if="sub.preset==='edc_org'" :rules="sub.required ? 'required' : ''" v-slot="{ errors }" :name="(sub.label !== '') ? $tc(sub.label) : $tc(sub.field_name)">
                                <v-select
                                    :name="field.field_name+'['+repeatedIndex+']'+'.'+sub.field_name"
                                    v-model="model[repeatedIndex][sub.field_name]"
                                    :label="((sub.label !== '') ? sub.label : sub.field_name) + (sub.required ? '*' : '')"
                                    :placeholder="sub.form_placeholder"
                                    :items="orgArray"
                                    item-text="label"
                                    item-value="value"
                                    :disabled="disabled"
                                    outline
                                    :error-messages="errors.length > 0 ? [errors[0]] : []"
                                    @change="modified">
                                </v-select>
                            </ValidationProvider>

                            <ValidationProvider v-else-if="sub.field_name==='org'" :rules="sub.required ? 'required' : ''" v-slot="{ errors }" :name="(sub.label !== '') ? $tc(sub.label) : $tc(sub.field_name)">
                                <v-select
                                    :name="field.field_name+'['+repeatedIndex+']'+'.'+sub.field_name"
                                    v-model="model[repeatedIndex][sub.field_name]"
                                    :label="((sub.label !== '') ? sub.label : sub.field_name) + (sub.required ? '*' : '')"
                                    :placeholder="sub.form_placeholder"
                                    :items="orgArray"
                                    item-text="label"
                                    :disabled="disabled"
                                    item-value="value"
                                    outline
                                    :error-messages="errors.length > 0 ? [errors[0]] : []"
                                    @change="modified">
                                </v-select>
                            </ValidationProvider>

                            <ValidationProvider v-else-if="sub.preset==='select'" :rules="sub.required ? 'required' : ''" v-slot="{ errors }" :name="(sub.label !== '') ? $tc(sub.label) : $tc(sub.field_name)">
                                <v-select
                                    :name="field.field_name+'['+repeatedIndex+']'+'.'+sub.field_name"
                                    v-model="model[repeatedIndex][sub.field_name]"
                                    :label="((sub.label !== '') ? $tc(sub.label) : $tc(sub.field_name)) + (sub.required ? '*' : '')"
                                    :placeholder="sub.form_placeholder"
                                    :items="sub.choices"
                                    item-text="label"
                                    item-value="value"
                                    outline
                                    :disabled="disabled"
                                    :error-messages="errors.length > 0 ? [errors[0]] : []"
                                    @change="modified">
                                </v-select>
                            </ValidationProvider>

                            <ValidationProvider v-else-if="field.field_name.toLowerCase().indexOf('date')>=0" :rules="(sub.required ? 'required|' : '') + 'date_format:yyyy-mm-dd'" v-slot="{ errors }" :name="(sub.label !== '') ? $tc(sub.label) : $tc(sub.field_name)">
                                <v-text-field
                                    outline
                                    :name="field.field_name+'['+repeatedIndex+'].'+sub.field_name"
                                    v-model="model[repeatedIndex][sub.field_name]"
                                    :label="((sub.label !== '') ? $tc(sub.label) : $tc(sub.field_name)) + (sub.required ? '*' : '')"
                                    :placeholder="sub.form_placeholder"
                                    :error-messages="errors.length > 0 ? [errors[0]] : []"
                                    :disabled="disabled"
                                    @input="modified">
                                </v-text-field>
                            </ValidationProvider>

                            <ValidationProvider v-else-if="sub.field_name.toLowerCase().indexOf('email')>=0" :rules="(sub.required ? 'required|' : '') + 'email'" v-slot="{ errors }" :name="(sub.label !== '') ? $tc(sub.label) : $tc(sub.field_name)">
                                <v-text-field
                                    outline
                                    :name="field.field_name+'['+repeatedIndex+'].'+sub.field_name"
                                    v-model="model[repeatedIndex][sub.field_name]"
                                    :label="((sub.label !== '') ? $tc(sub.label) : $tc(sub.field_name)) + (sub.required ? '*' : '')"
                                    :placeholder="sub.form_placeholder"
                                    :error-messages="errors.length > 0 ? [errors[0]] : []"
                                    :disabled="disabled"
                                    @input="modified">
                                </v-text-field>
                            </ValidationProvider>

                            <ValidationProvider v-else-if="sub.field_name.toLowerCase().indexOf('url')>=0" :rules="{required: !!sub.required, url: {require_tld: true, require_host: true}}" v-slot="{ errors }" :name="(sub.label !== '') ? $tc(sub.label) : $tc(sub.field_name)">
                                <v-text-field
                                    outline
                                    :name="field.field_name+'['+repeatedIndex+'].'+sub.field_name"
                                    v-model="model[repeatedIndex][sub.field_name]"
                                    :label="((sub.label !== '') ? $tc(sub.label) : $tc(sub.field_name)) + (sub.required ? '*' : '')"
                                    :placeholder="sub.form_placeholder"
                                    :disabled="disabled"
                                    :error-messages="errors.length > 0 ? [errors[0]] : []"
                                    @input="modified">
                                </v-text-field>
                            </ValidationProvider>

                            <ValidationProvider v-else :rules="sub.required ? 'required' : ''" v-slot="{ errors }" :name="(sub.label !== '') ? $tc(sub.label) : $tc(sub.field_name)">
                                <v-text-field
                                    outline
                                    
                                    :name="field.field_name+'['+repeatedIndex+']'+'.'+sub.field_name"
                                    v-model="model[repeatedIndex][sub.field_name]"
                                    :label="((sub.label !== '') ? $tc(sub.label) : $tc(sub.field_name)) + (sub.required ? '*' : '')"
                                    :placeholder="sub.form_placeholder"
                                    :disabled="disabled"
                                    :error-messages="errors.length > 0 ? [errors[0]] : []"
                                    @input="modified">
                                </v-text-field>
                            </ValidationProvider>
                        </div>
                    </v-card-text>
                    <v-card-actions v-if="repeatedIndex == (model.length-1)">
                        <v-spacer></v-spacer>
                        <v-btn tabindex="-1" fab small color="primary" @click="addRecord">
                            <v-icon>add</v-icon>
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </div>
        </v-card-text>
    </v-card>
</template>

<script>
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
        }
    },
    methods: {
        addRecord: function(){
            let model = {}
            for (let i=0; i<this.field.subfields.length; i++){
                model[this.field.subfields[i].field_name] = "";
                if (this.field.subfields[i].field_name.toLowerCase() === "displayed"){
                    this.hasDisplayed = true;
                }
            }
            this.model.push(model);
        },

        removeRecord: function(index){
            this.model.splice(index,1);
        },

        modified: function(){
            this.$emit('edited', JSON.stringify(this.model));
        }
    },
    computed: {
        displayLabel: function(){
            return this.field.label + (this.editing && this.field.required ? '*' : '');
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
</style>