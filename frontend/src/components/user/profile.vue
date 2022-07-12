<template>
    <v-container v-if="error">
        <div row align-center justify-center>
            <h1><v-icon x-large>error</v-icon> An Error Occurred: {{error.code}}</h1>
            <p><v-icon x-large>sentiment_very_dissatisfied</v-icon> Please try again or contact your system administrator</p>
        </div>
    </v-container>
    <v-container v-else fluid class="raise">
        <v-progress-circular
          v-if="loading"
          :size="70"
          :width="7"
          color="grey"
          indeterminate
        ></v-progress-circular>
        <v-row wrap v-else>
            <v-col cols=3>
                <ProfileCard :user="user"></ProfileCard>
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
    import ActivityList from '../common/activityList';
    import ProfileCard from '../user/profile_card';
    import {CkanApi} from '../../services/ckanApi';
    import { mapState } from "vuex";

    const ckanServ = new CkanApi();
    import {Analytics} from '../../services/analytics';
    const analyticsServ = new Analytics();


    export default {
        name: "user",
        components: {
            ActivityList: ActivityList,
            ProfileCard: ProfileCard,
        },
        data () {
            return {
                activities: [],
                loading: true,
                error: null,
                user_id: "",
                user: {},
            }
        },
        computed:{
            article(){
                return (this.$route.params.userId && this.user.name) ? (this.user.name[0].toUpperCase() + this.user.name.substring(1)) : "You";
            }
        },
        methods: {
            getUserActivity: async function(){
                this.user_id = await ckanServ.getUserId() || null;
                this.getUser();

                ckanServ.getActivity(this.user_id).then( (data) => {
                    if (data.error){
                        this.error = data.error;
                    } else {
                        this.activities = data.result;
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
        },
        updated() {
            window.snowplow('refreshLinkClickTracking');
        },

    }
</script>

<style scoped>
    .raise {
        margin-bottom: 45px;
    }
</style>
