<template>
    <v-container v-if="error === 'Not logged in'">
        <div row align-center justify-center>
            <h1>Unauthorized</h1>
            <p>This page requires you to be logged in</p>
        </div>
    </v-container>
    <v-container v-else-if="error">
        <div row align-center justify-center>
            <h1><v-icon x-large>error</v-icon> An Error Occured: {{error.code}}</h1>
            <p><v-icon x-large>sentiment_very_dissatisfied</v-icon> Please try again or contact your system administrator</p>
        </div>
    </v-container>
    <v-container v-else fluid class="raise">
        <Breadcrumb :breadcrumbs="breadcrumbs"></Breadcrumb>
        <v-progress-circular
          v-if="loading"
          :size="70"
          :width="7"
          color="grey"
          indeterminate
        ></v-progress-circular>
        <div v-else-if="noData">No activities yet, get involved!</div>
        <v-row wrap v-else>
            <v-col cols=3>
                <Profile :user="user"></Profile>
            </v-col>
            <v-col cols=9>
                <v-row wrap>
                    <h2>Activity</h2>
                </v-row>
                <ActivityList :activities="activities" :article="article"></ActivityList>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import Breadcrumb from '../breadcrumb/Breadcrumb';
    import ActivityList from '../common/activityList';
    import Profile from '../user/profile';
    import {CkanApi} from '../../services/ckanApi';

    const ckanServ = new CkanApi();
    import {Analytics} from '../../services/analytics';
    const analyticsServ = new Analytics();


    export default {
        name: "user",
        components: {
            Breadcrumb: Breadcrumb,
            ActivityList: ActivityList,
            Profile: Profile,
        },
        data () {
            return {
                activities: [],
                loading: true,
                error: null,
                breadcrumbs: [
                    {icon: "home", label: 'Home', route: '/'},
                    {label: 'Profile'}
                ],
                user: {},
                user_id: this.$route.params.userId ? this.$route.params.userId : "",
                noData: false,
            }
        },
        computed:{
            article(){
                return (this.$route.params.userId && this.user.name) ? (this.user.name[0].toUpperCase() + this.user.name.substring(1)) : "You";
            }
        },
        methods: {
            getUserActivity: function(){
                ckanServ.getActivity(this.user_id).then( (data) => {
                    if (data.error){
                        this.error = data.error;
                    } else if ( (typeof(data.result) == "undefined") || (typeof(data.result[0]) === "undefined") ||  (typeof(data.result[0].user_id) === "undefined") ){
                        this.noData = true;
                    } else {

                        this.activities = data.result;
                        this.user_id = data.result[0].user_id
                        this.getUser()
                    }
                    this.loading = false;
                });
            },

            getUser: function(){
                ckanServ.getUser(this.user_id).then( (data) => {
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
    .raise {
        margin-bottom: 45px;
    }
</style>
