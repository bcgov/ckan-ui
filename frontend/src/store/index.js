import Vue from 'vue';
import Vuex from 'vuex';
import user from './modules/user';
import dataset from './modules/dataset';
import organization from './modules/organization';
import group from './modules/group';
import tag from './modules/tag';
import search from './modules/search';
import pow from './modules/pow';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

export default new Vuex.Store({
	modules: {
		user,
		dataset,
		organization,
		group,
		tag,
		search,
		pow
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
