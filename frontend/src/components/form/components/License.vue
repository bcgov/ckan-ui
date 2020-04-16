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
        <div v-if="!editing">
            <p class="value">{{displayValue}}</p>
        </div>
        <ValidationProvider v-else :rules="(field.required)? 'required' : ''" v-slot="{ errors }" :name="$tc(displayLabel)">
            <v-select
                :name="name"
                v-model="val"
                :placeholder="placeholder"
                :items="licenses"
                item-text="title"
                item-value="id"
                :error-messages="errors.length > 0 ? [errors[0]] : []"
                :disabled="disabled"
                outlined dense>
            </v-select>
        </ValidationProvider>
    </v-col>
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
            return this.label + (this.editing && this.field.required ? '*' : '');
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
    label.label{
        font-size: 16px;
        font-weight: bold;
        color: var(--v-faded_text-base);
    }
    p.value{
        font-size: 16px;
        color: var(--v-faded_text-base);
    }
</style>
