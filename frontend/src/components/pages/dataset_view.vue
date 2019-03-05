<template>
  <v-progress-circular
      v-if="loading"
      :size="70"
      :width="7"
      color="grey"
      indeterminate
    ></v-progress-circular>
  <v-container v-else grid-list-md class="main-area">
      <v-layout row wrap>
        <v-flex xs12 md8>
          <h1>{{dataset.title}}</h1>
          <p>Published by the <a href="">{{dataset.organization.full_title}}</a>
          <br />
          Licensed under <a href="">{{dataset.license_title}}</a></p>
          <v-divider></v-divider>
          <v-container>
            <v-layout row wrap>
              <v-flex xs6>
                <AboutCard :desc="dataset.notes"></AboutCard>
              </v-flex>
              <v-flex xs6>
                <AdditionalInfoCard></AdditionalInfoCard>
              </v-flex>
            </v-layout>
            <v-layout row wrap>
              <v-flex xs4>
                <ContactInfoCard></ContactInfoCard>
              </v-flex>
              <v-flex xs4>
                <AccessSecurityCard></AccessSecurityCard>
              </v-flex>
              <v-flex xs4>
                <MetadataInformationCard></MetadataInformationCard>
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
  const ckanServ = new CkanApi()

  export default {
    components: {
        ResourceList: ResourceList,
        AboutCard: AboutCard,
        AdditionalInfoCard: AdditionalInfoCard,
        ContactInfoCard: ContactInfoCard,
        AccessSecurityCard: AccessSecurityCard,
        MetadataInformationCard: MetadataInformationCard,
    },
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
