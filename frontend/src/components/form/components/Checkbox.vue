<template>
    <div v-if="!editing">
        <label>{{$tc(label)}}: </label>
        <span>{{!!value ? trueDisplay : falseDisplay}}</span>
    </div>
    <ValidationProvider v-else :rules="(field.required)? 'required' : ''" v-slot="{ errors }" :name="$tc(displayLabel)">
        <v-checkbox
            :name="name"
            v-model="val"
            :label="$tc(displayLabel)"
            :error-messages="errors.length > 0 ? [errors[0]] : []"
            :disabled="disabled"
            @change="modified">
        </v-checkbox>
    </ValidationProvider>
</template>

<script>
export default {

    props: {
        name: String,
        value: String,
        label: String,
        editing: Boolean,
        field: Object,
        scope: String,
        disabled: {
            type: Boolean,
            default: false
        },
        trueDisplay: String,
        falseDisplay: String,
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