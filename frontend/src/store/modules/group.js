import { CkanApi } from '../../services/ckanApi';
const ckanServ = new CkanApi();

const state = {
    groups: [],
    searchedGroups: [],
    searchText: "",
    groupSchemas: {},
    group: {},
    abort: false,
    unmodifiedGroup: {}
};

const actions = {

    setGroup({ state }) {
        let group = JSON.parse(JSON.stringify(state.group));
        return ckanServ.putGroup(group);
    },
    createGroup({ state }) {
        return ckanServ.postGroup(state.group);
    },

    getGroups({ commit }) {
        ckanServ.getGroupList().then((data) => {
            commit('setGroupList', { groups: data.result });
            commit('setSearchedGroups', { searchedGroups: data.result });
        });
    },

    getGroup({commit}, {id}){
        ckanServ.getGroup(id).then( (data) => {
            let group = {};
            let error = false;
            if (data.success) {
                group = data.result;
            } else {
                group = {};
                error = true;
            }
            commit('setCurrentGroup', {group: group, error: error});
        });
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

    clearAbort(state){
        state.abort = false;
    },

    setSchema(state, { schema }) {

        //TODO: ....:(
        let keys = Object.keys(schema.fields);
        for (let i=0; i<keys.length; i++){
            if (schema.fields[i].field_name === "url"){
                schema.fields[i].field_name = "image_url";
            }

            if (schema.fields[i].field_name === "notes"){
                schema.fields[i].field_name = "description";
            }
        }

        Object.assign(state.groupSchemas, {group: schema});
    },

    setSearchText(state, { searchText }) {
        state.searchText = searchText;
    },

    setSearchedGroups(state, { searchedGroups }) {
        state.searchedGroups = searchedGroups;
    },

    setCurrentGroup(state, { group, error }) {
        state.abort = error ? error : false;
        state.group = Object.assign({}, group);
        state.unmodifiedGroup = Object.assign({}, group);
    },

    setCurrentNotUnmod(state, {group}) {
        state.abort = false;
        state.group = Object.assign({}, group);
    },
}

export default {
    namespaced: true,
    state,
    actions,
    mutations
}
