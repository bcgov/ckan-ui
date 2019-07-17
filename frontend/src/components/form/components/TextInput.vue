<template>
    <div>
        <div v-if="!editing">
            <label>{{$tc(label)}}: </label>
            <span>{{value}}</span>
        </div>
        <v-text-field v-else-if="field.form_snippet !== null"
            :label="$tc(displayLabel)"
            :name="name"
            v-model="val"
            :placeholder="placeholder"
            v-validate="validate"
            :data-vv-name="scopeName"
            :data-vv-as="$tc(displayLabel)"
            :data-vv-scope="scope"
            :error-messages="errors.first(scopeName) ? [errors.first(scopeName)] : []"
            outline
        ></v-text-field>
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
    mounted(){
        if (this.field.field_name.indexOf("date") >= 0){
            this.validate += (this.validate.length > 0) ? "|date_format:yyyy-mm-dd" : "date_format:yyyy-mm-dd";
        }
    }

};
</script>

<style scoped>
</style>