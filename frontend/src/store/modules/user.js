import { Auth } from '../../services/auth';
const authServ = new Auth();

const state = {
    authUser: {},
    ckanUser: {}
}

const getters = {
    isLoggedIn: (state) => {
        return Object.entries(state.authUser).length > 0;
    }
}

const actions = {
    getCurrentUser({ commit, state }) {
        if (state.authUser && state.authUser.jwt) {
            let currDate = new Date();

            let base64Url = state.authUser.jwt.split('.')[1];
            let base64 = base64Url.replace('-', '+').replace('_', '/');
            let jwtObj = JSON.parse(window.atob(base64));
            let exp = new Date(0);
            exp.setUTCSeconds(jwtObj.exp);

            if (currDate > exp) {
                authServ.getToken().then((data) => {
                    if ((typeof (data.error) === "undefined") && (typeof (data) === "object")) {
                        commit('setAuthUser', { authUser: data });
                    } else {
                        commit('setAuthUser', {});
                    }
                });
            }
        } else {
            authServ.getToken().then((data) => {
                if ((typeof (data.error) === "undefined") && (typeof (data) === "object")) {
                    commit('setAuthUser', { authUser: data });
                }
            });
        }
    }
}

const mutations = {
    setAuthUser(state, { authUser }) {
        state.authUser = authUser;
    },
    setCkanUser(state, { ckanUser }) {
        state.ckanUser = ckanUser;
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
