import { CkanApi } from '../../services/ckanApi';
const ckanServ = new CkanApi();

const state = {
    tagList: [],
    vocabs: {}
}

const getters = { }

const actions = {
    getTags({ commit }) {
        ckanServ.getTags().then((data) => {
            // eslint-disable-next-line
            console.log("Tag Data: ", data);
            commit('setTagList', { tagList: data.result });
        });
    },
    getVocabs({ commit }) {
        ckanServ.getVocabs().then((data) => {
            let vocabs = {};
            for (let vocab in data.result) {
                vocabs[vocab.name] = [];
                for (let tag in vocab.tags) {
                    vocabs[vocab.name].push(tag.name);
                }
            }
            commit('setVocabs', {vocabs: vocabs});
        });
    }
}

const mutations = {
    setTagList(state, { tagList }) {
        state.tagList = tagList;
    },
    setVocabs(state, { vocabs }) {
        state.vocabs = vocabs;
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
