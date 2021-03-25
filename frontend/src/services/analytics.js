import axios from 'axios';

export class Analytics {
    constructor(){}

    ga(){
        const url = '/api/an/ga'
        try{
            return axios.get(url, {withCredentials: true}).then(response => response.data)
        }catch(ex){
            return ''
        }
    }

    get(pageUrl, pageTitle, referrer){
        const url = '/api/an?pageUrl='+pageUrl+"&pageTitle="+pageTitle+"&referrer="+referrer
        try{
            return axios.get(url, {withCredentials: true}).then(response => response.data)
        }catch(ex){
            return '';
        }
    }

    post(pageUrl, pageTitle, referrer){
        const url = '/api/an?pageUrl='+encodeURI(pageUrl)+"&pageTitle="+encodeURI(pageTitle)+"&referrer="+encodeURI(referrer)
        try{
            return axios.post(url, {}, {withCredentials: true}).then(response => response.data)
        }catch(ex){
            return '';
        }
    }

}
