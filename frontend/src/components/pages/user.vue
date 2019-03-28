<template>
    <v-container fluid>
        <Breadcrumb :breadcrumbs="breadcrumbs"></Breadcrumb>
        <v-progress-circular
          v-if="loading"
          :size="70"
          :width="7"
          color="grey"
          indeterminate
        ></v-progress-circular>
        <div v-else-if="error !== ''">{{error}}</div>
        <v-layout row wrap v-else>
            <v-flex xs3>
                <Profile :user="user"></Profile>
            </v-flex>
            <v-flex xs9>
                <v-layout row wrap>
                    <h2>Activity</h2>
                </v-layout>
                <v-layout row wrap>
                    <ActivityItem v-for="(activity, key) in activities" :key="'activity-'+key" :activity="activity"></ActivityItem>
                </v-layout>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import Breadcrumb from '../breadcrumb/Breadcrumb'
    import ActivityItem from '../user/activityItem'
    import Profile from '../user/profile'
    import {CkanApi} from '../../services/ckanApi'

    const ckanServ = new CkanApi()
    import {Analytics} from '../../services/analytics'
    const analyticsServ = new Analytics()


    export default {
        name: "user",
        components: {
            Breadcrumb: Breadcrumb,
            ActivityItem: ActivityItem,
            Profile: Profile,
        },
        data () {
            return {
                activities: [],
                loading: true,
                error: "",
                breadcrumbs: [
                    {icon: "home", label: 'Home', route: '/'},
                    {label: 'Profile'}
                ],
                user: {},
                user_id: ""
            }
        },
        methods: {
            getUserActivity: function(){
                ckanServ.getActivity().then( (data) => {
                    if (data.error){
                        this.error = data.error;
                    }else {
                        this.activities = data.result;
                        this.user_id = data.result[0].user_id
                        this.getUser()
                    }
                    this.loading = false;
                });
            },

            getUser: function(){
                ckanServ.getUser(this.user_id).then( (data) => {
                    // eslint-disable-next-line
                    console.log(data.result);
                    this.user = data.result;
                });
            }
        },
        mounted(){
            analyticsServ.get(window.currentUrl, this.$route.meta.title, window.previousUrl);
            this.getUserActivity()
        }

    }
</script>

<style scoped>

</style>
