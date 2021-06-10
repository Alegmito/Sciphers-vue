<template>
  <div id="app">
    <h1>Шифр Полибия</h1>
    <polibii-cube></polibii-cube>
    <h1>Шифр плейфера</h1>
    <img alt="Vue logo" src="./assets/Wheatstone_Charles.jpg">
    <playfair msg=""/>
  </div>
</template>

<script>
import Playfair from './components/HelloWorld.vue'
import PolibiiCube from './components/PolibiiCube.vue'

export default {
  name: 'App',
  components: {
    Playfair,
    PolibiiCube
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
