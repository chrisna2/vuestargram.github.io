<template>
  <div class="post">
    <div class="post-header">
        <!-- 속성안에 데이터를 받기 위해서는 " : " 작은 따옴표와 큰 따옴표의 차이가 크게 작용한다.-->
        <div class="profile" :style="'background-image: url('+post.userImage+')'" ></div>
        <span class="profile-name">{{post.name}}</span>
    </div>
    <!-- 속성안에 데이터를 받기 위해서는 " : " 작은 따옴표가 아니다 ` 이 키를 사용한다-->
    <div class="post-body" :style="`background-image: url(${post.postImage})`"></div>

    <div class="post-content">
        <p>{{post.likes}} Likes</p>
        <p><strong>{{post.name}}</strong> {{post.caption}}</p>
        <p class="date"> {{post.date}}</p>
        <span class="modify-button" v-on:click="modifyinsta">수정</span>&nbsp;
        <span class="delete-button" v-on:click="deleteinsta">삭제</span>
    </div>
</div>

</template>

<script>
export default {
    name : 'Post',
    props : {
        post : Object,
        now_tap_num : Number
    },
    methods : {
        modifyinsta(){
            this.$emit('modifyinsta', this.post);
        },
        deleteinsta(){
            this.$emit('deleteinsta', this.post);
        }
    }
}
</script>

<style>
.post {
    width: 100%;
}
.profile {
    background-image: url({{post.userImage}});
    width: 30px;
    height: 30px;
    background-size: 100%;
    border-radius: 50%;
    float: left;
}
.profile-name {
    display: block;
    float: left;
    padding-left: 10px;
    padding-top: 7px;
    font-size: 14px;
}
.post-header {
    height: 30px;
    padding: 10px;
}
.post-body {
    background-image: url({{post.postImage}});
    height: 450px;
    background-position: center;
    background-size: cover;
}
.post-content {
    padding-left: 15px;
    padding-right: 15px;
    font-size: 14px;
}
.date {
    font-size: 11px;
    color: grey;
    margin-top: -8px;
}
.modify-button {
    color: skyblue;
    width: 50px;
    cursor: pointer;
}
.delete-button {
    color: crimson;
    width: 50px;
    cursor: pointer; 
}
</style>