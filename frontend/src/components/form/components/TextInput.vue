<template>
    <v-col cols=12 class="py-2">
        <label class="label">
            {{$tc(displayLabel)}}&nbsp;
            <v-tooltip right v-if="field.help_text">
                <template v-slot:activator="{ on }">
                    <v-icon color="label_colour" v-on="on">mdi-help-circle-outline</v-icon>
                </template>
                <span>{{field.help_text}}</span>
            </v-tooltip>
        </label>
        <div v-if="!editing">
            <p class="value">{{displayValue}}</p>
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
        let v = ( ( (this.field.required) || (this.field.validators && this.field.validators.indexOf('conditional_required')!==-1) ) ? 'required' : '');
        if (this.name.indexOf("url") >= 0){
            v = {
                url: {require_tld: true, require_host: true},
                required: (v === 'required'),
            }
        }

        return {
            val: this.value,
            displayValue: (this.value) ? this.value : this.$tc("Not Provided"),
            validate: v,
            scopeName: this.scope + '.' + this.name,
        }
    },
    computed: {
        displayLabel: function(){
            let required = ( (this.field.required) || (this.field.validators && this.field.validators.indexOf('conditional_required')!==-1) )
            return this.label + (this.editing && required ? '*' : '');
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
        font-size: 16px;
        font-weight: bold;
        color: var(--v-faded_text-base);
    }
    p.value{
        font-size: 16px;
        color: var(--v-faded_text-base);
    }
</style>
