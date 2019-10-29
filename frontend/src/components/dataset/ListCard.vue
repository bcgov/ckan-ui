<template>
  <v-container fluid align-center align-content-center justify-center>
      <v-row wrap mb-1>
          <v-col cols=12>
            <h3>
                <router-link :id="'dataset-link-'+record.id" :to="{ name: 'dataset_view', params: { datasetId: name }}" class="titleLink">
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                            <v-icon class="mr-2" color="primary" v-on="on">{{iconName}}</v-icon>
                        </template>
                        <span>{{iconToolTip}}</span>
                    </v-tooltip>
                    <span>{{title}}</span>
                </router-link>
            </h3>
          </v-col>
      </v-row>
      
      <v-row wrap>
          <v-col cols=12 my-0 py-0>
              <p v-line-clamp:1.5="2" >{{description}}</p>
          </v-col>
      </v-row>

      <v-row wrap>
        <v-col cols=4><strong>{{sector}}</strong> - Record Published: {{publishDate}}</v-col>
        <v-col cols=8 class="text-xs-right"><em>{{types}}</em></v-col>
      </v-row>


  </v-container>
</template>

<script>

export default {
    components: {
        
    },
    props: {
        record: Object,
    },

    computed: {
        types: function(){
            var types = '';
            for (var i=0; i<this.resourceTypes.length; i++){
                types += this.resourceTypes[i] + ",";
            }

            if (types.length > 0){
                types = types.substring(0, types.length-1);
            }

            return types;
        }
    },

    data: function() {
        if (typeof(this.record.id) === "undefined" ){
            return {
                resourceTypes: [],
                publishDate: ""
            }
        }
        let resourceTypes = []
        if (typeof(this.record.resources) !== "undefined"){
            for (let i=0; i<this.record.resources.length; i++){
                let format = this.record.resources[i].format
                if (resourceTypes.indexOf(format) === -1) {
                    resourceTypes.push(format)
                }
            }

            resourceTypes.sort(function(a, b){
                return a < b ? -1 : 1;
            });
        }

        let icon = ""
        let tooltip = ""

        switch(this.record.type){
            case "Geographic":
                icon = "public"
                tooltip = "Geographic"
                break

            case "Dataset":
                icon = "table_chart"
                tooltip = "Dataset"
                break

            case "Application":
                icon = "web_asset"
                tooltip = "Application"
                break

            case "Api":
                icon = "code"
                tooltip = "Web Service / API"
                break
            
            case "WebService":
                icon = "code"
                tooltip = "Web Service / API"
                break

            default:
                icon = ""
                break
        }

        return {
            publishDate: this.record.record_publish_date,
            resourceTypes: resourceTypes,
            description: this.record.notes,
            id: this.record.id,
            title: this.record.title,
            name: this.record.name,
            iconName: icon,
            iconToolTip: tooltip,
            primMarkers: [{
                name: this.record.sector
            }],
            sector: this.record.sector
        };
    },
}

</script>

<style scoped>
    .dataset-markers{
        float: right;
    }

    .titleLink{
        text-decoration: none;
    }

    .titleLink:hover{
        text-decoration: underline;
    }

    .dataset-heading a {
        color: #333;
        font-size: 16px;
        line-height: 1.3;
    }

    .dataset-marker-type-icon {
        float: right;
    }

    .dataset-decription{
        line-height: 13px;
        font-size: 13px;
        color: #444;
    }

    ul {
        list-style-type: none;
    }

    .flex-fill-end{
        display: flex;
        width: 100%;
        justify-content: flex-end;
    }

    .dates{
        color: #999;
        font-size: 13px;
        line-height: 13px;
        text-align: left;
    }

    .dataset-resources {
      float: right;
    }

</style>
