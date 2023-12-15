import { CkanApi } from '../../services/ckanApi';
const ckanServ = new CkanApi();

import { Auth } from '../../services/auth';
const authServ = new Auth();

import { ResourceApi } from '../../services/resourceApi';
const resourceServ = new ResourceApi();

import Vue from 'vue';

var formatResourceBody = function(resource){
    try{
        delete resource.created;
        delete resource.last_modified;
        delete resource.metadata;
        delete resource.raw_data;
        delete resource.schema;
        delete resource['content-length'];
        delete resource['content-type'];
        delete resource.schemaError;
        delete resource.hasSchema;
    }catch(e){
        //eslint-disable-next-line
        console.error("Format resource", e);
    }

    let originalJSONValue = resource.json_table_schema
    let parseable = true;
    try{
        let j = JSON.parse(originalJSONValue);
    }catch(ex){
        parseable = false;
    }

    if (!parseable){
        try{
            let j = JSON.parse(JSON.stringify(originalJSONValue));
            resource.json_table_schema = JSON.stringify(originalJSONValue);
        }catch(ex){
            resource.json_table_schema = "{}";
        }
    }

    if ( (resource.iso_topic_category) && (typeof(resource.iso_topic_category)==="object") ){
        resource.iso_topic_category = JSON.stringify(resource.iso_topic_category);
        let iso = JSON.parse(resource.iso_topic_category);
        if (iso.length === 1){
            resource.iso_topic_category = iso[0];
        }else if (iso.length === 0){
            resource.iso_topic_category = "";
        }
    }

    const compositeResourceFields = ['temporal_extent', 'details', 'preview_info', 'geographic_info'];
    for (const compositeField of compositeResourceFields) {
        let val;
        if (typeof resource[compositeField] === 'string') {
            try {
                val = JSON.parse(resource[compositeField]);
            } catch {
                val = [];
            }
        }
        if (!(val instanceof Array)) {
            val = [];
        }
        resource[compositeField] = JSON.stringify(val);
    }

    return resource;
}

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
    facets: {},
    previewPromise: false,
    preview: {},
    previewLoading: false,
    previewError: false,
};

const getters = {
    getResourceList: (state) => (id) => {
        if (typeof(id) === 'undefined') {
            return state.dataset.resources;
        } else {
            if (state.dataset.resources){
                return state.dataset.resources.filter( resource => {
                    return resource.id !== id;
                });
            }else{
                return [];
            }
        }
    }
};

const actions = {
    getDataset({ commit, dispatch }, { id }) {
        commit('resetAbortDataset');
        commit('clearError');
        commit('setDatasetLoading', {datasetLoading: true});
        commit('setSchemaLoading', {schemaLoading: true});
        return ckanServ.getDataset(id).then((data) => {
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
                commit('setError', {error: data.error.message});
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

    getFacet({state}, {facets}){
        var filters = {};
        for (let i=0; i<facets.length; i++){
            let firstKey = Object.keys(facets[i])[0];
            if ( (typeof(state.facets[firstKey]) === "undefined") || (state.facets[firstKey].length <= 0) ){
                let query = "?facet.field=[\""+firstKey+"\"]&facet.limit=-1&rows=0";
                ckanServ.getDatasets(query).then((data) => {

                    filters[firstKey] = data.result.search_facets[firstKey].items

                    filters[firstKey].sort(function(a, b){
                        return (a.name < b.name) ? -1 : 1
                    })

                    Vue.set(state.facets, firstKey, filters);
                    state.facets[firstKey] = filters;
                });
            }
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
   
    getResource({ commit, dispatch, state }, { id }) {
        commit('clearError');
        commit('setResourceLoading', { resourceLoading: true });
        return resourceServ.getResource(id).then( ( data ) => {
			if (data) {
                if (!data.metadata) data.metadata = JSON.parse(JSON.stringify(data));
				commit('setCurrentResource', { resource: data });
				commit('setResourceLoading', { resourceLoading: false });
                if (state.previewPromise){
                    state.previewPromise.cancel('New preview requested');
                }
                let prom = dispatch('getPreview');
                commit('setPreviewPromise', {promise: prom});
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

    getPreview( { state, commit } ){
        commit('setPreviewLoading', { loading: true });
        resourceServ.getPreview(state.resource.url, state.resource.json_table_schema).then( ( data ) => {
			if (data) {
                if (!data.metadata) data.metadata = JSON.parse(JSON.stringify(data));
				commit('setCurrentPreview', { preview: data });
				commit('setPreviewLoading', { loading: false });
			} else {
                commit('setPreviewError', { error: data.error });
                commit('setPreviewLoading', { loading: false });
            }
            commit('setPreviewPromise', {promise: false});
        }).catch((e) => {
            commit('setPreviewError', { error: e });
            commit('setPreviewLoading', { loading: false });
        });
    },

    setDataset({ state }) {
        let dataset = JSON.parse(JSON.stringify(state.dataset));
        
        for (let i=0; i<dataset.resources.length; i++){
            dataset.resources[i] = formatResourceBody(dataset.resources[i]);
        }
        
        return ckanServ.putDataset(dataset);
	},

	async setResource({ state }) {
        let resource = state.resource;
        delete resource.metadata;
        delete resource.raw_data;
        delete resource.schema;
        delete resource.size;
        delete resource.cache_last_updated;
        delete resource['content-length'];
        delete resource['content-type'];
        delete resource.schemaError;
        delete resource.hasSchema;
        let upload = resource.upload;
        resource = JSON.parse(JSON.stringify(resource));
        resource = formatResourceBody(resource);
        // eslint-disable-next-line
        console.log("Resource: ", JSON.stringify(resource));
        let formD = new FormData();
        for ( let key in resource ) {
            if (key !== 'upload'){
                formD.append(key, resource[key]);
            }else{
                formD.append(key, upload);
            }
        }

        let tok = await authServ.getToken().then();
        return ckanServ.updateResource(formD, tok['jwt']);
    },

    createDataset({ state }) {
        return ckanServ.postDataset(state.dataset);
	},

    async createResource({ state }) {
        let upload = state.resource.upload;
        let resource = JSON.parse(JSON.stringify(state.resource));
        resource = formatResourceBody(resource);
        let formD = new FormData();
        for ( let key in resource ) {
            if (key !== 'upload'){
                formD.append(key, resource[key]);
            }else{
                formD.append(key, upload);
            }
        }
        
        let tok = await authServ.getToken().then();
        return ckanServ.createResource(formD, tok['jwt']);
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
    },
    newDataset({ commit }) {
        commit('clearDataset');
    },
    newResource({ commit }) {
        commit('clearResource');
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
        //Vue.set(state, 'dataset', {publish_state: "DRAFT"});
        Vue.set(state, 'dataset', {});
        Vue.set(state, 'unmodifiedDataset', {});
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
        Vue.set(state, 'dataset', dataset);
        
        if (typeof(state.dataset['type']) !== "undefined"){
            Vue.set(state.dataset, 'type', state.dataset['type']);
        }
    },
    setCurrentResource(state, { resource }) {
        state.resource = Object.assign({}, resource);
        state.unmodifiedResource = Object.assign({}, resource);
    },
    setCurrentPreview(state, { preview }){
        Vue.set(state, 'preview', preview);
    },
    setPreviewLoading(state, { loading }){
        Vue.set(state, 'previewLoading', loading);
    },
    setPreviewPromise(state, {promise}){
        Vue.set(state, 'previewPromise', promise);
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
    resetResource(state) {
        state.resource = Object.assign({}, state.unmodifiedResource);
    },
    abortDataset(state) {
        state.shouldAbortDataset = true;
    },
    setError(state, { error }) {
        Vue.set(state, 'error', error);
    },
    setPreviewError(state, { error }) {
        Vue.set(state, 'previewError', error);
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
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
