import Vue from 'vue';
import Router from 'vue-router';

const home = () => import(/* webpackChunkName: "home" */ "../components/pages/home");
const datasets = () => import(/* webpackChunkName: "datasets" */ "../components/pages/datasets");
const dataset_view = () => import(/* webpackChunkName: "dataset_view" */ "../components/pages/dataset_view");
const organizations = () => import(/* webpackChunkName: "organizations" */ "../components/pages/organizations");
const organization_view = () => import(/* webpackChunkName: "organization_view" */ "../components/pages/organization_view");
const groups = () => import(/* webpackChunkName: "groups" */ "../components/pages/groups");
const group_view = () => import(/* webpackChunkName: "group_view" */ "../components/pages/group");
const user = () => import(/* webpackChunkName: "user" */ "../components/pages/user");
const NotFound = () => import(/* webpackChunkName: "NotFound" */ "../components/pages/404");
const about = () => import(/* webpackChunkName: "about" */ "../components/pages/about");

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
            path: '/dataset/create',
            name: 'dataset_create',
            component: dataset_view,
            meta: {
                title: "Creating a new Dataset"
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
