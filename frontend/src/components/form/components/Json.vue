<template>
    <div>
        <div v-if="!editing">
            <label>{{$tc(label)}}: </label>
            <span>{{value}}</span>
        </div>
        <ValidationProvider v-else-if="field.form_snippet !== null" :rules="validate" v-slot="{ errors }" :name="$tc(displayLabel)">
            <v-textarea 
                :label="$tc(displayLabel)"
                :name="name"
                v-model="val"
                :placeholder="placeholder"
                :error-messages="errors.length > 0 ? [errors[0]] : []"
                auto-grow
                outline
            ></v-textarea>
        </ValidationProvider>
    </div>
</template>

<script>
export default {

    props: {
        name: String,
        value: [String, Object, Array, Boolean],
        label: String,
        editing: Boolean,
        placeholder: String,
        field: Object,
        scope: String,
    },
    data() {
        return {
            val: this.value,
            validate: ((this.field.required)? 'required' : ''),
            scopeName: this.scope + '.' + this.name,
        }
    },
    computed: {
        displayLabel: function(){
            return this.label + (this.field.required ? '*' : '');
        }
    },
    watch: {
        val(){
            this.$emit('edited', this.model);
        },
    },
    methods: {
        validator: function(){
            return {
                getMessage(field) {
                    return field + " is not valid JSON"
                },
                validate(value){
                    try{
                        return value.length === 0 || ( JSON.stringify(JSON.parse(value)) === value );
                    }catch(e){
                        return false;
                    }
                }
            }
        }
    }

};
</script>

<style scoped>
</style>