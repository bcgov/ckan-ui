<template>
    <div>
        <div v-if="!editing">
            <label>{{$tc(label)}}:</label>
            <span>{{value}}</span>
        </div>
        <v-text-field v-else
            :label="$tc(displayLabel)"
            :name="name"
            v-model="val"
            :placeholder="placeholder"
            v-on:keyup="modified = true"
            v-validate="validate"
            :data-vv-name="scopeName"
            :data-vv-as="$tc(displayLabel)"
            :data-vv-scope="scope"
            :error-messages="errors.first(scopeName) ? [errors.first(scopeName)] : []"
            outline
        ></v-text-field>
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
        field: Object,
        scope: String,  
    },
    data() {
        return {
            val: this.value,
            validate: {url: {require_tld: false, require_host: false}},
            scopeName: this.scope + '.' + this.name,
        }
    },
    watch: {
        val(){
            this.$emit('edited', this.val);
        },
    },
    computed: {
        displayLabel: function(){
            return this.label + (this.field.required ? '*' : '');
        }
    },
    mounted() {
        if (this.field.required){
            this.validate['required'] = {};
        }
    }
    
};
</script>

<style scoped>
</style>