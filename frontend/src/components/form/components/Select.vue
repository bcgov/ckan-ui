<template>
    <div>
        <div v-if="!editing">
            <label>{{$tc(label)}}:</label>
            <span>{{translate ? $tc(displayValue) : displayValue}}</span>
        </div>
        <v-select v-else
            :name="name"
            v-model="val"
            
            :label="$tc(displayLabel)"
            :placeholder="placeholder"
            :items="items"
            item-text="label"
            item-value="value"
            @change="onChange"
            v-validate.initial="(field.required)? 'required:true' : ''"
            :data-vv-name="scopeName"
            :data-vv-as="$tc(displayLabel)"
            :data-vv-scope="scope"
            :error-messages="errors.first(scopeName) ? [errors.first(scopeName)] : []"
            outline>
        </v-select>
    </div>
</template>

<script>
export default {
    props: {
        name: String,
        value: String,
        label: String,
        editing: Boolean,
        placeholder: String,
        options: [Array, Object],
        includeBlank: Boolean,
        emitOnChange: String,
        labelField: {
            type: String,
            default: "label"
        },
        valueField: {
            type: String,
            default: "value"
        },
        field: Object,
        scope: String,
        translate: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            items: [],
            displayValue: "",
            val: this.value,
            scopeName: this.scope + '.' + this.name,
        }
    },

    computed: {
        displayLabel: function(){
            return this.label + (this.field.required ? '*' : '');
        }
    },

    methods: {
        onChange: function(){
            if ( (typeof(this.emitOnChange) !== "undefined") && (this.emitOnChange !== "") ){
                this.$emit(this.emitOnChange, this.val);
            }
            this.$emit('input',this. val)
        },
        initItems: function(){
            this.items = [];

            if (this.includeBlank){
                this.items.push({label: '', value: ''});
            }

            if (typeof(this.options) !== "undefined"){
                let keys = Object.keys(this.options);
                for (let i=0; i<keys.length; i++){
                    let item = {};
                    item.label = this.translate ? this.$tc(this.options[keys[i]][this.labelField]) : this.options[keys[i]][this.labelField];
                    item.value = this.options[keys[i]][this.valueField];

                    if (item.value == this.value){
                        this.displayValue = item.label;
                    } 
                    this.items.push(item);
                    //this.items[this.options[keys[i]].label] = this.options[keys[i]].value;
                }
            }

        }
    },

    mounted(){
        this.initItems();
    }
};
</script>

<style scoped>
</style>