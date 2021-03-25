<template>
    <v-col cols=12 class="py-2" v-if="editing">
        <label class="label">
            {{$tc(displayLabel)}}&nbsp;
            <v-tooltip right v-if="field.help_text">
                <template v-slot:activator="{ on }">
                    <v-icon color="label_colour" v-on="on">mdi-help-circle-outline</v-icon>
                </template>
                <span>{{field.help_text}}</span>
            </v-tooltip>
        </label>
        <ValidationProvider :rules="validate" v-slot="{ errors }" :name="$tc(displayLabel)">
            <v-text-field
                :name="name"
                v-model="val"
                :placeholder="placeholder"
                v-on:keyup="modified = true"
                :error-messages="errors.length > 0 ? [errors[0]] : []"
                :disabled="disabled"
                outlined dense
                :prefix="prefix"
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
</style>
