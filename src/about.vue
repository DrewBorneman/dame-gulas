<template>
  <div class = "home">
    <header class = "header row">
      <div class="col-auto about-link-div">
        <a href = "/">{{ $t('home') }}</a>
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
    <content class="row">
      <div class="content col-auto">
        <div class="main-row row">
          <h1 class="title">{{ $t('about') }}</h1>
        </div>
        <div class="main-row row">
          <p></p>
        </div>
      </div>
    </content>
  </div>
</template>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: lightyellow;
}
.title {
  font-size: 96px;
  margin-top: 50px;
}
.about-link-div {
  margin-left: 10px;
  float: left;
}
.language-switch-div {
  margin-right: 10px;
  float: right;
}
.header {
  margin-top: 10px;
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
</style>
