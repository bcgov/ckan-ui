<template>
    <div>
        <div v-if="!editing">
            <label>{{$tc(label)}}</label>
            <span>{{value}}</span>
        </div>
        <ValidationProvider v-else :rules="(field.required)? 'required' : ''" v-slot="{ errors }" :name="$tc(displayLabel)">
            <v-autocomplete
                :label="$tc(displayLabel)"
                :name="name"
                :loading="loading"
                v-model="val"
                :placeholder="placeholder"
                :items="items"
                cache-items
                chips
                deletable-chips
                multiple
                :search-input.sync="search"
                outline
                :error-messages="errors.length > 0 ? [errors[0]] : []"
            ></v-autocomplete>
        </ValidationProvider>
    </div>
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
    },
    data(){
        return {
            items: [],
            loading: false,
            search: null,
            val: this.value,//this.value.split(","),
            scopeName: this.scope + '.' + this.name,
        };
    },
    computed: {
        displayLabel: function(){
            return this.label + (this.field.required ? '*' : '');
        }
    },
    watch: {
        val(){
            if (this.val.length > 0){
                let tmp = this.val;//.split(",");
                for (let i=0; i<tmp.length; i++){
                    if (tmp[i] === ""){
                        tmp.splice(i, 1);
                        i--;
                    }
                }
                this.val = tmp;//.join(",");
                this.$emit('edited', tmp);
            }else{
                this.$emit('edited', []);
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
</style>