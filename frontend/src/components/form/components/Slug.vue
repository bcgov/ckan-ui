<template>
    <div>
        <div v-if="!editing">
            <label>{{$tc(label)}}:</label>
            <span>{{value}}</span>
        </div>
        <ValidationProvider v-else :rules="validate" v-slot="{ errors }" :name="$tc(displayLabel)">
            <v-text-field
                :label="$tc(displayLabel)"
                :name="name"
                v-model="val"
                :placeholder="placeholder"
                v-on:keyup="modified = true"
                :error-messages="errors.length > 0 ? [errors[0]] : []"
                outline
            ></v-text-field>
        </ValidationProvider>
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
            validate: {required: this.field.required, slug: true},
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
            this.validate['required'] = true;
        }
    },
    
};
</script>

<style scoped>
</style>