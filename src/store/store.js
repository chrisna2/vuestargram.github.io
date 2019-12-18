/*
    [2] vuex 
        yarn add vuex 이후
        여기다가 모든 데이터를 넣을 것이다 앞으로!
        이곳은 신성한곳 원본데이터를 직접 수정해서는 안된다!
*/
import Vue from 'vue'
import Vuex from 'vuex'
//Axios 
import axios from 'axios';

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
      //ajax 호출로 파이어 베이스 데이터 가져오기는 성공했다.
      //파이어 베이스는 항상 오름차순 정렬이다. 역순의 값을 얻으려면 스크립트 상에서 처리 해줘야한다. 
      //역의 값을 얻으려면 limitToLast 앞에서 순서대로 값을 얻으려면 limitToStart 
      axios.get('https://vuestargram-39e5c.firebaseio.com/postdata.json?orderBy="id"&limitToLast=3')
           .then(result => {                 
            //타이밍이 안맞는 이유는 다음과 같다. put처리 이후 콜백에서 처리를 안해 주어서 그렇다
            //axios호출 이후 반드시 후에 들어오는 로직은 then에서 함수 처리 해주어야 한다. 
            //사실 메서드 체인으로 처리한것 모든 것이 다 그렇다.
            //console.log(JSON.stringify(state.postdata))
      
            // 지난 2일간 파이어베이스 함수를 사용해서 쿼리를 날려 보려고 했으나 실패 했다. 헛지랄이었다. 더 쉬운 방법이 있었다.
            // [문제 해결1] ?orderBy="$key"&limitToLast=3 경로를 추가하면 된다! 이렇게 하면 키값이 인덱스로 잡혀 정렬된다
            // [문제 해결2] ?orderBy="id"&limitToLast=3 경로를 추가하면 된다! 이런식으로 밸류 값을 통해 정렬도 가능하다!
            // (단 반드시 해당 밸류는 아래처럼 파이어 베이스에서 인덱스로 등록해야 된다.)
              
              /*
              {
               "rules": {
                    "postdata" : {
                      ".indexOn": ["id", "date", "likes"]
                    },
                    ".read": "true",
                    ".write": "true"
                  }
                }
              */
                
            /*  */// [추가] 이런식으로 값을 제한으로 받기 시작하면 Array 가 아닌 json object 형태의 값으로 들어오게된다. 
            // 나는 키값은 필요 없으니 자바스크립트에서 제공하는 함수 Object.values(Object)로 밸류값을 배열 값을 출력 하도록 하자. 
            // 반대는 Object.keys(Object), 키값을 배열로 나열해 준다.

            /* eslint-disable */
            //console.log(JSON.stringify(result.data));
              /* 
              //이전 버전, 이렇게 데이터를 출력하면 JsonArray형태로 출력되게 된다.
              result.data
                    .reverse()
                    .forEach(post => {
                      if(post != null){//delete로 삭제된 null 값 제외
                        state.postdata.push(post);
                      }
                    });
              */
              //최신 버전 
              Object.values(result.data)
                    .reverse()
                    .forEach(post => {
                      //delete로 삭제된 null 값 제외
                      if(post != null){
                        state.postdata.push(post);
                      }
                    });
           });
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
