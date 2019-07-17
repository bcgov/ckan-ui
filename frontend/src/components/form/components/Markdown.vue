<template>
    <div>
        <label>{{$tc(displayLabel)}}</label>
        <div v-if="!editing">
            <span v-html="displayValue"></span>
        </div>
        <div v-else>
            <div class="toolbar">
                <v-btn icon small @click="add('#')">H1</v-btn>
                <v-btn icon small @click="add('##')">H2</v-btn>
                <v-btn icon small @click="add('###')">H3</v-btn>
                <v-btn icon small @click="wrap('*')"><v-icon>format_italic</v-icon></v-btn>
                <v-btn icon small @click="wrap('**')"><v-icon>format_bold</v-icon></v-btn>
                <v-btn icon small @click="wrap('~~')"><v-icon>format_strikethrough</v-icon></v-btn>
            </div>
            <v-textarea
                ref="ta"            
                :name="name"
                v-model="model"
                v-validate="field.required ? 'required' : ''"
                :data-vv-name="scopeName"
                :data-vv-as="$tc(displayLabel)"
                :data-vv-scope="scope"
                :error-messages="errors.first(scopeName) ? [errors.first(scopeName)] : []"
                outline
            ></v-textarea>
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
                return marked(this.model, {sanitize: true});
            }else{
                return marked("", {sanitize: true});
            }
        },
        displayLabel: function(){
            return this.label + (this.editing && this.field.required ? '*' : '');
        }
    },
    
    watch: {
        model(){
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