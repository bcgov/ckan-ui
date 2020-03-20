import { CkanApi } from '../../services/ckanApi';
const ckanServ = new CkanApi();

const state = {
    orgList: {},
    userOrgs: [],
    searchText: "",
};

const getters = {
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
    getOrgs({ commit }) {
        if (Object.entries(state.orgList).length == 0) {
            ckanServ.getOrgList().then((data) => {
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
    }
}

const mutations = {
    setOrgList(state, { orgList }) {
        state.orgList = Object.assign({}, orgList);
    },

    setSearchText(state, { searchText }) {
        state.searchText = searchText;
    },

    setUserOrgList(state, { orgList }) {
        var userOrgs = [];

        if ( (typeof(orgList) === "undefined") || (typeof(orgList.result) === "undefined") || (orgList.result.length === 0)){
            state.userOrgs = [];
            return;
        }

        for (let i=0; i<orgList.result.length; i++){
            userOrgs.push({value:orgList.result[i].id , label: orgList.result[i].display_name});
        }

        state.userOrgs = Object.assign({}, userOrgs);
    },
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
