import { CkanApi } from '../../services/ckanApi';
const ckanServ = new CkanApi();

const state = {
    orgList: {}
}

const getters = {
    getSubOrgs: (state) => (id) => {
        for (let topOrg in state.orgList) {
            if (state.orgList[topOrg].id == id) {
                return state.orgList[topOrg].children;
            }
        }
        return [{ id: -1, title: "No Sub-Organizations Found" }];
    },
    getTopOrgs: (state) => {
        let topOrgs = [];
        for (let topOrg in state.orgList) {
            topOrgs.push({ title: state.orgList[topOrg].title, id: state.orgList[topOrg].id });
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
    }
}

const mutations = {
    setOrgList(state, { orgList }) {
        state.orgList = orgList;
    },
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
