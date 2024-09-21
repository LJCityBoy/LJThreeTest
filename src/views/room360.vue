<template>
  <div class="container" ref="container"></div>
  <div class="map">
    <div class="tag" ref="tagDiv"></div>
    <img src="../assets/room360/map.gif" alt="" />
  </div>
  <div class="loading" v-if="progress != 100"></div>
  <div class="progress" v-if="progress != 100">
    <img src="../assets/room360/loading.gif" alt="" />
    <span>新房奔跑中：{{ progress }}%</span>
  </div>
  <div class="title">VR全景看房</div>
</template>

<script setup>
import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { ref, onMounted } from "vue";
import gsap from "gsap";
// import SpriteCanvas from "./three/SpriteCanvas";

let tagDiv = ref(null);
let progress = ref(0);
// 初始化场景
const scene = new THREE.Scene();
// 初始化相机
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
// 设置相机位置
camera.position.set(0, 0, 0);
// 初始化渲染器
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
  logarithmicDepthBuffer: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);

// 添加辅助坐标系
// const axes = new THREE.AxesHelper(5);
// scene.add(axes);

const container = ref(null);

const render = () => {
  renderer.render(scene, camera);
  requestAnimationFrame(render);
};

onMounted(() => {
  container.value.appendChild(renderer.domElement);
  render();

  let isMouseDown = false;
  // 监听鼠标按下事件
  container.value.addEventListener(
    "mousedown",
    () => {
      isMouseDown = true;
    },
    false
  );
  container.value.addEventListener(
    "mouseup",
    () => {
      isMouseDown = false;
    },
    false
  );
  container.value.addEventListener("mouseout", () => {
    isMouseDown = false;
  });
  let clock = new THREE.Clock();
  clock.start();
  // 是否按下鼠标,移动鼠标
  container.value.addEventListener("mousemove", (event) => {
    camera.rotation.order = "YXZ";

    let delta = clock.getDelta();
    if (isMouseDown) {
      gsap.to(camera.rotation, {
        y: camera.rotation.y + event.movementX * 0.001,
        x: camera.rotation.x + event.movementY * 0.001,
        duration: delta,
      });
      // camera.rotation.y += event.movementX * 0.002;
      // camera.rotation.x += event.movementY * 0.002;
      camera.rotation.order = "YXZ";
      // xyz
    }
  });

  tagDiv.value.style.cssText = `transform:translate(100px,110px)`;

  function moveTag(name) {
    let positions = {
      客厅: [100, 110],
      厨房: [180, 190],
      阳台: [50, 50],
    };
    if (positions[name]) {
      gsap.to(tagDiv.value, {
        duration: 0.5,
        x: positions[name][0],
        y: positions[name][1],
        ease: "power3.inOut",
      });
    }
  }

  // 创建客厅
  let liveroom = new Room("客厅", 0, "./img/livingroom/");
  scene.add(liveroom.scene);

  // 创建厨房
  let kitchenPostion = new THREE.Vector3(-5, 0, -10);
  let kitEuler = new THREE.Euler(0, -Math.PI / 2, 0);
  let kitchen = new Room("厨房", 3, "./img/kitchen/", kitchenPostion, kitEuler);
  scene.add(kitchen.scene);

  // 创建厨房精灵文字
  let kitchenTextPosition = new THREE.Vector3(-1, 0, -3);
  let kitchenText = new SpriteText("厨房", kitchenTextPosition);
  kitchenText.onClick(() => {
    // 让相机移动到厨房
    // console.log("厨房");
    gsap.to(camera.position, {
      duration: 1,
      x: kitchenPostion.x,
      y: kitchenPostion.y,
      z: kitchenPostion.z,
    });
    moveTag("厨房");
  });

  // 创建厨房回客厅精灵文字
  let kitchenBackTextPosition = new THREE.Vector3(-4, 0, -6);
  let kitchenBackText = new SpriteText("客厅", kitchenBackTextPosition);
  kitchenBackText.onClick(() => {
    // 让相机移动到客厅
    // console.log("客厅");
    gsap.to(camera.position, {
      duration: 1,
      x: 0,
      y: 0,
      z: 0,
    });
    moveTag("客厅");
  });

  // 创建阳台
  let balconyPosition = new THREE.Vector3(0, 0, 15);
  let balcony = new Room("阳台", 8, "./img/balcony/", balconyPosition);
  scene.add(balcony.scene);
  // 创建阳台精灵文字
  let balconyTextPosition = new THREE.Vector3(0, 0, 3);
  let balconyText = new SpriteText("阳台", balconyTextPosition);
  balconyText.onClick(() => {
    // 让相机移动到阳台
    // console.log("阳台");
    gsap.to(camera.position, {
      duration: 1,
      x: balconyPosition.x,
      y: balconyPosition.y,
      z: balconyPosition.z,
    });
    moveTag("阳台");
  });

  // 创建阳台回客厅精灵文字
  let balconyBackTextPosition = new THREE.Vector3(-1, 0, 11);
  let balconyBackText = new SpriteText("客厅", balconyBackTextPosition);
  balconyBackText.onClick(() => {
    // 让相机移动到客厅
    // console.log("客厅");
    gsap.to(camera.position, {
      duration: 1,
      x: 0,
      y: 0,
      z: 0,
    });
    moveTag("客厅");
  });
});

class Room {
  constructor(
    name,
    roomIndex,
    textureUrl,
    position = new THREE.Vector3(0, 0, 0),
    euler = new THREE.Euler(0, 0, 0)
  ) {
    this.name = name;
    // 创建立方体
    const geometry = new THREE.BoxGeometry(10, 10, 10);
    geometry.scale(1, 1, -1);
    // let textureUrl = textureUrl;
    // let roomIndex = 0;
    this.scene = null;
    var arr = [
      `${roomIndex}_l`,
      `${roomIndex}_r`,
      `${roomIndex}_u`,
      `${roomIndex}_d`,
      `${roomIndex}_b`,
      `${roomIndex}_f`,
    ];
    let boxMaterials = [];
    arr.forEach((item) => {
      // 纹理加载
      const texture = new THREE.TextureLoader().load(
        textureUrl + item + ".jpg"
      );
      if (item === `${roomIndex}_d` || item === `${roomIndex}_u`) {
        texture.rotation = Math.PI;
        texture.center = new THREE.Vector2(0.5, 0.5);
      }
      boxMaterials.push(
        new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          opacity: 0.8,
          depthWrite: true,
          depthTest: true,
        })
      );
    });

    const cube = new THREE.Mesh(geometry, boxMaterials);
    cube.position.copy(position);
    cube.rotation.copy(euler);
    // scene.add(cube);
    this.scene = cube;
  }
}

class SpriteText {
  constructor(text, position) {
    this.callbacks = [];
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 1024;
    const context = canvas.getContext("2d");
    context.fillStyle = "rgba(100, 100, 100, 0.7)";
    context.fillRect(0, 256, 1024, 512);
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = "bold 200px Arial";
    context.fillStyle = "white";
    context.fillText(text, 512, 512);
    let texture = new THREE.CanvasTexture(canvas);

    const material = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthWrite: true,
    });
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(0.5, 0.5, 0.5);
    sprite.position.copy(position);
    this.sprite = sprite;
    sprite.renderOrder = 1;
    scene.add(sprite);
    let mouse = new THREE.Vector2();
    let raycaster = new THREE.Raycaster();
    window.addEventListener("click", (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      let intersects = raycaster.intersectObject(sprite);
      if (intersects.length > 0) {
        this.callbacks.forEach((callback) => {
          callback();
        });
      }
    });
  }
  onClick(callback) {
    this.callbacks.push(callback);
  }
}
THREE.DefaultLoadingManager.onProgress = function (item, loaded, total) {
  console.log(item, loaded, total);
  console.log("进度:", new Number((loaded / total) * 100).toFixed(2));
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
  background-image: url(./assets/location.png);
  background-size: cover;
  z-index: 1;
}
.loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-image: url(./assets/loading.png);
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

.title {
  width: 180px;
  height: 40px;
  position: fixed;
  right: 100px;
  top: 50px;
  background-color: rgba(0, 0, 0, 0.5);
  line-height: 40px;
  text-align: center;
  color: #fff;
  border-radius: 5px;
  z-index: 110;
}
</style>
