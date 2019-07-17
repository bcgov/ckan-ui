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
            <div v-else>
                <v-card v-for="(_, repeatedIndex) in model" :key="field.field_name+'-'+repeatedIndex">
                    <v-card-actions v-if="repeatedIndex > 0">
                        <v-spacer></v-spacer>
                        <v-btn fab small color="error" @click="removeRecord(repeatedIndex)">
                            <v-icon>remove</v-icon>
                        </v-btn>
                    </v-card-actions>
                    <v-card-text>
                        <div v-for="(sub, key) in field.subfields" :key="field.field_name+'-'+repeatedIndex+'-'+key">
                            <v-checkbox
                                v-if="sub.preset=='multiple_checkbox'"
                                :name="field.field_name+'['+repeatedIndex+']'+'.'+sub.field_name"
                                v-model="model[repeatedIndex][sub.field_name]"
                                :label="((sub.label !== '') ? $tc(sub.label) : $tc(sub.field_name)) + (sub.required ? '*' : '')"
                                @change="$emit('edited', model)">
                            </v-checkbox>

                            <v-select v-else-if="sub.preset==='edc_org'"
                                :name="field.field_name+'['+repeatedIndex+']'+'.'+sub.field_name"
                                v-model="model[repeatedIndex][sub.field_name]"
                                :label="((sub.label !== '') ? sub.label : sub.field_name) + (sub.required ? '*' : '')"
                                :placeholder="sub.form_placeholder"
                                :items="orgArray"
                                item-text="label"
                                item-value="value"
                                outline
                                @change="$emit('edited', model)">
                            </v-select>

                            <v-select v-else-if="sub.preset==='select'"
                                :name="field.field_name+'['+repeatedIndex+']'+'.'+sub.field_name"
                                v-model="model[repeatedIndex][sub.field_name]"
                                :label="((sub.label !== '') ? $tc(sub.label) : $tc(sub.field_name)) + (sub.required ? '*' : '')"
                                :placeholder="sub.form_placeholder"
                                :items="sub.choices"
                                item-text="label"
                                item-value="value"
                                outline
                                @change="$emit('edited', model)">
                            </v-select>

                            <v-text-field
                                v-else
                                outline
                                :name="field.field_name+'['+repeatedIndex+']'+'.'+sub.field_name"
                                v-model="model[repeatedIndex][sub.field_name]"
                                :label="((sub.label !== '') ? $tc(sub.label) : $tc(sub.field_name)) + (sub.required ? '*' : '')"
                                :placeholder="sub.form_placeholder"
                                @input="$emit('edited', model)">
                            </v-text-field>
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