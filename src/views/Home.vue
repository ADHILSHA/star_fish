<template>
  <div class="home">
    <Header />
    <v-container>
        <!-- Home page section begins here-->
      <v-row>
        <v-col cols="12"> </v-col>
        <v-col md="6" cols="12">
             <!-- Lottie Animation-->
          <div class="text-center mt-10">
            <lottie-player
              src="https://assets2.lottiefiles.com/private_files/lf30_txmmovoe.json"
              background="transparent"
              speed="1"
             class="lottie-anime"
              autoplay
              loop
            ></lottie-player>
          </div>
        </v-col>

        <v-col md="6" cols="12">
          <h2 class="home-title">
            Amazon review analysis tool for Amazon Sellers
          </h2>
          <div class="mt-4">
            Star Fish review analyzer monitors reviews and provides
            easy-to-understand sentiment analysis to improve your seller
            performance. This means faster replies…and happier customers.
          </div>
          <h2 class="mt-10">Get Started</h2>
          <div>
              <!-- upload file  -->
            <v-file-input
              class="mt-4"
              v-model="file_item"
              accept=".json"
              outlined
              dense
              show-size
              label="Upload your json file"
            ></v-file-input>
             <!-- error message on uploading files   -->
            <v-alert outlined type="error" class="alert-msg" v-if="err_msg">
              {{ err_msg }}
            </v-alert>
            <v-btn
              color="primary black--text"
              class="mt-2"
           
              :disabled="!file_item?true:false"
              dark
              @click="parseFile()"
              >Continue</v-btn
            >
           
          </div>
           <!-- upload file  ends here-->
        </v-col>
      </v-row>
       <!-- Home page section ends here-->
    </v-container>
  </div>
</template>

<script>
import Header from "../components/Header.vue";

import {
 
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
      reviews: [],
      err_msg:''
    };
  },

  computed: {
    
  },

  mounted() {},
  methods: {
    ...mapActions(["generateReviews"]),
    checkJSON(data) { //to check whether the data in table is JSON Format.
      try {
        JSON.parse(data);
      } catch {
        return false;
      }
      return true;
    },
    async parseFile() { // Function to validate and convert line seperated file as proper json file.
      this.err_msg = "";
      var reader = new FileReader();
      var self = this;
      // eslint-disable-next-line no-unused-vars
      reader.onload = function (progressEvent) {
        try {
          //Split By lines
          if (self.checkJSON(this.result)) {
            self.reviews = JSON.parse(this.result);     //json string converted to json 
            self.generateReviews({ data: self.reviews, is_json: true }); //Passing JSON file to action 'Generate Reviews'
          } else {
            self.reviews = this.result.split("\n"); //result is splitted by lines and stored as array in reviews
            self.generateReviews({ data: self.reviews, is_json: false }); //passed to action 'Generate reviews' as not json formatted
          }
          self.$router.push("/reviews"); //go to reviews page
        } catch {
          self.err_msg = "Invalid JSON File"; 
        }
      };
      reader.readAsText(this.file_item); 
    },
  },
};
</script>
