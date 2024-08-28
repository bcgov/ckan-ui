<template>
    <v-col v-if="editing || value" cols=12 class="py-2">
        <div v-if="!editing">
            <label class="label">
                {{$tc(displayLabel)}}
            </label>
            <a v-if="isURL" class="value" :href="value" target="_blank">{{value}}</a>
            <p v-else class="value">{{value}}</p>
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
            <div v-if="allowURL">
                <v-radio-group v-model="isURL" row dense>
                    <v-radio
                        label="URL"
                        :value="true">
                    </v-radio>
                    <v-radio
                        label="File"
                        :value="false">
                    </v-radio>
                </v-radio-group>
            </div>
            <ValidationProvider v-if="isURL" :rules="validate" v-slot="{ errors }" :name="displayLabel ? $tc(displayLabel) : ''">
                <v-text-field
                    :label="$tc('Enter URL')"
                    :name="name"
                    v-model="val"
                    :placeholder="placeholder"
                    :hint="field.help_text"
                    persistent-hint
                    :error-messages="errors.length > 0 ? [errors[0]] : []"
                    :disabled="disabled"
                    outlined dense
                    background-color="text"
                ></v-text-field>
            </ValidationProvider>
            <div v-else>
                <ValidationProvider :rules="validate" v-slot="{ errors }" :name="displayLabel ? $tc(displayLabel) : ''">
                    <v-file-input
                        :label="$tc('File')"
                        :name="name"
                        v-model="fileVal"
                        :placeholder="$tc('Click here to attach file')"
                        :disabled="disabled"
                        :error-messages="errors.length > 0 ? [errors[0]] : []" >
                    </v-file-input>
                </ValidationProvider>
            </div>
        </div>
    </v-col>
</template>

<script>

export default {

    props: {
        name: String,
        value: [String, Object, Array, Boolean],
        upload: [String, File],
        label: String,
        currentlyUrl: [String, Boolean],
        editing: Boolean,
        placeholder: String,
        field: Object,
        scope: String,
        disabled: {
            type: Boolean,
            default: false
        },
        parentObject: Object,
    },
    data() {
        let isURL;
    
        if (typeof(this.currentlyUrl) === "boolean") {
            isURL = this.currentlyUrl;
        } else {
            isURL = (
                typeof(this.currentlyUrl) === "string" &&
                this.currentlyUrl.toLowerCase() === "true"
            ) || this.field.field_name === "url";
        }

        return {
            val: this.value,
            fileVal: (this.upload) ? this.upload : null,
            allowURL: this.field.field_name === "url",
            scopeName: this.scope + '.' + this.name,
            api: null,
            isURL
        }
    },
    computed: {
        displayLabel: function(){
            let required = ( (this.field.required) || (this.field.validators && this.field.validators.indexOf('conditional_required')!==-1) )
            return this.label + (required ? '*' : '');
        },

        validate: function() {

            let v = (( (this.field.required) || (this.field.validators && this.field.validators.indexOf('conditional_required')!==-1) ) ? 'required' : '');

            if (this.isURL) {
                v = {
                    url: {require_tld: true, require_host: true},
                    required: (v === "required")
                }
            }

            return v;
        }
    },
    watch: {
        value(){
            this.val = this.value;
        },
        val(){
            this.$emit('edited', this.isURL, this.val);
        },
        fileVal(){
            this.$emit('edited', this.isURL, this.fileVal);
        },
        isURL(){
            if (this.isUrl){
                this.$emit('edited', this.isURL, this.val);
            }else{
                this.$emit('edited', this.isURL, this.fileVal);
            }
            
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
    p.value{
        font-size: 16px;
        color: var(--v-faded_text-base);
    }
    .fullWidth{
        width: 100%;
    }
    .upload-radio {
        width: auto;
        background: white;
    }
    >>>.v-messages__message {
        margin-left: -12px !important;
    }
</style>
