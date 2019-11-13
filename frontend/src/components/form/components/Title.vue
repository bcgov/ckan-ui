<template>
    <h2 v-if="!editing">
        {{value}}
    </h2>
    <ValidationProvider v-else :rules="(field.required)? 'required' : ''" v-slot="{ errors }" :name="$tc(displayLabel)">
        <v-text-field
            :label="$tc(displayLabel)"
            :name="name"
            v-model="val"
            :placeholder="placeholder"
            outline
            :error-messages="errors.length>0 ? [errors[0]] : []"
            :disabled="disabled"
        ></v-text-field>
    </ValidationProvider>
</template>

<script>
export default {

    props: {
        name: String,
        value: String,
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
            scopeName: this.scope + '.' + this.name,
        }
    },

    watch: {
        val(){
            this.$emit('edited', this.val);
        },
    },
    computed: {
        displayLabel: function(){
            return this.label + (this.field.required ? '*' : '');
        }
    },
};
</script>

<style scoped>
</style>