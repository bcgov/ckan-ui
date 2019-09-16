<template>
    <div>
        <div v-if="!editing">
            <label>{{$tc(label)}}: </label>
            <span>{{value}}</span>
        </div>
        <ValidationProvider v-else-if="field.form_snippet !== null" :rules="validate" v-slot="{ errors }" :name="label ? $tc(label) : name">
            <v-text-field
                :label="$tc(displayLabel)"
                :name="name"
                v-model="val"
                :placeholder="placeholder"
                
                :error-messages="errors.length > 0 ? [errors[0]] : []"
                outline
            ></v-text-field>
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
            this.$emit('edited', this.val);
        },
    },
    mounted(){
        if (this.field.field_name.toLowerCase().indexOf("date") >= 0){
            this.validate += (this.validate.length > 0) ? "|date_format:yyyy-mm-dd" : "date_format:yyyy-mm-dd";
        }
    }

};
</script>

<style scoped>
</style>