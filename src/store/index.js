import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
      //Index of review repo is treated as the ID for each reviews . Maps are created based on that 
      review_repo:[],//To store all data as a map
    all_reviews:[], //contains id of all reviews 
    star_rating:{ //map of different star ratings to Id 
        1:[],
        2:[],
        3:[],
        4:[],
        5:[]

    },
    rating_counter:{//map of no of star ratings to Id
        1:0,
        2:0,
        3:0,
        4:0,
        5:0
    },
    average_rating:0, //average rating
    all_reviews_length:0, //no of reviews
  },
  getters: {
    allReviews: function (state) { //to get all reviews as ids
      return state.all_reviews
    },
    reviewRepo: function (state) { //to get all data - used as a data map for operations
        
        return state.review_repo
      },
    starRating: function (state) { //returns the ids mapped to star ratings
        return state.star_rating
      },
    ratingCount: function (state) { //returns the map of no of star ratings to star ratings
        return state.rating_counter
      },
   noOfReviews: function (state) { //returns no of reviews
    return state.all_reviews_length 
   },
   noOfOneStarReviews: function (state) { //returns no of one star reviews
    return state.star_rating[1].length
   },
   noOfTwoStarReviews: function (state) { //returns no of two star reviews
    return state.star_rating[2].length
   },
   noOfThreeStarReviews: function (state) { //returns no of three star reviews
    return state.star_rating[3].length
   },
   noOfFourStarReviews: function (state) { //returns no of four star reviews
    return state.star_rating[4].length
   },
   noOfFiveStarReviews: function (state) { //returns no of five star reviews
    return state.star_rating[5].length
   },
   averageRating: function (state) { //returns the average star rating
    return state.average_rating
   }


},
  mutations: {
    SET_REVIEWS(state,payload) {
        //states initialized to 0 to avoid duplication
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
     var totalRating=0 //to find the total rating value to use in calculation of average rating
     var data={}
     payload.data=payload.data.filter((a) => a) //to remove any undefined or empty values in data 
     state.all_reviews_length=payload.data.length //setting length of all data
     
      for(var i=0;i<state.all_reviews_length;i++){ // loop to set all datas and its mapping.
          if(payload.data[i]!=null)
          {
        if(!payload.is_json)
        {  
           data=JSON.parse(payload.data[i]) //json string converting to json   
        }
        else{
            
           data=payload.data[i]
           
        }
        state.review_repo[i]=data // all dats are stored to review repo
        state.review_repo[i].helpful=state.review_repo[i].helpful[0] //converting helpful 2d array to 1 d array for easier calculations
        state.all_reviews.push(i) //ids of all datas are stored in all_reviews
        totalRating=totalRating+state.review_repo[i].overall //calculation of total rating
        let overall=parseInt(state.review_repo[i].overall)

        state.star_rating[overall.toString()].push(i) //adding ids to curresponding star rating to create the mapping of ids and star ratings
        state.rating_counter[overall.toString()]++    //counting the curresponding star rating     
      }
    }        
   state.average_rating=parseInt(totalRating/state.all_reviews_length) //finding average rating
      
      
     
     
    },
    FILTER_BY_DATE(state,payload){ // Mutation for the purpose of global filtering by date range
        //states set to 0 or empty to avoid duplication
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
        var fromDate=payload.from //from date received as unix
        var toDate=payload.to //to date received as unix
        state.all_reviews=state.all_reviews.filter(a=>state.review_repo[a].unixReviewTime>fromDate &&state.review_repo[a].unixReviewTime<=toDate ) //filtering the all_reviews array to get the datas on given date range
        state.all_reviews_length=state.all_reviews.length //length of filtered data
        for(var i=0;i<state.all_reviews_length;i++){
            let index=state.all_reviews[i]
            let overall=parseInt(state.review_repo[index].overall)
            state.star_rating[overall.toString()].push(i) //setting star rating map
            state.rating_counter[overall.toString()]++   //setting star rating counter
        }
        
    }
    
  },
  actions: {
    generateReviews(context, payload) { //action to generate review 
      
      context.commit('SET_REVIEWS', payload)
    },
    filterReviewsByDate(context, payload) { //action to filter the reviews on given date range.
      
        context.commit('FILTER_BY_DATE', payload)
      }
  },
  modules: {
  },

})
