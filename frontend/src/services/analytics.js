import axios from 'axios';

export class Analytics {
    constructor(){}

    ga(){
        const url = '/api/analytics/ga'
        return axios.get(url, {withCredentials: true}).then(response => response.data)
    }

    get(pageUrl, pageTitle, referrer){
        const url = '/api/analytics?pageUrl='+pageUrl+"&pageTitle="+pageTitle+"&referrer="+referrer
        return axios.get(url, {withCredentials: true}).then(response => response.data)
    }

    post(pageUrl, pageTitle, referrer){
        const url = '/api/analytics?pageUrl='+encodeURI(pageUrl)+"&pageTitle="+encodeURI(pageTitle)+"&referrer="+encodeURI(referrer)
        return axios.post(url, {}, {withCredentials: true}).then(response => response.data)
    }

}
