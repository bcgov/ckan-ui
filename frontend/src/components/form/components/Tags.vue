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
            <p class="value">{{val.join(', ')}}</p>
        </div>
        <ValidationProvider v-else :rules="(field.required)? 'required' : ''" v-slot="{ errors }" :name="$tc(displayLabel)">
            <v-combobox
                :name="name"
                :loading="loading"
                v-model="val"
                :placeholder="placeholder"
                :items="items"
                :item-text="itemTextField"
                :item-value="itemTextField"
                cache-items
                chips
                deletable-chips
                multiple
                :search-input.sync="search"
                outlined dense
                :delimiters="[',']"
                :disabled="disabled"
                @input="search = null"
                :error-messages="errors.length > 0 ? [errors[0]] : []"
            ></v-combobox>
        </ValidationProvider>
    </v-col>
</template>

<script>
import {CkanApi} from '../../../services/ckanApi';
const ckanServ = new CkanApi();

export default {

    props: {
        name: String,
        value: [String,Array],
        label: String,
        editing: Boolean,
        placeholder: String,
        autoCompleteSource: String,
        field: Object,
        scope: String,
        itemTextField: {
            type: String,
            default: 'name',
        },
        itemValueField: {
            type: String,
            default: "id"
        },
        disabled: {
            type: Boolean,
            default: false
        },
    },
    data(){
        var self = this;
        return {
            loading: false,
            search: null,
            val: typeof(this.value) === "object" ? this.value.map(function(item){
                return item[self.itemTextField]
            }) : [],
            items: typeof(this.value) === "object" ? this.value.map(function(item){
                return item[self.itemTextField]
            }) : [],
            scopeName: this.scope + '.' + this.name,
        };
    },
    computed: {
        displayLabel: function(){
            return this.label + (this.editing && this.field.required ? '*' : '');
        }
    },
    watch: {
        val(){
            if (this.val.length > 0){
                // let tmp = this.val;//.split(",");
                // for (let i=0; i<tmp.length; i++){
                //     if (tmp[i] === ""){
                //         tmp.splice(i, 1);
                //         i--;
                //     }
                // }
                // this.val = tmp;//.join(",");
                this.$emit('edited', this.val.join(','));
            }else{
                this.$emit('edited', '');
            }
        },
        search(val){
            this.loading = true;
            let url = this.autoCompleteSource.substring(0,this.autoCompleteSource.length-1) + val;
            ckanServ.getGeneric(url).then( (data) => {

                this.items = [];
                this.items.push(val);
                if (data && data.ResultSet && data.ResultSet.Result){
                    let results = data.ResultSet.Result;

                    for (let i=0; i<results.length; i++){
                        this.items.push(results[i].Name);
                    }
                }
                this.loading = false;
            });
        }
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
