import { CkanApi } from '../../services/ckanApi';
import Vue from 'vue';
const ckanServ = new CkanApi();

const state = {
    orgList: {},
    userOrgs: [],
    searchText: "",
    organization: {},
    unmodifiedOrg: {},
    groupMembers: [],
    loading: false,
    schemas: {},
    currUserFollowingCurrGroup: false,
};

const getters = {
    ancestorsByName: (state) => (name) => {
        let ancestors = [];
        for (let topOrg in state.orgList) {
            if (state.orgList[topOrg].name == name) {
                return ancestors;
            }
            let children = state.orgList[topOrg].children;
            for (let child in children) {
                if (children[child].name == name) {
                    ancestors.push(state.orgList[topOrg].name);
                    return ancestors;
                }
            }
        }
        return ancestors;
    },

    titleByID: (state) => (id) => {
        for (let topOrg in state.orgList) {
            if (state.orgList[topOrg].id == id) {
                return state.orgList[topOrg].title;
            }
            let children = state.orgList[topOrg].children;
            for (let child in children) {
                if (children[child].id == id) {
                    return children[child].title;
                }
            }
        }
        return "";
    },
    nameByID: (state) => (id) => {
        for (let topOrg in state.orgList) {
            if (state.orgList[topOrg].id == id) {
                return state.orgList[topOrg].name;
            }
            let children = state.orgList[topOrg].children;
            for (let child in children) {
                if (children[child].id == id) {
                    return children[child].name;
                }
            }
        }
        return "";
    }
}

const actions = {

    followGroup({ state, commit }, apiKey){
        ckanServ.followGroup(state.organization.id, apiKey).then( () => {
            //get if user following
            ckanServ.getGroupFollowing(state.organization.id).then( async(data) => {
                if (data.success){
                    commit('setCurrUserFollowingCurrGroup', {following: data.result});
                }
            });
        });
    },

    unfollowGroup({ state, commit }, apiKey){
        ckanServ.unfollowGroup(state.organization.id, apiKey).then( () => {
            //get if user following
            ckanServ.getGroupFollowing(state.organization.id).then( async(data) => {
                if (data.success){
                    commit('setCurrUserFollowingCurrGroup', {following: data.result});
                }
            });
        });
    },

    newOrg({ commit }){
        commit('setOrg', {org: {}});
    },

    setOrg({ state }) {
        let organization = JSON.parse(JSON.stringify(state.organization));
        return ckanServ.putOrg(organization);
    },

    createOrg({ state }) {
        return ckanServ.postOrg(state.organization);
    },

    getSchema({ commit }){
        ckanServ.getOrgSchema().then((data) => {
            commit('setSchema', { schema: data.result });
        });
    },

    getOrgs({ commit }) {
        commit('setLoading', {loading: true});
        ckanServ.getOrgList().then((data) => {
            commit('setOrgList', { orgList: data.orgList });
            commit('setLoading', {loading: false});
        });
        
    },

    getOrgsNoCache({ commit }) {
        if (Object.entries(state.orgList).length == 0) {
            ckanServ.getOrgListNoCache().then((data) => {
                commit('setOrgList', { orgList: data.orgList });
            });
        }
    },

    getUserOrgs({ commit }) {
        if (state.userOrgs.length == 0) {
            ckanServ.getUserOrgList().then((data) => {
                commit('setUserOrgList', { orgList: data });
            });
        }
    },

    getOrg({commit}, {id}){
        commit('setLoading', {loading: true});
        //get members
        ckanServ.getGroupMembers(id).then( async(data) => {
            if ((data.success) && (!data.result.error)){
                let members = data.result;
                for (let i=0; i<members.length; i++){
                    var user = await ckanServ.getUser(members[i][0]);
                    if (user.success){
                        members[i].push(user.result.display_name);
                    }
                }
                commit('setCurrentMemberList', {members: members});
            }else{
                commit('setCurrentMemberList', {members: []});
            }
        });

        ckanServ.getGroupFollowing(id).then( async(data) => {
            if (data.success){
                commit('setCurrUserFollowingCurrGroup', {following: data.result});
            }
        });

        ckanServ.getOrgSchema().then((data) => {
            commit('setSchema', { schema: data.result });
        });

        if (state.userOrgs.length == 0) {
            ckanServ.getUserOrgList().then((data) => {
                commit('setUserOrgList', { orgList: data });
            });
        }
        
        ckanServ.getOrganization(id).then( (data) => {
            if (data.success) {
                commit('setOrg', {org: data.result});
            } else {
                commit('setOrg', {org: {}});
            }
            commit('setLoading', {loading: false});
        });
    }
    
}

const mutations = {
    setCurrentMemberList(state, {members}){
        state.groupMembers = members;
    },

    setCurrUserFollowingCurrGroup(state, {following}){
        state.currUserFollowingCurrGroup = following;
    },

    setOrgList(state, { orgList }) {
        state.orgList = Object.assign({}, orgList);
    },

    setSearchText(state, { searchText }) {
        state.searchText = searchText;
    },

    setOrg(state, { org }){
        state.unmodifiedOrg = Vue.set(state, 'unmodifiedOrg', org);
        state.organization = Object.assign(state.organization, {}, org);
    },

    setLoading(state, { loading }){
        state.loading = loading;
    },

    setSchema(state, { schema }){
        state.schemas = Object.assign(state.schemas, {organization: schema});
    },

    setUserOrgList(state, { orgList }) {
        var userOrgs = [];

        if ( (typeof(orgList) === "undefined") || (typeof(orgList.result) === "undefined") || (orgList.result.length === 0)){
            state.userOrgs = [];
            return;
        }

        let tmp = {};
        for (let i=0; i<orgList.result.length; i++){
            tmp[orgList.result[i].display_name] = orgList.result[i].id;
        }

        let keys = Object.keys(tmp).sort();

        for (let i=0; i<keys.length; i++){
            userOrgs.push({value: tmp[keys[i]] , label: keys[i]});
        }

        state.userOrgs = Object.assign({}, userOrgs);
    },

    setCurrentNotUnmod(state, {group}) {
        Vue.set(state, 'organization', group);
    },
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
