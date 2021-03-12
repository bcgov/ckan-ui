<template>
    <v-col cols=12 class="py-2">
        <label :class="'label fixedWidth' + ((multilineDisplay) ? 'block' : '') ">
            {{$tc(displayLabel)}}&nbsp;
            <v-tooltip right v-if="field.help_text">
                <template v-slot:activator="{ on }">
                    <v-icon color="label_colour" v-on="on">mdi-help-circle-outline</v-icon>
                </template>
                <span>{{field.help_text}}</span>
            </v-tooltip>
        </label>
        <span v-if="!editing" :class="((multilineDisplay) ? 'block' : '')">
            <span class="value mb-0 pb-0">{{translate ? $tc(displayValue) : displayValue}}</span>
            <span v-if="!validValue && sysAdmin" class="mt-0 pt-0 error--text errorText">Note this value is invalid</span>
        </span>
        <span v-else>
            <div>
                {{$tc('Current Value:')}} {{computedValue}}
            </div>
            <ValidationProvider :rules="( (field.required) || (field.validators && field.validators.indexOf('conditional_required')!==-1) ) ? 'required' : ''" v-slot="{ errors }" :name="$tc(displayLabel)">
                <v-btn color="primary" v-for="(state,k) in nextStates" :key="field.name+'-'+k+'-state-button'" @click="click(state.state)">
                    {{labelLookup[state.state]}}
                </v-btn>
            </ValidationProvider>
        </span>
    </v-col>
</template>

<script>
import { mapGetters, mapState } from "vuex";
export default {

    props: {
        name: String,
        value: String,
        initialValue: String,
        label: String,
        editing: Boolean,
        placeholder: String,
        options: [Array, Object],
        conditionalRedraw: Number,
        includeBlank: Boolean,
        emitOnChange: String,
        
        labelField: {
            type: String,
            default: "label"
        },
        valueField: {
            type: String,
            default: "value"
        },
        field: Object,
        scope: String,
        translate: {
            type: Boolean,
            default: true
        },
        selectableOptions: {
            type: Array,
            default: () => { return []; }
        },
        disabled: {
            type: Boolean,
            default: false
        },
        multilineDisplay: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            displayValue: "",
            val: this.value,
            scopeName: this.scope + '.' + this.name,
            validValue: false,
            nextStates: [],
            labelLookup: {},
            computedValue: "",
        }
    },

    computed: {

        displayLabel: function(){
            let required = ( (this.field.required) || (this.field.validators && this.field.validators.indexOf('conditional_required')!==-1) )
            return this.label + (this.editing && required ? '*' : '');
        },
        ...mapGetters("organization", {
            orgTitle: "titleByID",
            orgName: "nameByID"
        }),
        ...mapState({
            sysAdmin: state => state.user.sysAdmin,
        })
    },

    watch: {
        selectableOptions: function(newOpts, oldOpts){
            if (newOpts.length === oldOpts.length){
                if (JSON.stringify(newOpts) === JSON.stringify(oldOpts)){
                    return;
                }
            }
            this.initItems();
        },
        value: function(){
            this.val = this.value;
        }
    },

    mounted() {
        this.initItems();
    },

    methods: {

        click: function(state){
            this.val = state;
            if ( (typeof(this.emitOnChange) !== "undefined") && (this.emitOnChange !== "") ){
                this.$emit(this.emitOnChange, this.val);
            }
            this.$emit('input',this.val);
            this.computedValue = this.labelLookup[this.val];
        },

        initItems: function(){

            if (!this.initialValue || this.initialValue===""){
                this.nextStates = [this.field.startState];
                this.displayValue = "Not Provided"
            }

            if (typeof(this.options) !== "undefined"){
                let keys = Object.keys(this.options);
                for (var i=0; i<keys.length; i++){
                    var item = {};
                    item.label = this.translate ? this.$tc(this.options[keys[i]][this.labelField]) : this.options[keys[i]][this.labelField];
                    item.value = this.options[keys[i]][this.valueField];
                    item.validTo = this.options[keys[i]].validTo;
                    this.labelLookup[item.value] = item.label

                    if (item.value == this.initialValue){
                        this.displayValue = item.label;
                        this.validValue = true;
                        this.nextStates = item.validTo;
                    }
                }
            }
            this.computedValue = this.labelLookup[this.val];

        }
    }
};
</script>

<style scoped>
    .block{
        display: block;
    }
    label.label{
        font-size: 16px;
        font-weight: bold;
        color: var(--v-faded_text-base);
    }
    p.value{
        font-size: 16px;
        color: var(--v-faded_text-base);
    }

    span.errorText{
        font-size: 10px;
    }

    .fixedWidth{
        width: 300px;
        display: inline-block;
    }
</style>
