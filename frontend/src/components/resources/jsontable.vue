<template>
  <v-card>
      <v-toolbar color="primary">
          <v-btn class="no-right-margin" icon @click="$emit('closePreviewDialog')">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>{{name}} - Schema {{resource.schemaInferred ? '(Inferred)' : ''}}</v-toolbar-title>
      </v-toolbar>
      <v-card-text>

            <div v-if="schemaError">
                Q{{schemaError}}
            </div>


            <div v-else-if="fields.length>0">
                <div v-for="field in fields" :key="'schema'+((field.name && field.name.text ? field.name.text : false) || field.name || field.descriptor.name)">
                    <h3>Field: {{(field.name && field.name.text ? field.name.text : false) || field.name || field.descriptor.name}}</h3>
                    <div class="capitalize" v-if="field.type || field.descriptor.type">Type: {{field.type || field.descriptor.type}}</div>
                    <div class="capitalize" v-if="field.description || (field.descriptor && field.descriptor.description)">Description: {{field.description || field.descriptor.description}}</div>
                    <!-- <div>{{field.constraints}} {{ field.descriptor.constraints}}</div> -->
                    <div class="capitalize" v-if="(field.constraints && field.constraints.required) || (field.descriptor && field.descriptor.constraints && field.descriptor.constraints.required)">Required: {{(field.constraints && typeof(field.constraints.required)!=='undefined' ? (field.constraints.required ? "Yes" : "No") : false) || field.descriptor.constraints.required ? "Yes" : "No"}}</div>
                    <div class="capitalize" v-if="field.format || (field.descriptor && field.descriptor.format)">Format: {{field.format || field.descriptor.format}}</div>
                    <div class="capitalize" v-if="field.descriptor">
                        Constraints: <br />
                        <ul>
                            <li class="capitalize" v-for="(cons, key) in field.descriptor.constraints" :key="'constraint-'+((field.name && field.name.text ? field.name.text : false) || field.name || field.descriptor.name)+'-'+key">
                                {{key}}: {{cons}}
                            </li>
                        </ul>
                    </div>
                    <div v-if="field.descriptor">
                    <h4>Other Information</h4>
                        <div v-for="(descript, key) in field.descriptor" :key="'genericInfo-'+field.name+'-'+key" class="capitalize">
                            <span v-if="!['type', 'name', 'description', 'format', 'constraints'].includes(key)">
                                {{key}}: {{descript}}
                            </span>
                        </div>
                        <span v-if="Object.keys(field.descriptor).length==5">None</span>
                    </div>
                    <hr />
                </div>
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
        resourceIndex: Number
    },
    data() {
        return {
            name: this.resource.metadata.name,
            id: this.resource.metadata.id,
            schemaError: this.resource.schemaError,
            loading: false,
            schema: this.resource.schema,
            fields: []
        }
    },
    mounted(){
        if (this.resource.schema.Fields && !this.schema.fields){
            this.schema.fields = JSON.parse(JSON.stringify(this.resource.schema.Fields))
        }
        this.fields = this.schema.fields;
    }

}
</script>

<style scoped>

.capitalize {
  text-transform: capitalize;
}

.theme--light.v-sheet{
    color: var(--v-text-base)
}

.no-right-margin{
        margin-right: 0px;
    }

</style>