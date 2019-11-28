<template>
    <v-card>
        <v-card-title>{{$tc(displayLabel)}}</v-card-title>
        <v-card-text>
            <div v-if="!editing">
                <div v-for="(sub, key) in field.subfields" :key="field.field_name+'-'+key">
                    <label>{{(sub.label !== '') ? $tc(sub.label) : $tc(sub.field_name)}}:</label>
                    <span v-if="model[sub.field_name]">{{model[sub.field_name]}}</span>
                    <span v-else></span>
                </div>
            </div>
            <div v-else>
                <v-card-text>
                    <div v-for="(sub, key) in field.subfields" :key="field.field_name+'-'+key">
                        <ValidationProvider :rules="sub.required ? 'required|' : ''" v-slot="{ errors }" :name="sub.field_name">
                            <v-text-field
                                outline
                                :name="field.field_name+'.'+sub.field_name"
                                v-model="model[sub.field_name]"
                                :label="(sub.label !== '') ? $tc(sub.label) : $tc(sub.field_name) + (sub.required ? '*' : '')"
                                :error-messages="errors.length < 0 ? [errors[0]] : []"
                                @input="modified"
                                :disabled="disabled"
                                :placeholder="sub.form_placeholder">
                            </v-text-field>
                        </ValidationProvider>
                    </div>
                </v-card-text>
            </div>
        </v-card-text>
    </v-card>
</template>

<script>
export default {
    props: {
        field: Object,
        editing: Boolean,
        value: [String, Object],
        scope: String,
        disabled: {
            type: Boolean,
            default: false
        },
    },
    data() {
        return {
            model: {}
        }
    },
    mounted(){
        //THIS IS REQUIRED OR NOTHING WORKS FOR SOME REASON...:(
        this.model = {};
        for (let i=0; i<this.field.subfields.length; i++){
            if ( (typeof(this.value) === "string") && (this.value === '') ){
                this.model[this.field.subfields[i].field_name] = "";
            }else if (typeof(this.value) === "string"){
                this.model[this.field.subfields[i].field_name] = JSON.parse(this.value)[this.field.subfields[i].field_name];
            }else{
                this.model[this.field.subfields[i].field_name] = this.value[this.field.subfields[i].field_name];
            }
        }
        this.$emit('edited', JSON.stringify(this.model));
    },
    computed: {
        displayLabel: function(){
            return this.field.label + (this.editing && this.field.required ? '*' : '');
        }
    },
    methods: {
        modified: function(){
            this.$emit('edited', JSON.stringify(this.model));
        }
    }
};
</script>

<style scoped>
</style>