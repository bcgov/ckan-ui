<template>
    <v-col v-if="editing || val.length" cols=12 class="py-2">
        {{firstRender ? rerender() : ''}}
        <label class="label">
            {{$tc(displayLabel)}}
        </label>
        <div v-if="!editing">
            <p class="value">
                <span v-for="(v, k) in displayValue" :key="name+'-link-'+k"> 
                    <a class="underline" @click="searchDatasets(v)">{{v}}</a>{{((k==(displayValue.length-1)) ? "" : ", ")}} 
                </span>
            </p>
        </div>
        <ValidationProvider v-else :rules="( (field.required) || (field.validators && field.validators.indexOf('conditional_required')!==-1) ) ? 'required' : ''" v-slot="{ errors }" :name="$tc(displayLabel)">
            <v-combobox
                :name="name"
                :loading="loading"
                v-model="val"
                :placeholder="placeholder"
                :items="items"
                :item-text="itemTextField"
                :item-value="itemTextField"
                :hint="field.help_text"
                persistent-hint
                cache-items
                chips
                deletable-chips
                multiple
                :search-input.sync="search"
                outlined 
                :delimiters="[',']"
                :disabled="disabled"
                @input="search = null"
                :error-messages="errors.length > 0 ? [errors[0]] : []"
                background-color="text"
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
        redrawIndex: Number,
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
        let v = typeof(this.value) === "object" ? this.value.map(function(item){
                return item[self.itemTextField]
            }) : []
        return {
            loading: false,
            firstRender: true,
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
            let required = ( (this.field.required) || (this.field.validators && this.field.validators.indexOf('conditional_required')!==-1) )
            return this.label + (this.editing && required ? '*' : '');
        },
        displayValue: function() {
            let self = this;
            if ( (typeof(this.value) === "object") && (this.value.length>0) && (typeof(this.value[0]) === "object") ) {
                return this.value.map(function(item){
                    return item[self.itemTextField]
                });
            } else if ( (typeof(this.value) === "object") && (this.value.length>0) && (typeof(this.value[0]) === "string") ) {
                return this.value;
            } else if ( (typeof(this.value) === "string") && (this.value.length > 0) ) {
                return this.value.split(",");
            }
            return [];
        }
    },
    methods: {
        searchDatasets(findText){
            this.$store.commit('search/setSearchTextAndRedirect', findText);
        },
        rerender(){
            this.firstRender = false;
            let self = this;
            if ( (typeof(this.value) === "object") && (this.value.length>0) && (typeof(this.value[0]) === "object") ) {
                let v = this.value.map(function(item){
                    return item[self.itemTextField]
                });
                this.items = v;
            } else if ( (typeof(this.value) === "object") && (this.value.length>0) && (typeof(this.value[0]) === "string") ) {
                let v = this.value;
                this.items = v;

            } else if ( (typeof(this.value) === "string") && (this.value.length > 0) ) {
                this.items = this.value.split(",");
            } else {
                this.items = [];
            }
            
            this.items = typeof(this.value) === "object" ? this.value.map(function(item){
                return item[self.itemTextField]
            }) : this.value.split(",");
            return ''
        }
    },
    watch: {
        redrawIndex(){
            this.rerender();
        },

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
    .underline{
        text-decoration: underline;
    }
    >>>.v-messages__message {
        margin-left: -12px !important;
    }
</style>
