<template>
    <div>
        <label>{{$tc(displayLabel)}}</label>
        <div v-if="!editing">
            <span v-html="displayValue"></span>
        </div>
        <div v-else>
            <div class="toolbar">
                <v-btn tabindex="-1" icon small @click="add('#')">H1</v-btn>
                <v-btn tabindex="-1" icon small @click="add('##')">H2</v-btn>
                <v-btn tabindex="-1" icon small @click="add('###')">H3</v-btn>
                <v-btn tabindex="-1" icon small @click="wrap('*')"><v-icon>format_italic</v-icon></v-btn>
                <v-btn tabindex="-1" icon small @click="wrap('**')"><v-icon>format_bold</v-icon></v-btn>
                <v-btn tabindex="-1" icon small @click="wrap('~~')"><v-icon>format_strikethrough</v-icon></v-btn>
            </div>
            <ValidationProvider :rules="(field.required)? 'required' : ''" v-slot="{ errors }" :name="$tc(displayLabel)">
                <v-textarea
                    ref="ta"            
                    :name="name"
                    v-model="model"
                    :error-messages="errors.length > 0 ? [errors[0]] : []"
                    :disabled="disabled"
                    outline
                ></v-textarea>
            </ValidationProvider>
        </div>
    </div>
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
</style>