import axios from 'axios';

export class CkanApi {
    constructor(){}

    getDatasets(queryString) {
        const url = '/api/ckan/search'+queryString
        return axios.get(url).then(response => response.data)
    }

    getDataset(query) {
        const url = '/api/ckan/getDataset'+queryString
        return axios.get(url).then(response => response.data)
    }

}