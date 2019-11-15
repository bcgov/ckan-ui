import { CkanApi } from '../../services/ckanApi';
const ckanServ = new CkanApi();

const state = {
    tagList: [],
    vocabs: {},
    licenses: []
};

const getters = { };

const actions = {
    getTags({ commit }) {
        ckanServ.getTags().then((data) => {
            commit('setTagList', { tagList: data.result });
        });
    },
    getVocabs({ commit, state }) {
        if (Object.entries(state.vocabs).length <= 0) {
            ckanServ.getVocabs().then((data) => {
                let vocabs = {};
                for (let i = 0; i < data.result.length; i++) {
                    let tags = data.result[i].tags;
                    let name = data.result[i].name;
                    vocabs[name] = [];
                    for (let j = 0; j < tags.length; j++) {
                        vocabs[name].push(tags[j].name);
                    }
                }
                commit('setVocabs', {vocabs: vocabs});
            });
        }
    },
    getLicenses({ commit, state }) {
        if (state.licenses.length <= 0) {
            ckanServ.getLicenses().then((data) => {
                commit('setLicenses', { licenses: data.result });
            });
        }
    }
};

const mutations = {
    setTagList(state, { tagList }) {
        state.tagList = tagList;
    },
    setVocabs(state, { vocabs }) {
        state.vocabs = vocabs;
    },
    setLicenses(state, { licenses }) {
        state.licenses = licenses;
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
