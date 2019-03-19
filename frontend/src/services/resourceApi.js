import axios from 'axios';

export class ResourceApi {
    constructor(){}

    getResource(id){
        const url = '/api/resource/'+id
        return axios.get(url, {withCredentials: true}).then(response => response.data)
    }

}