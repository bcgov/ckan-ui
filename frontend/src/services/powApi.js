import axios from 'axios';

export class PowApi {
    constructor(){}

    getPowConfig(){
        const url = '/api/pow/powConfig'
        return axios.get(url).then(response => response.data)
    }

    getOfiConfig(){
        const url = '/api/pow/ofiConfig';
        return axios.get(url).then(response => response.data);
    }
}