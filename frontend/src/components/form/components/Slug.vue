<template>
    <v-col cols=12 class="py-2" v-if="editing">
        <label class="label">
            {{$tc(displayLabel)}}
        </label>
        <ValidationProvider :rules="validate" v-slot="{ errors }" :name="$tc(displayLabel)">
            <v-text-field
                :name="name"
                v-model="val"
                :placeholder="placeholder"
                :hint="field.help_text"
                persistent-hint
                v-on:keyup="modified = true"
                :error-messages="errors.length > 0 ? [errors[0]] : []"
                :disabled="disabled"
                outlined dense
                :prefix="prefix"
                background-color="text"
            ></v-text-field>
        </ValidationProvider>
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
        area: {
            type: String,
            default: "/dataset/"
        }
    },
    data() {
        return {
            val: this.value,
            validate: {required: ( (this.field.required) || (this.field.validators && this.field.validators.indexOf('conditional_required')!==-1) ), slug: true},
            scopeName: this.scope + '.' + this.name,
            prefix: window.location.origin + this.area,
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
    mounted() {
        let required = ( (this.field.required) || (this.field.validators && this.field.validators.indexOf('conditional_required')!==-1) )
        if (required){
            this.validate['required'] = true;
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
