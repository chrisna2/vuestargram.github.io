/*
    [2] vuex 
        yarn add vuex 이후
        여기다가 모든 데이터를 넣을 것이다 앞으로!
        이곳은 신성한곳 원본데이터를 직접 수정해서는 안된다!
*/
import Vue from 'vue';
import Vuex from 'vuex';
//Axios 
import axios from 'axios';

// Set the configuration for your app
// TODO: Replace with your project's config object
Vue.use(Vuex);

export let store = new Vuex.Store({
  state: {
      name : "naHyunKee",
      age : 28,
      postdata : [],
      filters : ["normal", "clarendon", "gingham", "moon", "lark", 
      "reyes", "juno", "slumber", "aden", "perpetua", 
      "mayfair", "rise", "hudson", "valencia", "xpro2", 
      "willow", "lofi", "inkwell", "nashville"]
  },
  getters : {
    getName(state){
      return state.name;
    },
    getAge(state){
      return state.age;
    },
    getPostData(state){
      //초기화 해 줘야 됨
      state.postdata = [];
      //version 1 : axios로 ajax 호출
      //ajax 호출로 파이어 베이스 데이터 가져오기는 성공했다. 문제는 어떻게 수정하는 가이다.
      axios.get('https://vuestargram-39e5c.firebaseio.com/postdata.json')
           .then(result => {
              result.data
                    .reverse()
                    .forEach(post => {
                      if(post != null){//delete로 삭제된 null 값 제외
                        state.postdata.push(post);
                      }
                    });
              /* eslint-disable */
              //타이밍이 안맞는 이유는 다음과 같다. put처리 이후 콜백에서 처리를 안해 주어서 그렇다
              //axios호출 이후 반드시 후에 들어오는 로직은 then에서 함수 처리 해주어야 한다. 
              //사실 메서드 체인으로 처리한것 모든 것이 다 그렇다.
              //console.log(JSON.stringify(state.postdata))
              
              // [문제점] axios로 호출을 할 경우 firebase 같이 클라우드 서버에서 호출 하는 경우 초기 데이터를 
              // 호출하는데 제한이 있다. 쿼리를 직접 서버에서 설정 할 수 있는 spring boot 같이 따로 자바 서버를 구축해서 
              // 배포 할 경우 axios를 활용하면 효과가 큰 것 같다. 반드시 restApi를 사용해야 함은 물론이다.
           });
      return state.postdata;
    },
    getPostDataFirebase(state){
      state.postdata = [];
      // 별 지랄을 해봐도 파이어베이스 데이터에 접근이 안된다. 이유를 모르겠다 ㅅㅂ
      var postRef = firebase.database().ref('postdata');
      var topPostRefs = postRef.orderByChild('id')
                                //firebase는 내림차순을 지원하지 않는다.
                               .limitToLast(3)
                               .reverse();
      console.log(topPostRefs);

      state.postdata = topPostRefs;
      return state.postdata;

    },
    getFilters(state){
      return state.filters;
    }
  },
  mutations: {
    setAge(state, param){
      state.age = param;
    },
    setName(state, param){
      state.name = param;
    }
  },
  //[리액트] => redux 와 동일
  actions : {
    //1. ajax 요청을 통해 mutations를 해야 되는 경우
    changeName(context){
      axios.get().then(result =>
      {
        context.commit("changeName", result)
      });
      // 사용법 : $store.dispatch("changeName")
    }
  }  
})
