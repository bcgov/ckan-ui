import { CkanApi } from '../../services/ckanApi';
const ckanServ = new CkanApi();

const state = {
    dataset: {}
}

const getters = {
    isLoaded: (state) => {
        return Object.entries(state.dataset).length <= 0
    }
}

const actions = {
    getDataset({ commit }, { id }) {
        // eslint-disable-next-line
        console.log("ID: ", id);
        ckanServ.getDataset(id).then((data) => {
            // eslint-disable-next-line
            console.log("Dataset: ", data);
            commit('setCurrentDataset', { dataset: data.result });
        });
    },
    setDataset({ state }) {
        // eslint-disable-next-line
        console.log("Saving...", state.dataset);
    },
    addContact({ commit }) {
        commit('setAddContact');
    },
    removeContact({ commit }, { index }) {
        commit('setRemoveContact', {index: index})
    },
    addMoreInfo({ commit }) {
        commit('setAddMoreInfo');
    },
    removeMoreInfo({ commit }, { index }) {
        commit('setRemoveMoreInfo', {index: index})
    }
}

const mutations = {
    setCurrentDataset(state, { dataset }) {
        state.dataset = dataset;
    },
    setAddContact(state) {
        state.dataset.contacts.push({
            name: '',
            email: '',
            organization: '',
            branch: '',
            role: '',
            private: 'Private'
        })
    },
    setRemoveContact(state, { index }) {
        state.dataset.contacts.splice(index, 1);
    },
    setAddMoreInfo(state) {
        state.dataset.more_info.push({
            delete: '0',
            link: ''
        })
    },
    setRemoveMoreInfo(state, { index }) {
        state.dataset.more_info.splice(index, 1);
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
