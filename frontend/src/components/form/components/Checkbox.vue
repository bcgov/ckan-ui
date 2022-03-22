<template>
    <div v-if="!editing" class="py-2">
        <label class="label">
            {{$tc(displayLabel)}}
        </label>
        <span>{{!!value ? trueDisplay : falseDisplay}}</span>
    </div>
    <ValidationProvider v-else :rules="( (field.required) || (field.validators && field.validators.indexOf('conditional_required')!==-1) )? 'required' : ''" v-slot="{ errors }" :name="$tc(displayLabel)" class="py-2">
        <v-checkbox
            :name="name"
            v-model="val"
            :hint="field.help_text"
            persistent-hint
            :label="$tc(displayLabel)"
            :error-messages="errors.length > 0 ? [errors[0]] : []"
            :disabled="disabled">
        </v-checkbox>
    </ValidationProvider>
</template>

<script>
export default {

    props: {
        name: String,
        value: Boolean,
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
            let required = ( (this.field.required) || (this.field.validators && this.field.validators.indexOf('conditional_required')!==-1) )
            return this.label + (required ? '*' : '');
        }
    },
};
</script>

<style scoped>
    label.label{
        font-size: 16px;
        font-weight: bold;
        color: var(--v-faded_text-base);
    }
    >>>.v-messages__message {
        margin-left: -12px !important;
    }
</style>
