import { CkanApi } from '../../services/ckanApi';
const ckanServ = new CkanApi();

const state = {
    groups: [],
    searchedGroups: [],
    searchText: "",
    groupSchemas: {},
    group: {},
    abort: false,
    unmodifiedGroup: {},
    groupActivity: [],
    groupMembers: [],
    currUserFollowingCurrGroup: false,
};

const actions = {

    setGroup({ state }) {
        let group = JSON.parse(JSON.stringify(state.group));
        return ckanServ.putGroup(group);
    },
    createGroup({ state }) {
        return ckanServ.postGroup(state.group);
    },

    followGroup({ state, commit }, apiKey){
        ckanServ.followGroup(state.group.id, apiKey).then( () => {
            //get if user following
            ckanServ.getGroupFollowing(state.group.id).then( async(data) => {
                if (data.success){
                    commit('setCurrUserFollowingCurrGroup', {following: data.result});
                }
            });
        });
    },

    unfollowGroup({ state, commit }, apiKey){
        ckanServ.unfollowGroup(state.group.id, apiKey).then( () => {
            //get if user following
            ckanServ.getGroupFollowing(state.group.id).then( async(data) => {
                if (data.success){
                    commit('setCurrUserFollowingCurrGroup', {following: data.result});
                }
            });
        });
    },

    async getGroupActivity({ state, commit }) {
        if (typeof(state.group.id) === 'undefined'){
            return [];
        }
        ckanServ.getGroupActivity(state.group.id).then( (data) => {
            commit('setGroupActivity', {activity: data.result});
        });
    },

    getGroups({ commit }) {
        ckanServ.getGroupList().then((data) => {
            commit('setGroupList', { groups: data.result });
            commit('setSearchedGroups', { searchedGroups: data.result });
        });
    },

    getGroup({commit}, {id}){
        return new Promise( (resolve, reject) => {
            //get members unimportant to return
            ckanServ.getGroupMembers(id).then( async(data) => {
                if (data.success){
                    let members = data.result;
                    for (let i=0; i<members.length; i++){
                        var user = await ckanServ.getUser(members[i][0]);
                        if (user.success){
                            members[i].push(user.result.display_name);
                        }
                    }
                    commit('setCurrentMemberList', {members: members});
                }
            });

            //get if user following unimportant to return
            ckanServ.getGroupFollowing(id).then( async(data) => {
                if (data.success){
                    commit('setCurrUserFollowingCurrGroup', {following: data.result});
                }
            });

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
                resolve();
            }).catch( (e) => {
                reject(e);
            });
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
        }else{
            commit('setSearchedGroups', {searchedGroups: state.groups});
        }
        commit('setSearchText', {searchText: searchText});
    }
}

const mutations = {
    setCurrentMemberList(state, {members}){
        state.groupMembers = members;
    },

    setCurrUserFollowingCurrGroup(state, {following}){
        state.currUserFollowingCurrGroup = following;
    },

    setGroupActivity(state, { activity }){
        state.groupActivity = activity;
    },

    setGroupList(state, { groups }) {
        state.groups = groups;
    },

    clearAbort(state){
        state.abort = false;
    },

    setSchema(state, { schema }) {
        state.groupSchemas = Object.assign(state.groupSchemas, {group: schema});
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
