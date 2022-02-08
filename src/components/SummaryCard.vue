<template>
    <div class="top-card-container mt-4" >
          <v-row class="top-labels">
            <v-col md="12">
              <div class="summary-card mt-4">
                <div class="avg-rating">
                  <v-progress-circular
                    :rotate="90"
                    :size="120"
                    :width="15"
                    :value="(averageRating / 5) * 100"
                    color="primary"
                    label="average"
                  >
                  
                   <span class="avg-rating-content">Average</span> 
                   <v-icon aria-hidden="false" color="primary" small v-for="(rev,index) in averageRating" v-bind:key="index">
                    mdi-star
                  </v-icon>
                 
                  </v-progress-circular>
                </div>
                <div class="top-card">
                  <div class="summary-items">
                    <v-row >
                      <v-col sm="4"  cols="12">
                        <div class="review-card-item">
                            <div class="summary-item">
                          <div class="text-center">Total reviews</div>
                          <div><h1 class="text-center">{{totalReviews}}</h1></div>
                            </div>
                        </div>
                      </v-col>
                      <v-col sm="4"  cols="12">
                        <div class="review-card-item">
                             <div class="summary-item">
                          <div class="text-center">Highest Rating</div>
                          <div><div class="text-center mt-2"> <v-icon aria-hidden="false" color="primary" v-for="(star,index) in highestRating" v-bind:key="index">
                    mdi-star
                  </v-icon></div>
                          </div>
                  
                
                  <div class="text-right mr-4 sub-text" >
                      <v-icon size="12">mdi-comment-text-multiple-outline</v-icon>
                      {{ratingCount[highestRating]}}
                  </div>
                    </div>
                        </div>
                      </v-col>
                      <v-col sm="4" >
                        <div class="review-card-item last-item">
                          <div class="text-center">Lowest Rating</div>
                          <div><div class="text-center mt-2"> <v-icon aria-hidden="false" color="primary" v-for="(star,index) in lowestRating" v-bind:key="index">
                    mdi-star
                  </v-icon>
                  
                  </div></div>
                    <div class="text-right mr-4 sub-text ">
                      <v-icon size="12">mdi-comment-text-multiple-outline</v-icon>
                      {{ratingCount[lowestRating]}}
                  </div>
                        </div>
                      </v-col>
                    </v-row>
                  </div>
                </div>
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col md="12">
              <div
                style="
                  border: 1px solid #eeeeee;
                  border-radius: 10px;
                 
                  width: 100%;
                  padding: 10px;
                "
              >
                <div class="mt-4">
                  <v-icon aria-hidden="false" color="primary">
                    mdi-star
                  </v-icon>
                       <span class="linear-progress-label">{{ratingCount['1']}}</span>
                  <v-progress-linear
                   
                    :value="getReviewPercent(ratingCount['1'])"
                    color="red"
                    class="mt-2"
                  ></v-progress-linear>
                </div>
                <div class="mt-4">
                  <v-icon aria-hidden="false" color="primary">
                    mdi-star
                  </v-icon>
                   <v-icon aria-hidden="false" color="primary">
                    mdi-star
                  </v-icon>
                       <span class="linear-progress-label">{{ratingCount['2']}}</span>
                  <v-progress-linear
                   :value="getReviewPercent(ratingCount['2'])"
                    color="orange"
                    class="mt-2"
                  ></v-progress-linear>
                </div>
                 <div class="mt-4">
                  <v-icon aria-hidden="false" color="primary">
                    mdi-star
                  </v-icon>
                   <v-icon aria-hidden="false" color="primary">
                    mdi-star
                  </v-icon>
                   <v-icon aria-hidden="false" color="primary">
                    mdi-star
                  </v-icon>
                  <span class="linear-progress-label">{{ratingCount['3']}}</span>
                  <v-progress-linear
                    :value="getReviewPercent(ratingCount['3'])"
                    color="blue"
                    class="mt-2"
                  ></v-progress-linear>
                </div>
                 <div class="mt-4">
                  <v-icon aria-hidden="false" color="primary">
                    mdi-star
                  </v-icon>
                   <v-icon aria-hidden="false" color="primary">
                    mdi-star
                  </v-icon>
                   <v-icon aria-hidden="false" color="primary">
                    mdi-star
                  </v-icon>
                   <v-icon aria-hidden="false" color="primary">
                    mdi-star
                  </v-icon>
                     <span class="linear-progress-label">{{ratingCount['4']}}</span>
                  <v-progress-linear
                    :value="getReviewPercent(ratingCount['4'])"
                    color="green"
                    class="mt-2"
                  ></v-progress-linear>
                </div>
                 <div class="mt-4">
                  <v-icon aria-hidden="false" color="primary">
                    mdi-star
                  </v-icon>
                   <v-icon aria-hidden="false" color="primary">
                    mdi-star
                  </v-icon>
                  <v-icon aria-hidden="false" color="primary">
                    mdi-star
                  </v-icon>
                   <v-icon aria-hidden="false" color="primary">
                    mdi-star
                  </v-icon>
                   <v-icon aria-hidden="false" color="primary">
                    mdi-star
                  </v-icon>
                       <span class="linear-progress-label">{{ratingCount['5']}}</span>
                  <v-progress-linear
                   :value="getReviewPercent(ratingCount['5'])"
                    color="amber"
                    class="mt-2"
                  ></v-progress-linear>
                 
                </div>
              </div>
            </v-col>
          </v-row>
        </div>
</template>
<script>
import {
     // eslint-disable-next-line no-unused-vars
  mapGetters,
  // eslint-disable-next-line no-unused-vars
  mapActions,
} from "vuex";
export default {
    data(){
        return {
       
        }
    },
    methods:{
        getReviewPercent(no){
          var percent=no/this.totalReviews
          return percent*100
      }
    },
    props:['ratingCount','averageRating','totalReviews','highestRating','lowestRating']
}
</script>