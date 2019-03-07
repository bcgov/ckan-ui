import axios from 'axios';

export class CkanApi {
    constructor(){}

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

}