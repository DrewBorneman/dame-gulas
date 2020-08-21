<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'App',
}
</script>

<style>
html {
  min-height: 100%;
}
body {
  width: 100%;
  min-height: 100vh;

  background: linear-gradient(#7d7db5, #383861);
  background-color: #383861;
}
#app {
  font-family: Roboto, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #FFF;
  min-height: 100vh;
}
.about-link-div {
  padding-left: 10px;
  float: left;
}
.language-switch-div {
  padding-right: 10px;
  float: right;
}
.header {
  padding-top: 10px;
  height: 100%;

  display: flex;
  flex-wrap: wrap;
}
@media only screen and (max-width: 768px) {
  .header {
    font-size: 22px;
  }
}
</style>
