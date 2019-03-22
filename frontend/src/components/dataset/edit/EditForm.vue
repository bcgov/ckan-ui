<template>
  <v-form>
	<v-layout row wrap justify-space-between>
	  <v-flex xs6>
		  <v-btn color="primary">Manage Resources</v-btn>
		  <v-spacer></v-spacer>
	  </v-flex>
	  <v-flex xs6 class="text-right">
		  <v-spacer></v-spacer>
		  <v-btn color="error">Cancel</v-btn>
		  <v-btn color="primary">Save</v-btn>
	  </v-flex>
	</v-layout>
    <v-layout row wrap fill-height>
      <v-flex xs12 md8>
		<h2>Dataset Details</h2>
		<v-layout row>
			<v-flex xs12>
				<v-text-field v-model="dataset.title" label="Title"></v-text-field>
			</v-flex>
		</v-layout>
		<v-layout row>
			<v-flex xs12>
				<v-text-field small v-model="dataset.name" label="URL" prefix="/dataset/"></v-text-field>
			</v-flex>
		</v-layout>
		<v-layout row>
			<v-flex xs6>
				<v-select v-model="datasetOrg" :items="topOrgs" item-text="title" item-value="id" label="Organization"></v-select>
			</v-flex>
			<v-flex xs6>
				<v-select v-model="datasetBranch" :items="topOrgs" item-text="title" item-value="id" label="Sub Organization"></v-select>
			</v-flex>
		</v-layout>
		<v-layout row>
			<v-flex xs12>
				<v-textarea v-model="dataset.notes" label="Description"></v-textarea>
			</v-flex>
		</v-layout>
		<v-layout row>
			<v-flex xs12>
				<v-textarea v-model="dataset.purpose" label="Purpose"></v-textarea>
			</v-flex>
		</v-layout>
		<v-layout row>
			<v-flex xs12>
				<v-textarea v-model="dataset.data_quality" label="Data Quality"></v-textarea>
			</v-flex>
		</v-layout>
		<v-layout row>
			<v-flex xs12>
				<v-textarea v-model="dataset.lineage_statement" label="Lineage Statement"></v-textarea>
			</v-flex>
		</v-layout>
        <v-divider></v-divider>
      </v-flex>
      <v-flex xs12 md4>
        <h2>Contacts</h2>
		<v-layout row>
			<v-flex xs6>
				<v-text-field v-model="dataset.contacts[0].name" label="Name"></v-text-field>
			</v-flex>
			<v-flex xs6>
				<v-text-field v-model="dataset.contacts[0].email" label="e-mail"></v-text-field>
			</v-flex>
		</v-layout>
		<v-layout row>
			<v-flex xs6>
				<v-select v-model="datasetOrg" :items="topOrgs" item-text="title" item-value="name" label="Organization"></v-select>
			</v-flex>
			<v-flex xs6>
				<v-select v-model="datasetBranch" :items="topOrgs" item-text="title" item-value="name" label="Sub Organization"></v-select>
			</v-flex>
		</v-layout>
		<v-layout row>
			<v-flex xs6>
				<v-text-field v-model="dataset.contacts[0].role" label="Role"></v-text-field>
			</v-flex>
			<v-flex xs6>
			</v-flex>
		</v-layout>
      </v-flex>
    </v-layout>
  </v-form>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'

export default{
  props: {
	datasetOrg: '',
	datasetBranch: ''
  },
  computed: {
	...mapState({
		dataset: state => state.dataset.dataset,
		orgList: state => state.organization.orgList
	}),
	...mapGetters('organization', {
		subOrgs: 'getSubOrgs',
		topOrgs: 'getTopOrgs'
	})
  },
}
</script>

<style scoped>
	.text-right{
		text-align: right;
	}
</style>