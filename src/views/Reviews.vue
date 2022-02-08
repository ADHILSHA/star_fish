<template>
  <div>
    <Header />
    <v-container>
      <v-row>
          <!-- Global Date range filter begins here-->
        <v-col cols="12" sm="6" md="4" offset-md="8" class="mh-65">
          <div class="mt-4 mb-4">
            <v-menu
              ref="menu"
              v-model="date_global_menu"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="auto"
              class="mt-pt-0 date-range-picker"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  class="mt-pt-0"
                  v-model="dateRangeText"
                  label="Select Date Range"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                  clearable
                  @click:clear="removeFilter()"
                ></v-text-field>
              </template>
              <v-date-picker v-model="dates" range></v-date-picker>
              <v-spacer></v-spacer>
              <div class="date-picker-btn">
                <v-btn text color="primary" @click="date_global_menu = false">
                  Cancel
                </v-btn>
                <v-btn text color="primary" @click="globalFilter()"> OK </v-btn>
              </div>
            </v-menu>
          </div>
        </v-col>
            <!-- Global Date range filter ends here-->
        <v-col cols="12">
          <div>
            <div>
              <h3>Review Summary</h3>
            </div>
             <!-- Summary Card component - to display the summary of data 
                props:{
                    ratingCount - no of ratings count mapped to the star ratings from 1 to 5.
                    averageRating - average star rating
                    totalReviews - no of reviews
                    highestRating - the top rating
                    lowestRating - the lowest rating 
                }
             -->
            <summary-card
              :ratingCount="ratingCount"
              :averageRating="averageRating"
              :totalReviews="noOfReviews"
              :highestRating="highestRating()"
              :lowestRating="lowestRating()"
            />
            <!--Summary ends here-->
            <!--Display of All Reviews - Data will be appended on scrolling-->
            <div class="mt-10">
              <h3>All Reviews</h3>
            </div>
            <div class="top-card-container mt-4" v-if="loadData">
                <!-- Global search -->
              <v-row>
                <v-col md="6" cols="8">
                  <v-text-field
                    label="Search by user, review summary or review text"
                    prepend-inner-icon="mdi-magnify"
                    v-model="search_pattern"
                    @input="resetSearch()"
                  ></v-text-field>
                </v-col>
                <v-col md="2" cols="2">
                  <v-btn
                    color="primary black--text"
                    class="mt-4"
                    @click="searchReviews()"
                    :loading="search_loading"
                    >Search</v-btn
                  >
                </v-col>
              </v-row>
               <!-- Global search ends here-->
              <div class="text-right mb-10">
                <span class="mr-10"> {{ current_data.length }} Results</span> <!-- no of reviews found-->
                <!-- Sorting begins here-->
                <v-menu
                  offset-y
                  class="ml-auto"
                  :close-on-content-click="false"
                  :left="true"
                  v-model="shown"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      color="primary"
                      fab
                      dark
                      v-bind="attrs"
                      v-on="on"
                      small
                    >
                      <v-icon dark> mdi-sort </v-icon>
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
                      <div
                        :class="
                          sort_option.order == 'low_to_high'
                            ? 'sort-options-active'
                            : 'sort-options'
                        "
                        @click="selectSort('low_to_high')"
                      >
                        Low to High
                      </div>
                      <div
                        :class="
                          sort_option.order == 'high_to_low'
                            ? 'sort-options-active' + ' ' + 'ml-4'
                            : 'sort-options' + ' ' + 'ml-4'
                        "
                        @click="selectSort('high_to_low')"
                      >
                        High to Low
                      </div>
                    </div>
                    <div class="text-right">
                      <v-btn
                        color="primary black--text mt-4"
                        v-if="sort_option.sort_by && sort_option.order"
                        @click="sortReview()"
                        :loading="sort_loading"
                      >
                        Apply
                      </v-btn>
                      <v-btn color="primary black--text" disabled v-else>
                        Apply
                      </v-btn>
                    </div>
                  </div>
                </v-menu>
                <!-- Sorting ends here-->
                <!-- filter begins here-->
                <v-menu
                  offset-y
                  class="ml-auto"
                  :close-on-content-click="false"
                  :left="true"
                  v-model="filter_box"
                >
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
                      <v-icon dark> mdi-filter </v-icon>
                    </v-btn>
                  </template>
                  <div class="dropdown-menu">
                    <div class="d-flex">
                      <div
                        :class="
                          action == 'filter'
                            ? 'sort-options-active'
                            : 'sort-options'
                        "
                        @click="selectAction('filter')"
                      >
                        Filter
                      </div>
                      <div
                        :class="
                          action == 'highlight'
                            ? 'sort-options-active' + ' ' + 'ml-4'
                            : 'sort-options' + ' ' + 'ml-4'
                        "
                        @click="selectAction('highlight')"
                      >
                        Highlight
                      </div>
                    </div>

                    <v-row class="mt-2">
                      <v-col cols="12">
                        <b>
                          Review <span v-if="action == 'highlight'">as</span></b
                        >
                        <div v-if="action == 'highlight'">
                          <v-select
                            v-model="selected_color"
                            :items="colors"
                            item-text="name"
                            item-value="value"
                            label="Select color"
                          ></v-select>
                        </div>
                        <b>Where</b>
                        <v-select
                          v-model="filter.property"
                          :items="filter_properties"
                          item-text="name"
                          item-value="value"
                          label="Select property"
                        ></v-select>
                      </v-col>
                      <v-col md="6" cols="12">
                        <v-select
                          v-model="filter.condition"
                          item-text="name"
                          item-value="value"
                          :items="getFilterOptions()"
                          label="Select a condition"
                          class="mt-pt-0"
                        ></v-select>
                      </v-col>
                      <v-col md="6" cols="12">
                        <v-select
                          v-model="filter.value"
                          :items="ratings"
                          item-text="name"
                          item-value="value"
                          label="Select an Option"
                          v-if="filter.property == 'overall'"
                          class="mt-pt-0"
                        ></v-select>
                        <v-text-field
                          label="Enter a value"
                          v-model="filter.value"
                          type="number"
                          v-else-if="filter.property == 'helpful'"
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
                          v-else-if="filter.property == 'unixReviewTime'"
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
                      <v-btn color="primary black--text" @click="applyFilter()">
                        Apply
                      </v-btn>
                     
                    </div>
                  </div>
                </v-menu>
                 <!-- filter ends here-->
                <div v-if="filter_applied">
                  <v-btn
                    color="primary black--text"
                    class="ml-2 mt-4"
                    small
                    @click="clearFilter()"
                  >
                    <v-icon size="12" class="mr-2">mdi-autorenew</v-icon>
                    Clear Filter
                  </v-btn>
                </div>
              </div>
              <div v-if="parsed_data.length < 1" class="text-center"> <!-- If there is no search or filter result or there is no data -->
                No Records Found
              </div>
              <v-row
                class="review-row"
                v-for="(review, index) in parsed_data"
                v-bind:key="index"
                v-bind:style="{
                  background: row_color[review] || '#ffffff',
                  color: row_text_color[review] || '#000000',
                }"
              >
               <!-- row_color is used to apply bg and color to the row to be highlighted -->
               <!-- Looping the id array and  displaying data from the reviewrepo map-->
                <v-col md="3" cols="12">
                  <div class="d-flex mt-4">
                    <div>
                      <v-avatar
                        color="primary"
                        size="56"
                        v-if="reviewRepo[review].reviewerName"
                        >{{
                          reviewRepo[review].reviewerName.charAt(0)
                        }}</v-avatar
                      >
                    </div>
                    <div class="ml-4">
                      <div>
                        {{ reviewRepo[review].reviewerName }}
                      </div>
                      <div>
                        <v-icon
                          aria-hidden="false"
                          color="primary"
                          v-for="(star, star_index) in reviewRepo[review]
                            .overall"
                          v-bind:key="star_index"
                        >
                          mdi-star
                        </v-icon>
                      </div>
                    </div>
                  </div>
                  <div class="sub-text mt-4">
                    Reviewer Id : {{ reviewRepo[review].reviewerID }}
                  </div>
                </v-col>
                <v-col md="9" cols="12">
                  <div>
                    <b>{{ reviewRepo[review].summary }}</b>
                  </div>
                  <div class="mt-2">
                    {{ reviewRepo[review].reviewText }}
                  </div>

                  <div class="mt-4 d-flex">
                    <div class="ml-auto">
                      On {{ moment(reviewRepo[review].unixReviewTime) }} <!--Convert unix time to DD-MM-YYYY-->
                    </div>
                    <div class="ml-4">
                      {{ reviewRepo[review].helpful }} Helpful
                      <v-icon color="primary">mdi-thumb-up-outline</v-icon>
                    </div>
                  </div>
                </v-col>
              </v-row>
               <!-- Loop ends here-->
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
import Fuse from "fuse.js";
import moment from "moment";

import {
  mapGetters,
  // eslint-disable-next-line no-unused-vars
  mapActions,
} from "vuex";
export default {
  name: "Home",
  components: {
    Header, 
    SummaryCard, //Component displays Summary of reviews 
  },
  data() {
    return {
      date_menu: false, //date picker in filter
      filter_applied: false, //to check whether filter is applied
      date_global_menu: false, //date range picker in global filter
      dates: [], //output of date range picker
      shown: false, // display or hide sorting menu
      filter: { //filter options 
        property: "", // the field name  - eg : overall rating,date,helpful
        condition: "",// condition for filtering 
        value: "", // value to check condition
      },
      parsed_data: [], // to display reviews  - 5 rows will be appended on scrolling
      itemCount: 0, //used in adding data on scrolling
      loadData: false, //to force update rendering in div 
      sliced: [],//used in adding data on scrolling
      current_data: [],// current result after filtering,sorting or searching
      sort_option: { //sorting options
        sort_by: "",
        order: "low_to_high",
      },
      colors: [ //color options for higlighting in filter 
        {
          name: "Red",
          value: "#F44336",
        },
        {
          name: "Orange",
          value: "#FF9800",
        },
        {
          name: "Yellow",
          value: "#FDD835",
        },
        {
          name: "Green",
          value: "#4CAF50",
        },
        {
          name: "Blue",
          value: "#03A9F4",
        },
        {
          name: "Indigo",
          value: "#3F51B5",
        },
        {
          name: "Violet",
          value: "#673AB7",
        },
      ],
      properties: [ 
        {
          name: "Overall Ratings",
          value: "overall",
        },
        {
          name: "Helpful",
          value: "helpful",
        },
        {
          name: "Date",
          value: "unixReviewTime",
        },
      ], // options for properties
      ratings: [
        {
          name: "1 Star",
          value: "1",
        },
        {
          name: "2 Star",
          value: "2",
        },
        {
          name: "3 Star",
          value: "3",
        },
        {
          name: "4 Star",
          value: "4",
        },
        {
          name: "5 Star",
          value: "5",
        },
      ],// options for Overall ratings
      filter_properties: [
        {
          name: "Overall Ratings",
          value: "overall",
        },
        {
          name: "Helpful",
          value: "helpful",
        },
        {
          name: "Created Date",
          value: "unixReviewTime",
        },
      ], //options for filtering 
      sort_loading: false, //loading on sort button
      filter_box: false,//to control filter menu
      action: "filter",//action type can be simply 'filter' or 'highlight'
      row_color: {},//to store selected color on curresponding filtered rows
      row_text_color: {},//to store selected text color on curresponding filtered rows
      selected_color: "",//selected color
      search_pattern: "",// global search pattern
      search_loading: false, //laoding on search button
    };
  },

  computed: {
    ...mapGetters([
      "allReviews",
      "reviewRepo",
      "starRating",
      "noOfReviews",
      "noOfOneStarReviews",
      "noOfTwoStarReviews",
      "noOfThreeStarReviews",
      "noOfFourStarReviews",
      "noOfFiveStarReviews",
      "ratingCount",
      "averageRating",
    ]), //definition for each getters is mentioned in store/index.js file
    dateRangeText() {
      return this.dates.join(" ~ ");//join selected date ranges
    },
  },

  mounted() {
    if (this.noOfReviews < 1) { //if user refreshed the page the store will be empty so redirecting back to home page 
      this.$router.push("/");
    }
    this.current_data = [...this.allReviews]; //current data is set initially as allReviews
    this.parsed_data = this.current_data.slice(0, 5); //5 rows of data is added to parsed data for displaying
    this.loadData = true; //to force rerender
  },
  created() {
    window.addEventListener("scroll", this.loadMoreData); //adding scroll event listener
    window.addEventListener("beforeunload", function (event) { //confirmation popup on user refreshing the page
      event.returnValue = "Are you sure do you want to reload ?";
    });
  },
  destroyed() {
    window.removeEventListener("scroll", this.loadMoreData);//destroying the event listeners
    window.removeEventListener("beforeunload", this.loadMoreData);
  },

  methods: {
    ...mapActions(["filterReviewsByDate", "generateReviews"]),
    clearFilter() {
      this.current_data = [...this.allReviews];
      this.filter_applied = false;
      this.filter = {
        property: "",
        condition: "",
        value: "",
      };
    },
    removeFilter() {
      this.generateReviews({ data: this.reviewRepo, is_json: true });
      this.current_data = [...this.allReviews];
    },
    
    globalFilter() {
      this.date_global_menu = false;
      var to = moment(this.dates[1] + " 05:30:00", "YYYY-MM-DD hh:mm:ss");
      var to_date = parseInt(to / 1000);
      var from = moment(this.dates[0] + " 05:30:00", "YYYY-MM-DD hh:mm:ss");
      var from_date = parseInt(from / 1000);
      if (!to_date) {
        to_date = from_date;
      }
      this.filterReviewsByDate({ from: from_date, to: to_date });
      this.current_data = [...this.allReviews];
      this.parsed_data = this.current_data.slice(0, 5);
    },
    resetSearch() {
      if (!this.search_pattern) {
        this.current_data = [...this.allReviews];
        this.parsed_data = this.current_data.slice(0, 5);
      }
    },
    searchReviews() {
        //to search by user/summary/reviewtext
      this.search_loading = true;
      this.current_data = [...this.allReviews];
      if (this.search_pattern) {
        var result = this.search(); //got search result using fuse js
        this.current_data = result.map((a) => a.refIndex);//mapping the result to ids
      } else {
        this.current_data = [...this.allReviews];
      }
      this.parsed_data = this.current_data.slice(0, 5); //first 5 row is added to parsed_data for displaying
    },

    
    search() {
        //for global searching in large data - fuse js is used which is following the fuzzy search algorithm 
      var pattern = this.search_pattern;
      const options = {
        includeMatches: true,
        findAllMatches: true,
        threshold: 0.3,
        keys: ["reviewerName", "reviewText", "summary"],//to search by user/summary/reviewtext
      };
      const fuse = new Fuse(this.reviewRepo, options);
      this.search_loading = false;
      return fuse.search(pattern); 
    },
    selectAction(action) { //select ation type on filter - 'filter' or 'highlight
      this.action = action;
    },
    applyFilter() { //filter operations
      this.row_color = {};
      this.row_text_color = {};
      this.filter_box = false;
      this.current_data = [...this.allReviews];
      var filter_value = this.filter.value;
      //yyyy-mm-dd date conversion to unix 
      if (this.filter.property == "unixReviewTime") {
        var filter_date = moment(
          this.filter.value + " 05:30:00",
          "YYYY-MM-DD hh:mm:ss"
        );
        filter_value = parseInt(filter_date / 1000);
      }
      //comparison operations
      if (this.filter.condition == "is") { 
        this.current_data = this.current_data.filter(
          (data) => this.reviewRepo[data][this.filter.property] == filter_value
        );
      } else if (this.filter.condition == "is not") {
        this.current_data = this.current_data.filter(
          (data) => this.reviewRepo[data][this.filter.property] != filter_value
        );
      } else if (this.filter.condition == "greater than") {
        this.current_data = this.current_data.filter(
          (data) => this.reviewRepo[data][this.filter.property] > filter_value
        );
      } else if (this.filter.condition == "less than") {
        this.current_data = this.current_data.filter(
          (data) => this.reviewRepo[data][this.filter.property] < filter_value
        );
      } else if (this.filter.condition == "greater than or equal") {
        this.current_data = this.current_data.filter(
          (data) => this.reviewRepo[data][this.filter.property] >= filter_value
        );
      } else if (this.filter.condition == "less than or equal") {
        this.current_data = this.current_data.filter(
          (data) => this.reviewRepo[data][this.filter.property] <= filter_value
        );
      }
     
      if (this.action == "highlight") {
           //if action is highlight - highlighting color also needed to be added
        for (var i = 0; i < this.current_data.length; i++) {
          this.row_color[this.current_data[i]] = this.selected_color;
          this.row_text_color[this.current_data[i]] = "#ffffff";
        }
        this.current_data = [...this.allReviews];
      }
      //first 5 rows of filtered data will be added for displaying
      this.parsed_data = this.current_data.slice(0, 5);
      this.filter_applied = true;
    },

    moment(date) { //time conversions using moment js
      return moment.unix(date).format("DD-MM-YYYY, hh:mm A");
    },
    getFilterOptions() {
        //To get filter options based on the property selected
      var property_options = [];
      if (this.filter.property == "unixReviewTime") {
        property_options = [
          "on",
          "on or before",
          "on or after",
          "before",
          "after",
        ];
        property_options = [
          { name: "on", value: "is" },
          { name: "after", value: "greater than" },
          { name: "before", value: "less than" },
          { name: "on or after", value: "greater than or equal" },
          { name: "on or before", value: "less than or equal" },
        ];
        return property_options;
      }  else {
        property_options = [
          { name: "is", value: "is" },
          { name: "is not", value: "is not" },
          { name: "greater than", value: "greater than" },
          { name: "less than", value: "less than" },
          { name: "greater than or equal", value: "greater than or equal" },
          { name: "less than or equal", value: "less than or equal" },
        ];
        return property_options;
      }
    },
    sortReview() {
        //to sort the listed reviews based on the selected property
      this.sort_loading = true;
      if (this.sort_option.order == "low_to_high") { //ascending order sorting
        this.current_data.sort((a, b) =>
          this.reviewRepo[a][this.sort_option.sort_by] >
          this.reviewRepo[b][this.sort_option.sort_by]
            ? 1
            : this.reviewRepo[b][this.sort_option.sort_by] >
              this.reviewRepo[a][this.sort_option.sort_by]
            ? -1
            : 0
        );
      } else { //descending order sorting
        this.current_data.sort((a, b) =>
          this.reviewRepo[a][this.sort_option.sort_by] <
          this.reviewRepo[b][this.sort_option.sort_by]
            ? 1
            : this.reviewRepo[b][this.sort_option.sort_by] <
              this.reviewRepo[a][this.sort_option.sort_by]
            ? -1
            : 0
        );
      }

      this.parsed_data = this.current_data.slice(0, 5);
      this.shown = false;
      this.sort_loading = false;
    },
    selectSort(selection) { //select the option for sorting
      this.sort_option.order = selection;
    },

    // eslint-disable-next-line no-unused-vars
    loadMoreData(event) {
        //To load 5 more rows on scrolling
      this.itemCount = this.itemCount + 5;
      this.sliced = this.current_data.slice(this.itemCount, this.itemCount + 5);
      this.parsed_data = this.parsed_data.concat(this.sliced);
    },
    highestRating() {
        //to find the highest rating received
      var highestReview = null;
      if (this.noOfFiveStarReviews > 0) {
        highestReview = 5;
      } else if (this.noOfFourStarReviews > 0) {
        highestReview = 4;
      } else if (this.noOfThreeStarReviews > 0) {
        highestReview = 3;
      } else if (this.noOfTwoStarReviews > 0) {
        highestReview = 2;
      } else {
        highestReview = 1;
      }
      return highestReview;
    },
    lowestRating() {
        //to find the lowest rating received
      var lowestReview = null;
      if (this.noOfOneStarReviews > 0) {
        lowestReview = 1;
      } else if (this.noOfTwoStarReviews > 0) {
        lowestReview = 2;
      } else if (this.noOfThreeStarReviews > 0) {
        lowestReview = 3;
      } else if (this.noOfFourStarReviews > 0) {
        lowestReview = 4;
      } else {
        lowestReview = 5;
      }
      return lowestReview;
    },
  },
};
</script>