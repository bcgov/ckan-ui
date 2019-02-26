<template>
    <li>
        <div class="format-label label cursor-help" :data-format="type" title="Data Format">{{type}}</div>
    </li>
</template>

<script>
export default{
    props: {
        type: String
    },
}
</script>

<style scoped>
    ul{
        list-style-type: none
    }

    .format-label {
        margin-right: .3em;
        display: inline-block;
        vertical-align: text-bottom;
        position: relative;
        top: 2px;
        height: 16px;
    }

    .format-label[data-format=rdf],.format-label[data-format*=rdf] {
        width: 32px;
        height: 16px;
        background-position: -32px -62px
    }

    .format-label[data-format=pdf],.format-label[data-format*=pdf] {
        width: 32px;
        height: 16px;
        background-position: -64px -62px
    }

    .format-label[data-format=api],.format-label[data-format*=api] {
        width: 32px;
        height: 16px;
        background-position: -96px -62px
    }

    .format-label[data-format=zip],.format-label[data-format*=zip] {
        width: 32px;
        height: 16px;
        background-position: -128px -62px
    }

    .format-label[data-format=xls],.format-label[data-format*=xls] {
        width: 32px;
        height: 16px;
        background-position: -160px -62px
    }

    .format-label[data-format=csv],.format-label[data-format*=csv] {
        width: 32px;
        height: 16px;
        background-position: -192px -62px
    }

    .format-label[data-format=txt],.format-label[data-format*=txt] {
        width: 32px;
        height: 16px;
        background-position: -224px -62px
    }

    .format-label[data-format=xml],.format-label[data-format*=xml] {
        width: 32px;
        height: 16px;
        background-position: -256px -62px
    }

    .format-label[data-format=json],.format-label[data-format*=json] {
        width: 32px;
        height: 16px;
        background-position: -288px -62px
    }

    .format-label[data-format=html],.format-label[data-format*=html] {
        width: 32px;
        height: 16px;
        background-position: -320px -62px
    }

    .cursor-help{
        cursor: help
    }

    .label[data-format=html],.label[data-format*=html] {
        background-color: #55a1ce
    }

    .label[data-format=json],.label[data-format*=json] {
        background-color: #ef7100
    }

    .label[data-format=xml],.label[data-format*=xml] {
        background-color: #ef7100
    }

    .label[data-format=text],.label[data-format*=text] {
        background-color: #74cbec
    }

    .label[data-format=csv],.label[data-format*=csv] {
        background-color: #dfb100
    }

    .label[data-format=xls],.label[data-format*=xls] {
        background-color: #2db55d
    }

    .label[data-format=zip],.label[data-format*=zip] {
        background-color: #686868
    }

    .label[data-format=api],.label[data-format*=api] {
        background-color: #ec96be
    }

    .label[data-format=pdf],.label[data-format*=pdf] {
        background-color: #e0051e
    }

    .label[data-format=rdf],.label[data-format*=rdf],.label[data-format*=nquad],.label[data-format*=ntriples],.label[data-format*=turtle] {
        background-color: #0b4498
    }

    li{
        line-height: 13px;
        display: inline;
    }

    .label {
        display: inline-block;
        padding: 2px 4px;
        font-size: 11.844px;
        font-weight: bold;
        line-height: 14px;
        color: #ffffff;
        vertical-align: baseline;
        white-space: nowrap;
        text-shadow: 0 -1px 0 rgba(0,0,0,0.25);
        background-color: #999999;
        box-sizing: border-box;
    }

</style>