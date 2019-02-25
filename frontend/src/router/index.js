import Vue from 'vue';
import Router from 'vue-router';

import datasets from '../components/pages/datasets'

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            name: 'Datasets',
            component: datasets,
        }
    ]
});