import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    all_reviews:[], //all reviews 
    one_star_reviews:[],  //reviews with rating 1 
    two_star_reviews:[],//reviews with rating 2
    three_star_reviews:[],//review with rating 3
    four_star_reviews:[],//reviews with rating 4
    five_star_reviews:[],//reviews with rating 5
    all_reviews_length:0, //no of reviews
    one_star_reviews_length:0,
    two_star_reviews_length:0,
    three_star_reviews_length:0,
    four_star_reviews_length:0,
    five_star_reviews_length:0,

  },
  getters: {
    allReviews: function (state) {
      return state.all_reviews
    },
    oneStarReviews: function (state) {
      return state.one_star_reviews
    },
    twoStarReviews: function (state) {
      return state.two_star_reviews
    },
    threeStarReviews: function (state) {
      return state.three_star_reviews
    },
    fourStarReviews: function (state) {
      return state.four_star_reviews
    },
    fiveStarReviews: function (state) {
      return state.five_star_reviews
    },
   noOfReviews: function (state) {
    return state.one_star_reviews_length
   },
   noOfOneStarReviews: function (state) {
    return state.one_star_reviews_length
   },
   noOfTwoStarReviews: function (state) {
    return state.two_star_reviews_length
   },
   noOfThreeStarReviews: function (state) {
    return state.three_star_reviews_length
   },
   noOfFourStarReviews: function (state) {
    return state.four_star_reviews_length
   },
   noOfFiveStarReviews: function (state) {
    return state.five_star_reviews_length
   }


},
  mutations: {
    SET_REVIEWS(state, payload) {
      console.log("inside the mutation")
      state.all_reviews = payload
      console.log("time early is "+new Date())
      for(var i=0;i<state.all_reviews.length;i++){
        state.all_reviews[i]=JSON.parse(state.all_reviews[i])
       switch(state.all_reviews[i].overall){
         case 1:{
          state.one_star_reviews.push({ ...state.all_reviews[i]})
          break;
         }
         case 2:{
          state.two_star_reviews.push({ ...state.all_reviews[i]})
          break;
         }
         case 3:{
          state.three_star_reviews.push(state.all_reviews[i])
          break;
         }
         case 4:{
          state.four_star_reviews.push(state.all_reviews[i])
          break;
         }
         case 5:{
          state.five_star_reviews.push(state.all_reviews[i])
          break;
         }
       }
       console.log("time after is "+new Date())
        // if(state.all_reviews[i].overall==1){
        //   state.one_star_reviews.push({ ...state.all_reviews[i]})
        // }
        // else if(state.all_reviews[i].overall==2){
        //   state.two_star_reviews.push({ ...state.all_reviews[i]})
        // }
        // else if(state.all_reviews[i].overall==3){
        //   state.three_star_reviews.push(state.all_reviews[i])
        // }
        // else if(state.all_reviews[i].overall==4){
        //   state.four_star_reviews.push(state.all_reviews[i])
        // }
        // else {
        //   state.five_star_reviews.push(state.all_reviews[i])
        // }
      }
     
    },
    
  },
  actions: {
    generateReviews(context, payload) {
      console.log("inside the action")
      context.commit('SET_REVIEWS', payload)
    }
  },
  modules: {
  },

})
