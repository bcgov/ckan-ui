import { Version } from '../../services/version';
const vServ = new Version();

const state = {
    version: "",
    hash: "",
    v: "",
    apiVersion: ""
};

const actions = {
    async getVersion({ commit }) {
        let res = await vServ.getVersion();
        commit('setVersion', {version: res.version});
        commit('setV', {v: res.v});
        commit('setHash', {hash: res.hash});
        commit('setApiVersion', {apiVersion: res.ckanV});
    }
}

const mutations = {
    setVersion(state, {version}){
        state.version = version;
    },
    
    setV(state, {v}){
        state.v = v;
    },

    setHash(state, {hash}){
        state.hash = hash;
    },

    setApiVersion(state, {apiVersion}){
        state.apiVersion = apiVersion;
    },
}

export default {
    namespaced: true,
    state,
    actions,
    mutations
}
