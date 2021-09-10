<template>
  <v-dialog v-model="showDialog" content-class="deletion-confirmation-dialog">
    <template v-slot:activator="{ on }">
      <v-btn text small depressed :class="buttonClass" color="error_text" v-on="on">
        <v-icon>mdi-trash-can-outline</v-icon><span v-html="fullButtonText"></span>
      </v-btn>
    </template>
    <v-card>
        <v-card-title>{{$tc("Please Confirm Action")}}</v-card-title>

        <v-card-text>
          {{$tc(confirmationMessage)}}
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer> <v-btn @click="cancel" color="secondary">{{$tc("Cancel")}}</v-btn> <v-btn @click="confirm" color="primary">{{$tc("Okay")}}</v-btn>
        </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>

  export default {
    data: () => ({
      showDialog: false
    }),

    props: {

      confirmationMessage: {
        type: String,
        default: "Are you sure?"
      },

      buttonText: {
        type: String,
        default: ""
      },

      buttonClass: {
        type: String,
        default: ""
      }
    },

    computed: {
      fullButtonText() {
        return this.buttonText ? '&nbsp;' + this.$tc(this.buttonText) : '';
      }
    },

    methods: {
      cancel() {
        this.$emit("cancel");
        this.showDialog = false;
      },

      confirm() {
        this.$emit("delete");
        this.showDialog = false;
      }
    }
  };

</script>

<style scoped>
  >>> .deletion-confirmation-dialog {
    max-width: 430px;
  }
</style>