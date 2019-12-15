<template>
    <div v-bind:class="`filter-item ${fliter}`" :style="`background-image: url(${upload_image})`" v-on:click="goApp"></div>
</template>

<script>
import EventBus from './../EventBus.js';

export default {
    props : {
        upload_image : String,
        fliter : String 
    },
    methods : {
        goApp(){
            EventBus.$emit('select-filter', this.fliter);
        }
    }
}

//filter-box 에서 한번에 app.vue로 바로 한방에 가는 법 : 버스 태워서 보낸다.
</script>

<style>
.filter-item {
    width: 100px;
    height: 100px;
    margin: 10px 10px 10px auto;
    padding: 8px;
    display: inline-block;
    color : white;
    background-size: cover;
    background-position : center;
}
</style>