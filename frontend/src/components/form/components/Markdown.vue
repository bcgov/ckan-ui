<template>
    <v-col v-if="editing || displayValue" cols=12 class="py-2">
        <label class="label">
            {{$tc(displayLabel)}}
        </label>
        <span v-if="!editing" v-html="displayValue" class="value"></span>
        <div v-else>
            <div class="toolbar">
                <v-btn tabindex="-1" icon small @click="add('#')">H1</v-btn>
                <v-btn tabindex="-1" icon small @click="add('##')">H2</v-btn>
                <v-btn tabindex="-1" icon small @click="add('###')">H3</v-btn>
                <v-btn tabindex="-1" icon small @click="wrap('*')"><v-icon>mdi-format-italic</v-icon></v-btn>
                <v-btn tabindex="-1" icon small @click="wrap('**')"><v-icon>mdi-format-bold</v-icon></v-btn>
                <v-btn tabindex="-1" icon small @click="wrap('~~')"><v-icon>mdi-format-strikethrough</v-icon></v-btn>
            </div>
            <ValidationProvider :rules="( (field.required) || (field.validators && field.validators.indexOf('conditional_required')!==-1) ) ? 'required' : ''" v-slot="{ errors }" :name="$tc(displayLabel)">
                <v-textarea
                    ref="ta"
                    :name="name"
                    :label="field.form_placeholder"
                    v-model="model"
                    :hint="field.help_text"
                    persistent-hint
                    :error-messages="errors.length > 0 ? [errors[0]] : []"
                    :disabled="disabled"
                    outlined dense
                    background-color="text"
                ></v-textarea>
            </ValidationProvider>
        </div>
    </v-col>
</template>

<script>

let marked = require('marked');

export default {

    props: {
        name: String,
        value: String,
        label: String,
        editing: Boolean,
        placeholder: String,
        field: [Object,String],
        scope: String,
        disabled: {
            type: Boolean,
            default: false
        },
    },

    data() {
        return {
            model: this.value,
            scopeName: this.scope + '.' + this.name,
        }
    },

    computed: {
        displayValue: function(){
            if (typeof(this.model)==="string"){
                return marked(this.model);
            }else{
                return null;
            }
        },
        displayLabel: function(){
            let required = ( (this.field.required) || (this.field.validators && this.field.validators.indexOf('conditional_required')!==-1) )
            return this.label + (this.editing && required ? '*' : '');
        }
    },

    watch: {
        value(){
            this.model = this.value;
        },
        model() {
            this.$emit('edited', this.model);
        },
    },

    methods: {
        add: function(markup, replace){
            if (typeof(replace) === "undefined"){
                replace = false;
            }
            var tArea = document.getElementsByName(this.name)[0];
            // get cursor's position
            let startPos = tArea.selectionStart;
            let endPos = replace ? tArea.selectionEnd : startPos;

            this.model = this.model.substring(0,startPos) + markup + this.model.substring(endPos, this.model.length);

            // move cursor & refocus
            setTimeout(() => {
                startPos += markup.length;
                tArea.selectionStart = tArea.selectionEnd = startPos;
                tArea.focus();
            }, 10);
        },
        wrap: function(markup){
            var tArea = document.getElementsByName(this.name)[0];
            // get cursor's position
            let startPos = tArea.selectionStart;
            let endPos = tArea.selectionEnd;

            if (startPos != endPos){
                this.model = this.model.substring(0,startPos) + markup + this.model.substring(startPos,endPos) + markup + this.model.substring(endPos, this.model.length);
            }else{
                this.model = markup + markup + this.model.substring(0,this.model.length)
            }

            // move cursor & refocus
            setTimeout(() => {
                startPos += markup.length;
                tArea.selectionStart = tArea.selectionEnd = startPos;
                tArea.focus();
            }, 10);
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
    .value{
        font-size: 16px;
        color: var(--v-faded_text-base);
    }
    >>>.v-messages__message {
        margin-left: -12px !important;
    }
</style>
