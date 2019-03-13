<template>
  <v-progress-circular
      v-if="loading"
      :size="70"
      :width="7"
      color="grey"
      indeterminate
    ></v-progress-circular>
  <v-container v-else grid-list-md class="main-area">
      <v-btn fab dark fixed bottom right color="primary" :to="editLink">
        <i class="fa fa-edit"></i>
      </v-btn>
      <v-layout row wrap fill-height>
        <v-flex xs12 md8>
          <v-container class="metadata">
            <v-card flat>
              <Breadcrumb :breadcrumbs="breadcrumbs"></Breadcrumb>
              <h1 class="h2">{{dataset.title}}</h1>
              <v-subheader class="tracking-summary">{{dataset.tracking_summary.total}} views ({{dataset.tracking_summary.recent}} recent)</v-subheader>
              <p>Published by the <a href="">{{dataset.organization.full_title}}</a>
              <br />
              Licensed under <a href="">{{dataset.license_title}}</a></p>
            </v-card>
          <v-divider></v-divider>
          <br>
            <v-layout row wrap>
              <v-flex xs6>
                <AboutCard :desc="dataset.notes"></AboutCard>
              </v-flex>
              <v-flex xs6>
                <AdditionalInfoCard :info="additionalInfo"></AdditionalInfoCard>
              </v-flex>
            </v-layout>
            <v-layout row wrap>
              <v-flex xs4>
                <ContactInfoCard :contact="contactInfo"></ContactInfoCard>
              </v-flex>
              <v-flex xs4>
                <AccessSecurityCard :info="accessInfo"></AccessSecurityCard>
              </v-flex>
              <v-flex xs4>
                <MetadataInformationCard :info="metadataInfo"></MetadataInformationCard>
              </v-flex>
            </v-layout>
          </v-container>
          <v-divider></v-divider>
        </v-flex>
        <v-flex xs12 md4>
          <ResourceList :resources="dataset.resources"></ResourceList>
        </v-flex>
      </v-layout>
  </v-container>
</template>

<script>
  import {CkanApi} from '../../services/ckanApi'
  import ResourceList from '../dataset/ResourceList'
  import AboutCard from '../dataset/AboutCard'
  import AdditionalInfoCard from '../dataset/AdditionalInfoCard'
  import ContactInfoCard from '../dataset/ContactInfoCard'
  import AccessSecurityCard from '../dataset/AccessSecurityCard'
  import MetadataInformationCard from '../dataset/MetadataInformationCard'
  import Breadcrumb from '../breadcrumb/Breadcrumb'
  const ckanServ = new CkanApi()

  export default {
    components: {
        ResourceList: ResourceList,
        AboutCard: AboutCard,
        AdditionalInfoCard: AdditionalInfoCard,
        ContactInfoCard: ContactInfoCard,
        AccessSecurityCard: AccessSecurityCard,
        MetadataInformationCard: MetadataInformationCard,
        Breadcrumb: Breadcrumb,
    },
    data() {
      return {
        loading: true,
        dataset: {},
        breadcrumbs: [
          {icon: 'home', label: 'Home', route: '/'},
          {label: 'Fetching Dataset...'}
        ],
        additionalInfo: {},
        contactInfo: {},
        accessInfo: {},
        metadataInfo: {},
      }
    },
   
    computed: {
      datasetId: function datasetId() {
        return this.$route.params.datasetId;
      },
      editLink: function editLink() {
        return '/dataset/' + this.datasetId + '/edit'
      }
    },

    methods: {
        getDataset(){
            ckanServ.getDataset(this.datasetId).then((data) => {
                this.loading = false;
                // eslint-disable-next-line
                console.log("hi", data);
                this.dataset = data.result;
                this.breadcrumbs[1].label = this.dataset.title;
                this.additionalInfo = {
                  purpose: this.dataset.purpose,
                  dataQuality: this.dataset.data_quality,
                  lineageStatement: this.dataset.lineage_statement,
                  tags: this.dataset.tags
                };
                this.accessInfo = {
                  viewAudience: this.dataset.view_audience,
                  downloadAudience: this.dataset.download_audience
                };
                this.metadataInfo = {
                  published: this.dataset.record_publish_date,
                  lastModified: this.dataset.record_last_modified,
                  status: this.dataset.resource_status
                };
                this.contactInfo = {
                  name: this.dataset.contacts[0].name,
                  role: this.dataset.contacts[0].role,
                  email: this.dataset.contacts[0].email,
                  organizationId: this.dataset.contacts[0].organization,
                  organization: null,
                  subOrganizationId: this.dataset.contacts[0].branch,
                  subOrganization: null
                };
                ckanServ.getOrganization(this.contactInfo.organizationId).then((data) => {
                  this.contactInfo.organization = data.result.title;
                });
                ckanServ.getOrganization(this.contactInfo.subOrganizationId).then((data) => {
                  this.contactInfo.subOrganization = data.result.title
                });
            });
        }
    },

    mounted(){
        this.getDataset();
    }
  }
</script>

<style>
  h1,h2,h3,h4,h5 {
    color: #444444;
  }
</style>

<style scoped>
    .main-area{
        margin-top: 20px
    }
    ul{
      list-style-type: none
    }
    .tracking-summary{
      height: inherit;
      padding: inherit;
    }
    .metadata{
      padding-top:0px;
    }
    
</style>
