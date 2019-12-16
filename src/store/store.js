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
      //ajax 호출로 파이어 베이스 데이터 가져오기는 성공했다. 문제는 어떻게 수정하는 가이다.
      axios.get('https://vuestargram-39e5c.firebaseio.com/postdata.json')
           .then(result => {
              result.data
                    .reverse()
                    .forEach(post => {
                      state.postdata.push(post);
                    });
           });
      /* eslint-disable */
      //console.log(JSON.stringify(state.postdata))
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
