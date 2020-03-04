<template>
    <v-col cols=12 class="pb-0 pt-1" v-if="editing">
        <label class="label">{{$tc(displayLabel)}}:</label>
        <ValidationProvider :rules="validate" v-slot="{ errors }" :name="$tc(displayLabel)">
            <v-text-field
                :name="name"
                v-model="val"
                :placeholder="placeholder"
                v-on:keyup="modified = true"
                :error-messages="errors.length > 0 ? [errors[0]] : []"
                :disabled="disabled"
                outlined dense
                :prefix="prefix"
            ></v-text-field>
        </ValidationProvider>
    </v-col>
</template>

<script>
export default {

    props: {
        name: String,
        value: String,
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
            val: this.value,
            validate: {required: this.field.required, slug: true},
            scopeName: this.scope + '.' + this.name,
            prefix: window.location.origin + '/dataset/'
        }
    },
    watch: {
        value(){
            this.val = this.value;
        },
        val(){
            this.$emit('edited', this.val);
        },
    },
    computed: {
        displayLabel: function(){
            return this.label + (this.editing && this.field.required ? '*' : '');
        }
    },
    mounted() {
        if (this.field.required){
            this.validate['required'] = true;
        }
    },

};
</script>

<style scoped>
    label.label{
        color: var(--v-label_text-base);
    }
</style>
