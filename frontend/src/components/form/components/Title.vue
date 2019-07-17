<template>
    <h2 v-if="!editing">
        {{value}}
    </h2>
    <v-text-field v-else
        :label="$tc(displayLabel)"
        :name="name"
        v-model="val"
        :placeholder="placeholder"
        v-validate="(field.required)? 'required' : ''"
        :data-vv-name="scopeName"
        :data-vv-as="$tc(displayLabel)"
        :data-vv-scope="scope"
        :error-messages="errors.first(scopeName) ? [errors.first(scopeName)] : []"
        outline
    ></v-text-field>
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