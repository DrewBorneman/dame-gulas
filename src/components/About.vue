<template>
  <div class = "home">
    <header class = "header">
      <div class="col-auto about-link-div">
        <router-link to = "/">{{ $t('home') }}</router-link>
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
      <div class="content">
        <div class="main-row">
          <h1 class="title">{{ $t('about') }}</h1>
        </div>
        <div class="text-row main-row">
          <p class="text">This simple site was created to help hungry lunchgoers locate the greatest dish of all time, guláš.  Coded in Vue, the site utilizes the Zomato API, and also crawls restaurancie.sme with the help of the Google Custom Search API. As such, this site likely won't work nearly as well outside of Slovakia.</p>
          <h3 class="subheader">How it works</h3>
          <p class="text">When the button is pressed, the user's location is found using the browser's built in navigation function.  Then, a call to the Zomato API is made to get all relevant restaurants within 5km.  Since the API is unfortunately limited to returning 100 search results maximum regardless of pagination, many refinements are made to the query to return the most relevant results: the 'cuisines' are limited to Czech, Slovak and Hungarian, the 'establishment type' of restaurants are limited to those that tend to serve traditional food, and the 'category' of restaurants are only those that serve lunch.  From there, results are paginated into groups of 20, and if there are less than 100 results some of these refinements are removed for the next chunk call.</p>
          <p class="text">For each restaurant, a second Zomato API call is made to retreive its daily menu.  Unfortunately once again, the majority of these restaurants do not post their daily menu, and so either an empty response or a 404 error is returned.  When this happens, the site attempts to find the daily menu on restaurancie.sme - since no SME API exists, the restaurant is located using the Google Custom Search API, the menu is retreived by crawling through the HTML of the daily menu page (with the help of the CORS-Anywhere service, since a normal request from a FE implementation like this would get blocked for security reasons).  This still does not account for most restaurants, but between the two sites a good deal of daily menus are still able to be parsed.</p>
          <p class="text">This site is likely in need of improvement; in addition to adding services to utilize (such as bistro.sk) and finding an alternative to CORS-Anywhere, it could also be sped up significantly - API calls are currently made sequentially since executing them fully asynchronously will exceed Zomato's limit and cause a temporary lockout, but a middle ground could likely be found that doesn't reach this level.</p>
        </div>
        <div class="main-row">
          <p class="text">Thanks for taking the time to use this site - if you have any comments or suggestions, feel free to <a href="mailto:borneman@case.edu">email me</a>.  This site also costs money to host (and concievably for API access in the future), so if you enjoyed it, feel free to spot a dollar/euro/beer on my <a href="paypal.me/DrewBorneman">Paypal</a>.</p>
        </div>
      </div>
    </content>
  </div>
</template>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
a {
  color: #ffff80;
}
.text {
  margin-top: 25px;
  margin-bottom: 25px;
  line-height: 1.5;
  font-size: 18px;
}
.subheader {
  margin-top: 15px;
  font-size: 26px;
}
.title {
  font-size: 56px;
  margin-top: 50px;
}
.main-row {
  width: 65%;
  margin-left: auto;
  margin-right: auto;
}
.content {
  width: 100%;
}
@media only screen and (max-width: 768px) {
  .text {
    line-height: 1.8;
    font-size: 20px;
  }
  .main-row {
    width: 80%!important;
  }
}
</style>
