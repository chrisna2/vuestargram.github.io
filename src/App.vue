<template>
<div>
  <div class="header">
    <ul class="header-button-left">
      <li>Cancel</li>
    </ul>

    <!-- 조건문을 통해 업로드 확인 가능 -->
    <ul v-if="now_tap_num==1" class="header-button-right" v-on:click="now_tap_num=2">
      <li>Next</li> 
    </ul>
    <ul v-if="now_tap_num==2 && uploadType=='upload'" class="header-button-right" v-on:click="uploadComplete">
      <li>Upload</li> 
    </ul>
    <ul v-if="now_tap_num==2 && uploadType=='modify'" class="header-button-right" v-on:click="modifyComplete">
      <li>Modify</li> 
    </ul>

    <img src="./assets/logo.png" class="logo">
  </div>

  <Body 
    v-bind:postdata="postdata" 
    v-bind:now_tap_num="now_tap_num"
    v-bind:uploadType="uploadType"
    v-bind:upload_image="upload_image"
    v-bind:modify_data="modify_data"
    v-on:shootData="wrote_post=$event"
    v-on:modifyinsta="modifyinsta" 
    v-on:deleteinsta="deleteinsta"/>

  <!--<div class="sample-box">임시 박스</div>-->

  <div class="footer">
    <ul class="footer-button-plus">
      <div v-if="now_tap_num==0">
        <input type="file" id="file" class="inputfile" v-on:change="upload">
        <label for="file" class="input-plus">➕</label>
      </div>
      <div v-if="now_tap_num==1">
        <input type="file" id="file" class="inputfile" v-on:change="modify">
        <label for="file" class="input-plus">♻️</label>
      </div>      
      <!--
        1.다음 페이지로 이동
        2.업로드한 이미지를 Body.vue 에 보여줘야함
        jpg, png 이미지를 해쉬함수로 압축한 것  
      -->
    </ul>
  </div>
</div>
</template>

<script>
import Body from './components/Body.vue';
import postdata from './mockdata/postdata.js';

export default {
  name: 'app',
  components: {
    Body
  },
  data() {
    return {
      postdata : postdata,
      //상태 변수 설정
      now_tap_num : 0,
      uploadType : "",
      upload_image : "",
      //custtom event!
      wrote_post : "",
      modify_data : {}

    }
  },
  methods : {
    upload(e){
      /*
        1.다음 페이지로 이동
        2.업로드한 이미지를 Body.vue 에 보여줘야함
        jpg, png 이미지를 해쉬함수로 압축한 것  
      */
      let file = e.target.files;
      let reader = new FileReader();
      reader.readAsDataURL(file[0]); //jpg, png 이미지를 해쉬함수로 문자열로 압축한 것 
      reader.onload = e => {
        /* eslint-disable */
        console.log(e.target.result);
        // 3. Body.vue에 그 이미지를 올려야 함
        this.now_tap_num = 1;
        this.upload_image = e.target.result;
        this.uploadType = "upload";
      }
    },
    uploadComplete(){

      var upload_data = {
              name: "NaHyunKee",
              userImage: "https://placeimg.com/100/100/arch",
              postImage: this.upload_image,
              likes: 36,
              date: 'Dec 16',
              liked: false,
              caption: this.wrote_post,
              filter: "perpetua"
      };
      //1. 업로드한 이미지를 업로드한다. 서버에
      this.postdata.unshift(upload_data);
      //2. 메인 페이지로 돌아간다.
      this.now_tap_num =  0;
      initData();
    },
    modifyinsta(param){
      this.modify_data = param
      this.upload_image = param.postImage;
      this.now_tap_num = 1;
      this.uploadType = "modify";
    },
    //사진 중간에 바꾸기
    modify(e){
      /*
        1.다음 페이지로 이동
        2.업로드한 이미지를 Body.vue 에 보여줘야함
        jpg, png 이미지를 해쉬함수로 압축한 것  
      */
      let file = e.target.files;
      let reader = new FileReader();
      reader.readAsDataURL(file[0]); //jpg, png 이미지를 해쉬함수로 문자열로 압축한 것 
      reader.onload = e => {
        /* eslint-disable */
        console.log(e.target.result);
        // 3. Body.vue에 그 이미지를 올려야 함
        this.now_tap_num = 1;
        this.upload_image = e.target.result;
      }
    },
    modifyComplete(){
      var tmp_modify_data = {
              name: this.modify_data.name,
              userImage: this.modify_data.userImage,
              postImage: this.upload_image,
              likes: this.modify_data.likes,
              date: this.modify_data.date,
              liked: this.modify_data.liked,
              caption: this.wrote_post,
              filter: this.modify_data.filter
      };
      //1. 수정하고자 하는 인덱스 값 찾기
      var idx = this.postdata.findIndex(post =>
        post.name == tmp_modify_data.name
      );
      //2. 수정하려는 데이터 update
      this.postdata[idx] = tmp_modify_data;
      //alert(JSON.stringify(modify));

      //2. 메인 페이지로 돌아간다.
      this.now_tap_num =  0;
      initData();
    },
    deleteinsta(param){
      if(confirm("해당 게시물을 삭제 하시겠습니까?")){
        //1. 수정하고자 하는 인덱스 값 찾기
        var idx = this.postdata.findIndex(post => post.name == param.name);
        //2. 해당 데이터를 날려 준다.
        this.postdata.splice(idx, 1);
        //3. 메인 페이지로 돌아간다.
        this.now_tap_num =  0;
        initData()
      }
      else{
        //1. 메인 페이지로 돌아간다.
        this.now_tap_num =  0;
        initData();
      }
    },
    initData(){
      this.upload_image = "";
      this.wrote_post = "";
    }
  }
}
</script>

<style>
body {
  margin: 0;
}
ul{
  padding: 5px;
  list-style-type: none;
}
.logo {
  width:22px;
  margin: auto;
  display: block;
  position: absolute;
  left: 0;
  right: 0;
  top: 13px;
}
.header {
  width: 100%;
  height: 40px;
  background-color: white;
  padding-bottom: 8px;
  position: sticky;
  top: 0;
}
.header-button-left {
  color: skyblue;
  float: left;
  width: 50px;
  padding-left: 20px;
  cursor: pointer;
  margin-top: 10px;
}
.header-button-right {
  color: skyblue;
  float: right;
  width: 50px;
  cursor: pointer;
  margin-top: 10px;
}
.footer{
  width: 100%;
  position: sticky;
  bottom: 0;
  padding-bottom: 10px;
  background-color: white;
}
.footer-button-plus {
  width: 80px;
  margin: auto;
  text-align: center;
  cursor: pointer;
  font-size: 24px;
  padding-top: 12px;
}
.sample-box{
  width: 100%;
  height: 600px;
  background-color: bisque;
}
.inputfile {
  display: none;
}
.input-plus {
  cursor: pointer
}
#app {
  box-sizing: border-box;
  font-family: 'consolas';
  margin-top: 60px;
  width: 100%;
  max-width: 460px;
  margin: auto;
  position: relative;
  border-right: 1px solid #eee;
  border-left: 1px solid #eee;
}
</style>
