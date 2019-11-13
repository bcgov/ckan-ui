<template>
    <div>
        <div v-if="!editing">
            <label>{{$tc(label)}}:</label>
            <span>{{licenseLookup[val]}}</span>
        </div>
        <ValidationProvider v-else :rules="(field.required)? 'required' : ''" v-slot="{ errors }" :name="$tc(displayLabel)">
            <v-select
                :name="name"
                v-model="val"
                :label="$tc(displayLabel)"
                :placeholder="placeholder"
                :items="licenses"
                item-text="title"
                item-value="id"
                :error-messages="errors.length > 0 ? [errors[0]] : []"
                :disabled="disabled"
                outline>
            </v-select>
        </ValidationProvider>
    </div>
</template>

<script>
import {CkanApi} from '../../../services/ckanApi';
let ckanServ = new CkanApi()

export default {

    props: {
        name: String,
        value: String,
        label: String,
        editing: Boolean,
        placeholder: String,
        includeBlank: Boolean,
        scope: String,
        labelField: {
            type: String,
            default: "label"
        },
        valueField: {
            type: String,
            default: "value"
        },
        field: Object,
        disabled: {
            type: Boolean,
            default: false
        },
    },
    data() {
        return {
            displayValue: this.value,
            licenses: [],
            licenseLookup: {},
            val: this.value,
            scopeName: this.scope + '.' + this.name,
        }
    },

    methods: {
        getLicenses: function(){
            ckanServ.getLicenses().then((data) => {
                this.licenses = data.result;
                for (let i=0; i<this.licenses.length; i++){
                    this.licenseLookup[this.licenses[i].id] = this.licenses[i].title;
                }
            });
        }
    },

    computed: {
        displayLabel: function(){
            return this.label + (this.field.required ? '*' : '');
        }
    },

    watch: {
        val(){
            this.$emit('edited', this.val);
        },
    },

    mounted(){
        this.getLicenses();
    }
};
</script>

<style scoped>
</style>