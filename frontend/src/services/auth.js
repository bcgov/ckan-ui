import axios from 'axios';

export class Auth {
    constructor(){}

    getToken(){
        const url = '/client-api/token'
        return axios.get(url, {withCredentials: true}).then(response => response.data)
    }

    groupSeperator(){
        const url = '/client-api/groupSeperator';
        return axios.get(url).then(response => response.data);
    }

    sysAdminGroup(){
        const url = '/client-api/sysAdminGroup';
        return axios.get(url).then(response => response.data);
    }

}