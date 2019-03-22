<template>
    <v-menu bottom offset-y color="primary">
        <template v-slot:activator="{ on }">
            <v-btn flat v-on="on">{{user.displayName}}</v-btn>
        </template>
        <v-list>
            <v-list-tile>
                <v-btn flat to="/user">Profile</v-btn>
            </v-list-tile>
            <v-list-tile>
                <v-btn flat @click="logout">Logout</v-btn>
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
            logoutUrl: "/api/logout"
        }
    },
    methods: {
        logout: function(){
            delete localStorage.user;
            window.location.href = this.logoutUrl
        }
    },

    mounted() {

    }
}

</script>