<template>
    <li class="marker dataset-sector" v-bind:class="[className]">
        <div title="Sector" class="cursor-help">{{name}}</div>
    </li>
</template>

<script>
export default {
    props: {
        name: String
    },
    computed: {
        className: function(){
            return this.name.toLowerCase().replace(/ /g, "-")
        }
    }
};
</script>

<style scoped>
    li.marker.dataset-sector div.cursor-help{
        cursor: help;
    }

    .marker.geographic {
      background: #27ae60;
    }

    .marker.geographic:after {
      border-right-color: #1e8449;
    }

    .marker.dataset,
    .marker.education {
      background: #2980b9;
    }

    .marker.dataset:after,
    .marker.education:after {
      border-right-color: #2472a4;
    }

    .marker.application {
      background: #9b59b6;
    }

    .marker.application:after {
      border-right-color: #8e44ad;
    }

    .marker.webservice,
    .marker.natural-resources {
      background: #e67e22;
    }

    .marker.transportation {
      background: #7f8c8d;
    }

    .marker.transportation:after {
      border-right-color: #667273;
    }

    .marker.webservice:after,
    .marker.natural-resources:after {
      border-right-color: #bf6515;
    }

    .marker.economy {
      background: #1abc9c;
    }

    .marker.economy:after {
      border-right-color: #17a689;
    }

    .marker.finance {
      background: #f1c40f;
    }

    .marker.finance:after {
      border-right-color: #dab10d;
    }

    .marker.social-services {
      background: #b1455a;
    }

    .marker.social-services:after {
      border-right-color: #8f3748;
    }

    .marker.health-and-safety {
      background: #e74c3c;
    }

    marker.health-and-safety:after {
      border-right-color: #cd3121;
    }

    .marker.justice {
      background: #2c3e50;
    }

    .marker.justice:after {
      border-right-color: #233140;
    }

    .marker.multiculturalism {
      background: #95a5a6;
    }

    .marker.multiculturalism:after {
      border-right-color: #79898a;
    }

    .marker.service {
      background: #9b59b6;
    }

    .marker.service:after {
      border-right-color: #8f4bab;
    }

    .marker.dataset-iso {
      background: #34495e;
    }

    .marker.dataset-iso:after {
      border-right-color: #22303d;
    }

    .marker a,
    .marker div {
      display: block;
      padding: 5px 8px;
      color: #fff;
      font-size: 18px;
      font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;
      font-weight: bold;
    }

    .marker {
      width: 130px;
      line-height: 22px;
      margin: 20px 0;
      background: #888;
    }

    .marker:after {
      content: "";
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 0 130px 8px 0;
      border-color: transparent black transparent transparent;
      float: right;
    }

</style>