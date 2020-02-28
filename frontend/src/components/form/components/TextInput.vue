<template>
    <v-col cols=12 class="pb-0 pt-1">
        <label class="label">{{$tc(displayLabel)}}: </label>
        <div v-if="!editing">
            <p>{{value}}</p>
        </div>
        <ValidationProvider v-else-if="field.form_snippet !== null" :rules="validate" v-slot="{ errors }" :name="label ? $tc(label) : name">
            <v-text-field
                :name="name"
                v-model="val"
                :placeholder="placeholder"
                :error-messages="errors.length > 0 ? [errors[0]] : []"
                :disabled="disabled"
                outlined dense
            ></v-text-field>
        </ValidationProvider>
    </v-col>
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
        disabled: {
            type: Boolean,
            default: false
        },
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
            return this.label + (this.editing && this.field.required ? '*' : '');
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
    label.label{
        color: var(--v-label_text-base);
    }
</style>
