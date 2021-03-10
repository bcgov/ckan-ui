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
            <span v-if="field.field_name === 'owner_org'"><router-link :to="{ name: 'organization_view', params: { organizationId: orgName(value) }}">{{orgTitle(value)}}</router-link></span>
            <span v-else class="value mb-0 pb-0">{{translate ? $tc(displayValue) : displayValue}}</span>
            <span v-if="!validValue && sysAdmin" class="mt-0 pt-0 error--text errorText">Note this value is invalid</span>
        </span>
        <ValidationProvider v-else :rules="( (field.required) || (field.validators && field.validators.indexOf('conditional_required')!==-1) ) ? 'required' : ''" v-slot="{ errors }" :name="$tc(displayLabel)">
            <v-select
                :key="'select'+name"
                :name="name"
                v-model="val"
                :placeholder="placeholder"
                :items="items"
                item-text="label"
                item-value="value"
                @change="onChange"
                :disabled="disabled"
                :error-messages="errors.length > 0 ? [errors[0]] : []"
                outlined dense>
            </v-select>
        </ValidationProvider>
    </v-col>
</template>

<script>
import { mapGetters, mapState } from "vuex";
export default {

    props: {
        name: String,
        value: String,
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
            items: [],
            displayValue: "",
            val: this.value,
            scopeName: this.scope + '.' + this.name,
            validValue: false,
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
        selectableOptions: function(){
            this.initItems();
        },
        conditionalRedraw: function(){
            this.initItems();
        }
    },

    methods: {
        onChange: function(){
            if ( (typeof(this.emitOnChange) !== "undefined") && (this.emitOnChange !== "") ){
                this.$emit(this.emitOnChange, this.val);
            }
            this.$emit('input',this. val)
        },
        initItems: function(){
            this.items = [];
            this.displayValue = this.value;


            let required = ( (this.field.required) || (this.field.validators && this.field.validators.indexOf('conditional_required')!==-1) )
            if ((this.includeBlank) && (!required)){
                this.items.push({label: '', value: ''});
            }

            if (this.selectableOptions.length > 0 ){
                for (let i=0; i<this.selectableOptions.length; i++){
                    this.items.push(this.selectableOptions[i]);
                }
            }

            if (typeof(this.options) !== "undefined"){
                let keys = Object.keys(this.options);
                for (var i=0; i<keys.length; i++){
                    var item = {};
                    item.label = this.translate ? this.$tc(this.options[keys[i]][this.labelField]) : this.options[keys[i]][this.labelField];
                    item.value = this.options[keys[i]][this.valueField];

                    if (item.value == this.value){
                        this.displayValue = item.label;
                        this.validValue = true;
                    }


                    if (this.selectableOptions.length === 0 ){
                        this.items.push(item);
                    }

                    //this.items[this.options[keys[i]].label] = this.options[keys[i]].value;
                }
            }

        }
    },

    mounted(){
        this.initItems();
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
