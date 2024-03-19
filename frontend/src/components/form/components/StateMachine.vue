<template>
    <v-col v-if="editing" cols=12 class="py-2">
        <label :class="'label fixedWidth' + ((multilineDisplay) ? 'block' : '') ">
            {{$tc(displayLabel)}}
        </label>
        <div>
            <span class="help-text">{{field.help_text}}</span>
            <ValidationProvider :rules="( (field.required) || (field.validators && field.validators.indexOf('conditional_required')!==-1) ) ? 'required' : ''" v-slot="{ errors }" :name="$tc(displayLabel)">
                <v-radio-group v-model="val"
                    dense
                    :error-messages="errors.length > 0 ? [errors[0]] : []">
                    <v-radio v-for="(option, k) in options"
                        :key="k"
                        :label="option.label"
                        :value="option.value"
                        :disabled="!(option.value == val || validStates.includes(option.value))">
                    </v-radio>
                </v-radio-group>
            </ValidationProvider>
        </div>
    </v-col>
</template>

<script>
import { mapGetters, mapState } from "vuex";

import Permissions from '@/mixins/permissions';

export default {
    mixins: [Permissions],

    props: {
        name: String,
        value: String,
        initialValue: String,
        label: String,
        editing: Boolean,
        placeholder: String,
        options: [Array, Object],
        conditionalRedraw: Number,
        includeBlank: Boolean,
        emitOnChange: String,
        orgId: String,
        
        labelField: {
            type: String,
            default: "label"
        },
        valueField: {
            type: String,
            default: "value"
        },
        field: Object,
        scope: String,
        translate: {
            type: Boolean,
            default: true
        },
        selectableOptions: {
            type: Array,
            default: () => { return []; }
        },
        disabled: {
            type: Boolean,
            default: false
        },
        multilineDisplay: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            val: this.value,
            scopeName: this.scope + '.' + this.name,
            validStates: [],
            labelLookup: {},
            stepNo: -1,
            redrawIndex: 0
        }
    },

    computed: {
        displayLabel: function() {
            let required = ( (this.field.required) || (this.field.validators && this.field.validators.indexOf('conditional_required')!==-1) )
            return this.label + (this.editing && required ? '*' : '');
        },
        ...mapState({
            sysAdmin: state => state.user.sysAdmin,
            userPermissions: state => state.user.userPermissions,
        }),
        ...mapGetters("organization", {
            ancestorsByName: "ancestorsByName",
            orgName: "nameByID"
        }),
    },

    watch: {
        val(){
            this.$emit('edited', this.val);
        },
    },

    mounted() {
        const {sysAdmin, admin, editor} = this.getUserPermissionsForOrganization(this.orgName(this.orgId));
        const currentState = this.options.find(( option ) => option.value == this.val);
        if (currentState) {
            this.validStates = currentState.validTo.map( ( state ) => {
                if (sysAdmin && state.by.includes('sysadmin') || 
                        admin && state.by.includes('admin') || 
                        editor && state.by.includes('editor')) {
                    return state.state;
                }
            });
            this.validStates.push(this.val);
        } else {
            this.validStates = [this.field.startState];
        }
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
    .help-text {
        font-size: 12px;
        color: rgba(0, 0, 0, 0.6);
    }
    .fixedWidth{
        width: 300px;
        display: inline-block;
    }
    >>>.v-radio label {
        font-weight: normal;
    }
</style>