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
      age : 28
  },
  getters : {
    getName(state){
      return state.name;
    },
    getAge(state){
      return state.age;
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
    //1. ajax 요청을 통해 mytations를 해야 되는 경우
    changeName(context){
      axios.get().then(result =>
      {
        context.commit("changeName", result)
      });
      // 사용법 : $store.dispatch("changeName")
    }
  }  
})
