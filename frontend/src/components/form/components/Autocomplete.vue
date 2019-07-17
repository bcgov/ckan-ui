<template>
    <div>
        <div v-if="!editing">
            <label>{{$tc(label)}}</label>
            <span>{{value}}</span>
        </div>
        <v-autocomplete v-else
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
            v-validate="(field.required) ? 'required' : ''"
            :data-vv-name="scopeName"
            :data-vv-as="$tc(displayLabel)"
            :data-vv-scope="scope"
            :error-messages="errors.first(scopeName) ? [errors.first(scopeName)] : []"
        ></v-autocomplete>
    </div>
</template>

<script>
import {CkanApi} from '../../../services/ckanApi';
const ckanServ = new CkanApi();

export default {
    props: {
        name: String,
        value: String,
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
            val: this.value.split(","),
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
            this.$emit('edited', this.val);
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