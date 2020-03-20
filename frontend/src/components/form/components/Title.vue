<template>
    <v-col cols=12 class="pb-0 pt-1">
        <h2 v-if="!editing">
            {{value}}
        </h2>
        <div v-else>
            <label class="label">{{$tc(displayLabel)}}</label>
            <ValidationProvider :rules="(field.required)? 'required' : ''" v-slot="{ errors }" :name="$tc(displayLabel)">
                <v-text-field
                    :name="name"
                    v-model="val"
                    :placeholder="placeholder"
                    outlined dense
                    :error-messages="errors.length>0 ? [errors[0]] : []"
                    :disabled="disabled"
                ></v-text-field>
            </ValidationProvider>
        </div>
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
            scopeName: this.scope + '.' + this.name,
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
};
</script>

<style scoped>
    label.label{
        color: var(--v-label_text-base);
    }
</style>
