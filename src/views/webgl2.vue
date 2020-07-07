<template>
  <div ref="canvasid"></div>
</template>

<script>
import { mat4 } from "../libs/gl-matrix";
export default {
  data() {
    return {};
  },
  mounted() {
    this.initwebgl();
  },
  methods: {
    initwebgl() {
      let canvas = document.createElement("canvas");
      canvas.width = 1920;
      canvas.height = 1080;
      this.$refs.canvasid.appendChild(canvas);

      let gl = canvas.getContext("webgl");
      if (!gl) return;

      const vsSource = `
                attribute vec4 aVertexPosition;
                attribute vec4 aVertexColor;

                uniform mat4 uModelViewMatrix;
                uniform mat4 uProjectionMatrix;

                varying lowp vec4 vColor;

                void main(){
                    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
                    vColor = aVertexColor;
                }

            `;

      const fsSource = `
                varying lowp vec4 vColor;
                
                void main(){
                    gl_FragColor = vColor;
                }`;

      const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

      
      const programInfo = {
        program: shaderProgram,
        attribLocations: {
          vertexPosition: gl.getAttribLocation(
            shaderProgram,
            "aVertexPosition"
          ),
          vertexColor: gl.getAttribLocation(shaderProgram, "aVertexColor")
        },
        uniformLocations: {
          projectionMatrix: gl.getUniformLocation(
            shaderProgram,
            "uProjectionMatrix"
          ),
          modelViewMatrix: gl.getUniformLocation(
            shaderProgram,
            "uModelViewMatrix"
          )
        }
      };

      const buffers = initBuffers(gl);

        let then = 0;
        function render(now){
            now *= 0.001;
            const deltaTime = now - then;
            then = now;
            drawScene(gl, programInfo, buffers,deltaTime);
            requestAnimationFrame(render)
        }
         requestAnimationFrame(render);


      

      function initBuffers(gl) {
       
        const positionBuffer = gl.createBuffer();


        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);


        const positions = [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0];

        gl.bufferData(
          gl.ARRAY_BUFFER,
          new Float32Array(positions),
          gl.STATIC_DRAW
        );

        // Now set up the colors for the vertices

        var colors = [
          1.0,
          1.0,
          1.0,
          1.0, // white
          1.0,
          0.0,
          0.0,
          1.0, // red
          0.0,
          1.0,
          0.0,
          1.0, // green
          0.0,
          0.0,
          1.0,
          1.0 // blue
        ];

        const colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(
          gl.ARRAY_BUFFER,
          new Float32Array(colors),
          gl.STATIC_DRAW
        );

        return {
          position: positionBuffer,
          color: colorBuffer
        };
      }
       let squareRotation = 0.0;
      //
      // Draw the scene.
      //
      function drawScene(gl, programInfo, buffers,deltaTime) {
        gl.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque
        gl.clearDepth(1.0); // Clear everything
        gl.enable(gl.DEPTH_TEST); // Enable depth testing
        gl.depthFunc(gl.LEQUAL); // Near things obscure far things

        // Clear the canvas before we start drawing on it.

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


        const fieldOfView = (45 * Math.PI) / 180; // in radians
        const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
        const zNear = 0.1;
        const zFar = 100.0;
        const projectionMatrix = mat4.create();

        
        mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

       
        const modelViewMatrix = mat4.create();


        mat4.translate(
          modelViewMatrix, // destination matrix
          modelViewMatrix, // matrix to translate
          [-0.0, 0.0, -6.0]
        ); // amount to translate

        mat4.rotate(modelViewMatrix,modelViewMatrix,squareRotation,[0,0,1]);

        {
          const numComponents = 2;
          const type = gl.FLOAT;
          const normalize = false;
          const stride = 0;
          const offset = 0;
          gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
          gl.vertexAttribPointer(
            programInfo.attribLocations.vertexPosition,
            numComponents,
            type,
            normalize,
            stride,
            offset
          );
          gl.enableVertexAttribArray(
            programInfo.attribLocations.vertexPosition
          );
        }

        // Tell WebGL how to pull out the colors from the color buffer
        // into the vertexColor attribute.
        {
          const numComponents = 4;
          const type = gl.FLOAT;
          const normalize = false;
          const stride = 0;
          const offset = 0;
          gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
          gl.vertexAttribPointer(
            programInfo.attribLocations.vertexColor,
            numComponents,
            type,
            normalize,
            stride,
            offset
          );
          gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);
        }

        // Tell WebGL to use our program when drawing

        gl.useProgram(programInfo.program);

        // Set the shader uniforms

        gl.uniformMatrix4fv(
          programInfo.uniformLocations.projectionMatrix,
          false,
          projectionMatrix
        );
        gl.uniformMatrix4fv(
          programInfo.uniformLocations.modelViewMatrix,
          false,
          modelViewMatrix
        );

        {
          const offset = 0;
          const vertexCount = 4;
          gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
        }
        squareRotation += deltaTime;
      }

      function initShaderProgram(gl, vsSource, fsSource) {
        const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
        const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);


        const shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);


        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
          alert(
            "Unable to initialize the shader program: " +
              gl.getProgramInfoLog(shaderProgram)
          );
          return null;
        }

        return shaderProgram;
      }

      function loadShader(gl, type, source) {
        const shader = gl.createShader(type);

        gl.shaderSource(shader, source);

        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
          alert(
            "An error occurred compiling the shaders: " +
              gl.getShaderInfoLog(shader)
          );
          gl.deleteShader(shader);
          return null;
        }

        return shader;
      }
    }
  },
  destroyed() {}
};
</script>

<style>
</style>