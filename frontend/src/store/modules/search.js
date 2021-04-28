import Vue from 'vue';

import router from '../../router/index';

import { CkanApi } from '../../services/ckanApi';
const ckanServ = new CkanApi();

const DEFAULT_SORT_NO_TEXT_ORDER = "metadata_created desc";
const DEFAULT_SORT_WITH_TEXT_ORDER = "score desc";

const state = {
    facets: {},
    totalFilters: 0,
    searchText: "",
    clearOnRedirect: true,
    landingTerms: [],
    sortOrder: DEFAULT_SORT_NO_TEXT_ORDER,
};

const getters = {
    isReady: (state) => {
        return state.facets.length > 0;
    }
}

const actions = {
    getLandingTerms({ commit }) {
        ckanServ.getLandingTerms().then( (data) => {
            commit('setLandingTerms', {terms: data.terms});
        });
    }
}

const mutations = {
    clearAllFacets(state){
        state.totalFilters = 0;
        Vue.set(state, 'facets', {});
    },

    setLandingTerms(state, {terms}){
        state.landingTerms = terms;
    },

    toggleFacet(state, { facet, filter }) {
        if (typeof(state.facets[facet]) === "undefined"){
            state.facets[facet] = [];
        }

        if (state.facets[facet].indexOf(filter) !== -1){
           state.facets[facet].splice(state.facets[facet].indexOf(filter), 1)
           state.totalFilters -= 1;
           if (state.facets[facet].length === 0){
               delete state.facets[facet];
           }

        }else {
            state.facets[facet].push(filter);
            state.totalFilters += 1;
        }
    },

    setSearchText(state, text ) {
        state.searchText = text;
    },

    setClearOnRedirect(state, clear ) {
        state.clearOnRedirect = clear;
    },

    setSearchTextAndRedirect(state, text ){
        state.searchText = text;
        state.clearOnRedirect = false;
        state.sortOrder = DEFAULT_SORT_WITH_TEXT_ORDER;
        router.push('/datasets');
    },

    setSortOrder(state, sort){
        state.sortOrder = sort;
    },

    defaultSortOrder(state){
        state.sortOrder = (state.searchText === "") ? DEFAULT_SORT_NO_TEXT_ORDER : DEFAULT_SORT_WITH_TEXT_ORDER;
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}