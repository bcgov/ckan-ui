<template>
    <v-col cols=12 class="py-2">
        <label :class="'label fixedWidth' + ((multilineDisplay) ? 'block' : '') ">
            {{$tc(displayLabel)}}
        </label>
        <span v-if="!editing" :class="((multilineDisplay) ? 'block' : '')">
            <span class="value mb-0 pb-0">{{translate ? $tc(this.labelLookup[this.val]) : this.labelLookup[this.val]}}</span>
            <span v-if="!validValue">{{this.val}}</span>
            <span v-if="!validValue && sysAdmin" class="mt-0 pt-0 error--text errorText">Note this value is invalid</span>
        </span>
        <span v-else>
            <v-stepper alt-labels :value="stepNo" class="elevation-0 border">
                <v-stepper-header>
                    <span v-for="(state, k) in nextStates" :key="field.name+'-'+k+'-state-button-'+redrawIndex">
                        <v-stepper-step :complete="stepNo === state.stepNo" :step="state.stepNo"  :class="state.allowed ? 'fauxButton' : 'fauxDisabled'" @click="click(state.state, state.stepNo, state.allowed)">
                            {{labelLookup[state.state]}}
                        </v-stepper-step>
                    </span>
                </v-stepper-header>
            </v-stepper>
            <span class="help-text">{{field.help_text}}</span>
            <ValidationProvider :rules="( (field.required) || (field.validators && field.validators.indexOf('conditional_required')!==-1) ) ? 'required' : ''" v-slot="{ errors }" :name="$tc(displayLabel)">                
                <input type="text" style="display: none" v-model="val" />
                <div class="errors">{{errors.length > 0 ? errors[0] : ""}}</div>
            </ValidationProvider>
        </span>
    </v-col>
</template>

<script>
import { mapGetters, mapState } from "vuex";

import Permissions from '@/mixins/permissions';

export default {
    mixins: [Permissions],

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
        orgName: String,
        
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
            val: this.value,
            scopeName: this.scope + '.' + this.name,
            validValue: false,
            nextStates: [],
            labelLookup: {},
            stepNo: -1,
            redrawIndex: 0
        }
    },

    computed: {

        displayLabel: function(){
            let required = ( (this.field.required) || (this.field.validators && this.field.validators.indexOf('conditional_required')!==-1) )
            return this.label + (this.editing && required ? '*' : '');
        },
        ...mapState({
            sysAdmin: state => state.user.sysAdmin,
            userPermissions: state => state.user.userPermissions,
        }),
        ...mapGetters("organization", {
            ancestorsByName: "ancestorsByName"
        }),
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
        },
        orgName: function(newName, oldName){
            if (oldName !== newName){
                this.initItems();
            }
        }
    },

    mounted() {
        this.initItems();
    },

    methods: {

        click: function(state, step, allowed){
            if (allowed){
                this.val = state;
                this.stepNo = step;
                if ( (typeof(this.emitOnChange) !== "undefined") && (this.emitOnChange !== "") ){
                    this.$emit(this.emitOnChange, this.val);
                }
                this.$emit('input',this.val);
                this.computedValue = this.labelLookup[this.val];
                this.redrawIndex++;
                
            }
        },

        initItems: function(){

            if (!this.initialValue || this.initialValue===""){
                this.nextStates = [JSON.parse(JSON.stringify(this.field.startState))];
            }

            let keys = Object.keys(this.options);
            let currentStateItem = {};
            if (typeof(this.options) !== "undefined"){
                
                for (var i=0; i<keys.length; i++){
                    var item = {};
                    item.label = this.translate ? this.$tc(this.options[keys[i]][this.labelField]) : this.options[keys[i]][this.labelField];
                    item.value = this.options[keys[i]][this.valueField];
                    item.validTo = this.options[keys[i]].validTo;
                    this.labelLookup[item.value] = item.label

                    if (item.value == this.initialValue){
                        this.validValue = true;
                        this.nextStates = JSON.parse(JSON.stringify(item.validTo));
                        currentStateItem = item;
                        this.stepNo = i;
                    }
                }
            }
            if (!this.validValue){
                this.nextStates = [JSON.parse(JSON.stringify(this.field.startState))];
            }
            this.nextStates.push({state: currentStateItem.value, by: []})

            let {sysAdmin, admin, editor} = this.getUserPermissionsForOrganization(this.orgName);
            

            let sortedNext = []
            for (let i=0; i<keys.length; i++){
                for (let j=0; j<this.nextStates.length; j++){
                    let added = false;
                    if (this.options[keys[i]][this.valueField] === this.nextStates[j].state){
                        sortedNext.push(this.nextStates[j]);
                        added = true;
                    }
                    if (added){
                        let by = sortedNext[sortedNext.length - 1].by;
                        let allowed = ( (by.length === 0) || (sysAdmin && by.indexOf('sysadmin') != -1) );
                        allowed = ( (allowed) || (admin && by.indexOf('admin') != -1) );
                        allowed = ( (allowed) || (editor && by.indexOf('editor') != -1) );
                        sortedNext[sortedNext.length - 1].allowed = allowed;
                        sortedNext[sortedNext.length - 1].stepNo = i;
                    }
                }
            }

            this.nextStates = JSON.parse(JSON.stringify(sortedNext));

            this.redrawIndex++;

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
    .errors{
        color: var(--v-error_text-base)
    }
    .fauxButton{
        cursor: pointer;
    }
    .fauxDisabled{
        cursor: not-allowed;
    }
    .help-text {
        font-size: 12px;
        color: rgba(0, 0, 0, 0.6);
    }
    .border {
        border: 1px solid rgba(0, 0, 0, 0.4);
    }
</style>

<style>
    .fauxButton:hover span.v-stepper__step__step{
        background: var(--v-secondary-base) !important;
    }
    .fauxDisabled:hover span.v-stepper__step__step{
        background: var(--v-error-base) !important;
    }
</style>