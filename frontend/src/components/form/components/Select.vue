<template>
    <v-col cols=12 class="pb-0 pt-1">
        <label class="label">{{$tc(displayLabel)}}</label>
        <div v-if="!editing">
            <p v-if="field.field_name === 'owner_org'"><router-link :to="{ name: 'organization_view', params: { organizationId: orgName(value) }}">{{orgTitle(value)}}</router-link></p>
            <p v-else>{{translate ? $tc(displayValue) : displayValue}}</p>
        </div>
        <ValidationProvider v-else :rules="(field.required)? 'required' : ''" v-slot="{ errors }" :name="$tc(displayLabel)">
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
import { mapGetters } from "vuex";
export default {

    props: {
        name: String,
        value: String,
        label: String,
        editing: Boolean,
        placeholder: String,
        options: [Array, Object],
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
    },
    data() {
        return {
            items: [],
            displayValue: "",
            val: this.value,
            scopeName: this.scope + '.' + this.name,
        }
    },

    computed: {
        displayLabel: function(){
            return this.label + (this.editing && this.field.required ? '*' : '');
        },
        ...mapGetters("organization", {
            orgTitle: "titleByID",
            orgName: "nameByID"
        })
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

            if (this.includeBlank){
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
    label.label{
        color: var(--v-label_text-base);
    }
</style>
