import axios from 'axios';

export class Version {
    constructor(){}

    getVersion(){
        const url = '/api/version'
        return axios.get(url, {withCredentials: true}).then(response => response.data)
    }

}