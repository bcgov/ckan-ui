<template>
    <v-col v-if="editing || displayValue" cols=12 class="py-2">
        <label class="label">
            {{$tc(displayLabel)}}
        </label>
        <div v-if="!editing">
            <p class="value">{{displayValue}}</p>
        </div>
        <ValidationProvider v-else :rules="( (field.required) || (field.validators && field.validators.indexOf('conditional_required')!==-1) ) ? 'required' : ''" v-slot="{ errors }" :name="$tc(displayLabel)">
            <v-autocomplete
                :name="name"
                :loading="loading"
                v-model="val"
                :placeholder="placeholder"
                :items="items"
                :item-text="itemTextField"
                :item-value="itemValueField"
                :hint="field.help_text"
                persistent-hint
                cache-items
                chips
                deletable-chips
                :multiple="multi"
                :disabled="disabled"
                outlined
                :error-messages="errors.length > 0 ? [errors[0]] : []"
                background-color="text"
            ></v-autocomplete>
        </ValidationProvider>
    </v-col>
</template>

<script>
export default {

    props: {
        name: String,
        value: [Array, String],
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
        multi: {
            type: Boolean,
            default: true
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

    methods: {
        computeVal(){
            if (this.multi){
                if (typeof(this.value) === "string"){
                    if ( (this.value.length === 0) || (this.value === "[]") ){
                        this.val = "";
                    }else{
                        this.val = this.value.join(" ");
                    }
                }
            }else{
                if (typeof(this.value) === "object"){
                    if (this.value.length === 0){
                        this.val = "";
                    }else{
                        this.val = this.value.join(" ")
                    }
                }
            }
            for (let i=0; i<this.items.length; i++){
                if (this.val.indexOf(this.items[i][this.itemValueField]) !== -1){
                    this.displayValue += this.items[i][this.itemTextField] + ",";
                }
            }
            if (this.displayValue.length > 0){
                this.displayValue = this.displayValue.substring(0,this.displayValue.length-1);
            }else{
                this.displayValue = null;
            }
        }
    },

    mounted(){
        this.computeVal();
    },

    computed: {
        displayLabel: function(){
            let required = ( (this.field.required) || (this.field.validators && this.field.validators.indexOf('conditional_required')!==-1) )
            return this.label + (this.editing && required ? '*' : '');
        }
    },
    watch: {
        value(){
            this.val = this.value;
            this.computeVal();
        },

        val(){
            if (this.multi){
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
                    this.$emit('edited', JSON.stringify());
                }
            }else{
                this.$emit('edited', this.val);
            }
        },
    }
};
</script>

<style scoped>
    label.label{
        font-size: 16px;
        font-weight: bold;
        color: var(--v-faded_text-base);
    }
    .value{
        font-size: 16px;
        color: var(--v-faded_text-base);
    }
    >>>.v-messages__message {
        margin-left: -12px !important;
    }
</style>
