<template>
  <div class="container">
    <div class="room" ref="container"></div>
    <div class="map">
      <div class="tag" ref="tagDiv"></div>
      <img src="@/assets/room360/map.gif" alt="" />
    </div>
    <div class="loading" v-if="progress != 100"></div>
    <div class="progress" v-if="progress != 100">
      <img src="@/assets/room360/loading.gif" alt="" />
      <span>正在加载中：{{ progress }}%</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import * as THREE from "three";
import { Room } from "./room";

//加载进度
const progress = ref(0);

//当前位置tag
let tagDiv = ref(null);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.set(0, 0, 0);
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
  logarithmicDepthBuffer: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);

const container = ref(null);

const render = () => {
  renderer.render(scene, camera);
  requestAnimationFrame(render);
};

// 创建客厅
const createLiveRoom = (scene) => {
  const liveroom = new Room("客厅", 0, "./img/livingroom/");
  scene.add(liveroom.cube);
};
// 创建厨房
const createKitchen = (scene) => {
  let kitchenPostion = new THREE.Vector3(-5, 0, -10);
  let kitEuler = new THREE.Euler(0, -Math.PI / 2, 0);
  let kitchen = new Room("厨房", 3, "./img/kitchen/", kitchenPostion, kitEuler);
  scene.add(kitchen.cube);
};
// 创建阳台
const createBalcony = (scene) => {
  let balconyPosition = new THREE.Vector3(0, 0, 15);
  let balcony = new Room("阳台", 8, "./img/balcony/", balconyPosition);
  scene.add(balcony.cube);
};

onMounted(() => {
  container.value.appendChild(renderer.domElement);
  render();
  tagDiv.value.style.cssText = `transform:translate(100px,110px)`;

  createLiveRoom(scene);
  createKitchen(scene);
  createBalcony(scene);
});

THREE.DefaultLoadingManager.onProgress = function (__item, loaded, total) {
  progress.value = new Number((loaded / total) * 100).toFixed(2);
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
.container {
  height: 100vh;
  width: 100vw;
  background-color: #f0f0f0;
}
.room {
  width: 100vw;
  height: 100vh;
}
.map {
  width: 300px;
  height: 260px;
  position: absolute;
  left: 0;
  bottom: 0;
  overflow: hidden;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}
.map > img {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
}
.map > .tag {
  position: absolute;
  top: 0;
  left: 0;
  width: 30px;
  height: 30px;
  background-image: url(../../assets/room360/location.png);
  background-size: cover;
  z-index: 1;
}
.loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-image: url(../../assets/room360/loading.png);
  background-size: cover;
  filter: blur(50px);
  z-index: 100;
}
.progress {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 101;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  color: #fff;
}
.progress > img {
  padding: 0 15px;
}
</style>
