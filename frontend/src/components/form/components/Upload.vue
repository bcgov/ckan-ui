<template>
    <div>
        <div v-if="!editing">
            <label>{{$tc(label)}}: </label>
            <span>{{value}}</span>
        </div>
        <div v-else>
            <label>{{$tc(displayLabel)}}</label>
            <div v-if="allowURL">
                <v-switch
                    v-model="isURL"
                    :label="isURL ? 'URL' : 'File'"
                ></v-switch>
            </div>
            <ValidationProvider v-if="isURL" :rules="validate" v-slot="{ errors }" :name="displayLabel ? $tc(displayLabel) : ''">
                <v-text-field
                    :label="$tc(displayLabel)"
                    :name="name"
                    v-model="val"
                    :placeholder="placeholder"
                    :error-messages="errors.length > 0 ? [errors[0]] : []"
                    outline
                ></v-text-field>
            </ValidationProvider>
            <div v-else>
                <ValidationProvider :rules="validate" v-slot="{ errors }" :name="displayLabel ? $tc(displayLabel) : ''">
                    <v-file-input 
                        :label="$tc(displayLabel)"
                        :name="name"
                        v-model="val"
                        :error-messages="errors.length > 0 ? [errors[0]] : []" >
                    </v-file-input>
                </ValidationProvider>
            </div>
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
    },
    data() {
        return {
            val: this.value,
            validate: ((this.field.required) ? 'required' : ''),
            allowURL: this.field.field_name === "url",
            isURL: this.field.field_name === "url" ? true : false,
            scopeName: this.scope + '.' + this.name,
        }
    },
    computed: {
        displayLabel: function(){
            return this.label + (this.field.required ? '*' : '');
        }
    },
    watch: {
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