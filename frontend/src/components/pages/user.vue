<template>
    <v-container v-if="error === 'Not logged in'">
        <div row align-center justify-center>
            <h1>Unauthorized</h1>
            <p>This page requires you to be logged in</p>
        </div>
    </v-container>
    <v-container v-else-if="error">
        <div row align-center justify-center>
            <h1><v-icon x-large>error</v-icon> An Error Occurred: {{error.code}}</h1>
            <p><v-icon x-large>sentiment_very_dissatisfied</v-icon> Please try again or contact your system administrator</p>
        </div>
    </v-container>
    <v-container v-else fluid class="pt-0 px-0 raise">
        <v-tabs v-model="activeTab" background-color="menu_secondary" slider-color="govYellow" slider-size=3>
            <span class="pl-16"></span>
            <v-tab v-for="tab in tabs" :key="tab.title" :to="tab.route" class="tab" 
                :class="{ 'd-none': tab.title === 'Admin' && !showAdminTab}" active-class="active-tab"
                >{{tab.title}}</v-tab>
        </v-tabs>
        <router-view />
    </v-container>
</template>

<script>
    import ActivityList from '../common/activityList';
    import Profile from '../user/profile';
    import { CkanApi } from '../../services/ckanApi';
    import { mapGetters, mapState } from "vuex";

    const ckanServ = new CkanApi();
    import { Analytics } from '../../services/analytics';
    const analyticsServ = new Analytics();


    export default {
        name: "user",
        components: {
            // Profile: Profile,
        },
        data () {
            return {
                activities: [],
                loading: true,
                error: null,
                user_id: this.$route.params.userId ? this.$route.params.userId : "",
                tabs: [{title: "Profile", route: {name: 'userProfile'}}, {title: "Admin", route: {name: 'adminHome'}}],
                activeTab: 'Profile'
            }
        },
        computed:{
            article(){
                return (this.$route.params.userId && this.user.name) ? (this.user.name[0].toUpperCase() + this.user.name.substring(1)) : "You";
            },
            ...mapGetters("organization", {
                hasAdmin: "hasAdmin"
            }),
            ...mapState({
                sysAdmin: state => state.user.sysAdmin,
                userGroups: state => state.group.userGroups
            }),
            showAdminTab: function() {
                if (this.sysAdmin || this.hasAdmin || this.userGroups.length > 0 || this.$route.matched.some(({ name }) => name === 'admin')) return true;
                return false;
            }
        },
        methods: {
            
        },
        mounted(){
            if (this.$route.matched.some(({ name }) => name === 'admin')) {
                this.activeTab = 'Admin'
            }
            this.$store.dispatch('group/getUserGroups');
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
    .tab {
        color: white !important;
        font-weight: bold;
    }
</style>
