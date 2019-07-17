import Vue from 'vue';
import Router from 'vue-router';

import home from '../components/pages/home';
import datasets from '../components/pages/datasets';
import dataset_view from '../components/pages/dataset_view';
import organizations from '../components/pages/organizations';
import organization_view from '../components/pages/organization_view';
import groups from '../components/pages/groups';
import group_view from '../components/pages/group';
import user from '../components/pages/user';

import NotFound from '../components/pages/404';

import about from '../components/pages/about';

Vue.use(Router);

let r = new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'splash',
            component: home,
            meta: {
                title: "DataCatalogue"
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
            path: '/organization',
            name: 'Organizations',
            component: organizations,
            meta: {
                title: "Organizations"
            }
        },
        {
            path: '/organization/:organizationId',
            name: 'organization_view',
            component: organization_view,
            meta: {
                title: "Viewing Organization"
            }
        },
        {
            path: '/groups',
            name: 'Groups',
            component: groups,
            meta: {
                title: "Groups"
            }
        },
        {
            path: '/group/:groupId',
            name: 'group_view',
            component: group_view,
            meta: {
                title: "Viewing Group"
            }
        },
        {
            path: '/about',
            name: 'about',
            component: about,
            meta: {
                title: "About"
            }
        },
        {
            path: '/user',
            name: 'user',
            component: user,
            meta: {
                title: "User Profile"
            }
        },
        {
            path: '*',
            component: NotFound,
            meta: {
                title: "404 - Page Not Found"
            }
        }
    ]
});

r.beforeEach((to, from, next) => {
    window.currentUrl = to.fullPath;
    window.previousUrl = from.fullPath;
    next();
});

export default r;
