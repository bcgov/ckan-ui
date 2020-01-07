<template>
    <div>
        <div v-if="!editing">
            <v-img :src="imgSrc" v-on:error="onImgError"></v-img>
        </div>
        <div v-else>
            <label>{{$tc(displayLabel)}}</label>
            <ValidationProvider :rules="validate" v-slot="{ errors }" :name="displayLabel ? $tc(displayLabel) : ''">
                <v-text-field
                    :label="$tc(displayLabel)"
                    :name="name"
                    v-model="val"
                    :placeholder="placeholder"
                    :error-messages="errors.length > 0 ? [errors[0]] : []"
                    :disabled="disabled"
                    outline
                ></v-text-field>
            </ValidationProvider>
        </div>
    </div>
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
        parentObject: Object,
        image: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            val: this.value,
            validate: ((this.field.required) ? 'required' : ''),
            allowURL: this.field.field_name === "url",
            isURL: this.field.field_name === "url" ? true : false,
            scopeName: this.scope + '.' + this.name,
            api: null,
            imgError: false,
            imgSrc: this.value
        }
    },
    methods: {
        onImgError(){
            this.imgSrc = '/placeholder-organization.png'
        }
    },
    computed: {
        displayLabel: function(){
            return this.label + (this.field.required ? '*' : '');
        },
    },
    watch: {
        value(){
            this.val = this.value;
            this.imgSrc = this.val;
        },
        val(){
            this.$emit('edited', this.isURL, this.val);
        },
    },
    mounted(){
    }

};
</script>

<style scoped>
</style>