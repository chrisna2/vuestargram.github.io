<template>
    <div class="body">
        <!-- 첫번째 페이지 -->
        <div v-if="now_tap_num == 0">
            <!-- 예시
            <button v-on:click="$emit('shootNumber','50000')">버튼</button>
            v-for="post in postdata" :key="post" 보다 아래 처럼 사용할 것을 권한다.
            v-for="(post, i) in postdata" :key="i"
            -->
            <Post 
                v-for="(post, i) in postdata" :key="i" 
                v-bind:post="post"
                v-on:modifyinsta="modifyinsta"
                v-on:deleteinsta="deleteinsta"
            />
        </div>

        <!-- 두번째 페이지 -->
        <div v-if="now_tap_num == 1">
            <div :class="['upload-image', select_filter]" :style="`background-image:url(${upload_image})`"></div>
            <div class="filters">
                <!-- v-for :key v-bind 가 삼위일체 -->
                <FilterBox v-for="fliter in filter_list" :key='fliter' v-bind:upload_image="upload_image" v-bind:fliter="fliter"/>
            </div>
        </div>

        <!-- 세번째 페이지 -->
        <div v-if="now_tap_num == 2">
            <div v-bind:class="`upload-image ${select_filter}`"  :style="`background-image:url(${upload_image})`"></div>
            <div class="write">
                <!-- 오늘의 세로운 vue 문법 : 컴포넌트의 데이터를 상위 app위로 올려야 한다. -->
                <textarea class="write-box" v-on:input="$emit('shootData', $event.target.value)">write!</textarea>
                <!--
                    $event :
                     addEventListener
                    $event.target.value : 인풋 테그에 입력된 벨류 값 
                    [1] 수정 기능 추가
                    [2] 삭제 기능 추가
                -->
            </div>
        </div>

    </div>
</template>

<script>
import Post from './Post.vue';
import FilterBox from './FilterBox.vue'

export default {
    name: 'Body',
    components: {
        Post, FilterBox
    },
    props : {
        postdata : Array,
        now_tap_num : Number,
        upload_image : String,
        filter_list : Array,
        select_filter : String
    },
        methods : {
            modifyinsta(param){
                this.$emit('modifyinsta', param);
            },
            deleteinsta(param){
                this.$emit('deleteinsta', param);
            }

    }
}
</script>

<style>
.upload-image{
    width: 100%;
    height: 450px;
    background: cornflowerblue;
    background-size : cover;
    background-position: center;
}
.filters{
    overflow-x:scroll;
    white-space: nowrap;
}
.filter-1 {
    width: 100px;
    height: 100px;
    background-color: cornflowerblue;
    margin: 10px 10px 10px auto;
    padding: 8px;
    display: inline-block;
    color : white;
    background-size: cover;
}
.filters::-webkit-scrollbar {
    height: 5px;
}
.filters::-webkit-scrollbar-track {
    background: #f1f1f1; 
}
.filters::-webkit-scrollbar-thumb {
    background: #888; 
    border-radius: 5px;
}
.filters::-webkit-scrollbar-thumb:hover {
    background: #555; 
}
.write-box {
    border: none;
    width: 90%;
    height: 100px;
    padding: 15px;
    margin: auto;
    display: block;
    outline: none;
}
</style>