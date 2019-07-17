<template>
    <div>
        <div v-if="!editing">
            <label>{{$tc(label)}}:</label>
            <span>{{displayValue}}</span>
        </div>
        <v-select v-else
            :name="name"
            v-model="val"
            :label="$tc(displayLabel)"
            :placeholder="placeholder"
            :items="licenses"
            item-text="label"
            item-value="value"
            v-validate="(field.required)? 'required' : ''"
            :data-vv-name="scopeName"
            :data-vv-as="$tc(displayLabel)"
            :data-vv-scope="scope"
            :error-messages="errors.first(scopeName) ? [errors.first(scopeName)] : []"
            outline>
        </v-select>
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
    },
    data() {
        return {
            displayValue: this.value,
            licenses: [],
            val: this.value,
            scopeName: this.scope + '.' + this.name,
        }
    },

    methods: {
        getLicenses: function(){
            ckanServ.getLicenses().then((data) => {
                this.licenses = data.result;
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