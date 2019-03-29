<template>
    <v-card flat style="margin-bottom:.5rem">
        <p v-html="compiledMarkdown"></p>
    </v-card>
</template>

<script>
import { mapState } from "vuex";
import marked from "marked";
export default {
    props: {
        desc: String
    },
    computed: {
        compiledMarkdown: function() {
            return marked(this.dataset.notes, { sanitize: true });
        },
        ...mapState({
            dataset: state => state.dataset.dataset
        })
    }
};
</script>

<style scoped>
</style>
