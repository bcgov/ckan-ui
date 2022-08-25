<template>
  <v-card>
      <v-toolbar color="primary">
          <v-btn class="no-right-margin" icon @click="$emit('closePreviewDialog')">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>{{name}} - Schema {{preview.schemaInferred ? '(Inferred)' : ''}}</v-toolbar-title>
      </v-toolbar>
      <v-card-text>

            <div v-if="schemaError">
                {{schemaError}}
            </div>

            <div v-else-if="fields.length>0">
                <div>
                    <v-radio-group v-model="showRaw" row>
                        <v-radio
                            label="Raw"
                            :value="true">
                        </v-radio>
                        <v-radio
                            label="Rendered"
                            :value="false">
                        </v-radio>
                    </v-radio-group>
                </div>
                <span v-if="!showRaw">
                    <div v-for="field in fields" :key="'schema'+((field.name && field.name.text ? field.name.text : false) || field.name || field._descriptor.name)">
                        <h3>Field: {{(field.name && field.name.text ? field.name.text : false) || field.name || field._descriptor.name}}</h3>
                        <div class="capitalize" v-if="field.type || (field._descriptor && field._descriptor.type)">Type: {{field.type || field._descriptor.type}}</div>
                        <div class="capitalize" v-if="field.description || (field._descriptor && field._descriptor.description)">Description: {{field.description || field._descriptor.description}}</div>
                        <!-- <div>{{field.constraints}} {{ field._descriptor.constraints}}</div> -->
                        <div class="capitalize" v-if="(field.constraints && field.constraints.required) || (field._descriptor && field._descriptor.constraints && field._descriptor.constraints.required)">Required: {{(field.constraints && typeof(field.constraints.required)!=='undefined' ? (field.constraints.required ? "Yes" : "No") : false) || field._descriptor.constraints.required ? "Yes" : "No"}}</div>
                        <div class="capitalize" v-if="field.format || (field._descriptor && field._descriptor.format)">Format: {{field.format || field._descriptor.format}}</div>
                        <div class="capitalize" v-if="field._descriptor">
                            Constraints: <br />
                            <ul>
                                <li class="capitalize" v-for="(cons, key) in field._descriptor.constraints" :key="'constraint-'+((field.name && field.name.text ? field.name.text : false) || field.name || field._descriptor.name)+'-'+key">
                                    {{key}}: {{cons}}
                                </li>
                            </ul>
                        </div>
                        <div class="capitalize" v-if="field.contraints">
                            Constraints: <br />
                            <ul>
                                <li class="capitalize" v-for="(cons, key) in field.constraints" :key="'constraint-'+((field.name && field.name.text ? field.name.text : false) || field.name || field._descriptor.name)+'-'+key">
                                    {{key}}: {{cons}}
                                </li>
                            </ul>
                        </div>
                        <div v-if="hasOtherInfo(field)">
                        <h4>Other Information</h4>
                            <div v-for="(descript, key) in otherInfo(field)" :key="'genericInfo-'+field.name+'-'+key">
                                <span class="capitalize">
                                    {{key.replace(/_/g, ' ')}}: 
                                </span>
                                <span>
                                    {{descript}}
                                </span>
                            </div>
                        </div>
                        <hr />
                    </div>
                </span>
                <span v-else>
                    {{preview.schema}}
                </span>
            </div>
            <v-progress-circular
                v-else
                indeterminate
                color="light-blue"
            ></v-progress-circular>

      </v-card-text>
  </v-card>
</template>

<script>

export default{
    components:{
    },
    props: {
        resource: Object,
        preview: Object,
    },
    data() {
        return {
            name: this.resource.metadata.name,
            id: this.resource.metadata.id,
            schemaError: this.preview.schemaError,
            loading: false,
            schema: this.preview.schema,
            fields: [],
            showRaw: false,
            NOT_OTHER_INFO: ['type', 'name', 'description', 'format', 'constraints'],
        }
    },
    methods:{
        hasOtherInfo: function(field){
            let keys = (field._descriptor) ? Object.keys(field._descriptor) : Object.keys(field);
            
            for (let i=0; i<this.NOT_OTHER_INFO.length; i++){
                let ind = keys.indexOf(this.NOT_OTHER_INFO[i]);
                if (ind > -1){
                    keys.splice(ind, 1);
                }   
            }
            return keys
        },

        otherInfo: function(field){
            let keys = this.hasOtherInfo(field);
            let otherInfo = {};
            for (let i=0; i<keys.length; i++){
                otherInfo[keys[i]] = field._descriptor ? field._descriptor[keys[i]] : field[keys[i]]
            }
            return otherInfo
        }
    },
    mounted(){
        if (this.preview.schema._fields && !this.schema.fields){
            this.schema.fields = JSON.parse(JSON.stringify(this.preview.schema._fields))
        }
        this.fields = this.schema.fields;
    }

}
</script>

<style scoped>

.capitalize {
  text-transform: capitalize !important;
}

.theme--light.v-sheet{
    color: var(--v-text-base)
}

.no-right-margin{
        margin-right: 0px;
    }

</style>
