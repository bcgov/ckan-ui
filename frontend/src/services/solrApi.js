import axios from 'axios';

export class SolrApi {
    constructor(){}

    getDatasets(queryString) {
        const url = '/api/solr/select'+queryString
        return axios.get(url).then(response => response.data)
    }

    getSchema() {
        const url = '/api/solr/schema'
        return axios.get(url).then(response => response.data)
    }

}