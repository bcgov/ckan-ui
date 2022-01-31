<template>
  <!-- <v-card :id="'group-link-'+id" @click="toggleShowDatasets" class="cursor groupLink">
    <v-img alt="Logo" @click="gotoGroup" :src="image" v-on:error="onImgError"></v-img>

    <v-card-title primary-title @click="gotoGroup">
      <div>
        <h3>{{name}}</h3>
        <div>{{description}}</div>
      </div>
    </v-card-title>
  </v-card> -->
    <v-container class="pl-5 cardContainer cardHeight py-0" @click="$emit('groupClicked')">
        <v-row dense align="center" class="cardHeight py-0">
          <v-col cols=2>
            <v-img position="left center" alt="Logo" class="ma-1" max-height="120px" contain :src="image" v-on:error="onImgError"></v-img>
          </v-col>
          <v-col cols=9 class="pl-2">
              <v-container>
                <v-row dense>
                <span class="groupName">{{name}}</span>
                </v-row>
                <v-row dense>
                <v-progress-circular
                    v-if="loading"
                    indeterminate
                    color="light-blue"
                ></v-progress-circular>
                <p v-else class="groupCount">{{datasets.length}} {{$tc('datasets', datasets.length)}}</p>
                </v-row>
              </v-container>
          </v-col>
          <v-col cols=1 class="text-right pr-3" align-self="center">
            <v-icon large color="label_colour">mdi-arrow-right-thick</v-icon>
          </v-col>
        </v-row>
    </v-container>
</template>

<script>


export default{
    name: 'GroupCard',

    props: {
        group: Object
    },

    data() {
        return {
            id: this.group.id,
            name: this.group.display_name,
            description: this.group.description,
            datasets: [],
            showDatasets: false,
            searched: false,
            loading: true,
            imageError: false
        }
    },

    computed: {
      image: function(){
        return !this.imageError ? (this.group.image_display_url ? this.group.image_display_url : this.group.url) : '/placeholder-organization.png';
      }
    },

    methods: {

      gotoGroup: function(){
        this.$router.push('/group/'+this.group.name);
      },

      onImgError: function(){
        this.imageError = true;
      },

    },
    updated() {
        window.snowplow('refreshLinkClickTracking');
    },

}
</script>

<style scoped>

  .groupName{
    font-size: 23px;
    color: var(--v-faded_text-base);
    font-weight: bold;
  }

  .groupCount{
    font-size: 16px;
    color: var(--v-faded_text-base);
  }

  .cardContainer{
    background: var(--v-text_background-base);
    box-shadow: 0 5px 5px rgba(0, 0, 0, .2);
    border-radius: 0px;
    margin-bottom: 10px;
  }

  .cardHeight{
    height: 120px;
  }

  .cursor{
    cursor: pointer;
  }

  .data{
    background: var(--v-text-base);
  }

</style>
