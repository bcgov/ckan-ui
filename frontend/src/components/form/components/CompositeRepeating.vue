<template>
    <v-card>
        <v-card-title>{{$tc(displayLabel)}}</v-card-title>
        <v-card-text>
            <div v-if="!editing">
                <span v-for="(_, repeatedIndex) in model" :key="field.field_name+'-'+repeatedIndex">
                    <div v-for="(sub, key) in field.subfields" :key="field.field_name+'-'+repeatedIndex+'-'+key">
                        <label>{{(sub.label !== '') ? $tc(sub.label) : $tc(sub.field_name)}}:</label>
                        <span v-if="model[repeatedIndex]">{{model[repeatedIndex][sub.field_name]}}</span>
                        <span v-else></span>
                    </div>
                </span>
            </div>
            <div v-else :key="'composite'+field.field_name">
                <v-card v-for="(_, repeatedIndex) in model" :key="field.field_name+'-'+repeatedIndex">
                    <v-card-actions v-if="repeatedIndex > 0">
                        <v-spacer></v-spacer>
                        <v-btn fab small color="error" @click="removeRecord(repeatedIndex)">
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
                                    @change="$emit('edited', model)">
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
                                    outline
                                    :error-messages="errors.length > 0 ? [errors[0]] : []"
                                    @change="$emit('edited', model)">
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
                                    item-value="value"
                                    outline
                                    :error-messages="errors.length > 0 ? [errors[0]] : []"
                                    @change="$emit('edited', model)">
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
                                    :error-messages="errors.length > 0 ? [errors[0]] : []"
                                    @change="$emit('edited', model)">
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
                                    @input="$emit('edited', model)">
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
                                    @input="$emit('edited', model)">
                                </v-text-field>
                            </ValidationProvider>

                            <ValidationProvider v-else :rules="sub.required ? 'required' : ''" v-slot="{ errors }" :name="(sub.label !== '') ? $tc(sub.label) : $tc(sub.field_name)">
                                <v-text-field
                                    outline
                                    
                                    :name="field.field_name+'['+repeatedIndex+']'+'.'+sub.field_name"
                                    v-model="model[repeatedIndex][sub.field_name]"
                                    :label="((sub.label !== '') ? $tc(sub.label) : $tc(sub.field_name)) + (sub.required ? '*' : '')"
                                    :placeholder="sub.form_placeholder"
                                    :error-messages="errors.length > 0 ? [errors[0]] : []"
                                    @input="$emit('edited', model)">
                                </v-text-field>
                            </ValidationProvider>
                        </div>
                    </v-card-text>
                    <v-card-actions v-if="repeatedIndex == (model.length-1)">
                        <v-spacer></v-spacer>
                        <v-btn fab small color="primary" @click="addRecord">
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
    },
    data() {
        return {
            model: [{}]
        }
    },
    methods: {
        addRecord: function(){
            let model = {}
            for (let i=0; i<this.field.subfields.length; i++){
                model[this.field.subfields[i].field_name] = "";
            }
            this.model.push(model);
        },

        removeRecord: function(index){
            this.model.splice(index,1);
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
            for (let i=0; i<this.dataset[this.field.field_name].length; i++){
                this.model[i] = {};
                for (let j=0; j<this.field.subfields.length; j++){
                    if (this.dataset[this.field.field_name] && this.dataset[this.field.field_name][i] && this.dataset[this.field.field_name][i][this.field.subfields[j].field_name]){
                        this.model[i][this.field.subfields[j].field_name] = this.dataset[this.field.field_name][i][this.field.subfields[j].field_name];
                    }else{
                        this.model[i][this.field.subfields[j].field_name] = "";
                    }
                }
            }
        }
    },
    watch: {
        model(){
            this.$emit('edited', this.model);
        },
    }
};
</script>

<style scoped>
</style>