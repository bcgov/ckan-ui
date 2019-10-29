import { CkanApi } from '../../services/ckanApi';
const ckanServ = new CkanApi();

const state = {
    orgList: {},
    userOrgs: []
};

const getters = {

    getSubOrgs: (state) => (id) => {
        for (let topOrg in state.orgList) {
            if (state.orgList[topOrg].id == id) {
                let orgs = [];
                for (let j=0; j<state.orgList[topOrg].children.length; j++){
                    orgs.push({label: state.orgList[topOrg].children[j].title, value: state.orgList[topOrg].children[j].id});
                }
                return orgs;
            }
        }
        return [{ id: -1, title: "No Sub-Organizations Found" }];
    },
    getTopOrgs: (state) => {
        let topOrgs = [];
        for (let topOrg in state.orgList) {
            topOrgs.push({ label: state.orgList[topOrg].title, value: state.orgList[topOrg].id });
        }
        return topOrgs;
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
        if (Object.entries(state.orgList).length == 0) {
            ckanServ.getUserOrgList().then((data) => {
                commit('setUserOrgList', { orgList: data });
            });
        }
    }
}

const mutations = {
    setOrgList(state, { orgList }) {
        state.orgList = orgList;
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

        state.userOrgs = userOrgs;
    },
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
