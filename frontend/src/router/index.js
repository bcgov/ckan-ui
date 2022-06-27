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
const user_profile = () => import(/* webpackChunkName: "profile" */ "../components/user/profile");
const admin = () => import(/* webpackChunkName: "admin" */ "../components/admin/admin");
const admin_home = () => import(/* webpackChunkName: "admin_home" */ "../components/admin/admin_home");
const admin_org_members = () => import(/* webpackChunkName: "admin_home" */ "../components/admin/members");
const NotFound = () => import(/* webpackChunkName: "NotFound" */ "../components/pages/404");
const about = () => import(/* webpackChunkName: "about" */ "../components/pages/about");
const resource = () => import(/* webpackChunkName: "resource" */ "../components/pages/resource");
const siteUsage = () => import(/* webpackChunkName: "usage" */ "../components/pages/usage");

import store from '../store/index';

Vue.use(Router);

let r = new Router({
    mode: 'history',
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
            alias: '/dataset',
            component: datasets,
            meta: {
                title: "Datasets - Data Catalogue"
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
                title: "Viewing Dataset",
                dynamicTitle: true
            }
        },
        {
            path: '/dataset/:datasetId/resource/create',
            name: 'resource_create',
            component: resource,
            meta: {
                title: "Creating a new Resource"
            }
        },
        {
            path: '/dataset/:datasetId/resource/:resourceId',
            name: 'resource_view',
            component: resource,
            meta: {
                title: "Viewing Resource",
                dynamicTitle: true
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
            path: '/organization/create',
            name: 'organization_create',
            component: organization_view,
            meta: {
                title: "Creating Organization"
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
            alias: '/group',
            component: groups,
            meta: {
                title: "Groups"
            }
        },
        {
            path: '/group/create',
            name: 'group_create',
            component: group_view,
            meta: {
                title: "Creating a new Group"
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
            path: '/usage',
            name: 'siteUsage',
            component: siteUsage,
            meta: {
                title: "Site Usage"
            }
        },
        {
            path: '/user',
            name: 'user',
            redirect: '/user/profile',
            component: user,
            children: [{
                path: 'profile',
                name: 'userProfile',
                meta: {
                    title: "User Profile"
                },
                component: user_profile
            }, {
                path: 'admin',
                name: 'admin',
                component: admin,
                children: [{
                    path: '',
                    name: 'adminHome',
                    meta: {
                        title: "Administration"
                    },
                    component: admin_home
                }, {
                    path: ':orgId/members',
                    name: 'adminOrgMembers',
                    meta: {
                        title: 'Manage Organization Members'
                    },
                    component: admin_org_members
                }]
            }]
        },
        {
            path: '/user/:userId',
            name: 'otherUser',
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
    store.commit('nav/setCurrentPage', window.currentUrl);
    store.commit('dataset/clearDataset')

    switch(to.name){
        case "Datasets":
        case "Groups":
        case "Organizations":
            store.commit('nav/setLastListPage', window.currentUrl);
            break;

    }

    switch(to.name){
        case "Datasets":
        case "organization_view":
        case "group_view":
            store.commit('nav/setLastDatasetListPage', window.currentUrl);
            if ((to.name !== store.state.nav.lastDatasetListPageTo) && (store.state.search.clearOnRedirect)){
                store.commit('search/setSearchText', "");
                store.commit('search/defaultSortOrder');
                store.commit('search/clearAllFacets');
            }
            store.commit('search/setClearOnRedirect', true);
            store.commit('nav/setLastDatasetListPageTo', to.name);
            break;

    }
    window.previousUrl = from.fullPath;
    next();
});

r.afterEach(() => {
    try {
        window.snowplow('trackPageView');
    } catch (error) {
        // eslint-disable-next-line
        console.error(error);
    }
});

export default r;
