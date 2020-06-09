<template>
    <v-col cols=12 class="pb-0 pt-1">
        <div v-if="!editing">
            <label class="label">
                {{$tc(displayLabel)}}&nbsp;
                <v-tooltip right v-if="field.help_text">
                    <template v-slot:activator="{ on }">
                        <v-icon color="label_colour" v-on="on">mdi-help-circle-outline</v-icon>
                    </template>
                    <span>{{field.help_text}}</span>
                </v-tooltip>
            </label>
            <p class="value">{{value}}</p>
        </div>
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
                    :disabled="disabled"
                    outline
                ></v-text-field>
            </ValidationProvider>
            <div v-else>
                <ValidationProvider :rules="validate" v-slot="{ errors }" :name="displayLabel ? $tc(displayLabel) : ''">
                    <v-file-input
                        :label="$tc(displayLabel)"
                        :name="name"
                        v-model="val"
                        :disabled="disabled"
                        :error-messages="errors.length > 0 ? [errors[0]] : []" >
                    </v-file-input>
                </ValidationProvider>
            </div>
        </div>
    </v-col>
</template>

<script>

export default {

    props: {
        name: String,
        value: [String, Object, Array, Boolean, File],
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
    },
    data() {
        return {
            val: this.value,
            validate: ((this.field.required) ? 'required' : ''),
            allowURL: this.field.field_name === "url",
            isURL: this.field.field_name === "url" ? true : false,
            scopeName: this.scope + '.' + this.name,
            api: null,
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
    label.label{
        font-size: 16px;
        font-weight: bold;
        color: var(--v-faded_text-base);
    }
    p.value{
        font-size: 16px;
        color: var(--v-faded_text-base);
    }

    .fullWidth{
        width: 100%;
    }
</style>
