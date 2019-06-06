<template>
    <v-menu bottom offset-y color="primary">
        <template v-slot:activator="{ on }">
            <v-btn flat v-on="on" id="user-drop">{{user.displayName}}</v-btn>
        </template>
        <v-list>
            <v-list-tile>
                <v-btn flat to="/user">{{$tc('Profile')}}</v-btn>
            </v-list-tile>
            <v-list-tile>
                <v-btn flat @click="logout">{{$tc('Logout')}}</v-btn>
            </v-list-tile>
        </v-list>
    </v-menu>
</template>

<script>

export default{
    props: {
        user: Object
    },
    data() {
        return {
            logoutUrl: "/api/logout?r="+window.location.pathname,
        }
    },
    methods: {
        logout: function(){
            var keys = Object.keys(localStorage);
            for (var i=0; i<keys.length; i++){
                delete localStorage[keys[i]];
            }
            window.location.href = this.logoutUrl
        }
    },

    mounted() {

    }
}

</script>