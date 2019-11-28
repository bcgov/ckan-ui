<template>
    <div>
        <div v-if="!editing">
            <label>{{$tc(label)}}:</label>
            <span>{{displayValue}}</span>
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
            let self = this;
            ckanServ.getLicenses().then((data) => {
                self.licenses = data.result;
                if (self.licenses) {
                    for (let i=0; i<self.licenses.length; i++){
                        self.licenseLookup[self.licenses[i].id] = self.licenses[i].title;
                    }
                    self.displayValue = self.licenseLookup[self.val];
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
