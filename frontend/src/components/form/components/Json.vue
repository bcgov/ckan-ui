<template>
    <v-col cols=12 class="py-2">
        <div v-if="!editing">
            <label class="label fixedWidth">
                {{$tc(displayLabel)}}&nbsp;
                <v-tooltip right v-if="field.help_text">
                    <template v-slot:activator="{ on }">
                        <v-icon color="label_colour" v-on="on">mdi-help-circle-outline</v-icon>
                    </template>
                    <span>{{field.help_text}}</span>
                </v-tooltip>
            </label>
            <span>{{ (empty) ? $tc("Not provided") : val  }}</span>
        </div>
        <ValidationProvider v-else-if="field.form_snippet !== null" :rules="validate" v-slot="{ errors }" :name="$tc(displayLabel)">
            <v-textarea
                :label="$tc(displayLabel)"
                :name="name"
                v-model="val"
                :placeholder="placeholder"
                :error-messages="errors.length > 0 ? [errors[0]] : []"
                auto-grow
                :disabled="disabled"
                outline
            ></v-textarea>
        </ValidationProvider>
    </v-col>
</template>

<script>
export default {

    props: {
        name: String,
        value: [String, Object, Array, Boolean],
        label: String,
        editing: Boolean,
        placeholder: String,
        field: Object,
        scope: String,
        disabled: {
            type: Boolean,
            default: false
        },
    },
    data() {
        return {
            val: (typeof(this.value) !== 'string') ? JSON.stringify(this.value) : this.value,
            validate: ((this.field.required)? 'required' : ''),
            scopeName: this.scope + '.' + this.name,
        }
    },
    computed: {
        displayLabel: function(){
            return this.label + (this.field.required ? '*' : '');
        },
        empty: function(){
            return ( (!this.val) || (this.val === "{}") || (this.val === "") );
        }
    },
    watch: {
        val(){
            this.$emit('edited', this.val);
        },
    },
    mounted(){
        this.$emit('edited', this.val);
    },
    methods: {
        validator: function(){
            return {
                getMessage(field) {
                    return field + " is not valid JSON"
                },
                validate(value){
                    try{
                        return value.length === 0 || ( JSON.stringify(JSON.parse(value)) === value );
                    }catch(e){
                        return false;
                    }
                }
            }
        }
    }

};
</script>

<style scoped>
.fullWidth{
    width: 100%;
}

.fixedWidth{
    width: 300px;
    display: inline-block;
}
</style>
