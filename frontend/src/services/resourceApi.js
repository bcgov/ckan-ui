import axios from 'axios';

export class ResourceApi {
    constructor(){}

    getResource(id){
        const url = '/api/resource/'+id
        return axios.get(url, {withCredentials: true}).then(response => response.data)
    }

    getPreview(previewUrl, json){

        let url = '/api/resource/preview/'+encodeURIComponent(previewUrl)
        if (json){
            url += "?json_table_schema=" + JSON.stringify(json);
        }
        return axios.get(url, {withCredentials: true}).then(response => response.data)
    }

}