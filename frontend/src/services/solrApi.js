import axios from 'axios';

export class SolrApi {
    constructor(){}

    getDatasets(queryString) {
        const url = '/client-api/solr/select'+queryString
        return axios.get(url).then(response => response.data)
    }

    getSchema() {
        const url = '/client-api/solr/schema'
        return axios.get(url).then(response => response.data)
    }

}