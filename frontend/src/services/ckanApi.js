import axios from 'axios';

export class CkanApi {
    constructor(){}

    getClassic() {
        const url = '/api/ckan/classic'
        return axios.get(url).then(response => response.data)
    }

    getDatasets(queryString) {
        const url = '/api/ckan/search'+queryString
        return axios.get(url, {withCredentials: true}).then(response => response.data)
    }

    getDataset(id) {
        const url = '/api/ckan/getDataset?id='+id
        return axios.get(url, {withCredentials: true}).then(response => response.data)
    }

    getFacets(){
        const url = '/api/ckan/getFacets'
        return axios.get(url, {withCredentials: true}).then(response => response.data)
    }

    getOrganization(id){
        const url = '/api/ckan/getOrganization?id='+id
        return axios.get(url, {withCredentials: true}).then(response => response.data)
    }

    getOrgList() {
        const url = '/api/ckan/getOrganizations'
        return axios.get(url, {withCredentials: true}).then(response => response.data)
    }

    getActivity() {
        const url = '/api/ckan/activity'
        return axios.get(url, {withCredentials: true}).then(response => response.data)
    }

    getUser(user_id) {
        const url = '/api/ckan/user/'+user_id
        return axios.get(url, {withCredentials: true}).then(response => response.data)
    }

    getTags() {
        const url = '/api/ckan/tagList/'
        return axios.get(url, {withCredentials: true}).then(response => response.data)
    }

    getVocabs() {
        const url = '/api/ckan/vocabList/'
        return axios.get(url, {withCredentials: true}).then(response => response.data)
    }

    getGroupList() {
        const url = '/api/ckan/groups'
        return axios.get(url, {withCredentials: true}).then(response => response.data)
    }
}
