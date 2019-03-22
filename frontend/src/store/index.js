import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import dataset from './modules/dataset'
import organization from './modules/organization'

Vue.use(Vuex)

export default new Vuex.Store({
	modules: {
		user,
		dataset,
		organization
	},
})