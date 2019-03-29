<template>
    <v-card flat style="margin-bottom:.5rem;">
        <h3>Contact Information</h3>
        <v-container style="padding-top:10px;border-left:thin solid lightgrey;">
            <v-layout
                v-for="contact in dataset.contacts"
                :key="contact.email"
                column
                justify-start
                flex
            >
                <template v-if="contact.private == 'Display'">
                    <h4>{{contact.name}}</h4>
                    <h5>Role</h5>
                    <p class="contact">{{roles[contact.role]}}</p>
                    <h5>Email</h5>
                    <p class="contact">
                        <a :href="contact.email">{{contact.email}}</a>
                    </p>
                    <h5>Organization</h5>
                    <p class="contact">{{orgTitle(contact.organization)}}</p>
                    <h5>Sub-Organization</h5>
                    <p class="contact">{{orgTitle(contact.branch)}}</p>
                </template>
            </v-layout>
        </v-container>
    </v-card>
</template>

<script>
import { mapState, mapGetters } from "vuex";
export default {
    data() {
        return {
            roles: {
                pointOfContact: "Point of Contact"
            }
        };
    },
    computed: {
        ...mapState({
            dataset: state => state.dataset.dataset
        }),
        ...mapGetters("organization", {
            orgTitle: "titleByID"
        })
    }
};
</script>

<style scoped>
@import "https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css";

.container {
    padding-bottom: 15px;
}
p.contact {
    margin-bottom: 4px;
}
</style>
