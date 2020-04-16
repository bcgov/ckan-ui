<template>
    <v-col cols=12 class="pb-0 pt-1">
        <label class="label">
            {{$tc(displayLabel)}}&nbsp;
            <v-tooltip right v-if="field.help_text">
                <template v-slot:activator="{ on }">
                    <v-icon color="label_colour" v-on="on">mdi-help-circle-outline</v-icon>
                </template>
                <span>{{field.help_text}}</span>
            </v-tooltip>
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
            <ValidationProvider :rules="(field.required)? 'required' : ''" v-slot="{ errors }" :name="$tc(displayLabel)">
                <v-textarea
                    ref="ta"
                    :name="name"
                    v-model="model"
                    :error-messages="errors.length > 0 ? [errors[0]] : []"
                    :disabled="disabled"
                    outlined dense
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
        field: Object,
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
                return marked("");
            }
        },
        displayLabel: function(){
            return this.label + (this.editing && this.field.required ? '*' : '');
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
</style>
