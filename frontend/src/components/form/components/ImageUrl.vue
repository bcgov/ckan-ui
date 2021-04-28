<template>
    <v-col cols=12 class="py-2">
        <div v-if="!editing">
            <v-img :src="imgSrc" v-on:error="onImgError"></v-img>
        </div>
        <div v-else>
            <label class="label">
                {{$tc(displayLabel)}}&nbsp;
                <v-tooltip right v-if="field.help_text">
                    <template v-slot:activator="{ on }">
                        <v-icon color="label_colour" v-on="on">mdi-help-circle-outline</v-icon>
                    </template>
                    <span>{{field.help_text}}</span>
                </v-tooltip>
            </label>
            <ValidationProvider :rules="validate" v-slot="{ errors }" :name="displayLabel ? $tc(displayLabel) : ''">
                <v-text-field
                    :label="$tc(displayLabel)"
                    :name="name"
                    v-model="val"
                    :placeholder="placeholder"
                    :error-messages="errors.length > 0 ? [errors[0]] : []"
                    :disabled="disabled"
                    solo
                    outlined dense
                ></v-text-field>
            </ValidationProvider>
        </div>
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
        parentObject: Object,
        image: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            val: this.value,
            validate: (( (this.field.required) || (this.field.validators && this.field.validators.indexOf('conditional_required')!==-1) ) ? {required: 'required', url: {require_tld: true, require_host: true}} : {url: {require_tld: true, require_host: true}}),
            allowURL: this.field.field_name === "url",
            isURL: this.field.field_name === "url" ? true : false,
            scopeName: this.scope + '.' + this.name,
            api: null,
            imgError: false,
            imgSrc: this.value
        }
    },
    methods: {
        onImgError(){
            this.imgSrc = '/placeholder-organization.png'
        }
    },
    computed: {
        displayLabel: function(){
            let required = ( (this.field.required) || (this.field.validators && this.field.validators.indexOf('conditional_required')!==-1) )
            return this.label + (required ? '*' : '');
        },
    },
    watch: {
        value(){
            this.val = this.value;
            this.imgSrc = this.val;
        },
        val(){
            this.$emit('edited', this.isURL, this.val);
        },
    },
    mounted(){
    }

};
</script>

<style scoped>
    label.label{
        font-size: 16px;
        font-weight: bold;
        color: var(--v-faded_text-base);
    }
</style>
