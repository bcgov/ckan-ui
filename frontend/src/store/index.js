import Vue from 'vue';
import Vuex from 'vuex';
import user from './modules/user';
import dataset from './modules/dataset';
import organization from './modules/organization';
import group from './modules/group';
import tag from './modules/tag';
import search from './modules/search';
import pow from './modules/pow';
import nav from './modules/nav';
import version from './modules/version';
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
		pow,
		nav,
		version,
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
			'dataset.facetList',
			'dataset.facets',
			'dataset.facetOpen',
			'organization.orgList',
			'organization.searchText',
			'search.facets',
			'search.totalFilters',
			'search.searchText',
			'nav.currentPage',
			'nav.lastPage',
			'nav.navHistory',
			'nav.lastListPage',
		]
	})]
})
