<template>
    <v-col v-if="editing || showView" cols=12 class="py-2 mb-4">
        <label class="label">
            {{$tc(displayLabel)}}{{( (field.required) || (field.validators && field.validators.indexOf('conditional_required')!==-1) ) ? '*' : ''}}
        </label>
        <div v-if="!editing">
            <div class="mb-2">
                <div v-for="(sub, key) in field.subfields" :key="field.field_name+'-'+key">
                    <v-row v-if="(sub.display_snippet !== null || sub.preset !== null) && model[sub.field_name]" align="center">
                        <v-col cols=12 class="py-1">
                            <label class="sub-label fixedWidth">
                                {{(sub.label !== '') ? $tc(sub.label) : $tc(sub.field_name)}}
                            </label>
                        
                            <span v-if="sub.display_snippet === 'url'">
                                <a :href="model[sub.field_name]" style="text-overflow: ellipsis">{{model[sub.field_name]}}</a>
                            </span>
                            <span v-else-if="sub.field_name === 'email'">
                                <a :href="'mailto:'+model[sub.field_name]">{{model[sub.field_name]}}</a>
                            </span>
                            <span v-else-if="sub.preset === 'select'" class="value">{{getDisplayValue(sub, value[sub.field_name])}}</span>
                            <span v-else class="value">{{model[sub.field_name]}}</span>
                        </v-col>
                    </v-row>
                </div>
            </div>
            <hr>
        </div>
        <div v-else :key="'composite'+field.field_name" class="mb-2">
            <span class="help-text">{{field.help_text}}</span>
            <v-row v-for="(sub, key) in field.subfields" :key="field.field_name+'-'+key" align="center">
                <v-col cols=2 class="pb-0">
                    <label class="sub-label">{{(sub.label !== '') ? $tc(sub.label) : $tc(sub.field_name)}}</label>
                </v-col>
                <v-col cols=10 class="pb-0">
                    <ValidationProvider v-if="sub.preset=='multiple_checkbox'" :rules="( !!sub.required || (!!sub.validators && sub.validators.indexOf('conditional_required') !== -1)) ? 'required' : ''" v-slot="{ errors }" :name="(sub.label !== '') ? $tc(sub.label) : $tc(sub.field_name)">
                        <v-checkbox
                            dense
                            class="mt-0"
                            :name="field.field_name+'.'+sub.field_name"
                            v-model="model[sub.field_name]"
                            :hint="sub.help_text"
                            persistent-hint
                            :error-messages="errors.length > 0 ? [errors[0]] : []"
                            :disabled="disabled"
                            hide-details="auto"
                            @change="modified">
                        </v-checkbox>
                    </ValidationProvider>

                    <ValidationProvider v-else-if="sub.field_name==='org'" :rules="( !!sub.required || (!!sub.validators && sub.validators.indexOf('conditional_required') !== -1)) ? 'required' : ''" v-slot="{ errors }" :name="(sub.label !== '') ? $tc(sub.label) : $tc(sub.field_name)">
                        <v-select
                            :name="field.field_name+'.'+sub.field_name"
                            v-model="model[sub.field_name]"
                            :placeholder="sub.form_placeholder"
                            :items="orgArray"
                            item-text="label"
                            :disabled="disabled"
                            item-value="value"
                            :hint="sub.help_text"
                            persistent-hint
                            outlined dense
                            hide-details="auto"
                            :error-messages="errors.length > 0 ? [errors[0]] : []"
                            @change="modified"
                            background-color="text">
                        </v-select>
                    </ValidationProvider>

                    <ValidationProvider v-else-if="sub.preset==='select'" :rules="( !!sub.required || (!!sub.validators && sub.validators.indexOf('conditional_required') !== -1)) ? 'required' : ''" v-slot="{ errors }" :name="(sub.label !== '') ? $tc(sub.label) : $tc(sub.field_name)">
                        <v-select
                            :name="field.field_name+'.'+sub.field_name"
                            v-model="model[sub.field_name]"
                            :placeholder="sub.form_placeholder"
                            :items="sub.choices"
                            item-text="label"
                            item-value="value"
                            :hint="sub.help_text"
                            persistent-hint
                            outlined dense
                            hide-details="auto"
                            :disabled="disabled"
                            :error-messages="errors.length > 0 ? [errors[0]] : []"
                            @change="modified"
                            background-color="text">
                        </v-select>
                    </ValidationProvider>

                    <ValidationProvider v-else-if="((field.field_name.toLowerCase().indexOf('date')>=0) || (sub.preset === 'date') )" :rules="(( !!sub.required || (!!sub.validators && sub.validators.indexOf('conditional_required') !== -1)) ? 'required|' : '') + 'date_format:yyyy-mm-dd'" v-slot="{ errors }" :name="(sub.label !== '') ? $tc(sub.label) : $tc(sub.field_name)">
                        <v-menu
                            :ref="field.field_name+'.'+sub.field_name"
                            :nudge-right="40"
                            transition="scale-transition"
                            offset-y
                            min-width="290px"
                        >
                            <template v-slot:activator="{ on }">
                                <v-text-field
                                    outlined dense
                                    hide-details="auto"
                                    :name="field.field_name+'.'+sub.field_name"
                                    v-model="model[sub.field_name]"
                                    :placeholder="sub.form_placeholder"
                                    :error-messages="errors.length > 0 ? [errors[0]] : []"
                                    :disabled="disabled"
                                    :hint="sub.help_text"
                                    persistent-hint
                                    readonly
                                    clearable
                                    @click:clear="clearField(sub.field_name);"
                                    v-on="on"
                                    background-color="text"
                                ></v-text-field>
                            </template>
                            <v-date-picker :disabled="disabled" v-model="model[sub.field_name]" @input="modified(field.field_name+'.'+sub.field_name);"></v-date-picker>
                        </v-menu>
                    </ValidationProvider>

                    <ValidationProvider v-else-if="sub.field_name.toLowerCase().indexOf('email')>=0" :rules="(( !!sub.required || (!!sub.validators && sub.validators.indexOf('conditional_required') !== -1)) ? 'required|' : '') + 'email'" v-slot="{ errors }" :name="(sub.label !== '') ? $tc(sub.label) : $tc(sub.field_name)">
                        <v-text-field
                            outlined dense
                            hide-details="auto"
                            :name="field.field_name+'.'+sub.field_name"
                            v-model="model[sub.field_name]"
                            :placeholder="sub.form_placeholder"
                            :hint="sub.help_text"
                            persistent-hint
                            :error-messages="errors.length > 0 ? [errors[0]] : []"
                            :disabled="disabled"
                            @input="modified"
                            background-color="text">
                        </v-text-field>
                    </ValidationProvider>

                    <ValidationProvider v-else-if="sub.field_name.toLowerCase().indexOf('url')>=0" :rules="{required: ( !!sub.required || (!!sub.validators && sub.validators.indexOf('conditional_required') !== -1)), url: {require_tld: true, require_host: true}}" v-slot="{ errors }" :name="(sub.label !== '') ? $tc(sub.label) : $tc(sub.field_name)">
                        <v-text-field
                            outlined dense
                            hide-details="auto"
                            :name="field.field_name+'.'+sub.field_name"
                            v-model="model[sub.field_name]"
                            :placeholder="sub.form_placeholder"
                            :hint="sub.help_text"
                            persistent-hint
                            :disabled="disabled"
                            :error-messages="errors.length > 0 ? [errors[0]] : []"
                            @input="modified"
                            background-color="text">
                        </v-text-field>
                    </ValidationProvider>

                    <ValidationProvider v-else :rules="( !!sub.required || (!!sub.validators && sub.validators.indexOf('conditional_required') !== -1)) ? 'required' : ''" v-slot="{ errors }" :name="(sub.label !== '') ? $tc(sub.label) : $tc(sub.field_name)">
                        <v-text-field
                            outlined dense
                            hide-details="auto"
                            :name="field.field_name+'.'+sub.field_name"
                            v-model="model[sub.field_name]"
                            :placeholder="sub.form_placeholder"
                            :hint="sub.help_text"
                            persistent-hint
                            :disabled="disabled"
                            :error-messages="errors.length > 0 ? [errors[0]] : []"
                            @input="modified"
                            background-color="text">
                        </v-text-field>
                    </ValidationProvider>
                </v-col>
            </v-row>
        </div>
        <hr>
    </v-col>
</template>

<script>
export default {

    props: {
        field: Object,
        dataset: Object,
        value: {
            type: [Object, String],
            default: () => { return {}; }
        },
        editing: Boolean,
        scope: String,
        disabled: {
            type: Boolean,
            default: false
        },
    },
    data() {
        return {
            dateMenuOpen: false,
            showView: false,
            model: {}
        }
    },
    methods: {
        modified: function(refName) {
            if ( (typeof(refName) !== "undefined") && (typeof(this.$refs[refName]) !== "undefined") ){
                this.$refs[refName] = false;
            }
            this.$emit('edited', JSON.stringify(this.model));
        },
        getDisplayValue: function(field, value) {
            if (field.choices) {
                for (let choice of field.choices) {
                    if (choice.value === value) {
                        return choice.label;
                    }
                }
            }
            return value;
        },
        clearField: function(field) {
            this.model[field] = '';
            this.$emit('edited', JSON.stringify(this.model));
        }
    },
    watch: {
        value: function(){
            if (typeof(this.value) === 'string'){
                this.model = JSON.parse(this.value);
            }else{
                this.model = this.value;
            }
        }
    },
    computed: {
        displayLabel: function(){
            let required = ( (this.field.required) || (this.field.validators && this.field.validators.indexOf('conditional_required')!==-1) )
            return this.field.label + (this.editing && required ? '*' : '');
        }
    },
    mounted(){
        if (this.value){
        //     //THIS IS REQUIRED OR NOTHING WORKS FOR SOME REASON...:(
            if (typeof(this.value) === 'string'){
                this.model = JSON.parse(this.value);
            }else{
                this.model = this.value;
            }
        }
        for (let i=0; i<this.field.subfields.length; i++){
            if (this.model[this.field.subfields[i].field_name] && !this.showView) {
                this.showView = true;
            }
        }
        this.$emit('edited', JSON.stringify(this.model));
    },
};
</script>

<style scoped>
    .fixedWidth{
        width: 300px;
        display: inline-block;
    }
    label.label{
        font-size: 16px;
        font-weight: bold;
        color: var(--v-faded_text-base);
    }
    label.sub-label{
        font-size: 16px;
        font-weight: bold;
        color: var(--v-faded_text-base);
    }
    .value{
        font-size: 16px;
        color: var(--v-faded_text-base);
    }
    hr{
        color: var(--v-icon-base);
        border-bottom: 0px;
    }
    .help-text {
        font-size: 12px;
        color: rgba(0, 0, 0, 0.6);
    }
</style>
