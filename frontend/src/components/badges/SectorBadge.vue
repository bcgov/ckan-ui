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
            if (this.name) {
                return this.name.toLowerCase().replace(/ /g, "-");
            }
            return '';
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

    .marker.dataset,
    .marker.education {
      background: #2980b9;
    }

    .marker.application {
      background: #9b59b6;
    }

    .marker.webservice,
    .marker.natural-resources {
      background: #e67e22;
    }

    .marker.transportation {
      background: #7f8c8d;
    }

    .marker.economy {
      background: #1abc9c;
    }

    .marker.finance {
      background: #f1c40f;
    }

    .marker.social-services {
      background: #b1455a;
    }

    .marker.health-and-safety {
      background: #e74c3c;
    }

    .marker.justice {
      background: #2c3e50;
    }

    .marker.multiculturalism {
      background: #95a5a6;
    }

    .marker.service {
      background: #9b59b6;
    }

    .marker.dataset-iso {
      background: #34495e;
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

</style>
