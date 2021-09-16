import axios from 'axios';

export class PowApi {
    constructor(){}

    getPowConfig(){
        const url = '/client-api/pow/powConfig'
        return axios.get(url).then(response => response.data)
    }

    getOfiConfig(){
        const url = '/client-api/pow/ofiConfig';
        return axios.get(url).then(response => response.data);
    }
}