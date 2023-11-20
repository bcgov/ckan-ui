import axios from 'axios';
import apiConfig from './apiConfig';

export class CkanApi {
    constructor(){}

    getClassic() {
        const url = '/client-api/ckan/classic';
        return axios.get(url).then(response => response.data);
    }

    getLandingTerms() {
        const url = '/client-api/ckan/landingTerms';
        return axios.get(url).then(response => response.data);
    }

    getDatasets(queryString) {
        const url = '/client-api/ckan/search'+queryString;
        return axios.get(url, {withCredentials: true, timeout: apiConfig.timeout}).then(response => response.data);
    }

    getDataset(id) {
        const url = '/client-api/ckan/dataset?id='+id;
        return axios.get(url, {withCredentials: true}).then(response => response.data);
    }

    putDataset(dataset) {
        const url = '/client-api/ckan/dataset';
        return axios.put(url, dataset, {withCredentials: true}).then(response => response.data);
    }

    postDataset(dataset) {
        const url = '/client-api/ckan/dataset';
        return axios.post(url, dataset, {withCredentials: true}).then(response => response.data);
    }

    deleteDataset(id) {
        const url = '/client-api/ckan/dataset/'+id;
        return axios.delete(url, { withCredentials: true }).then(response => response.data);
    }

    getFacets(){
        const url = '/client-api/ckan/facets';
        return axios.get(url, {withCredentials: true}).then(response => response.data);
    }

    getOrganization(id){
        const url = '/client-api/ckan/organization?id='+id;
        return axios.get(url, {withCredentials: true, timeout: apiConfig.timeout}).then(response => response.data);
    }

    getOrgList() {
        const url = '/client-api/ckan/organizations';
        return axios.get(url, {withCredentials: true}).then(response => response.data);
    }

    getOrgListNoCache() {
        const url = '/client-api/ckan/organizations?nocache=true';
        return axios.get(url, {withCredentials: true}).then(response => response.data);
    }

    getUserOrgList() {
        const url = '/client-api/ckan/userOrganizations';
        return axios.get(url, {withCredentials: true, timeout: apiConfig.timeout}).then(response => response.data);
    }

    getActivity(user_id) {
        let url = '/client-api/ckan/activity';
        if ( (typeof(user_id) !== "undefined") && (user_id != "") ){
            url += '/' + user_id;
        }
        return axios.get(url, {withCredentials: true}).then(response => response.data);
    }

    getUserId() {
        const url = '/client-api/ckan/whoami';
        return axios.get(url, {withCredentials: true}).then(response => response.data.result);
    }

    getUser(user_id) {
        const url = '/client-api/ckan/user/'+user_id;
        return axios.get(url, {withCredentials: true}).then(response => response.data);
    }

    getTags() {
        const url = '/client-api/ckan/tagList';
        return axios.get(url, {withCredentials: true}).then(response => response.data)
    }

    getVocabs() {
        const url = '/client-api/ckan/vocabList';
        return axios.get(url, {withCredentials: true}).then(response => response.data)
    }

    getLicenses() {
        const url = '/client-api/ckan/licenseList';
        return axios.get(url, {withCredentials: true}).then(response => response.data)
    }

    getGroupList() {
        const url = '/client-api/ckan/groups';
        return axios.get(url, {withCredentials: true, timeout: apiConfig.timeout}).then(response => response.data);
    }

    getUserGroupList() {
        const url = '/client-api/ckan/userGroups';
        return axios.get(url, {withCredentials: true, timeout: apiConfig.timeout}).then(response => response.data);
    }

    getGroup(id) {
        const url = '/client-api/ckan/group/'+id;
        return axios.get(url, {withCredentials: true, timeout: apiConfig.timeout}).then(response => response.data);
    }

    async getAbout() {
        const url = '/client-api/ckan/about';


        let aboutPageUrl;

        try {
            aboutPageUrl = (await axios.get(url, {withCredentials: true})).data.url;
        } catch (e) {
            return { content: "" }
        }

        try {
            return { content: (await axios.get(aboutPageUrl)).data };
        } catch (e) {
            return { content: "" };
        } 
    }

    getDatasetSchema(type) {
        let url = '/client-api/ckan/datasetSchema';
        if (typeof(type) !== "undefined"){
           url += "?type=" +type;
        }
        return axios.get(url, {withCredentials: true}).then(response => response.data);
    }

    getGroupSchema(/*type*/) {
        let url = '/client-api/ckan/groupSchema';
        // if (typeof(type) !== "undefined"){
        //    url += "?type=" +type;
        // }
        return axios.get(url, {withCredentials: true}).then(response => response.data);
    }

    getGeneric(ckanUrl) {
        let url = '/client-api/ckan/?url='+encodeURIComponent(ckanUrl);
        return axios.get(url, {withCredentials: true}).then(response => response.data);
    }

    _expandCompositeFields(data) {
        const compositeResourceFields = ['temporal_extent', 'details', 'preview_info', 'geographic_info'];
        for (const compositeField in compositeResourceFields) {
            if (typeof data[compositeField] === 'string') {
                try {
                    const val = JSON.parse(data[compositeField]);
                    data[compositeField] = val;
                } catch {
                    continue;
                }
            }
        }
        return data;
    }

    //it is recommended to call getToken from auth immediately before this call
    createResource(data, jwt) {
        data = this._expandCompositeFields(data);
        let url = '/resourceCreate';
        let options = {
            url: url,
            method: "POST",
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': 'Bearer ' + jwt
            },
            withCredentials: true,
            data: data,
        };
        return axios(options).then(response => response.data);
    }

    //it is recommended to call getToken from auth immediately before this call
    updateResource(data, jwt) {
        data = this._expandCompositeFields(data);
        let url = '/resourceUpdate';
        let options = {
            url: url,
            method: "POST",
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': 'Bearer ' + jwt
            },
            withCredentials: true,
            data: data,
        };

        return axios(options).then(response => response.data);
    }

    deleteResource(id) {
        const url = '/client-api/ckan/resource/'+id;
        return axios.delete(url, { withCredentials: true }).then(response => response.data);
    }

    deleteGroup(id){
        const url = '/client-api/ckan/group/'+id;
        return axios.delete(url, { withCredentials: true }).then(response => response.data);
    }

    postGroup(group) {
        const url = '/client-api/ckan/group';
        return axios.post(url, group, {withCredentials: true}).then(response => response.data);
    }

    putGroup(group) {
        const url = '/client-api/ckan/group/'+group.id;
        return axios.put(url, group, {withCredentials: true}).then(response => response.data);
    }

    getGroupActivity(group) {
        const url = '/client-api/ckan/group_activity/'+group;
        return axios.get(url, group, {withCredentials: true}).then(response => response.data);
    }

    getGroupMembers(group) {
        const url = '/client-api/ckan/members/'+group;
        return axios.get(url, {withCredentials: true}).then(response => response.data);
    }

    deleteGroupMember(groupId,  member){
        const url = '/client-api/ckan/members/'+groupId;
        return axios.delete(url, { data: {object_type: 'user', object: member} }, {withCredentials: true}).then(response => response.data);
    }

    getGroupFollowing(groupId){
        const url = '/client-api/ckan/group/'+groupId+'/following';
        return axios.get(url, {withCredentials: true}).then(response => response.data);
    }

    followGroup(groupId, apiKey){
        const url = '/client-api/ckan/group/'+groupId+'/follow';
        let body = {
            api_key: apiKey
        };
        return axios.post(url, body, {withCredentials: true}).then(response => response.data);
    }

    unfollowGroup(groupId, apiKey){
        const url = '/client-api/ckan/group/'+groupId+'/unfollow';
        return axios.delete(url, { data: {api_key: apiKey} }, {withCredentials: true}).then(response => response.data);
    }

    getOrgSchema(){
        let url = '/client-api/ckan/orgSchema';
        return axios.get(url, {withCredentials: true}).then(response => response.data);
    }

    postOrg(group) {
        const url = '/client-api/ckan/organization';
        return axios.post(url, group, {withCredentials: true}).then(response => response.data);
    }

    putOrg(group) {
        const url = '/client-api/ckan/organization/'+group.id;
        return axios.put(url, group, {withCredentials: true}).then(response => response.data);
    }

    deleteOrg(id){
        const url = '/client-api/ckan/organization/'+id;
        return axios.delete(url, { withCredentials: true }).then(response => response.data);
    }

    getUsage(startY, startM, endY, endM, count, publisher){
        let url = '/client-api/ckan/usage'
        let addedToUrl = false;
        if (startY){
            addedToUrl = true;
            url += "?start_year=" + startY
        }

        if (startM){
            url += (addedToUrl) ? "&" : "?";
            addedToUrl = true;
            url += "start_month=" + startM
        }

        if (endY){
            url += (addedToUrl) ? "&" : "?";
            addedToUrl = true;
            url += "end_year=" + endY
        }

        if (endM){
            url += (addedToUrl) ? "&" : "?";
            addedToUrl = true;
            url += "end_month=" + endM
        }

        if (count){
            url += (addedToUrl) ? "&" : "?";
            addedToUrl = true;
            url += "count=" + count
        }

        if (publisher){
            url += (addedToUrl) ? "&" : "?";
            url += "publisher=" + publisher
        }

        return axios.get(url, { withCredentials: true }).then(response => response.data);
    }

    getPublishers(){
        let url = '/client-api/ckan/publishers'
        return axios.get(url, { withCredentials: true }).then(response => response.data);
    }

    getUserAutocomplete(q) {
        const url = '/client-api/ckan/userAutocomplete/'+q;
        return axios.get(url, {withCredentials: true}).then(response => response.data);
    }

    postOrganizationMember(member) {
        const url = '/client-api/ckan/organizationMember';
        return axios.post(url, member, {withCredentials: true}).then(response => response.data);
    }

    deleteOrganizationMember(member) {
        const url = '/client-api/ckan/organizationMemberDelete';
        return axios.post(url, member, {withCredentials: true}).then(response => response.data);
    }

    postGroupMember(member) {
        const url = '/client-api/ckan/groupMember';
        return axios.post(url, member, {withCredentials: true}).then(response => response.data);
    }

}
