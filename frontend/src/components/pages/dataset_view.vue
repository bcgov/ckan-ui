<template>
  <i v-if="loading" class="fa fa-circle-o-notch fa-spin"></i>
  <b-container v-else class="main-area">
      <h1>{{dataset.title}}</h1>
      Published by the <a href="">{{dataset.organization.full_title}}</a>
      <br />
      Licensed under <a href="">{{dataset.license_title}}</a>
      <hr>
      <h2>Data and Resources</h2>
      <b-row v-for="resource in dataset.resources" :key="resource.id">
        <b-col cols=1 class="text-center"><i class="fa fa-file"></i></b-col>
        <b-col cols=6>{{resource.name}}</b-col>
        <b-col cols=1><b-button size="sm" variant="info">Explore <i class="fa fa-caret-down"></i></b-button></b-col>
      </b-row>
      <hr>
      <h2>Addional Information</h2>
      <b-row>
        <b-col cols=2><strong>Purpose</strong></b-col>
        <b-col cols=10>{{dataset.purpose}}</b-col>
      </b-row>
      <b-row>
        <b-col cols=2><strong>Data Quality</strong></b-col>
        <b-col cols=10>{{dataset.data_quality}}</b-col>
      </b-row>
      <b-row>
        <b-col cols=2><strong>Lineage Statement</strong></b-col>
        <b-col cols=10>{{dataset.lineage_statement}}</b-col>
      </b-row>
      <hr>
      <h3>Additional Information</h3>
      <p><a v-for="info in dataset.more_info" :key="info.link" :href="info.link">{{info.link}}<br></a></p>
      <hr>
      <h3>Contact Information</h3>
      <div v-for="contact in dataset.contacts" :key="contact.email">
        <b-row>
          <b-col cols=4><strong>Name</strong></b-col>
          <b-col cols=8>{{contact.name}}</b-col>
        </b-row>
        <b-row>
          <b-col cols=4><strong>Email</strong></b-col>
          <b-col cols=8>{{contact.email}}</b-col>
        </b-row>
        <hr>
      </div>
      <h3>Access and Security</h3>
      <b-row>
        <b-col cols=4><strong>Who Can View this Data</strong></b-col>
        <b-col cols=8>{{dataset.view_audience}}</b-col>
      </b-row>
      <b-row>
        <b-col cols=4><strong>Who Can Download this Data</strong></b-col>
        <b-col cols=8>{{dataset.download_audience}}</b-col>
      </b-row>
      <hr>
      <h3>Metadata Information</h3>
      <b-row>
        <b-col cols=4><strong>Record Published</strong></b-col>
        <b-col cols=8>{{dataset.record_publich_date}}</b-col>
      </b-row>
      <b-row>
        <b-col cols=4><strong>Record Last Modified</strong></b-col>
        <b-col cols=8>{{dataset.record_last_modified}}</b-col>
      </b-row>
      <b-row>
        <b-col cols=4><strong>Resource Status</strong></b-col>
        <b-col cols=8>{{dataset.resource_status}}</b-col>
      </b-row>
  </b-container>
</template>

<script>
  import {CkanApi} from '../../services/ckanApi'
  const ckanServ = new CkanApi()

  export default {
    data() {
      return {
        loading: true,
        dataset: {},
      }
    },

    computed: {
      datasetId: function datasetId() {
        return this.$route.params.datasetId;
      }
    },

    methods: {
        getDataset(){
            ckanServ.getDataset(this.datasetId).then((data) => {
                this.loading = false;
                // eslint-disable-next-line
                console.log("hi", data)
                this.dataset = data.result;
            });
        }
    },

    mounted(){
        this.getDataset();
    }
  }
</script>

<style scoped>
    .main-area{
        margin-top: 20px
    }
    ul{
      list-style-type: none
    }
</style>
