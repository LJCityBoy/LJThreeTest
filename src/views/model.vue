<template>
  <div class="container" ref="container"></div>
</template>

<script>
import "three/examples/js/controls/OrbitControls";
export default {
  name: "Home",
  data() {
    return {
      viewer: {
        camera: null,
        scene: null,
        renderer: null,
        container: null,
        controller: null
      }
    };
  },
  components: {},
  mounted() {
    //初始化
    this.initScene();
  },
  methods: {
    initScene() {
      let self = this;
      self.container = self.$refs.container;
      //初始化相机
      self.camera = new THREE.PerspectiveCamera(
        55,
        window.innerWidth / window.innerHeight,
        1.0,
        100000
      );
      self.camera.position.set(0, 10, 0);
      self.camera.lookAt(0, 0, 0);

      //初始化scene
      self.scene = new THREE.Scene();
      self.scene.background = new THREE.Color(0xff0000);

      //初始化
      self.renderer = new THREE.WebGLRenderer({ antialias: true });
      self.renderer.setPixelRatio(window.devicePixelRatio);
      self.renderer.setSize(window.innerWidth, window.innerHeight);
      self.container.appendChild(self.renderer.domElement);

      //相机控制器
      self.controller = new THREE.OrbitControls(self.camera,self.container);
      self.controller.update();
      //是否开启场景自动旋转
      self.controller.autoRotate = false;
      self.controller.autoRotateSpeed = 0.1;
      self.controller.minPolarAngle = 0;
      self.controller.maxPolarAngle = Math.PI * 0.48;

      //窗口自适应
      
       window.addEventListener( "resize", () => {
          self.camera.aspect = window.innerWidth / window.innerHeight;
          elf.renderer.setSize(window.innerWidth, window.innerHeight);
      },false);
      
    },

    //渲染循环
    render() {
      requestAnimationFrame(this.render);
      this.renderer.render(this.scene, this.camera);
      this.controller.update()
    }
  },
  destroyed() {}
};
</script>
