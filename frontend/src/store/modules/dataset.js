import { CkanApi } from '../../services/ckanApi';
const ckanServ = new CkanApi();

import { ResourceApi } from '../../services/resourceApi';
const resourceServ = new ResourceApi();

import Vue from 'vue';

const state = {
    dataset: {},
    shouldAbortDataset: false,
    unmodifiedDataset: {},
    datasetLoading: false,
    schemas: {},
    schemaLoading: false,
    resource: {},
    unmodifiedResource: {},
    resourceLoading: false,
    error: null,
    facetList: {},
    facetOpen: {},
};

const getters = {
    getResourceList: (state) => (id) => {
        if (typeof(id) === 'undefined') {
            return state.dataset.resources;
        } else {
            return state.dataset.resources.filter( resource => {
                return resource.id !== id;
            });
        }
    }
};

const actions = {
    getDataset({ commit, dispatch }, { id }) {
        commit('resetAbortDataset');
        commit('clearError');
        commit('setDatasetLoading', {datasetLoading: true});
        commit('setSchemaLoading', {schemaLoading: true});
        ckanServ.getDataset(id).then((data) => {
            if (data.success) {
                if(data.result == undefined) {
                    commit('abortDataset')
                } else {
                    commit('setCurrentDataset', { dataset: data.result });
                    commit('setDatasetLoading', {datasetLoading: false});
                    dispatch('getDatasetSchema').then(() => {
                        commit('setSchemaLoading', {schemaLoading: false});
                    });
                }
            } else {
                commit('setError', {error: data.error});
                commit('setSchemaLoading', {schemaLoading: false});
                commit('setDatasetLoading', {datasetLoading: false});
            }
        }).catch((e) => {
            commit('setError', {error: e});
            commit('setSchemaLoading', {schemaLoading: false});
            commit('setDatasetLoading', {datasetLoading: false});
        });
    },

    getFacetList({ state, commit }){
        if ( Object.keys(state.facetList).length === 0 ){
            ckanServ.getFacets().then((data) => {
                commit('setFacetList', { facetList: data });
            });
        }
    },

    getDatasetSchema(context){
        context.commit('clearError');
        let type = 'bcdc_dataset';
        if (typeof(context.state.schemas[type]) !== "undefined"){
            context.commit('setSchema', {type: type, data: context.state.schemas[type]});
            return context.state.schemas[type];
        }
        ckanServ.getDatasetSchema(type).then((data) => {
            if ((typeof(data.success) !== "undefined") && (data.success === true) && (typeof(data.result) !== "undefined")){
                context.commit('setSchema', {type: type, data: data.result});
                return data.result;
            }
            context.commit('setError', {error: data.error});
            return {};

        });
    },
    //getResource(context, {datasetResourceIndex, id}){
    // getResource(context, {id}){
    //     if ( (typeof(context.state.resources[id]) !== "undefined") && (context.state.resource[id] !== null) ){
    //         return context.state.resources[id];
    //     }

    //     resourceServ.getResource(id).then((data) => {
    //         data.metadata = data
    //         context.commit('setResource', {id: id, resource: data.metadata});
    //     });
    // },
    getResource({ commit, dispatch, state }, { id }) {
        commit('clearError');
        commit('setResourceLoading', { resourceLoading: true });
        resourceServ.getResource(id).then( ( data ) => {
			if (data) {
                data.metadata = data;
				commit('setCurrentResource', { resource: data });
				commit('setResourceLoading', { resourceLoading: false });
				if (state.dataset.id !== data.package_id) {
					dispatch('getDataset', { id: data.package_id });
				}
			} else {
                commit('setError', { error: data.error });
                commit('setResourceLoading', { resourceLoading: false });
            }
        }).catch((e) => {
            commit('setError', { error: e });
            commit('setResourceLoading', { resourceLoading: false });
        });
    },
    setDataset({ state }) {
        let dataset = JSON.parse(JSON.stringify(state.dataset));
        //delete dataset.resources;
        return ckanServ.putDataset(dataset);
	},
	setResource({ state }) {
        let resource = JSON.parse(JSON.stringify(state.resource));
        let formD = new FormData();
        for ( let key in resource ) {
            formD.append(key, resource[key]);
        }
        return ckanServ.updateResource(resource);
    },
    createDataset({ state }) {
        return ckanServ.postDataset(state.dataset);
	},
	createResource({ state }) {
        let resource = JSON.parse(JSON.stringify(state.resource));
        let formD = new FormData();
        for ( let key in resource ) {
            formD.append(key, resource[key]);
        }
        return ckanServ.createResource(formD);
    },
    addContact({ commit }) {
        commit('setAddContact');
    },
    removeContact({ commit }, { index }) {
        commit('setRemoveContact', {index: index});
    },
    addMoreInfo({ commit }) {
        commit('setAddMoreInfo');
    },
    removeMoreInfo({ commit }, { index }) {
        commit('setRemoveMoreInfo', {index: index});
    },
    addDate({ commit }) {
        commit('setAddDate');
    },
    removeDate({ commit }, { index }) {
        commit('setRemoveDate', {index: index});
    },
    resetDataset({ commit }) {
        commit('resetDataset');
	},
	resetResource({ commit }) {
        commit('resetResource');
    }
};

const mutations = {
    resetAbortDataset(state) {
        state.shouldAbortDataset = false;
    },
    setDatasetLoading(state, {datasetLoading}){
        state.datasetLoading = datasetLoading;
	},
	setResourceLoading(state, { resourceLoading }){
        state.resourceLoading = resourceLoading;
    },
    clearDataset(state){
        //state.dataset = {};
        Vue.set(state, 'dataset', {});
        state.datasetLoading = false;
        state.shouldAbortDataset = false;
	},
	clearResource(state){
        Vue.set(state, 'resource', {});
        state.resourceLoading = false;
    },
    setSchemaLoading(state, {schemaLoading}) {
        state.schemaLoading = schemaLoading;
    },
    setResource(state, { resource }){
        state.resource = Object.assign({}, resource);
	},
	setCurrentDataset(state, { dataset }) {
        state.dataset = Object.assign({}, dataset);
        state.unmodifiedDataset = Object.assign({}, dataset);
    },
    setCurrentNotUnmodDataset(state, {dataset}) {
        state.dataset = Object.assign({}, dataset);
    },
    setCurrentResource(state, { resource }) {
        state.resource = Object.assign({}, resource);
        state.unmodifiedResource = Object.assign({}, resource);
    },
    setCurrentNotUnmodResource(state, { resource }) {
        state.resource = Object.assign({}, resource);
    },
    setSchema(state, {type, data}){
        state.schemas[type] = Object.assign({}, data);
    },
    setAddContact(state) {
        state.dataset.contacts.push({
            name: '',
            email: '',
            organization: '',
            branch: '',
            role: '',
            private: 'Private'
        });
    },
    setRemoveContact(state, { index }) {
        state.dataset.contacts.splice(index, 1);
    },
    setAddMoreInfo(state) {
        state.dataset.more_info.push({
            delete: '0',
            link: ''
        });
    },
    setRemoveMoreInfo(state, { index }) {
        state.dataset.more_info.splice(index, 1);
    },
    setAddDate(state) {
        state.dataset.dates.push({
            type: '',
            date: ''
        });
    },
    setRemoveDate(state, { index }) {
        state.dataset.dates.splice(index, 1);
    },
    resetDataset(state) {
        state.dataset = Object.assign({}, state.unmodifiedDataset);
    },
    abortDataset(state) {
        state.shouldAbortDataset = true;
    },
    setError(state, { error }) {
        state.error = Object.assign({}, error);
    },
    setFacetList(state, { facetList }) {
        state.facetList = Object.assign({}, facetList);
        let keys = Object.keys(facetList);
        for (let i=0; i<keys.length; i++){
            state.facetOpen[keys] = false;
        }
    },
    setFacetOpen(state, { facet, open }){
        Vue.set(state.facetOpen, facet, open);
    },
    clearError(state) {
        state.error = null;
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
