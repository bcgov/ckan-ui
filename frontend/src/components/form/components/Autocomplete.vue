<template>
    <div>
        <div v-if="!editing">
            <label>{{$tc(label)}}: </label>
            <span>{{displayValue}}</span>
        </div>
        <ValidationProvider v-else :rules="(field.required)? 'required' : ''" v-slot="{ errors }" :name="$tc(displayLabel)">
            <v-autocomplete
                :label="$tc(displayLabel)"
                :name="name"
                :loading="loading"
                v-model="val"
                :placeholder="placeholder"
                :items="items"
                :item-text="itemTextField"
                :item-value="itemValueField"
                cache-items
                chips
                deletable-chips
                multiple
                :disabled="disabled"
                outline
                :error-messages="errors.length > 0 ? [errors[0]] : []"
            ></v-autocomplete>
        </ValidationProvider>
    </div>
</template>

<script>
export default {
    
    props: {
        name: String,
        value: Array,
        label: String,
        editing: Boolean,
        placeholder: String,
        field: Object,
        scope: String,
        items: Array,
        itemTextField: {
            type: String,
            default: 'label',
        },
        itemValueField: {
            type: String,
            default: "value"
        },
        disabled: {
            type: Boolean,
            default: false
        },
    },
    data(){
        return {
            loading: false,
            search: null,
            val: this.value,
            scopeName: this.scope + '.' + this.name,
            displayValue: ""
        };
    },
    mounted(){
        for (let i=0; i<this.items.length; i++){
            if (this.val.indexOf(this.items[i][this.itemValueField]) !== -1){
                this.displayValue += this.items[i][this.itemTextField] + ",";
            }
        }
        if (this.displayValue.length > 0){
            this.displayValue = this.displayValue.substring(0,this.displayValue.length-1);
        }
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
                this.$emit('edited', JSON.stringify([]));
            }
        },
    }
};
</script>

<style scoped>
</style>