<template>
  <v-container fluid align-center align-content-center justify-center class="mb-4 pl-0">
      <v-row wrap dense class="my-0 py-0">
          <v-col cols=12>
            <h3>
                <router-link :id="'dataset-link-'+record.id" :to="{ name: 'dataset_view', params: { datasetId: name }}" class="titleLink">
                    <span>{{title}}</span>
                </router-link>
            </h3>
          </v-col>
      </v-row>

      <v-row wrap dense class="my-0 py-0">
          <v-col cols=12 class="my-0 py-0">
              <p class="mb-0 pb-0 faded" v-line-clamp:1.5="2" >{{description}}</p>
          </v-col>
      </v-row>

      <v-row wrap dense class="my-0 py-0">
          <v-col cols=12 class="my-0 py-0">
              <router-link class="noUnderline" :to="{name: 'organization_view', params: {organizationId: orgId}}">{{org}}</router-link>
          </v-col>
      </v-row>

      <v-row wrap dense class="my-0 py-0">
        <!--<v-col cols=4 class="faded">{{$tc('Metadata Modified')}}: {{metaModDate}}</v-col>-->
        <v-col cols=5 class="faded">{{$tc('First Published')}}: {{publishDate}}</v-col>
        <v-col cols=5 class="faded text-right"><strong>{{$tc('Data Types')}}: {{types}}</strong></v-col>
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
                types += this.resourceTypes[i] + ", ";
            }

            if (types.length > 0){
                types = types.substring(0, types.length-2);
            }

            return types;
        }
    },

    data: function() {
        if (typeof(this.record.id) === "undefined" ){
            return {
                resourceTypes: [],
                publishDate: "",
                metaModDate: ""
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

        // let icon = ""
        // let tooltip = ""

        // switch(this.record.type){
        //     case "Geographic":
        //         icon = "public"
        //         tooltip = "Geographic"
        //         break

        //     case "Dataset":
        //         icon = "table_chart"
        //         tooltip = "Dataset"
        //         break

        //     case "Application":
        //         icon = "web_asset"
        //         tooltip = "Application"
        //         break

        //     case "Api":
        //         icon = "code"
        //         tooltip = "Web Service / API"
        //         break

        //     case "WebService":
        //         icon = "code"
        //         tooltip = "Web Service / API"
        //         break

        //     default:
        //         icon = ""
        //         break
        // }

        let date = new Date(this.record.metadata_created)
        let pubDate = date.getFullYear() + "-" + (date.getMonth() <= 10 ? "0"+(date.getMonth()+1) : (date.getMonth()+1)) + "-" + date.getDate();

        let d2 = new Date(this.record.metadata_modified)
        let modDate = d2.getFullYear() + "-" + (d2.getMonth() <= 10 ? "0"+(d2.getMonth()+1) : (d2.getMonth()+1)) + "-" + d2.getDate();

        return {
            publishDate: pubDate ? pubDate : "",
            resourceTypes: resourceTypes,
            description: this.record.notes,
            id: this.record.id,
            title: this.record.title,
            name: this.record.name,
            org: this.record.organization.title,
            orgId: this.record.organization.name,
            metaModDate: modDate ? modDate : "",
            //iconName: icon,
            //iconToolTip: tooltip,
            primMarkers: [{
                name: this.record.sector
            }],
            sector: this.record.sector
        };
    },
}

</script>

<style scoped>
    .noUnderline{
        text-decoration: none;
    }

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

    .faded{
        color: var(--v-faded_text-base);
        font-size: 14px;
    }

</style>
