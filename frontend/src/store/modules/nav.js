const state = {
    currentPage: "",
    lastPage: "",
    lastListPage: "",
    lastDatasetListPage: "",
    navHistory: [],
};

const getters = {
}

const actions = {}

const mutations = {
    setCurrentPage(state, page) {
        
        state.navHistory.push(page);
        if (state.navHistory.length > 5){
            state.navHistory.shift();
        }
        state.lastPage = state.currentPage;
        state.currentPage = page;
    },

    setLastListPage(state, page){
        state.lastListPage = page;
    },

    setLastDatasetListPage(state, page){
        state.lastDatasetListPage = page;
    },
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
