<template>
    <v-col v-if="!isEmpty" cols=12 class="py-2 mb-4">
        <label class="label">
            {{$tc(displayLabel)}}
        </label>
        <div v-if="!editing">
            <v-dialog v-model="expandDialog" width="100%">
                <template v-slot:activator="{ on }">
                    <v-row>
                        <v-col cols=2>
                            <v-btn v-on="on" text small color="label_colour">
                                <v-icon>mdi-fullscreen</v-icon>&nbsp;{{$tc("Expand")}}
                            </v-btn>
                        </v-col>
                    </v-row>
                </template>
                <v-card>
                    <v-card-title class="header">
                        <span>{{$tc(displayLabel)}}</span>
                        <v-spacer></v-spacer>
                        <v-btn text small depressed class="noHover" @click="expandDialog = false"><v-icon color="text">mdi-close</v-icon></v-btn>
                    </v-card-title>
                    <v-card-text>
                        <v-container>
                            <v-row>
                                <v-col cols=12>
                                    <v-data-table
                                        :headers="headers"
                                        :items="model"
                                        :items-per-page="20"
                                    ></v-data-table>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-card-text>
                </v-card>
            </v-dialog>
            <v-data-table
                dense
                class="tableText"
                :headers="headers"
                :items="model"
                :items-per-page="5"
            ></v-data-table>
        </div>
    </v-col>
</template>

<script>
import { mapGetters } from "vuex";
export default {

    props: {
        field: Object,
        dataset: Object,
        orgArray: Array,
        editing: Boolean,
        scope: String,
        disabled: {
            type: Boolean,
            default: false
        },
        formDefaults: {
            type: Object,
            default: () => {}
        },
    },

    data() {
        return {
            model: [{}],
            hasDisplayed: false,
            dateMenuOpen: false,
            rerenderKey: 0,
            expandDialog: false,
            hasValues: false
        }
    },

    methods: {

        getDisplayValue: function(field, value) {
            if (field.choices) {
                for (let choice of field.choices) {
                    if (choice.value === value) {
                        return choice.label;
                    }
                }
            }
            return value;
        }
    },
    computed: {
        displayLabel: function(){
            let required = ( (this.field.required) || (this.field.validators && this.field.validators.indexOf('conditional_required')!==-1) )
            return this.field.label + (this.editing && required ? '*' : '');
        },

        headers: function(){
            var head = [];
            for (let i=0; i<this.field.repeating_subfields.length; i++){
                head.push({
                    text: this.field.repeating_subfields[i].label,
                    value: this.field.repeating_subfields[i].field_name,
                });
            }
            return head;
        },

        isEmpty: function() {
            for (let val of this.model) {
                for (let subfield of this.field.repeating_subfields) {
                    if (val[subfield.field_name]) return false;
                }
            }
            return true;
        },

        ...mapGetters("organization", {
            orgTitle: "titleByID",
            orgName: "nameByID"
        }),
        fieldValue: function(){
            return this.dataset[this.field.field_name];
        }
    },
    mounted(){
        if (this.dataset[this.field.field_name]){
            //THIS IS REQUIRED OR NOTHING WORKS FOR SOME REASON...:(
            this.model = [];
            let value = this.dataset[this.field.field_name];
            if (typeof value === 'string') {
                value = JSON.parse(value);
            }

            for (let val of value) {
                for (const subfield in val) {
                    if (subfield == 'displayed') {
                        this.hasDisplayed = true;
                        if (val[subfield] || (val[subfield] instanceof Array && val[subfield][0])) {
                            val[subfield] = true;
                        }
                    }
                }
                this.model.push(JSON.parse(JSON.stringify(val)));
            }
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

<style>
    .tableText.v-data-table>.v-data-table__wrapper>table>tbody>tr>td{
        font-size: 10px;
    }
</style>
