import { Auth } from '../../services/auth';
const authServ = new Auth();

import { CkanApi } from '../../services/ckanApi';
const ckanServ = new CkanApi();

const state = {
    authUser: {},
    ckanUser: {},
    loggedIn: false,
    userPermissions: {},
    sysAdmin: false,
    isAdmin: false,
    isEditor: false,
    loading: true,
};

// function sleep(ms) {
//     return new Promise(resolve => setTimeout(resolve, ms));
// }

const actions = {
    async getCurrentUser({ commit, state }) {
        
        commit('setLoading', {loading: true});

        let user = state.authUser;
        let loggedIn = state.loggedIn;

        if (state.authUser && state.authUser.jwt) {
            let currDate = new Date();

            let base64Url = state.authUser.jwt.split('.')[1];
            let base64 = base64Url.replace('-', '+').replace('_', '/');
            let jwtObj = JSON.parse(window.atob(base64));
            let exp = new Date(0);
            exp.setUTCSeconds(jwtObj.exp);

            if (currDate > exp) {
                await authServ.getToken().then((data) => {
                    if ((typeof (data.error) === "undefined") && (typeof (data) === "object")) {
                        commit('setAuthUser', { authUser: data });
                        commit('setLoggedIn', {loggedIn: true});
                        user = data;
                        loggedIn = true;
                    } else {
                        commit('setAuthUser', {authUser: null});
                        commit('setLoggedIn', {loggedIn: false});
                        user = {};
                        loggedIn = false;
                    }
                });
            }
        } else {
            await authServ.getToken().then((data) => {
                if ((typeof (data.error) === "undefined") && (typeof (data) === "object")) {
                    commit('setAuthUser', { authUser: data });
                    commit('setLoggedIn', {loggedIn: true});
                    user = data;
                    loggedIn = true;
                }
            });
        }

        let userPermissions = {};
        let sysAdmin = false;
        let isAdmin = false;
        let isEditor = false;
        if ( (loggedIn) && user.userPermissions ){
            userPermissions = user.userPermissions;
            sysAdmin = user.sysAdmin;
            isAdmin = user.isAdmin || user.sysAdmin;
            isEditor = user.isEditor;
        }else{
            userPermissions = {};
            isAdmin = false;
            sysAdmin = false;
            isEditor = false;
        }

        ckanServ.getActivity(this.user_id).then( (d) => {
            if ( (d.result) && (d.result[0]) && (d.result[0]) && (d.result[0].user_id) ){
                ckanServ.getUser(d.result[0].user_id).then( (data) => {
                    commit('setCkanUser', {ckanUser: data.result});
                });
            }else{
                commit('setCkanUser', {ckanUser: null});
            }
        });

        commit('setUserPermissions', {userPermissions: userPermissions});
        commit('setSysAdmin', {sysAdmin: sysAdmin});
        commit('setAdmin', {isAdmin: isAdmin});
        commit('setEditor', {isEditor: isEditor});
        commit('setLoading', {loading: false});

    }
}

const mutations = {
    setLoading(state, {loading}){
        state.loading = loading;
    },
    setUserPermissions(state, { userPermissions }){
        state.userPermissions = userPermissions;
    },
    setSysAdmin(state, { sysAdmin }){
        state.sysAdmin = sysAdmin;
    },
    setAuthUser(state, { authUser }) {
        state.authUser = authUser;
    },
    setLoggedIn(state, { loggedIn }){
        state.loggedIn = loggedIn;
    },
    setCkanUser(state, { ckanUser }) {
        state.ckanUser = ckanUser;
    },
    setAdmin(state, { isAdmin }){
        state.isAdmin = isAdmin;
    },
    setEditor(state, { isEditor }){
        state.isEditor = isEditor;
    }
}

export default {
    namespaced: true,
    state,
    actions,
    mutations
}
