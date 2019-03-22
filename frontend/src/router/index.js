import Vue from 'vue';
import Router from 'vue-router';

import home from '../components/pages/home'
import datasets from '../components/pages/datasets'
import dataset_view from '../components/pages/dataset_view'
import dataset_edit from '../components/pages/dataset_edit'
import organizations from '../components/pages/organizations'

import about from '../components/pages/about'

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            name: 'splash',
            component: home,
            meta: {
                title: "Data Catalogue"
            }
        },
        {
            path: '/datasets',
            name: 'Datasets',
            component: datasets,
            meta: {
                title: "Datasets"
            }
        },
        {
            path: '/dataset/:datasetId',
            name: 'dataset_view',
            component: dataset_view,
            meta: {
                title: "Viewing Dataset"
            }
        },
        {
            path: '/dataset/:datasetId/edit',
            name: 'dataset_edit',
            component: dataset_edit,
            meta: {
                title: "Editing Dataset"
            }
        },
        {
            path: '/organization',
            name: 'Organizations',
            component: organizations,
            meta: {
                title: "Organizations"
            }
        },
        {
            path: '/about',
            name: 'about',
            component: about,
            meta: {
                title: "About"
            }
        }
    ]
});