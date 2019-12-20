<template>
<div>
  <div class="header">
    <ul class="header-button-left" v-on:click="initData"  v-if="now_tap_num==1 || now_tap_num==2" >
      <li>Cancel</li>
    </ul>

    <!-- 조건문을 통해 업로드 확인 가능 -->
    <ul class="header-button-right" v-on:click="fnopenmodal"  v-if="now_tap_num==0" >
      <li>User</li>
    </ul>
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
      <div class="post-header">
        <!-- 속성안에 데이터를 받기 위해서는 " : " 작은 따옴표와 큰 따옴표의 차이가 크게 작용한다.-->
        <div class='profile' :style="'background-image: url('+userImage+');width:80px;height:80px;'" ></div>
        <span class="profile-name">&nbsp;&nbsp;<b><h3>{{userName}}</h3></b></span>
      </div>
      <ul>
        <li class="modal-list">사진변경 : <input type="file" id="usrfile" class="inputfile" v-on:change="userImageModify"><label class="input-plus" for="usrfile">♻️</label></li>
        <!-- v-model="userNameInputval" 이렇게 설정한 변수도 data에 등록해 줘야 한다. -->
        <li class="modal-list">이름변경 : <input class="inputModal" type="text" v-model="userNameInputval"><span class="modal-button" v-on:click="userNameModify(userNameInputval)">변경</span></li>
      </ul>
    <hr>
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
      // 상태 변수 설정
      now_tap_num : 0,
      uploadType : "",
      upload_image : "",
      // custtom event!
      wrote_post : "",
      modify_data : {},
      filter_list : this.$store.getters.getFilters,
      select_filter : "",
      open_modal : false,
      userNameInputval : "",
      userName : this.$store.getters.getName,
      userImage : this.$store.getters.getImage,
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
              name: this.userName,
              userImage: this.userImage,
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
                this.postdata.unshift(upload_data);//현재 app에도 해당 데이터를 반영한다.
                this.$store.commit('setPostData', this.postdata);//스토어에 있는 데이터도 같이 처리
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
      // 수정 처리 된다.
      axios.put('https://vuestargram-39e5c.firebaseio.com/postdata/'+this.modify_data.id+'.json', tmp_modify_data)
           .then(result => {
              console.log(result);
              //2. 메인 페이지로 돌아간다.
              this.initData();
              //클라이언트에 박힌 데이터 수정
              var idx = this.postdata.findIndex(post => post.id == tmp_modify_data.id);
              //2. 수정하려는 데이터 update
              this.postdata[idx] = tmp_modify_data;
              this.$store.commit('setPostData', this.postdata);//스토어에 있는 데이터도 같이 처리
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
        //this.postdata.splice(idx, 1); 
        //문제는 파이어 베이스에서 삭제를 호출할 경우 데이터는 지워지더라도 그 자리에는 null이라는 값이 남는다.
        //그래서 데이터를 호출 할때 null인 값을 제외하고 호출 해 주어야 한다. store.js 확인
        axios.delete('https://vuestargram-39e5c.firebaseio.com/postdata/'+param.id+'.json')
             .then(result => {
               if(result.status == 200){
                //3. 메인 페이지로 돌아간다.
                this.initData();
                //2. 화면에도 해당 데이터를 날려 준다. 
                this.postdata.splice(idx, 1);
                this.$store.commit('setPostData', this.postdata);//스토어에 있는 데이터도 같이 처리
               }
             })
             .catch(err => {
               console.log(err);
             })
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
      //이전 아이디 설정
      var preId = this.postdata[this.postdata.length-1].id - 1;

      if(preId < 0){
        alert("가장 마지막의 포스트입니다.")
      }
      //ajax 호출로 파이어 베이스 데이터 가져오기는 성공했다.
      axios.get('https://vuestargram-39e5c.firebaseio.com/postdata.json?orderBy=%22id%22&endAt='+preId+'&limitToLast=2&print=pretty')
           .then(result => {
                console.log("@데이터 형태 : "+JSON.stringify(result.data));
                Object.values(result.data)
                      .reverse()
                      .forEach(post => {
                        if(post != null){
                          //각각 배열에 입력처리
                          this.postdata.push(post);  
                          this.$store.commit('setPostData', this.postdata);//스토어에 있는 데이터도 같이 처리
                        }
                      });
            });
      /*post call & try~catch
      axios.post("경로")
        .then(result => {
      })
        .catch(err =>{
      });
      */
    },
    fnopenmodal(){
      if(this.open_modal == false){
        this.open_modal = true;
      }
      else{
        this.open_modal = false;
      }
      return this.open_modal;
    },
    userImageModify(e){
      let file = e.target.files;
      let reader = new FileReader();
      reader.readAsDataURL(file[0]); //jpg, png 이미지를 해쉬함수로 문자열로 압축한 것 
      reader.onload = e => {
        /* eslint-disable */
        console.log(e.target.result);
        // 3. Body.vue에 그 이미지를 올려야 함
        this.upload_image = e.target.result;
      }
      var tmp_modify_data = {
          userImage : this.upload_image,
          userName : this.userName
      };
      // 2. 업로드한 이미지를 업로드한다. 서버에
      // this.postdata.unshift(upload_data); 
      // 입력 처리 된다.
      axios.put('https://vuestargram-39e5c.firebaseio.com/userInfo.json', tmp_modify_data)
           .then(result => {
              console.log(result);
              //2. 메인 페이지로 돌아간다.
              this.$store.commit('setImage', this.upload_image);
              this.initData();

            })
           .catch(err => {
              console.log(err);
            });
    },
    userNameModify(param){
      var tmp_modify_data = {
          userImage : this.userImage,
          userName : param
      };
      // 2. 업로드한 이미지를 업로드한다. 서버에
      // this.postdata.unshift(upload_data); 
      // 입력 처리 된다.
      axios.put('https://vuestargram-39e5c.firebaseio.com/userInfo.json', tmp_modify_data)
           .then(result => {
              console.log(result);
              //2. 메인 페이지로 돌아간다.
              this.$store.commit('setName', param);
              this.initData();
            })
           .catch(err => {
              console.log(err);
            });
    }
  },
  mounted(){
    EventBus.$on('select-filter', (fliter) => {
        /* eslint-disable */
        console.log(fliter);
        this.select_filter = fliter;
    });
  },
  //페이지 첫로드시 데이터 초기화 시킬 함수 -> 페이지 첫로드시 데이터 초기값을 설정해주고 싶을 때
  created(){
    //promise를 리턴할 경우 이런식으로 then을 붙여 원하는 데이터가 로딩 될때 까지 기다려야한다. 
    //promise가 뜨는 이유 : 원하는 데이터가 뜰때 까지 동기적으로 수행된게 아니라 비동기로 먼저 수행된 결과가 나와서 그렇다.
    //this.$store.getters.getName 이렇게 직접 가져다 쓰면 promise가 뜬다 따라서 데이터를 한번에 호출하고 담아줄 data 변수가 필요하다.
    /*
    this.$store.getters.getPostData.then(data => {
      this.postdata = data
    });
    this.$store.getters.getName.then(data =>{
      this.userName = data
    });
    this.$store.getters.getImage.then(data =>{
      this.userImage = data
    });*/
    //아래 것도 마찬가지였다. 함수형 프로그래밍 방법을 많이 알야 두어야 할 듯하다.
    this.$store.dispatch("loadPostData").then(() => {
      this.postdata = this.$store.getters.getPostData;
    });
    this.$store.dispatch("loadName").then(() => {
      this.userName = this.$store.getters.getName;
    });
    this.$store.dispatch("loadImage").then(() => {
      this.userImage = this.$store.getters.getImage;
    });
  },
  //데이터가 변경되어 재랜더링 된 이후 -> 데이터가 변경되어 재렌더링된 이후 뭔가 동작시킬 때
  updated(){
    //근데 입력한 데이터가 왜 바로 반영되지 않는 걸까?
    //[1] ajax로 통신한 데이터를 실시간을 반영하는 방법 => 현재는 화면에 데이터를 직접 수정반영 
    //값을 입력할 때먀다 계속 실행함 이거 아닌거 같음!
    // this.$store.dispatch("loadPostData");
    // this.$store.dispatch("loadImage");
    // this.$store.dispatch("loadName");
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
.modal {
  padding : 10px;
}
.modal-list {
  margin: 5px;
  float: center;
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
