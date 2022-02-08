<template>
  <div class="home">
    <Header />
    <v-container>
      <v-row >
        <v-col cols="12"> </v-col>
        <v-col md="6" cols="12">
          <div class="text-center mt-10">
            <lottie-player
              src="https://assets2.lottiefiles.com/private_files/lf30_txmmovoe.json"
              background="transparent"
              speed="1"
              style="width: 400px; height: 400px; max-width: 100%"
              autoplay
              loop
            ></lottie-player>
            <!-- <lottie-player src="https://assets2.lottiefiles.com/packages/lf20_MeTWrj.json"  background="transparent"  speed="1"  style="width: 400px; height: 400px;"   autoplay loop></lottie-player> -->
          </div>
        </v-col>

        <v-col md="6" cols="12">
          <h2 class="mt-10 pt-10">
            Amazon review analysis tool for Amazon Sellers
          </h2>
          <div class="mt-4">
            Star Fish review analyzer monitors reviews and provides
            easy-to-understand sentiment analysis to improve your seller
            performance. This means faster replies…and happier customers.
          </div>
          <h2 class="mt-10">Get Started</h2>
          <div>
            <v-file-input
              class="mt-4"
              v-model="file_item"
              outlined
              dense
              show-size
              label="Upload your json file"
              @change="parseFile()"
            ></v-file-input>
            <v-btn
              color="primary black--text"
              class="mt-2"
              v-if="file_item"
              dark
              @click="analyseData()"
              >Continue</v-btn
            >
            <v-btn color="primary black--text" class="mt-2" v-else disabled @click="analyseData()"
              >Continue</v-btn
            >
          </div>
        </v-col>
      </v-row>

    
    </v-container>
  </div>
</template>

<script>
import Header from "../components/Header.vue";

import {
  mapGetters,
  // eslint-disable-next-line no-unused-vars
  mapActions,
} from "vuex";
export default {
  name: "Home",
  components: {
    Header,
  },
  data() {
    return {
      
      file_item: null,
      
     
    };
  },
  
  computed: {
    ...mapGetters(["allReviews", "starRating","noOfReviews","noOfOneStarReviews","noOfTwoStarReviews","noOfThreeStarReviews","noOfFourStarReviews","noOfFiveStarReviews","ratingCount"]),
  },
  
  
  mounted(){
     
  },
  methods: {
     
      analyseData(){
         this.$router.push('/reviews')
      },
     
    ...mapActions(["generateReviews"]),
    async parseFile() {
      var reader = new FileReader();
      var self = this;
      // eslint-disable-next-line no-unused-vars
      reader.onload = function (progressEvent) {
        //Split By lines
        self.reviews = this.result.split("\n");
        self.generateReviews(self.reviews);
      };
      reader.readAsText(this.file_item);
    },
  },
};
</script>
