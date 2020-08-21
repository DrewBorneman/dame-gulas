<template>
  <div class = "home">
    <header class = "header">
      <div class="col-auto about-link-div">
        <router-link to = "/about">{{ $t('about') }}</router-link>
      </div>
      <div class="col"></div>
      <div class = "col-auto language-switch-div">
          <a
              v-if="$i18n.locale !== 'en'"
              href="#"
              @click="$i18n.locale='en'"
          >
              EN
          </a>
          <a
              v-else
              href="#"
              @click="$i18n.locale='sk'"
          >
              SK
          </a>
      </div>
    </header>
    <content>
      <div class="content col-auto">
        <div class="main-row">
          <h1 class="title">{{ $t('title') }}</h1>
        </div>
        <div class="main-row">
          <h6 class="subtitle">{{ $t('subtitle') }}</h6>
        </div>
        <div 
          class="main-row"
          v-if="!showResults"
          >
            <div class="find-button" id="findButton">
              <button class="button-start btn-primary" @click="getLocation()">{{ $t('find') }}</button>
            </div>
            <div 
              class="loading"
              v-if="loading"
            >
              <h3>{{ $t('searching') }}</h3>
              <div class="loader"></div>
              <p>{{ $t('checking') }}{{ currentRestaurant.name }}</p>
            </div>
        </div>
        <div class="main-row"
          v-else
        >
          <div 
            class="results"
            v-if="errorMessage===''"
          >
            <h3 class=" found-title">{{ $t('foundRestaurant') }}</h3>
            <div>{{ $t('atRestaurant') }}</div>
            <h3 class = "found-restaurant">
              {{ gulasRestaurant.name }}
            </h3>
            <div>{{ $t('location') }}</div>
            <h4>{{ gulasRestaurant.location.address }}</h4>
            <div>{{ $t('distance') }}</div>
            <h4>{{ restaurantDistance }} m</h4>
            <a :href = "menuUrl">{{ $t('checkMenu') }}</a>
            <a :href = "googleMapsLink">{{ $t('showDirections') }}</a>
          </div>
          <div v-else>
            <h3 class = "found-restaurant">
              No gulas today :(
            </h3>
          </div>
        </div>
      </div>
    </content>
  </div>
</template>

<script>
import cheerio from 'cheerio'
import fetch from 'node-fetch'

export default {
  name: 'Home',
  data() {
    return {
      zomatoKey: "c7829e6d54110c175a6e18655ed21735",
      results: {},
      currentRestaurant: {},
      googleMapsLink: '',
      gulasRestaurant: {},
      foundRestaurant: {},
      restaurantDistance: {},
      showResults: false,
      errorMessage: '',
      loading: false,
      menuUrl: '',
      lat: null,
      long: null,
    };
  },
  methods: {
    getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(this.searchRestaurants);
      } else {
        this.errorMessage = "Geolocation is not supported by this browser.";
        this.showResults = true;
      }
    },

    async searchRestaurants(position) {
      // const ZOMATO_GET_RESTAURANTS = "https://developers.zomato.com/api/v2.1/geocode";
      const M_RADIUS = 5000;
      const SLOVAK_CUISINE_ID = 701;
      const CZECH_CUISINE_ID = 671;
      const HUNGARIAN_CUISINE_ID = 228;

      const PAGE_LENGTH = 20;
      const MAX_SEARCH_RESULTS = 100;
      let searchOffset = 0;
      let foundGulas = false;     
      
      const CUISINE_ID_STRING = `${SLOVAK_CUISINE_ID},${CZECH_CUISINE_ID},${HUNGARIAN_CUISINE_ID}`;
      const CATEGORIES_ID_STRING = '9';
      const ESTABLISHMENT_ID_STRING = '16,6,211,161,181';

      this.lat = position.coords.latitude;
      this.long = position.coords.longitude;

      this.loading = true;
      document.getElementById('findButton').className ='slide-out-bottom';

      await this.getLocation();

      for(searchOffset=0; searchOffset<MAX_SEARCH_RESULTS; searchOffset += PAGE_LENGTH) {
        let searchRequestUrl = `https://developers.zomato.com/api/v2.1/search?start=${searchOffset}&count=${PAGE_LENGTH}&lat=${this.lat}&lon=${this.long}&radius=${M_RADIUS}&cuisines=${CUISINE_ID_STRING}&establishment_type=${ESTABLISHMENT_ID_STRING}&category=${CATEGORIES_ID_STRING}&sort=real_distance`;

        this.results = await this.makeZomatoApiCall(searchRequestUrl);
        if(this.results<100){
          searchRequestUrl = `https://developers.zomato.com/api/v2.1/search?start=${searchOffset}&count=${PAGE_LENGTH}&lat=${this.lat}&lon=${this.long}&radius=${M_RADIUS}&cuisines=${CUISINE_ID_STRING}&sort=real_distance`;
        }
        console.log(this.results);
        for(var i=0;i<PAGE_LENGTH;i++) {
          this.currentRestaurant = this.results.restaurants[i].restaurant;
          if(this.currentRestaurant.highlights.includes("Lunch Menu")) { 
            foundGulas = await this.checkDailyMenu(this.currentRestaurant);  //ADD DEBOUNCE
            if(foundGulas) {
              this.gulasRestaurant = this.currentRestaurant;
              console.log("found gulas at restaurant ", this.gulasRestaurant);
              break;
            }
          }
        }
        if(foundGulas) {
          break;
        }
        console.log(`offset: ${searchOffset}, results shown: ${this.results.results_shown}, found: ${foundGulas}`);
      }

      if(foundGulas) {
          console.log("found gulas!!");
          this.restaurantDistance = this.latLongDistance(this.lat,this.long,this.gulasRestaurant.location.latitude, this.gulasRestaurant.location.longitude);
          this.googleMapsLink = "http://maps.google.com/maps?q=" + encodeURIComponent( this.gulasRestaurant.location.address ) + "' target='_blank";
          this.foundGulas = true;
          this.showResults = true;
        }
        else {
          this.errorMessage = "No guláš today :(";
          console.log(this.errorMessage);
          this.foundGulas = false;
          this.showResults = true;
        }
    },

    async checkDailyMenu(res) {
      const res_id = res.R.res_id;
      const menuRequestUrl = `https://developers.zomato.com/api/v2.1/dailymenu?res_id=${res_id}`;
      let dailyMenu = {};
      let foundGulas = false;
      let dishes = [];
      dailyMenu = await this.makeZomatoApiCall(menuRequestUrl);
      if(dailyMenu){
        if(dailyMenu.daily_menus.length !== 0){
          console.log("checking for Gulas at :", res_id);
          this.menuUrl = res.menu_url;
          dailyMenu.daily_menus[0].daily_menu.dishes.forEach(dish => {
            dishes.push(dish.dish.name);
          })
          foundGulas = await this.checkForGulas(dishes);
        }
        else {
          // scrape restaurancie.sme
          foundGulas = await this.scrapeSme(res);
        }
      }
      return foundGulas;
    },

    checkForGulas(dishes) {
      let hasGulas = false;
        dishes.forEach(dishName => {
          dishName = this.lodash.deburr(dishName.toLowerCase());
          if(dishName.includes('gulas') || dishName.includes('goulash') || dishName.includes('gulyas')) {
            hasGulas = true;
          }
        })     
      return hasGulas;
    },

    async scrapeSme (res) {

      const googleApiKey = 'AIzaSyCBbm3eAAEhqxKqHE4OT86Rq2rwsX2EKI8';
      const customSearchEngineId = 'c9e8439b693c76aed';
      const query = 'denne menu ' + res.name + ' ' + res.location.city;
      const searchUrl = 'https://customsearch.googleapis.com/customsearch/v1';
      const params = {
        key: googleApiKey,
        cx: customSearchEngineId,
        q: query,
      };
      let dishes = [];
      let searchResults = await this.makeGoogleApiCall(searchUrl, params);
      if(searchResults.items.length!==0){
        this.menuUrl = searchResults.items[0].link;
        const html = await this.makeSmeContentCall(this.menuUrl);
        const $ = cheerio.load(html);
        if($('.emptyContentMessageContainer').length>0) {
          console.log('no daily menu in SME now');
          return false;
        }
        const menuItems = $('.dnesne_menu').first().children('.jedlo_polozka');
        
        menuItems.toArray().forEach((menuItem) => {
          menuItem = menuItem.children[1].firstChild.data.trim();
          if(menuItem !== ''){
            dishes.push(menuItem);
          }
        });
        return this.checkForGulas(dishes);
      }
    },

    async makeZomatoApiCall(url) {
      return this.axios.get(url, {
        headers: {
          'user-key': this.zomatoKey,
        },
        'content-type': 'application/json',
      })
      .then(response => {
          return response.data;
      })
      .catch(error => console.error(error));
    },

    async makeGoogleApiCall(url, params) {
      return this.axios.get(url,{
        headers: {
          'content-type': 'application/json',
        },
        params: params,
      })
      .then(response => {
          return response.data;
      })
      
    },

    async makeSmeContentCall(url) {
      const requestUrl = "https://cors-anywhere.herokuapp.com/" + url;
      return fetch(requestUrl)
      .then(response => response.text())
      .then(body => body)
      .catch(error => console.error(error));
    },

    latLongDistance(lat1,lon1,lat2,lon2) {
      var R = 6371; // Radius of the earth in km
      var dLat = this.deg2rad(lat2-lat1);  // deg2rad below
      var dLon = this.deg2rad(lon2-lon1); 
      var a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2)
        ; 
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      var d = R * c * 1000; // Distance in m
      return Math.trunc(d);
    },

    deg2rad(deg) {
      return deg * (Math.PI/180)
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
a {
  color: #ffff80;
  text-decoration: none;
}
.title {
  font-size: 96px;
  margin-top: 50px;
}
.subtitle {
  margin-top: 30px;
  font-size: 18px;
  font-style: italic;
  margin-bottom: 50px;
}
.find-button {
  min-width: 100%;
  max-width: 300px;
}
.button-start {
  margin-top: 80px;
  padding-left: 100px;
  padding-right: 100px;
  max-width: 300px;
  height: 80px;
  color: #fff;
  background-color: rgba(2,2,71,0.22);
  border-color: rgba(255,255,255,0.6);
  border-radius: 5px;
  font-size: 36px;
}
.main-row {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.content {
  width: 100%;
}
.results {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.found-title {
  margin-bottom: 20px;
}
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  animation-name: loadingFadeIn;
  animation-duration: 0.5s;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
  animation-iteration-count: 1;
}

@keyframes loadingFadeIn{
    0%{
      opacity: 0;
    }
    100%{
      opacity: 1;
    }
}

.loader {
  border: 6px solid #e6e6e6;
  border-top: 6px solid #262673;
  border-radius: 50%;
  width: 80px;
  height: 80px;
  margin-top: 25px;
  margin-bottom: 25px;
  animation: spin 1s linear infinite;
}
.home {
  min-height: 100vh;
  overflow: hidden;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.slide-out-bottom{
  animation-name: slideOutBottom;
  animation-duration:0.5s;
  animation-timing-function: ease;
  animation-fill-mode: forwards;
  animation-iteration-count: 1;
}

@keyframes slideOutBottom{
    0%{
      position: absolute;
        transform: translateY(0%);
    }
    100%{
      position: absolute;
        transform: translateY(500%);
    }
}

@media only screen and (max-width: 768px) {
  .title {
    font-size: 60px;
    margin-top: 40px;
  }
  .main-row {
    width: 85%;
    margin-left: auto;
    margin-right: auto;
  }
  .button-start {
    margin-top: 50px;
    padding-left: 60px;
    padding-right: 60px;
  }
}
</style>
