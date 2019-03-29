<template>
  <div>
      <div class="dataset-markers">
          <ul>
              <SectorBadge v-for="primMarker in primMarkers" :name="primMarker.name" :key="'dataset-' + id + '-' + primMarker.name + '-badge'"></SectorBadge>
          </ul>
      </div>

      <div class="dataset-marker-type-icon">
          <i class="fa fa-2x icon icon-2x" v-bind:class="['fa-'+iconName, 'icon-'+iconName]"></i>
      </div>

      <h3 class="dataset-heading">
          <router-link :to="{ name: 'dataset_view', params: { datasetId: name }}">{{title}}</router-link>
      </h3>

      <div class="dataset-decription">
          {{description}}
      </div>

      <div class="flex-fill-end">
          <ul class="dataset-resources unstyled pb-1">
              <FormatBadge v-for="type in resourceTypes" v-bind:key="'dataset-' + id + '-' + type" :type="type"></FormatBadge>
          </ul>
      </div>

      <div class="dates">
          Record Published: {{publishDate}}
      </div>


  </div>
</template>

<script>
import SectorBadge from "../badges/SectorBadge"
import FormatBadge from "../badges/FormatBadge"
export default {
    components: {
        SectorBadge,
        FormatBadge
    },
    props: {
        record: Object,
    },

    data: function() {
        if (typeof(this.record.id) === "undefined" ){
            return {
                resourceTypes: [],
                publishDate: ""
            }
        }
        let resourceTypes = []
        for (let i=0; i<this.record.resources.length; i++){
            let format = this.record.resources[i].format
            if (resourceTypes.indexOf(format) === -1) {
                resourceTypes.push(format)
            }
        }

        let icon = ""

        switch(this.record.type){
            case "Geographic":
                icon = "globe"
                break

            case "Dataset":
                icon = "table"
                break

            case "Application":
                icon = "cogs"
                break

            case "Api":
                icon = "code"
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
            primMarkers: [{
                name: this.record.sector
            }]
        };
    },
}

</script>

<style scoped>
    @import "https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css";
    .dataset-markers{
        float: right;
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
