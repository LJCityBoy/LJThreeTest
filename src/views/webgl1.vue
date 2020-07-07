<template>
  <div ref="continer" class="continer"></div>
</template>

<script>
import { mat4 } from "../libs/gl-matrix";
export default {
  name: "webgl1",
  data() {
    return {
      gl: null
    };
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      let self = this;
      let canvas = document.createElement("canvas");
      canvas.id = "glcanvas";
      canvas.width = 640;
      canvas.height = 480;
      this.$refs.continer.appendChild(canvas);

      self.gl = canvas.getContext("webgl");

      if (!self.gl) return;

      let vertextShader = require("./shaders/vsShader1");
      let fragementShader = require("./shaders/fsShader1");

      let shaderProgram = self.initShaderProgram(vertextShader, fragementShader);

      let programInfo = {
        program: shaderProgram,
        attribLocations: {
          vertexPosition: self.gl.getAttribLocation(
            shaderProgram,
            "aVertexPosition"
          )
        },
        uniformLocations: {
          projectionMatrix: self.gl.getUniformLocation(
            shaderProgram,
            "uProjectionMatrix"
          ),
          modelViewMatrix: self.gl.getUniformLocation(
            shaderProgram,
            "uModelViewMatrix"
          )
        }
      };
      let buffers = initBuffers();
      self.drawScene(programInfo, buffers);

      function initBuffers() {
        let positionBuffer = self.gl.createBuffer();
        self.gl.bindBuffer(self.gl.ARRAY_BUFFER, positionBuffer);

        let positions = [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0];

        self.gl.bufferData(
          self.gl.ARRAY_BUFFER,
          new Float32Array(positions),
          self.gl.STATIC_DRAW
        );

        return {
          position: positionBuffer
        };
      }
    },
    //初始化shader program
    initShaderProgram(vsShader, fsShader) {
      let self = this;
      let vertexShader = self.loaderShader(self.gl.VERTEX_SHADER, vsShader);
      let fragmentShader = self.loaderShader(self.gl.FRAGMENT_SHADER, fsShader);

      let shaderProgram = self.gl.createProgram();
      
      self.gl.attachShader(shaderProgram, vertexShader);
      self.gl.attachShader(shaderProgram, fragmentShader);
      self.gl.linkProgram(shaderProgram);

      if (!self.gl.getShaderParameter(shaderProgram, self.gl.LINK_STATUS)) {
        return null;
      }
      return shaderProgram;
    },
    //加载shader
    loaderShader(type, source) {
        let self = this
      let shader = self.gl.createShader(type);
      self.gl.shaderSource(shader, source);
      self.gl.compileShader(shader);
      if (!self.gl.getShaderParameter(shader, self.gl.COMPILE_STATUS)) {
        self.gl.deleteShader(shader);
        return null;
      }
      return shader;
    },

    //创建场景
    drawScene(programInfo, buffers) {
      let self = this;
      self.gl.clearColor(0.0, 0.0, 0.0, 1.0);
      self.gl.clearDepth(1.0);
      self.gl.enable(self.gl.DEPTH_TEST);
      self.gl.depthFunc(self.gl.LEQUAL);

      self.gl.clear(self.gl.COLOR_BUFFER_BIT | self.gl.DEPTH_BUFFER_BIT);

      let fieldOfView = (45 * Math.PI) / 180; // in radians
      let aspect = self.gl.canvas.clientWidth / self.gl.canvas.clientHeight;
      let zNear = 0.1;
      let zFar = 100.0;
      let projectionMatrix = mat4.create();

      mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

      let modelViewMatrix = mat4.create();

      mat4.translate(modelViewMatrix, modelViewMatrix, [-0.0, 0.0, -6.0]);

      {
        let numComponents = 2;
        let type = self.gl.FLOAT;
        let normalize = false;
        let stride = 0;
        let offset = 0;
        self.gl.bindBuffer(self.gl.ARRAY_BUFFER, buffers.position);
        self.gl.vertexAttribPointer(
          programInfo.attribLocations.vertexPosition,
          numComponents,
          type,
          normalize,
          stride,
          offset
        );
        self.gl.enableVertexAttribArray(
          programInfo.attribLocations.vertexPosition
        );
      }

      self.gl.useProgram(programInfo.program);

      self.gl.uniformMatrix4fv(
        programInfo.uniformLocations.projectionMatrix,
        false,
        projectionMatrix
      );
      self.gl.uniformMatrix4fv(
        programInfo.uniformLocations.modelViewMatrix,
        false,
        modelViewMatrix
      );

      {
        let offset = 0;
        let vertexCount = 4;
        self.gl.drawArrays(self.gl.TRIANGLE_STRIP, offset, vertexCount);
      }
    }
  },
  destroyed() {}
};
</script>

<style>
.continer {
  width: 100%;
  height: 100%;
  /* background: red; */
}
</style>