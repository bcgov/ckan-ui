<template>
    <v-col v-if="anyShown || editing" cols=12 class="py-2 mb-4">
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
            <div class="mb-2" v-for="(_, repeatedIndex) in model" :key="field.field_name+'-'+repeatedIndex">
                <div v-if="(!hasDisplayed || (model[repeatedIndex].displayed === true) || loggedIn)">
                    <div v-for="(sub, key) in field.subfields" :key="field.field_name+'-'+repeatedIndex+'-'+key">
                        <span v-if="( (typeof(sub.hide_if_empty) === 'undefined') || (!sub.hide_if_empty) || (model[repeatedIndex][sub.field_name] != '') )">
                            <span v-if="sub.field_name != 'displayed'">
                                <v-row v-if="sub.display_snippet !== null" align="center">
                                    
                                    <label v-if="model[repeatedIndex]" class="sub-label">
                                        {{(sub.label !== '') ? $tc(sub.label) : $tc(sub.field_name)}}
                                        <v-tooltip right v-if="sub.help_text">
                                            <template v-slot:activator="{ on }">
                                                <v-icon color="label_colour" v-on="on">mdi-help-circle-outline</v-icon>
                                            </template>
                                            <span>{{sub.help_text}}</span>
                                        </v-tooltip>
                                    </label>
                                    
                                    <span class="py-1 valueSpan" v-line-clamp:1.5="1" >

                                        <v-tooltip top>
                                            <template v-slot:activator="{ on }">
                                                <span v-on=on v-if="model[repeatedIndex] && (model[repeatedIndex][sub.field_name].length > 0)">
                                                    <span v-if="sub.field_name === 'org'">
                                                        <router-link :to="{ name: 'organization_view', params: { organizationId: orgName(model[repeatedIndex][sub.field_name]) }}">{{orgTitle(model[repeatedIndex][sub.field_name])}}</router-link>
                                                    </span>
                                                    <span v-else-if="sub.field_name === 'url'">
                                                        <a :href="model[repeatedIndex][sub.field_name]">{{model[repeatedIndex][sub.field_name]}}</a>
                                                    </span>
                                                    <span v-else-if="sub.field_name === 'email'">
                                                        <a :href="'mailto:'+model[repeatedIndex][sub.field_name]">{{model[repeatedIndex][sub.field_name]}}</a>
                                                    </span>
                                                    <span v-else-if="sub.preset === 'select'" class="value">{{getDisplayValue(sub, model[repeatedIndex][sub.field_name])}}</span>
                                                    <span v-else class="value">{{model[repeatedIndex][sub.field_name]}}</span>
                                                </span>
                                                <span v-else>{{$tc('Not Provided')}}</span>
                                            </template>
                                            <span>{{(model[repeatedIndex] && (model[repeatedIndex][sub.field_name].length > 0)) ? model[repeatedIndex][sub.field_name] : $tc('Not Provided')}}</span>
                                        </v-tooltip>
                                    </span>
                                </v-row>
                            </span>
                        </span>
                    </div>
                </div>
            </div>
            <hr>
        </div>
        <div v-else :key="'composite'+field.field_name+rerenderKey">
            <div v-for="(_, repeatedIndex) in model" :key="field.field_name+'-'+repeatedIndex">
                <v-row v-for="(sub, key) in field.subfields" :key="field.field_name+'-'+repeatedIndex+'-'+key" align="center">
                    <v-col cols=2 class="pb-0">
                        <label class="sub-label">{{(sub.label !== '') ? $tc(sub.label) : $tc(sub.field_name)}}{{( !!sub.required || (!!sub.validators && sub.validators.indexOf('conditional_required') !== -1)) ? '*' : ''}}</label>
                    </v-col>
                    <v-col cols=10 class="pb-0">
                        <ValidationProvider v-if="sub.preset=='multiple_checkbox'" :rules="( !!sub.required || (!!sub.validators && sub.validators.indexOf('conditional_required') !== -1)) ? 'required' : ''" v-slot="{ errors }" :name="(sub.label !== '') ? $tc(sub.label) : $tc(sub.field_name)">
                            <v-checkbox
                                dense
                                class="mt-0"
                                :name="field.field_name+'['+repeatedIndex+']'+'.'+sub.field_name"
                                v-model="model[repeatedIndex][sub.field_name]"
                                :error-messages="errors.length > 0 ? [errors[0]] : []"
                                :disabled="disabled"
                                hide-details="auto"
                                @change="modified">
                            </v-checkbox>
                        </ValidationProvider>

                        <ValidationProvider v-else-if="sub.field_name==='org'" :rules="( !!sub.required || (!!sub.validators && sub.validators.indexOf('conditional_required') !== -1)) ? 'required' : ''" v-slot="{ errors }" :name="(sub.label !== '') ? $tc(sub.label) : $tc(sub.field_name)">
                            <v-select
                                :name="field.field_name+'['+repeatedIndex+']'+'.'+sub.field_name"
                                v-model="model[repeatedIndex][sub.field_name]"
                                :placeholder="sub.form_placeholder"
                                :items="orgArray"
                                item-text="label"
                                :disabled="disabled"
                                item-value="value"
                                outlined dense
                                hide-details="auto"
                                :error-messages="errors.length > 0 ? [errors[0]] : []"
                                @change="modified">
                            </v-select>
                        </ValidationProvider>

                        <ValidationProvider v-else-if="sub.preset==='select'" :rules="( !!sub.required || (!!sub.validators && sub.validators.indexOf('conditional_required') !== -1)) ? 'required' : ''" v-slot="{ errors }" :name="(sub.label !== '') ? $tc(sub.label) : $tc(sub.field_name)">
                            <v-select
                                :name="field.field_name+'['+repeatedIndex+']'+'.'+sub.field_name"
                                v-model="model[repeatedIndex][sub.field_name]"
                                :placeholder="sub.form_placeholder"
                                :items="sub.choices"
                                item-text="label"
                                item-value="value"
                                outlined dense
                                hide-details="auto"
                                :disabled="disabled"
                                :error-messages="errors.length > 0 ? [errors[0]] : []"
                                @change="modified">
                            </v-select>
                        </ValidationProvider>

                        <ValidationProvider v-else-if="field.field_name.toLowerCase().indexOf('date')>=0" :rules="(( !!sub.required || (!!sub.validators && sub.validators.indexOf('conditional_required') !== -1)) ? 'required|' : '') + 'date_format:yyyy-mm-dd'" v-slot="{ errors }" :name="(sub.label !== '') ? $tc(sub.label) : $tc(sub.field_name)">
                            <!-- <v-text-field
                                outlined dense
                                hide-details="auto"
                                :name="field.field_name+'['+repeatedIndex+'].'+sub.field_name"
                                v-model="model[repeatedIndex][sub.field_name]"
                                :placeholder="sub.form_placeholder"
                                :error-messages="errors.length > 0 ? [errors[0]] : []"
                                :disabled="disabled"
                                @input="modified">
                            </v-text-field> -->
                            <v-menu
                                :ref="field.field_name+'['+repeatedIndex+'].'+sub.field_name"
                                :nudge-right="40"
                                transition="scale-transition"
                                offset-y
                                min-width="290px"
                            >
                                <template v-slot:activator="{ on }">
                                    <v-text-field
                                        outlined dense
                                        hide-details="auto"
                                        :name="field.field_name+'['+repeatedIndex+'].'+sub.field_name"
                                        v-model="model[repeatedIndex][sub.field_name]"
                                        :placeholder="sub.form_placeholder"
                                        :error-messages="errors.length > 0 ? [errors[0]] : []"
                                        :disabled="disabled"
                                        readonly
                                        v-on="on"
                                    ></v-text-field>
                                </template>
                                <v-date-picker :disabled="disabled" v-model="model[repeatedIndex][sub.field_name]" @input="modified(field.field_name+'['+repeatedIndex+'].'+sub.field_name);"></v-date-picker>
                            </v-menu>
                        </ValidationProvider>

                        <ValidationProvider v-else-if="sub.field_name.toLowerCase().indexOf('email')>=0" :rules="(( !!sub.required || (!!sub.validators && sub.validators.indexOf('conditional_required') !== -1)) ? 'required|' : '') + 'email'" v-slot="{ errors }" :name="(sub.label !== '') ? $tc(sub.label) : $tc(sub.field_name)">
                            <v-text-field
                                outlined dense
                                hide-details="auto"
                                :name="field.field_name+'['+repeatedIndex+'].'+sub.field_name"
                                v-model="model[repeatedIndex][sub.field_name]"
                                :placeholder="sub.form_placeholder"
                                :error-messages="errors.length > 0 ? [errors[0]] : []"
                                :disabled="disabled"
                                @input="modified">
                            </v-text-field>
                        </ValidationProvider>

                        <ValidationProvider v-else-if="sub.field_name.toLowerCase().indexOf('url')>=0" :rules="{required: ( !!sub.required || (!!sub.validators && sub.validators.indexOf('conditional_required') !== -1)), url: {require_tld: true, require_host: true}}" v-slot="{ errors }" :name="(sub.label !== '') ? $tc(sub.label) : $tc(sub.field_name)">
                            <v-text-field
                                outlined dense
                                hide-details="auto"
                                :name="field.field_name+'['+repeatedIndex+'].'+sub.field_name"
                                v-model="model[repeatedIndex][sub.field_name]"
                                :placeholder="sub.form_placeholder"
                                :disabled="disabled"
                                :error-messages="errors.length > 0 ? [errors[0]] : []"
                                @input="modified">
                            </v-text-field>
                        </ValidationProvider>

                        <ValidationProvider v-else :rules="( !!sub.required || (!!sub.validators && sub.validators.indexOf('conditional_required') !== -1)) ? 'required' : ''" v-slot="{ errors }" :name="(sub.label !== '') ? $tc(sub.label) : $tc(sub.field_name)">
                            <v-text-field
                                outlined dense
                                hide-details="auto"
                                :name="field.field_name+'['+repeatedIndex+']'+'.'+sub.field_name"
                                v-model="model[repeatedIndex][sub.field_name]"
                                :placeholder="sub.form_placeholder"
                                :disabled="disabled"
                                :error-messages="errors.length > 0 ? [errors[0]] : []"
                                @input="modified">
                            </v-text-field>
                        </ValidationProvider>
                    </v-col>
                </v-row>
                <v-row class="mr-2" v-if="model.length > 1">
                    <v-spacer></v-spacer>
                    <v-btn right tabindex="-1" text icon small @click="removeRecord(repeatedIndex)">
                        <v-icon>mdi-trash-can-outline</v-icon>
                    </v-btn>
                </v-row>
            </div>
            <v-row>
                <v-col cols=12>
                    <v-btn tabindex="-1" text class="ml-0" color="primary" @click="addRecord">
                        Add {{displayLabel}}
                    </v-btn>
                </v-col>
            </v-row>
            <hr>
        </div>
    </v-col>
</template>

<script>
import { mapGetters, mapState } from "vuex";
export default {

    props: {
        field: Object,
        dataset: Object,
        orgArray: Array,
        editing: Boolean,
        scope: String,
        disabled: {
            type: Boolean,
            default: false
        },
        formDefaults: {
            type: Object,
            default: () => {}
        },
    },

    watch: {
        fieldValue: function(){
            this.updateValues();
        },
        formDefaults: function(){
            for (let i=0; i<this.field.subfields.length; i++){
                let fieldName = this.field.subfields[i].field_name;
                for (let j=0; j<this.model.length; j++){
                    let def = this.formDefaults[fieldName];
                    if ( (!this.model[j][fieldName]) && (def) ){
                        this.model[j][fieldName] = def;
                    }
                }
            }
            this.rerenderKey++;
        }
    },

    data() {
        return {
            model: [{}],
            hasDisplayed: false,
            dateMenuOpen: false,
            rerenderKey: 0,
            anyShown: false,
        }
    },

    methods: {
        updateValues: function(){
            if (this.dataset[this.field.field_name]){
                let value = JSON.parse(this.dataset[this.field.field_name]);
                for (let i=0; i<value.length; i++){
                    this.model[i] = {};
                    for (let j=0; j<this.field.subfields.length; j++){
                        if (value && value[i] && value[i][this.field.subfields[j].field_name]){
                            this.model[i][this.field.subfields[j].field_name] = value[i][this.field.subfields[j].field_name];
                        }else{
                            this.model[i][this.field.subfields[j].field_name] = "";
                        }
                    }
                }
            }
        },
        
        addRecord: function() {
            let model = {}
            for (let i=0; i<this.field.subfields.length; i++){
                if ( (typeof(this.formDefaults) !== "undefined") && (this.formDefaults[this.field.subfields[i].field_name]) ){
                    model[this.field.subfields[i].field_name] = this.formDefaults[this.field.subfields[i].field_name];
                }else{
                    model[this.field.subfields[i].field_name] = "";
                }
            }
            this.model.push(model);
        },
        removeRecord: function(index) {
            this.model.splice(index,1);
            this.$emit('edited', JSON.stringify(this.model));
        },

        modified: function(refName) {
            if ( (typeof(refName) !== "undefined") && (typeof(this.$refs[refName]) !== "undefined") ){
                this.$refs[refName] = false;
            }
            this.$emit('edited', JSON.stringify(this.model));
        },

        getDisplayValue: function(field, value) {
            if (field.choices) {
                for (let choice of field.choices) {
                    if (choice.value === value) {
                        return choice.label;
                    }
                }
            }
            return value;
        }
    },
    computed: {
        displayLabel: function(){
            let required = ( (this.field.required) || (this.field.validators && this.field.validators.indexOf('conditional_required')!==-1) )
            return this.field.label + (this.editing && required ? '*' : '');
        },
        ...mapGetters("organization", {
            orgTitle: "titleByID",
            orgName: "nameByID"
        }),
        ...mapState({
            loggedIn: state => state.user.loggedIn,
        }),
        fieldValue: function(){
            return this.dataset[this.field.field_name];
        }
    },
    mounted(){
        this.anyShown = false;
        if (this.loggedIn){
            this.anyShown = true;
        }
        if (this.dataset[this.field.field_name]){
            //THIS IS REQUIRED OR NOTHING WORKS FOR SOME REASON...:(
            this.model = [{}];
            let value = JSON.parse(this.dataset[this.field.field_name]);
            for (let i=0; i<value.length; i++){
                this.model[i] = {};

                for (let j=0; j<this.field.subfields.length; j++){
                    if (value && value[i] && !value[i][this.field.subfields[j].field_name] && this.field.subfields[j].field_name === "displayed" && value[i]['private']){
                        this.model[i][this.field.subfields[j].field_name] = (( value[i]['private'] === true) || (value[i]['private'].toLowerCase() === "display") || (value[i]['private'].toLowerCase() === "displayed") );
                    }else if (value && value[i] && value[i][this.field.subfields[j].field_name]){
                        this.model[i][this.field.subfields[j].field_name] = value[i][this.field.subfields[j].field_name];
                    }else{
                        this.model[i][this.field.subfields[j].field_name] = "";
                    }
                    if (this.field.subfields[j].field_name.toLowerCase() === "displayed"){
                        this.hasDisplayed = true;
                        if (this.model[i][this.field.subfields[j].field_name] === true){
                            this.anyShown = true;
                        }
                    }
                }
            }
            this.$emit('edited', JSON.stringify(this.model));
        }else{
            let model = {}
            for (let i=0; i<this.field.subfields.length; i++){
                if ( (typeof(this.formDefaults) !== "undefined") && (this.formDefaults[this.field.subfields[i].field_name]) ){
                    model[this.field.subfields[i].field_name] = this.formDefaults[this.field.subfields[i].field_name];
                }else{
                    model[this.field.subfields[i].field_name] = "";
                }
            }
            this.model[0] = model;
        }
        if (!this.hasDisplayed){
            this.anyShown = true;
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
    label.sub-label{
        font-size: 16px;
        font-weight: bold;
        width: 287px; /*no idea why this is what makes it line up...*/
        margin-left: 24px;
        color: var(--v-faded_text-base);
    }

    .valueSpan{
        max-width: calc(100% - 330px);
    }

    .fullValue{
        display: hidden;
    }

    .valueSpan:hover .fullValue{
        display: block;
    }

    .value{
        font-size: 16px;
        color: var(--v-faded_text-base);
    }
    hr{
        color: var(--v-icon-base);
        border-bottom: 0px;
    }
</style>
