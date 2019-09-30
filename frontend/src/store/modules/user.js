import { Auth } from '../../services/auth';
const authServ = new Auth();

const state = {
    authUser: {},
    ckanUser: {},
    loggedIn: false,
    userPermissions: {},
    groupSeperator: null,
    sysAdminGroup: null,
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
        let sep = state.groupSeperator
        if (sep === null){
            await authServ.groupSeperator().then((data) => {
                sep = data.seperator;
                commit('setGroupSeperator', {groupSeperator: sep});
            });
        }

        if (typeof(sep) === "undefined"){
            return;
        }

        let sysAdminGroup = state.sysAdminGroup;
        if (sysAdminGroup === null){
            await authServ.sysAdminGroup().then((data) => {
                sysAdminGroup = data.group;
                commit('setSysAdminGroup', {sysAdminGroup: sysAdminGroup});
            });
        }

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
        if ( (loggedIn) && (Object.keys(state.userPermissions).length > 0) ){
            userPermissions = state.userPermissions;
            sysAdmin = state.sysAdmin;
            isAdmin = state.isAdmin;
            isEditor = state.isEditor;
        }else if (loggedIn){
            
            for (let i=0; i<user.groups.length; i++){
                let g = user.groups[i];
                if (g.substring(0,1) === sep){
                    g = g.substring(1);
                }

                if (g.toLowerCase() == sysAdminGroup.toLowerCase()){
                    sysAdmin = true;
                }

                if (g.indexOf(sep) !== -1){
                    let c = g.substring(g.indexOf(sep)+1);
                    if (c === "admin"){
                        isAdmin = true;
                    }else if (c === "editor"){
                        isEditor = true;
                    }
                    g = g.substring(0, g.indexOf(sep));
                    userPermissions[g] = c;
                }
            }
        }else{
            userPermissions = {};
            isAdmin = false;
            sysAdmin = false;
            isEditor = false;
        }

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
    setGroupSeperator(state, { groupSeperator }){
        state.groupSeperator = groupSeperator;
    },
    setSysAdminGroup(state, { sysAdminGroup }){
        state.sysAdminGroup = sysAdminGroup;
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
