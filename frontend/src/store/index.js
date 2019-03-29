import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import dataset from './modules/dataset'
import organization from './modules/organization'
import tag from './modules/tag'

Vue.use(Vuex)

export default new Vuex.Store({
	modules: {
		user,
		dataset,
        organization,
        tag
	},
})
