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

            <v-text-field v-if="isURL"
                :label="$tc(displayLabel)"
                :name="name"
                v-model="val"
                :placeholder="placeholder"
                v-validate="validate"
                :data-vv-name="scopeName"
                :data-vv-as="$tc(displayLabel)"
                :data-vv-scope="scope"
                :error-messages="errors.first(scopeName) ? [errors.first(scopeName)] : []"
                outline
            ></v-text-field>
            <div v-else>
                <input 
                    type='file' 
                    :name="name"
                    v-validate="validate"
                    :data-vv-name="scopeName"
                    :data-vv-as="$tc(displayLabel)"
                    :data-vv-scope="scope"
                    :error-messages="errors.first(scopeName) ? [errors.first(scopeName)] : []" />
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
            this.$emit('edited', this.model);
        },
    },
    mounted(){
    }

};
</script>

<style scoped>
</style>