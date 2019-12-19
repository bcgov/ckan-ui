import axios from 'axios';
import apiConfig from './apiConfig';

export class CkanApi {
    constructor(){}

    getClassic() {
        const url = '/api/ckan/classic';
        return axios.get(url).then(response => response.data);
    }

    getDatasets(queryString) {
        const url = '/api/ckan/search'+queryString;
        return axios.get(url, {withCredentials: true, timeout: apiConfig.timeout}).then(response => response.data);
    }

    getDataset(id) {
        const url = '/api/ckan/dataset?id='+id;
        return axios.get(url, {withCredentials: true, timeout: apiConfig.timeout}).then(response => response.data);
    }

    putDataset(dataset) {
        const url = '/api/ckan/dataset';
        return axios.put(url, dataset, {withCredentials: true}).then(response => response.data);
    }

    postDataset(dataset) {
        const url = '/api/ckan/dataset';
        return axios.post(url, dataset, {withCredentials: true}).then(response => response.data);
    }

    deleteDataset(id) {
        const url = '/api/ckan/dataset/'+id;
        return axios.delete(url, { withCredentials: true }).then(response => response.data);
    }

    getFacets(){
        const url = '/api/ckan/facets';
        return axios.get(url, {withCredentials: true}).then(response => response.data);
    }

    getOrganization(id){
        const url = '/api/ckan/organization?id='+id;
        return axios.get(url, {withCredentials: true, timeout: apiConfig.timeout}).then(response => response.data);
    }

    getOrgList() {
        const url = '/api/ckan/organizations';
        return axios.get(url, {withCredentials: true, timeout: apiConfig.timeout}).then(response => response.data);
    }

    getUserOrgList() {
        const url = '/api/ckan/userOrganizations';
        return axios.get(url, {withCredentials: true, timeout: apiConfig.timeout}).then(response => response.data);
    }

    getActivity(user_id) {
        let url = '/api/ckan/activity';
        if ( (typeof(user_id) !== "undefined") && (user_id != "") ){
            url += '/' + user_id;
        }
        return axios.get(url, {withCredentials: true}).then(response => response.data);
    }

    getUser(user_id) {
        const url = '/api/ckan/user/'+user_id;
        return axios.get(url, {withCredentials: true}).then(response => response.data);
    }

    getTags() {
        const url = '/api/ckan/tagList';
        return axios.get(url, {withCredentials: true}).then(response => response.data)
    }

    getVocabs() {
        const url = '/api/ckan/vocabList';
        return axios.get(url, {withCredentials: true}).then(response => response.data)
    }

    getLicenses() {
        const url = '/api/ckan/licenseList';
        return axios.get(url, {withCredentials: true}).then(response => response.data)
    }

    getGroupList() {
        const url = '/api/ckan/groups';
        return axios.get(url, {withCredentials: true, timeout: apiConfig.timeout}).then(response => response.data);
    }

    getGroup(id) {
        const url = '/api/ckan/group/'+id;
        return axios.get(url, {withCredentials: true, timeout: apiConfig.timeout}).then(response => response.data);
    }

    getAbout() {
        const url = '/api/ckan/about';
        return axios.get(url, {withCredentials: true}).then(response => response.data);
    }

    getDatasetSchema(type) {
        let url = '/api/ckan/datasetSchema';
        if (typeof(type) !== "undefined"){
           url += "?type=" +type;
        }
        return axios.get(url, {withCredentials: true}).then(response => response.data);
    }

    getGroupSchema(/*type*/) {
        let url = '/api/ckan/groupSchema';
        // if (typeof(type) !== "undefined"){
        //    url += "?type=" +type;
        // }
        return axios.get(url, {withCredentials: true}).then(response => response.data);
    }

    getGeneric(ckanUrl) {
        let url = '/api/ckan/?url='+encodeURIComponent(ckanUrl);
        return axios.get(url, {withCredentials: true}).then(response => response.data);
    }

    //it is recommended to call getToken from auth immediately before this call
    createResource(data, jwt){
        let url = '/resourceCreate';
        let options = {
            url: url,
            method: "POST",
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': 'Bearer ' + jwt
            },
            data: data,
        };
        return axios(options).then(response => response.data);
    }

    //it is recommended to call getToken from auth immediately before this call
    updateResource(data, jwt){
        let url = '/resourceUpdate';
        let options = {
            url: url,
            method: "POST",
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': 'Bearer ' + jwt
            },
            data: data,
        };
        return axios(options).then(response => response.data);
    }

    deleteResource(id) {
        const url = '/api/ckan/resource/'+id;
        return axios.delete(url, { withCredentials: true }).then(response => response.data);
    }

    deleteGroup(id){
        const url = '/api/ckan/group/'+id;
        return axios.delete(url, { withCredentials: true }).then(response => response.data);
    }

    postGroup(group) {
        const url = '/api/ckan/group';
        return axios.post(url, group, {withCredentials: true}).then(response => response.data);
    }

    putGroup(group) {
        const url = '/api/ckan/group/'+group.id;
        return axios.put(url, group, {withCredentials: true}).then(response => response.data);
    }

    getGroupActivity(group) {
        const url = '/api/ckan/group_activity/'+group;
        return axios.get(url, group, {withCredentials: true}).then(response => response.data);
    }
    
}
