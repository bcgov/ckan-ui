<template>
    <v-menu bottom offset-y color="primary">
        <template v-slot:activator="{ on }">
            <v-btn text v-on="on" id="user-drop">{{user.displayName}}</v-btn>
        </template>
        <v-list dense class="header-menu-secondary">
            <v-list-item>
                <v-btn text to="/user">{{$tc('Profile')}}</v-btn>
            </v-list-item>
            <v-list-item>
                <v-btn text @click="logout">{{$tc('Logout')}}</v-btn>
            </v-list-item>
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

<style scoped>
    .theme--light.v-list.header-menu-secondary{
        background-color: var(--v-secondary-base);
    }

    .header-menu-secondary .theme--light.v-btn{
       color: var(--v-text-base) !important;
    }

    .header-menu-secondary .theme--light.v-btn{
        color: var(--v-text-base) !important;
    }
    
</style>