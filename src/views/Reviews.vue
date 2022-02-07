<template>
<div>
     <Header/>
   <v-container>
         
       <v-row>
           <v-col cols="12">
            
      <div >
        <div class="mt-4">
          <h3>Review Summary</h3>
        </div>
        <summary-card :ratingCount="ratingCount" :averageRating="averageRating" :totalReviews="noOfReviews" :highestRating="highestRating()" :lowestRating="lowestRating()"/>

        
        <div class="mt-10">
          <h3>All Reviews </h3>
        </div>
        <div class="top-card-container mt-4" v-if="loadData">
            <div>
                <v-text-field
            outlined
            label="Search here"
            prepend-inner-icon="mdi-magnify"
            v-model="search_pattern"
            @input="searchReviews()"
          ></v-text-field>
            </div>
            <div class="text-right mb-10">
                
               <span class="mr-10"> {{current_data.length}} Results</span>
                <v-menu offset-y class="ml-auto " :close-on-content-click="false" :left="true" v-model="shown">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="primary"
          fab
      dark
          v-bind="attrs"
          v-on="on"
          small
        >
         <v-icon dark>
        mdi-sort
      </v-icon>
        </v-btn>
      </template>
      <div class="dropdown-menu">
           <div><b>Sort</b></div>
           <div class="mt-2">
               <v-select
          :items="properties"
          label="Sort By"
          item-text="name"
          item-value="value"
          v-model="sort_option.sort_by"
        ></v-select>
           </div>
           <div class="d-flex" v-if="sort_option.sort_by">
               <div :class="sort_option.order=='low_to_high'?'sort-options-active':'sort-options'" @click="selectSort('low_to_high')">
                   Low to High
               </div>
               <div :class="sort_option.order=='high_to_low'?'sort-options-active'+' '+'ml-4':'sort-options' + ' '+'ml-4'" @click="selectSort('high_to_low')">
                   High to Low
               </div>
           </div>
           <div class="text-right">
                <v-btn color="primary black--text" v-if="sort_option.sort_by && sort_option.order" @click="sortReview()" :loading="sort_loading"> 
               Apply
           </v-btn>
           <v-btn color="primary black--text" disabled v-else>
               Apply
           </v-btn>
           </div>
      </div>
    </v-menu>
            <v-menu offset-y class="ml-auto" :close-on-content-click="false" :left="true" v-model="filter_box">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="primary"
          fab
      dark
          v-bind="attrs"
          v-on="on"
          small
          class="ml-4"
        >
         <v-icon dark>
        mdi-filter
      </v-icon>
        </v-btn>
      </template>
      <div class="dropdown-menu">
           <div class="d-flex " >
               <div :class="action=='filter'?'sort-options-active':'sort-options'" @click="selectAction('filter')">
                   Filter
               </div>
               <div :class="action=='highlight'?'sort-options-active'+' '+'ml-4':'sort-options' + ' '+'ml-4'" @click="selectAction('highlight')">
                   Highlight
               </div>
           </div>
           
          <v-row class="mt-2">
              <v-col md="12">
                <b>  Review <span v-if="action=='highlight'">as</span></b><div v-if="action=='highlight'">
                       <v-select
                   v-model="selected_color"
          :items="colors" 
          item-text="name"
          item-value="value"
          label="Select color"
          
        ></v-select>
                      </div><b>Where</b>
                   <v-select
                   v-model="filter.property"
          :items="filter_properties"
          item-text="name"
          item-value="value"
          label="Select property"
        ></v-select>
              </v-col>
               <v-col md="6">
                  <v-select
                  v-model="filter.condition"
                  item-text="name"
                  item-value="value"
          :items="getFilterOptions()"
          label="Select a condition"
          class="mt-pt-0"
        ></v-select>
              </v-col>
              <v-col md="6">
                  <v-select
                   v-model="filter.value"
          :items="ratings"
          item-text="name"
           item-value="value"
          label="Select an Option"
          v-if="filter.property=='overall'"
          class="mt-pt-0"
        ></v-select>
        <v-text-field
            label="Enter a value"
            v-model="filter.value"
            type="number"
            v-else-if="filter.property=='helpful'"
            class="mt-pt-0"
          ></v-text-field>
          <v-menu
        v-model="date_menu"
        :close-on-content-click="false"
        :nudge-right="40"
        transition="scale-transition"
        offset-y
        min-width="auto"
        class="mt-pt-0"
        v-else-if="filter.property=='unixReviewTime'"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
          class="mt-pt-0"
           v-model="filter.value"
            label="Select Date"
            prepend-icon="mdi-calendar"
            readonly
            v-bind="attrs"
            v-on="on"
          ></v-text-field>
        </template>
          <v-date-picker
          v-model="filter.value"
          
          @input="date_menu = false"
        ></v-date-picker>
       
      </v-menu>
         
              </v-col>
          </v-row>
           <div class="text-right">
                <v-btn color="primary black--text" @click="applyFilter()" > 
               Apply
           </v-btn>
           <!-- <v-btn color="primary black--text" disabled v-else>
               Apply
           </v-btn> -->
           </div>
          
      </div>
    </v-menu>
            </div>
          <v-row class="review-row " v-for="(review,index) in parsed_data" v-bind:key="index" v-bind:style="{ background: row_color[review]||'#ffffff',color:row_text_color[review]||'#000000' }">
            <v-col md="3">
                <div class="d-flex">
                    <div>
                         <v-avatar
  color="primary"
  size="56"
  v-if="reviewRepo[review].reviewerName"
>{{reviewRepo[review].reviewerName.charAt(0)}}</v-avatar> 
                    </div>
                    <div class="ml-4">
                        <div>
                       {{reviewRepo[review].reviewerName}}
                        </div>
                         <div>
                            <v-icon aria-hidden="false" color="primary" v-for="(star,star_index) in reviewRepo[review].overall" v-bind:key="star_index">
                    mdi-star
                  </v-icon>
                  
                        </div> 
                       
                        
                    </div>
                </div>
            </v-col>
             <v-col md="9">
                <div>
                    <b>{{reviewRepo[review].summary}}</b>
                </div>
                <div class="mt-2">
                    {{reviewRepo[review].reviewText}}
                </div>

                 <div class="mt-4 d-flex ">
                            <div class="ml-auto">
                            On {{moment(reviewRepo[review].unixReviewTime)}}
                            </div>
                            <div class="ml-4">
                   {{reviewRepo[review].helpful}} Helpful
        <v-icon color="primary">mdi-thumb-up-outline</v-icon>
      

                            </div>
                        </div>
            </v-col> 
           
            
          </v-row>
          
      </div>
      </div>
           </v-col>
       </v-row>
   </v-container>
</div>
</template>
<script>
import Header from "../components/Header.vue";
import SummaryCard from "../components/SummaryCard.vue";
import Fuse from 'fuse.js'
import moment from 'moment'

import {
  mapGetters,
  // eslint-disable-next-line no-unused-vars
  mapActions,
} from "vuex";
export default {
  name: "Home",
  components: {
    Header,
    SummaryCard
  },
  data() {
    return {
       date_menu:false,
        shown:false,
    filter:{
        property:'',
        condition:'',
        value:''
    },

      file_item: null,
      reviews: [],
      test: ['{"adhil":"0","rollno":"1"}'],
      step: 0,
      parsed_data:[],
      pageData:[],
      itemCount:0,
      loadData:false,
      sliced:[],
      current_data:[],
      sort_option:{
          sort_by:'',
          order:'low_to_high'
      },
      colors:[{
          name:'Red',
          value:'#F44336'
      },
      {
          name:'Orange',
          value:'#FF9800'
      },
      {
          name:'Yellow',
          value:'#FDD835'
      },
      {
          name:'Green',
          value:'#4CAF50'
      },
      {
          name:'Blue',
          value:'#03A9F4'
      },
      {
          name:'Indigo',
          value:'#3F51B5'
      },
      {
          name:'Violet',
          value:'#673AB7'
      }
      
      ],
      properties:[{
          name:'Overall Ratings',
          value:'overall'
      },
      {
          name:'Helpful',
          value:'helpful'
      },
      {
          name:'Date',
          value:'unixReviewTime'
      }
      ],
      ratings:[{
          name:'1 Star',
          value:'1'
      },
      {
          name:'2 Star',
          value:'2'
      },
      {
          name:'3 Star',
          value:'3'
      },
      {
          name:'4 Star',
          value:'4'
      },{
          name:'5 Star',
          value:'5'
      },
      ],
      filter_properties:[
          {
          name:'Overall Ratings',
          value:'overall'
      },
      {
          name:'Helpful',
          value:'helpful'
      },
      {
          name:'Created Date',
          value:'unixReviewTime'
      }
      ],
      sort_loading:false,
      filter_box:false,
     action:'filter',
     row_color:{},
     row_text_color:{},
     selected_color:'',
     search_pattern:'',
     
    };
  },
  
  computed: {
    ...mapGetters(["allReviews","reviewRepo", "starRating","noOfReviews","noOfOneStarReviews","noOfTwoStarReviews","noOfThreeStarReviews","noOfFourStarReviews","noOfFiveStarReviews","ratingCount","averageRating"]),
  },
  
  mounted(){
   
      this.current_data=[ ...this.allReviews ]
     this.parsed_data=this.current_data.slice(0,5)
     this.loadData=true
     

  },
  created() {
    window.addEventListener("scroll", this.loadMoreData);
  },
  destroyed() {
    window.removeEventListener("scroll", this.loadMoreData);
  },
  
  methods: {
      searchReviews(){
          if(this.search_pattern)
          {
          var result=this.search()
         this.current_data=result.map(a => a.refIndex); 
          }
          else{
              this.current_data=[ ...this.allReviews ]
          }
          this.parsed_data=this.current_data.slice(0,5)
      },
      search(){
          var pattern=this.search_pattern
          const options = {
  // isCaseSensitive: false,
  // includeScore: false,
  // shouldSort: true,
  // includeMatches: false,
  // findAllMatches: false,
  // minMatchCharLength: 1,
  // location: 0,
  // threshold: 0.6,
  // distance: 100,
  // useExtendedSearch: false,
  // ignoreLocation: false,
  // ignoreFieldNorm: false,
  // fieldNormWeight: 1,
  keys: [
    "reviewText",
    "summary"
  ]
};
          const fuse = new Fuse(this.reviewRepo, options);
          return fuse.search(pattern)
      },
      selectAction(action){
          this.action=action
      },
      applyFilter(){
          this.row_color={}
          this.row_text_color={}
           this.filter_box=false
            this.current_data=[ ...this.allReviews ]
            var filter_value=this.filter.value
            if(this.filter.property=='unixReviewTime'){
                var filter_date=moment(this.filter.value+' 05:30:00','YYYY-MM-DD hh:mm:ss')
                // filter_value=moment(filter_value).unix()
                 filter_value=parseInt(filter_date/1000)
                console.log("filter value is it"+filter_value)
               
            }
            if(this.filter.condition=='is')
              {
                   this.current_data=this.current_data.filter(data=>this.reviewRepo[data][this.filter.property]==filter_value)
              }
               else if(this.filter.condition=='is not')
              {
                   this.current_data=this.current_data.filter(data=>this.reviewRepo[data][this.filter.property]!=filter_value)
              }
               else if(this.filter.condition==('greater than'))
              {
                   this.current_data=this.current_data.filter(data=>this.reviewRepo[data][this.filter.property]>filter_value)
              }
              else if(this.filter.condition=='less than')
              {
                   this.current_data=this.current_data.filter(data=>this.reviewRepo[data][this.filter.property]<filter_value)
              }
               else if(this.filter.condition=='greater than or equal')
              {
                   this.current_data=this.current_data.filter(data=>this.reviewRepo[data][this.filter.property]>=filter_value)
              }
              else if(this.filter.condition=='less than or equal')
              {
                   this.current_data=this.current_data.filter(data=>this.reviewRepo[data][this.filter.property]<=filter_value)
              }
              if(this.action=='highlight'){
                  for(var i=0;i<this.current_data.length;i++){
                      this.row_color[this.current_data[i]]=this.selected_color
                      this.row_text_color[this.current_data[i]]='#ffffff'
                  }
                  this.current_data=[ ...this.allReviews ]
              }
              this.parsed_data=this.current_data.slice(0,5)
      },
    
      moment(date) {
    return moment.unix(date).format('DD-MM-YYYY, hh:mm A');
  },
  getFilterOptions(){
     var property_options=[]
      if(this.filter.property=='unixReviewTime')
      {
           property_options=['on','on or before','on or after','before','after']
           property_options=[
               {name:'on',
               value:'is'
               },
               {name:'after',
               value:'greater than'
               },
                {name:'before',
               value:'less than'
               },
                {name:'on or after',
               value:'greater than or equal'
               },
                {name:'on or before',
               value:'less than or equal'
               },
           ]
           return property_options
      }
      else if(this.filter.property=='user'){
           property_options=['is']
           return property_options
      }
      else{
           property_options=[
               {name:'is',
               value:'is'
               },
               {name:'is not',
               value:'is not'
               },
               {name:'greater than',
               value:'greater than'
               },
                {name:'less than',
               value:'less than'
               },
                {name:'greater than or equal',
               value:'greater than or equal'
               },
                {name:'less than or equal',
               value:'less than or equal'
               },
           ]
          return property_options
      }   
  },
      sortReview(){
           this.sort_loading=true
            // this.current_data=[...this.allReviews]
        
           
           
            if(this.sort_option.order=='low_to_high')
            {
              this.current_data.sort((a,b) => (this.reviewRepo[a][this.sort_option.sort_by] > this.reviewRepo[b][this.sort_option.sort_by]) ? 1 : ((this.reviewRepo[b][this.sort_option.sort_by] > this.reviewRepo[a][this.sort_option.sort_by]) ? -1 : 0))
              }
              else{
                  this.current_data.sort((a,b) => (this.reviewRepo[a][this.sort_option.sort_by] < this.reviewRepo[b][this.sort_option.sort_by]) ? 1 : ((this.reviewRepo[b][this.sort_option.sort_by] < this.reviewRepo[a][this.sort_option.sort_by]) ? -1 : 0))
              }
          
       
          this.parsed_data=this.current_data.slice(0,5)
          this.shown=false
          this.sort_loading=false
          
          

      },
      selectSort(selection){
          this.sort_option.order=selection
      },
      
       // eslint-disable-next-line no-unused-vars
      loadMoreData(event) {
          
          this.itemCount=this.itemCount+5
          this.sliced=this.current_data.slice(this.itemCount,this.itemCount+5)
          this.parsed_data=this.parsed_data.concat(this.sliced)
         // this.parsed_data.push()
          
    },
      scrollData(){
          console.log("done scrolling")
      },
      highestRating(){
          var highestReview=null
          if(this.noOfFiveStarReviews>0){
              highestReview=5
          }
          else if(this.noOfFourStarReviews>0){
              highestReview=4
          }
            else if(this.noOfThreeStarReviews>0){
              highestReview=3
          }
            else if(this.noOfTwoStarReviews>0){
              highestReview=2
            }
            else{
              highestReview=1
          }
          return highestReview
      },
      lowestRating(){
          var lowestReview=null
          if(this.noOfOneStarReviews>0){
              lowestReview=1
          }
          else if(this.noOfTwoStarReviews>0){
              lowestReview=2
            }
             else if(this.noOfThreeStarReviews>0){
              lowestReview=3
          }
          else if(this.noOfFourStarReviews>0){
              lowestReview=4
          }      
            else{
             lowestReview=5
          }
          return lowestReview
      },
      analyseData(){
          this.step=1
      },
      getPageData(){
          console.log("fired again")
         // var allData=this.$store.getters['allReviews']
          this.pageData=this.allReviews.slice(5,10)
      },
    ...mapActions(["generateReviews"]),
    async parseFile() {
         console.log("i m inside the file uploader")
      var reader = new FileReader();
      var self = this;
      // eslint-disable-next-line no-unused-vars
      reader.onload = function (progressEvent) {
        //Split By lines
            console.log("i m inside the file uploader")
        self.reviews = this.result.split("\n");
        self.generateReviews(self.reviews);
        //self.$store.dispatch('generateReviews',self.reviews)
      };
      reader.readAsText(this.file_item);
    },
  },
};
</script>