import { CkanApi } from '../../services/ckanApi';
const ckanServ = new CkanApi();

const state = {
	dataset: {}
}

const getters = {
	
}

const actions = {
	getDataset({ commit }, { id }) {
		// eslint-disable-next-line
		console.log("ID: ", id);
		ckanServ.getDataset(id).then((data) => {
			// eslint-disable-next-line
			console.log("Dataset: ", data);
			commit('setCurrentDataset', { dataset: data.result });
		});
	},
	setDataset({ state }) {
		// eslint-disable-next-line
		console.log("Saving...", state.dataset);
	}
}

const mutations = {
	setCurrentDataset (state, { dataset }) {
		state.dataset = dataset;
	}
}

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations
  }