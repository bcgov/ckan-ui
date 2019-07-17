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
                        <v-text-field
                            outline
                            :name="field.field_name+'.'+sub.field_name"
                            v-model="model[sub.field_name]"
                            :label="(sub.label !== '') ? $tc(sub.label) : $tc(sub.field_name) + (sub.required ? '*' : '')"
                            :data-vv-name="scope+'.'+field.field_name+'.'+sub.field_name"
                            :data-vv-as="sub.label !== '' ? $tc(sub.label) : $tc(sub.field_name)"
                            :data-vv-scope="scope"
                            :error-messages="errors.first(scope+'.'+field.field_name+'.'+sub.field_name) ? [errors.first(scope+'.'+field.field_name+'.'+sub.field_name)] : []"
                            :placeholder="sub.form_placeholder">
                        </v-text-field>
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
        value: Object,
        scope: String,
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
            this.model[this.field.subfields[i].field_name] = this.value[this.field.subfields[i].field_name];
        }
    },
    computed: {
        displayLabel: function(){
            return this.field.label + (this.editing && this.field.required ? '*' : '');
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