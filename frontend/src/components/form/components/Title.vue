<template>
    <v-col cols=12 class="pb-0 pt-1">
        <h2 v-if="!editing" class="title">
            {{value}}
        </h2>
        <div v-else>
            <label class="label">
                {{$tc(displayLabel)}}&nbsp;
                <v-tooltip right v-if="field.help_text">
                    <template v-slot:activator="{ on }">
                        <v-icon color="label_colour" v-on="on">mdi-help-circle-outline</v-icon>
                    </template>
                    <span>{{field.help_text}}</span>
                </v-tooltip>
            </label>
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
        font-size: 16px;
        font-weight: bold;
        color: var(--v-faded_text-base);
    }
    .title {
        font-size: 23px;
        font-weight: bold;
        color: var(--v-faded_text-base);
    }
</style>
