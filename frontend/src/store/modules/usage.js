import { CkanApi } from '../../services/ckanApi';
const ckanServ = new CkanApi();

const state = {
    usage: "",
    loading: false,
    error: "",

    lowerUsage: "",
    lowerLoading: false,
    lowerError: "",

    publishers: []
};

const actions = {
    async getUsage({ commit }, {start, end, count}) {
        commit('setLoading', { loading: true });
        commit('setError', { error:"" });
        let sy = false;
        let sm = false;
        if (start){
            let d = start.split("-");
            sy = d[0];
            sm = d[1]
        }
        let ey = false;
        let em = false;
        if (end){
            let d = end.split("-");
            ey = d[0];
            em = d[1]
        }
        let c = (count) ? count : false;
        try{
            let res = await ckanServ.getUsage(sy, sm, ey, em, c);
            commit('setUsage', { usage: res.result });
        }catch(ex){
            commit('setError', { error: ex });
        }
        commit('setLoading', {loading: false });
    },

    async getLowerUsage({ commit }, {month, publishers, count}) {
        commit('setLowerLoading', { loading: true });
        commit('setLowerError', { error:"" });
        
        let c = (count) ? count : false;
        let sy = false;
        let sm = false;
        let ey = false;
        let em = false;
        let publisher = false;

        if ((month) && (month !=="All")){
            let d = month.split("-");
            sy = d[0];
            sm = d[1]
            ey = d[0];
            em = d[1];
        }

        if (publishers){
            publisher = publishers;
        }

        try{
            let res = await ckanServ.getUsage(sy, sm, ey, em, c, publisher);
            commit('setLowerUsage', { usage: res.result });
        }catch(ex){
            commit('setLowerError', { error: ex });
        }
        commit('setLowerLoading', {loading: false });
    },

    async getPublishers({commit}){
        let res = await ckanServ.getPublishers();
        commit('setPublishers', { publishers: res.result.publishers });
    }
}

const mutations = {
    setUsage(state, { usage }){
        state.usage = usage;
    },
    setLoading(state, { loading }){
        state.loading = loading;
    },
    setError(state, { error }){
        state.error = error;
    },

    setLowerUsage(state, { usage }){
        state.lowerUsage = usage;
    },
    setLowerLoading(state, { loading }){
        state.lowerLoading = loading;
    },
    setLowerError(state, { error }){
        state.lowerError = error;
    },

    setPublishers(state, { publishers }){
        state.publishers = publishers;
    }
}

export default {
    namespaced: true,
    state,
    actions,
    mutations
}
