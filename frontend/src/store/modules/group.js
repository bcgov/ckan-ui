import { CkanApi } from '../../services/ckanApi';
const ckanServ = new CkanApi();

const state = {
    groups: [],
    searchedGroups: [],
    searchText: "",
    groupSchemas: {}
};

const actions = {
    getGroups({ commit }) {
        if (state.groups.length == 0) {
            ckanServ.getGroupList().then((data) => {
                commit('setGroupList', { groups: data.result });
                commit('setSearchedGroups', { searchedGroups: data.result });
            });
        }
    },

    getGroupSchemas({ commit }) {
        ckanServ.getGroupSchema().then((data) => {
            commit('setSchema', { schema: data.result });
        });
    },

    searchGroups({commit, state}, {searchText}){
        if (searchText !== ""){
            let result = [];
            for (let i=0; i<state.groups.length; i++){
                if (state.groups[i].display_name.toLowerCase().indexOf(searchText.toLowerCase()) >= 0){
                    result.push(state.groups[i]);
                }
            }
            commit('setSearchedGroups', {searchedGroups: result});
        }
        commit('setSearchText', {searchText: searchText});
    }
}

const mutations = {
    setGroupList(state, { groups }) {
        state.groups = groups;
    },

    setSchema(state, { schema }) {
        Object.assign(state.groupSchemas, {group: schema});
    },

    setSearchText(state, { searchText }) {
        state.searchText = searchText;
    },

    setSearchedGroups(state, { searchedGroups }) {
        state.searchedGroups = searchedGroups;
    },
}

export default {
    namespaced: true,
    state,
    actions,
    mutations
}
