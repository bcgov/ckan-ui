<template>
    <v-col cols=12 class="py-2">
        <label class="label">
            {{$tc(displayLabel)}}
        </label>
        <div v-if="!editing">
            <span v-if="licenseUrlLookup[val]">
                <a :href="licenseUrlLookup[val]">{{displayValue}}</a>
            </span>
            <span v-else>
                <p class="value">{{displayValue}}</p>
            </span>
        </div>
        <ValidationProvider v-else :rules="( (field.required) || (field.validators && field.validators.indexOf('conditional_required')!==-1) ) ? 'required' : ''" v-slot="{ errors }" :name="$tc(displayLabel)">
            <v-select
                :name="name"
                v-model="val"
                :placeholder="placeholder"
                :items="licenses"
                item-text="title"
                item-value="id"
                :hint="field.help_text"
                persistent-hint
                :error-messages="errors.length > 0 ? [errors[0]] : []"
                :disabled="disabled"
                outlined dense
                background-color="text">
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
            licenseUrlLookup: {},
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
                        self.licenseUrlLookup[self.licenses[i].id] = self.licenses[i].url;
                    }
                    try{
                        self.displayValue = self.licenseLookup[self.val];
                    }catch(e){
                        self.displayValue = self.$tc("Not Provided");
                    }
                }
            });
        }
    },

    computed: {
        displayLabel: function(){
            let required = ( (this.field.required) || (this.field.validators && this.field.validators.indexOf('conditional_required')!==-1) )
            return this.label + (this.editing && required ? '*' : '');
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
    >>>.v-messages__message {
        margin-left: -12px !important;
    }
</style>
