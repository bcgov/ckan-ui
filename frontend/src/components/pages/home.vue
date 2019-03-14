<template>
  <v-container fluid primary dark align-center justify-center fill-height>
    <v-layout align-center>
        <v-text-field box background-color="text" append-icon="search" light v-model="searchText" label="Search Datasets..." v-on:keyup="search"></v-text-field>
    </v-layout>
  </v-container>
</template>

<script>

  export default{
      data () {
        return {
          searchText: ""
        }
      },
      methods:{
        search: function(e){
            if (e.keyCode === 13) {
                this.$router.push('/datasets?q=' + this.searchText)
                this.showSearch = false
            }
        }
      },
  }

</script>