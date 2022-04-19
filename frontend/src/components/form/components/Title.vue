<template>
    <v-col cols=12 class="py-2">
        <h2 v-if="!editing" class="title-field">
            {{value}}
        </h2>
        <div v-else>
            <label class="label">
                {{$tc(displayLabel)}}
            </label>
            <ValidationProvider :rules="( (field.required) || (field.validators && field.validators.indexOf('conditional_required')!==-1) ) ? 'required' : ''" v-slot="{ errors }" :name="$tc(displayLabel)">
                <v-text-field
                    :name="name"
                    v-model="val"
                    :placeholder="placeholder"
                    :hint="field.help_text"
                    persistent-hint
                    outlined dense
                    counter
                    maxlength="100"
                    :error-messages="errors.length>0 ? [errors[0]] : []"
                    :disabled="disabled"
                    background-color="text"
                ></v-text-field>
            </ValidationProvider>
        </div>
    </v-col>
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
        value(){
            this.val = this.value;
        },
        val(){
            this.$emit('edited', this.val);
        },
    },
    computed: {
        displayLabel: function(){
            let required = ( (this.field.required) || (this.field.validators && this.field.validators.indexOf('conditional_required')!==-1) )
            return this.label + (this.editing && required ? '*' : '');
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
    .title-field {
        font-size: 23px;
        font-weight: bold;
        color: var(--v-faded_text-base);
    }
    >>>.v-messages__message {
        margin-left: -12px !important;
    }
</style>
