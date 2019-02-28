import Vue from 'vue';
import Router from 'vue-router';

import datasets from '../components/pages/datasets'
import dataset_view from '../components/pages/dataset_view'

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            name: 'Datasets',
            component: datasets,
        },
        {
            path: '/dataset/:datasetId',
            name: 'dataset_view',
            component: dataset_view,
        }
    ]
});