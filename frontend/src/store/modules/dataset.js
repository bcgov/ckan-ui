import { CkanApi } from '../../services/ckanApi';
const ckanServ = new CkanApi();

import { ResourceApi } from '../../services/resourceApi';
const resourceServ = new ResourceApi();

import Vue from 'vue';

const state = {
    dataset: {},
    resourceUpdate: false,
    shouldAbort: false,
    unmodifiedDataset: {},
    schemas: {},
    schemaLoading: false,
    dataLoading: false,
    resources: {},
    error: null,
    facetList: {},
    facetOpen: {},
};

const actions = {
    getDataset({ commit, dispatch }, { id }) {
        commit('setResetAbort');
        commit('clearError');
        commit('setDataLoading', {dataLoading: true});
        commit('setSchemaLoading', {schemaLoading: true});
        ckanServ.getDataset(id).then((data) => {
            if (data.success) {
                if(data.result == undefined) {
                    commit('abortDataset')
                } else {
                    commit('setCurrentDataset', { dataset: data.result });
                    commit('setDataLoading', {dataLoading: false});
                    dispatch('getDatasetSchema').then(() => {
                        commit('setSchemaLoading', {schemaLoading: false});
                    });
                }
            } else {
                commit('setError', {error: data.error});
                commit('setSchemaLoading', {schemaLoading: false});
                commit('setDataLoading', {dataLoading: false});
            }
        }).catch((e) => {
            commit('setError', {error: e});
            commit('setSchemaLoading', {schemaLoading: false});
            commit('setDataLoading', {dataLoading: false});
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
    getResource(context, {id}){
        if ( (typeof(context.state.resources[id]) !== "undefined") && (context.state.resource[id] !== null) ){
            return context.state.resources[id];
        }

        resourceServ.getResource(id).then((data) => {
            data.metadata = data
            context.commit('setResource', {id: id, resource: data.metadata});
        });
    },

    setDataset({ state }) {
        let dataset = JSON.parse(JSON.stringify(state.dataset));
        //delete dataset.resources;
        return ckanServ.putDataset(dataset);
    },
    createDataset({ state }) {
        return ckanServ.postDataset(state.dataset);
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
    }
};

const mutations = {
    setResetAbort(state) {
        state.shouldAbort = false;
    },
    setDataLoading(state, {dataLoading}){
        state.dataLoading = dataLoading;
    },
    clearDataset(state){
        //state.dataset = {};
        Vue.set(state, 'dataset', {});
        state.dataLoading = false;
        state.shouldAbort = false;
    },
    setSchemaLoading(state, {schemaLoading}) {
        state.schemaLoading = schemaLoading;
    },
    setResource(state, {id, resource}){
        Vue.set(state.resources, id, resource);
    },
    setCurrentDataset(state, { dataset }) {
        state.dataset = Object.assign({}, dataset);
        state.unmodifiedDataset = Object.assign({}, dataset);
    },
    setCurrentNotUnmod(state, {dataset}) {
        state.dataset = Object.assign({}, dataset);
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
        state.shouldAbort = true;
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
    actions,
    mutations
};
