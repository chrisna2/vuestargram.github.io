<template>
<div>
  <div class="header">
    <ul class="header-button-left" v-on:click="initData"  v-if="now_tap_num==1 || now_tap_num==2" >
      <li>Cancel</li>
    </ul>
    <ul class="header-button-left" v-on:click="open_modal=true"  v-if="now_tap_num==0" >
      <li>User</li>
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

  <!-- 모달창 -->
  <div v-if="open_modal" class="modal">
    <hr>
    <ul>
      <!-- <li>이름1 : {{$store.state.name}} / {{$store.state.age}}</li> -->
      <li class="modal-list">유저정보 : {{$store.getters.getName}} / {{$store.getters.getAge}}</li>
      <li class="modal-list">나이변경 : <input class="inputModal" type="text" v-model="ageText"><span class="modal-button" v-on:click="$store.commit('setAge', ageText)">변경</span></li>
      <li class="modal-list">이름변경 : <input class="inputModal" type="text" v-model="nameText"><span class="modal-button" v-on:click="$store.commit('setName', nameText)">변경</span></li>
    </ul>
    <hr>
    <ul v-on:click="open_modal=false" class="modal-button" style="float:right">
      <li>닫기</li>
    </ul>
  </div>

  <Body 
    v-bind:postdata="postdata" 
    v-bind:now_tap_num="now_tap_num"
    v-bind:uploadType="uploadType"
    v-bind:upload_image="upload_image"
    v-bind:modify_data="modify_data"
    v-bind:filter_list="filter_list"
    v-bind:select_filter="select_filter"
    v-on:shootData="wrote_post=$event"
    v-on:modifyinsta="modifyinsta" 
    v-on:deleteinsta="deleteinsta"/>

  <!-- <div class="sample-box">임시 박스</div> -->

  <div class="footer">
    <ul class="footer-button-plus">
      <div v-if="now_tap_num==0">
        <input type="file" id="file" class="inputfile" v-on:change="upload">
        <label for="file" class="input-plus">➕</label>
        <hr>
        <label class="input-plus" v-on:click="moreShow">더보기</label>
      </div>
      <div v-if="now_tap_num==1">
        <input type="file" id="file" class="inputfile" v-on:change="modify">
        <label for="file" class="input-plus">♻️</label>
      </div>      
      <!--
        1.다음 페이지로 이동
        2.업로드한 이미지를 Body.vue 에 보여줘야함
        jpg, png 이미지를 해쉬함수로 압축한 것  

        [1] 백엔드 서버 구축 연결

        웹서버 : 뭔가 요청하면 갖다주는 프로그램
        누가 naver.com/index.html 요청하면 그에
        걸맞는 html css js를 갖다주는 것 

        vue는 Ajax 호출을 한다
        yarn add axios
        1. get call
        2. post call

        [2] vuex => store.js
        [3] PWA -> vue add @vue/pwa
          1. yarn build
          2. manifest.json , serviceworker.js
      -->
    </ul>
  </div>
</div>
</template>

<script>
import Body from './components/Body.vue';
import EventBus from './EventBus.js';
//Axios 
import axios from 'axios';

export default {
  name: 'app',
  components: {
    Body
  },
  data() {
    return {
      postdata : this.$store.getters.getPostData,
      //상태 변수 설정
      now_tap_num : 0,
      uploadType : "",
      upload_image : "",
      //custtom event!
      wrote_post : "",
      modify_data : {},
      filter_list : this.$store.getters.getFilters,
      select_filter : "",
      open_modal : false
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
        this.open_modal = false;
      }
    },
    uploadComplete(){
      //다음 아이디 설정
      var nextId = this.postdata[0].id + 1;
      //업로드 데이터 설정
      var upload_data = {
              id : nextId,
              name: this.$store.getters.getName,
              userImage: "https://placeimg.com/100/100/arch",
              postImage: this.upload_image,
              likes: 36,
              date: 'Dec 16',
              liked: false,
              caption: this.wrote_post,
              filter: this.select_filter
      };
      //1. 업로드한 이미지를 업로드한다. 서버에
      //this.postdata.unshift(upload_data); 
      // 입력 처리 된다.
      axios.put('https://vuestargram-39e5c.firebaseio.com/postdata/'+nextId+'.json', upload_data)
           .then(result => {
              console.log(result);
              if(result.status == 200){
                //2. 메인 페이지로 돌아간다.
                this.initData();
              }
           })
           .catch(err => {
              console.log(err);
           });
    },
    modifyinsta(param){
      this.modify_data = param
      this.upload_image = param.postImage;
      this.now_tap_num = 1;
      this.uploadType = "modify";
      this.open_modal = false;
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
              id : this.modify_data.id,
              name : this.modify_data.name,
              userImage : this.modify_data.userImage,
              postImage : this.upload_image,
              likes : this.modify_data.likes,
              date : this.modify_data.date,
              liked : this.modify_data.liked,
              caption : this.wrote_post,
              filter : this.select_filter
      };
      // 2. 업로드한 이미지를 업로드한다. 서버에
      // this.postdata.unshift(upload_data); 
      // 입력 처리 된다.
      axios.put('https://vuestargram-39e5c.firebaseio.com/postdata/'+this.modify_data.id+'.json', tmp_modify_data)
           .then(result => {
              console.log(result);
              //2. 메인 페이지로 돌아간다.
              this.initData();
            })
           .catch(err => {
              console.log(err);
            });
    },
    deleteinsta(param){

      if(confirm("해당 게시물을 삭제 하시겠습니까?")){
        //1. 수정하고자 하는 인덱스 값 찾기
        var idx = this.postdata.findIndex(post => post.id == param.id);
        //2. 해당 데이터를 날려 준다.
        this.postdata.splice(idx, 1);
        //3. 메인 페이지로 돌아간다.
        this.initData()
      }
      else{
        //1. 메인 페이지로 돌아간다.
        this.initData();
      }
    },
    //데이터 초기화 및 리프레쉬 : store.js 문제 였음
    initData(){
      //모든 데이터 초기화!
      Object.assign(this.$data, this.$options.data.call(this));
    },
    moreShow(){
      //ajax 호출로 파이어 베이스 데이터 가져오기는 성공했다.
      axios.get('https://vuestargram-39e5c.firebaseio.com/postdata.json')
      .then(result => {
          console.log("@데이터 형태 : "+JSON.stringify(result.data));
          //안에 데이터가 Array 이기 때문에 여기선 foreach를 사용한다.
          result.data.forEach(element => {
            //각각 배열에 입력처리
            this.postdata.push(element);  
          });
      });
      /*post call & try~catch
      axios.post("경로")
        .then(result => {
      })
        .catch(err =>{
      });
      */
    }
  },
  mounted(){
    EventBus.$on('select-filter', (fliter) => {
        /* eslint-disable */
        console.log(fliter);
        this.select_filter = fliter;
    });
  }
  // 페이지 첫로드시 데이터 초기화 시킬 함수 -> 페이지 첫로드시 데이터 초기값을 설정해주고 싶을 때
  // created(){
  //   this.postdata = this.$store.getters.getPostData;
  //   this.filter_list = this.$store.getters.getFilters;
  // }
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
.modal {
  padding : 10px;
}
.modal-list {
  margin: 5px;
}
.modal-button {
  color: skyblue;
  cursor: pointer;
  margin: 5px;
}
.inputModal {
  width: 50px;
  margin-left: 5px;
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
