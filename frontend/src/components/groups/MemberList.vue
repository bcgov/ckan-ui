<template>
    <v-container fluid>
        <v-row>
            <span><h2 class="inline">Members</h2><h2 class="inline noBold">({{members.length}})</h2></span>
            <v-spacer></v-spacer>
            <span v-if="false"><h4><v-btn  v-if="sysAdmin" text depressed color="primary">{{$tc('Add Member')}}</v-btn></h4></span>
        </v-row>

        <v-row wrap>
            <v-col md=6 cols=12 v-for="(member, id) in members" :key="'member-'+id">
                <v-row class="borderBottom mr-3">
                    <v-col cols=6>{{member[3]}}</v-col>
                    <v-col cols=5>{{member[2]}}</v-col>
                    <v-col cols=1><v-btn v-if="sysAdmin" @click="removeUser(id)" text depressed class="noHover"><v-icon>mdi-close</v-icon></v-btn></v-col>
                </v-row>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>

import { mapState } from 'vuex';

import { CkanApi } from '../../services/ckanApi';
const ckanServ = new CkanApi();

export default{

    props: {
        members: Array,
        groupId: String
    },

    methods: {
        removeUser(index){
            ckanServ.deleteGroupMember(this.groupId, this.members[index])
            this.members.splice(index, 1);
        }
    },

    computed: {
        ...mapState({
            sysAdmin: state => state.user.sysAdmin,
        })
    }
}

</script>

<style scoped>
    .borderBottom{
        border-bottom: 1px solid;
    }

    .inline{
        display: inline;
    }

    .noBold{
        font-weight: normal;
    }

    .noHover:hover{
        box-shadow: none;
        border: none;
        background: none;
    }

    .noHover:hover:before{
        opacity: 0;
    }

</style>