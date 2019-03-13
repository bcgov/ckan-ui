<template>
  <v-progress-circular
      v-if="loading"
      :size="70"
      :width="7"
      color="grey"
      indeterminate
    ></v-progress-circular>
  <v-container v-else grid-list-md class="main-area">
    <v-layout row wrap fill-height>
      <v-flex xs12 md8>
        <v-container class="metadata">
          <Breadcrumb :breadcrumbs="breadcrumbs"></Breadcrumb>
          <v-form>
            <v-text-field v-model="dataset.title" label="Title"></v-text-field>
            <v-text-field small v-model="dataset.name" label="URL" prefix="/dataset/"></v-text-field>
            <v-layout row>
            <v-flex xs6>
              <v-select v-model="datasetOrg" :items="orgs" item-text="title" item-value="name" label="Organization" v-on:change="getSubOrgs"></v-select>
            </v-flex>
            <v-flex xs6>
              <v-select v-model="datasetBranch" :items="subOrgs" item-text="title" item-value="name" label="Sub Organization"></v-select>
            </v-flex>
            </v-layout>
            <v-textarea v-model="dataset.notes" label="Description"></v-textarea>
            <v-textarea v-model="dataset.purpose" label="Purpose"></v-textarea>
            <v-textarea v-model="dataset.data_quality" label="Data Quality"></v-textarea>
            <v-textarea v-model="dataset.lineage_statement" label="Lineage Statement"></v-textarea>
            <v-divider></v-divider>
            <h3>Contacts</h3>
            <v-layout row>
            <v-flex >
              <v-text-field xs6 v-model="dataset.contacts[0].name" label="Name"></v-text-field>
            </v-flex>
            <v-flex xs6>
              <v-text-field xs6 v-model="dataset.contacts[0].email" label="e-mail"></v-text-field>
            </v-flex>
            </v-layout>
            <v-layout row>
            <v-flex >
              <v-select xs6 v-model="dataset.contacts[0].organization" :items="orgs" item-text="title" item-value="name" label="Organization" v-on:change="getSubOrgs"></v-select>
            </v-flex>
            <v-flex xs6>
              <v-select v-model="dataset.contacts[0].organization" :items="subOrgs" item-text="title" item-value="name" label="Sub Organization"></v-select>
            </v-flex>
            </v-layout>
          </v-form>
        </v-container>
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
  import Breadcrumb from '../breadcrumb/Breadcrumb'
  const ckanServ = new CkanApi()

  export default {
    components: {
        ResourceList: ResourceList,
        Breadcrumb: Breadcrumb,
    },
    data() {
      return {
        loading: true,
        dataset: {},
        breadcrumbs: [
          {label: 'Home', route: '/'},
          {label: 'Fetching Dataset...', route: ''},
          {label: 'Edit'},
        ],
        orgs: [],
        subOrgs: [],
        allsuborgs: [],
        activeOrg: String,
        datasetOrg: String,
        datasetBranch: String
      }
    },
   
    computed: {
      datasetId: function datasetId() {
        return this.$route.params.datasetId;
      },
      editLink: function editLink() {
        return '/dataset/' + this.datasetId + '/edit';
      },
    },

    methods: {
        getDataset(){
            ckanServ.getDataset(this.datasetId).then((data) => {
              this.loading = false;
              // eslint-disable-next-line
              console.log("hi", data)
              this.dataset = data.result;
              this.breadcrumbs[1] = {
                label: this.dataset.title,
                route: '/dataset/' + this.dataset.id
              }
              ckanServ.getOrgList().then((data2) => {
                // eslint-disable-next-line
                console.log("hi2", data2);
                data2.orgs.forEach(org => {
                  this.orgs.push({
                    name: Object.keys(org)[0],
                    title: org[Object.keys(org)[0]]
                  });
                });
                this.allsuborgs = data2.suborgs;
                ckanServ.getOrganization(this.dataset.org).then((data3) => {
                  // eslint-disable-next-line
                  console.log("org", data3)
                  this.datasetOrg = data3.result.name;
                  this.getSubOrgs();
                });
              });
            });
        },
        getSubOrgs() {
          console.log("activeOrg", this.datasetOrg);
          console.log("suborgs", this.allsuborgs);
          if (this.allsuborgs && this.datasetOrg) {
            this.allsuborgs[this.datasetOrg].forEach(org => {
              this.subOrgs.push({
                name: Object.keys(org)[0],
                title: org[Object.keys(org)[0]]
              });
            });
          }
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
