import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
      review_repo:[],
    all_reviews:[], //all reviews 
    star_rating:{
        1:[],
        2:[],
        3:[],
        4:[],
        5:[]

    },
    rating_counter:{
        1:0,
        2:0,
        3:0,
        4:0,
        5:0
    },
    average_rating:0, //average rating
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
    reviewRepo: function (state) {
        
        return state.review_repo
      },
    starRating: function (state) {
        return state.star_rating
      },
    ratingCount: function (state) {
        return state.rating_counter
      },
   noOfReviews: function (state) {
    return state.all_reviews_length
   },
   noOfOneStarReviews: function (state) {
    return state.star_rating[1].length
   },
   noOfTwoStarReviews: function (state) {
    return state.star_rating[2].length
   },
   noOfThreeStarReviews: function (state) {
    return state.star_rating[3].length
   },
   noOfFourStarReviews: function (state) {
    return state.star_rating[4].length
   },
   noOfFiveStarReviews: function (state) {
    return state.star_rating[5].length
   },
   averageRating: function (state) {
    return state.average_rating
   }


},
  mutations: {
    SET_REVIEWS(state,payload) {
     state.rating_counter={
        1:0,
        2:0,
        3:0,
        4:0,
        5:0
    }
    state.star_rating={
        1:[],
        2:[],
        3:[],
        4:[],
        5:[]
    }
    state.review_repo=[]
    state.all_reviews=[]
     var totalRating=0
     var data={}
     state.all_reviews_length=payload.data.length-1  
      for(var i=0;i<state.all_reviews_length;i++){
        if(!payload.is_json)
        {
           
           data=JSON.parse(payload.data[i])
           
        }
        else{
            
           data=payload.data[i]
           
        }
        state.review_repo[i]=data
        state.review_repo[i].helpful=state.review_repo[i].helpful[0]
        state.all_reviews.push(i)
        totalRating=totalRating+state.review_repo[i].overall
        let overall=parseInt(state.review_repo[i].overall)

        state.star_rating[overall.toString()].push(i)
        state.rating_counter[overall.toString()]++        
      }        
   state.average_rating=parseInt(totalRating/state.all_reviews_length)
      
      
     
     
    },
    FILTER_BY_DATE(state,payload){
        state.rating_counter={
            1:0,
            2:0,
            3:0,
            4:0,
            5:0
        }
        state.star_rating={
            1:[],
            2:[],
            3:[],
            4:[],
            5:[]
        }
        var fromDate=payload.from
        var toDate=payload.to
        state.all_reviews=state.all_reviews.filter(a=>state.review_repo[a].unixReviewTime>fromDate &&state.review_repo[a].unixReviewTime<=toDate )
        state.all_reviews_length=state.all_reviews.length
        for(var i=0;i<state.all_reviews_length;i++){
            let index=state.all_reviews[i]
            let overall=parseInt(state.review_repo[index].overall)
            state.star_rating[overall.toString()].push(i)
            state.rating_counter[overall.toString()]++   
        }
        
    }
    
  },
  actions: {
    generateReviews(context, payload) {
      
      context.commit('SET_REVIEWS', payload)
    },
    filterReviewsByDate(context, payload) {
      
        context.commit('FILTER_BY_DATE', payload)
      }
  },
  modules: {
  },

})
