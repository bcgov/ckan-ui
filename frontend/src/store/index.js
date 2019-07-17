import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import dataset from './modules/dataset'
import organization from './modules/organization'
import tag from './modules/tag'
import search from './modules/search'
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex)

export default new Vuex.Store({
	modules: {
		user,
		dataset,
        organization,
		tag,
		search,
	},
	plugins: [createPersistedState({
		paths: [
			'user.authUser',
			'user.ckanUser',
			'user.loggedIn',
			'user.userPermissions',
			'user.groupSeperator',
			'user.sysAdminGroup',
			'user.sysAdmin',
			'user.isAdmin',
			'user.loading',
			'dataset.schemas',
			'organization.orgList',
			'search.facets',
			'search.totalFilters',
			'search.searchText',
		]
	})]
})
