<template>
  <v-card>
      <v-toolbar dark color="primary">
          <v-btn icon dark @click="$emit('closePreviewDialog')">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>{{name}}</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
          <i v-if="loading" class="fa fa-circle-o-notch fa-spin"></i>
            <v-data-table v-if="headers.length>0" :items="data" :headers="headers">
                <template v-slot:items="props">
                    <td v-for="(item, key) in props.item" :key="key">{{item}}</td>
                </template>
            </v-data-table>
            <div v-else>We're sorry we don't currently support previewing this type of file</div>
      </v-card-text>
  </v-card>
</template>

<script>
import {ResourceApi} from "../../services/resourceApi"

const resourceApi = new ResourceApi()

export default{
    props: {
        resource: Object
    },
    data() {
        return {
            type: '',
            name: '',
            url: '',
            loading: true,
            data: [],
            headers: [],
            raw_data: '',
        }
    },
    mounted() {
        this.name = this.resource.name;
        this.id = this.resource.id;
        this.loadResource();

    },

    methods: {
        loadResource: function(){
            resourceApi.getResource(this.id).then((data) => {
                this.type = "unknown";

                if (data.headers) {
                    this.type = "csv";
                    this.data = data.workbook
                    this.headers = data.headers

                } else {
                    this.raw_data = data.raw_data
                }


                this.loading = false;
            });
        }
    }

}
</script>