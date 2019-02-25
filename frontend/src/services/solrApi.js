import axios from 'axios';

export class SolrApi {
    constructor(){}

    getDatasets(queryString) {
        const url = '/api/solr/select'+queryString
        return axios.get(url).then(response => response.data)
    }

}