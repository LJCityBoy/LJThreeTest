import * as THREE from "three";
class Room {
  constructor(
    name,
    roomIndex,
    textureUrl,
    position = new THREE.Vector3(0, 0, 0),
    euler = new THREE.Euler(0, 0, 0)
  ) {
    this.name = name;
    this.roomIndex = roomIndex;
    this.textureUrl = textureUrl;
    this.position = position;
    this.euler = euler;
    this.cube = null;

    //创建立方体
    const geometry = new THREE.BoxGeometry(10, 10, 10);
    geometry.scale(1, 1, -1);

    var arr = [
      `${this.roomIndex}_l`,
      `${this.roomIndex}_r`,
      `${this.roomIndex}_u`,
      `${this.roomIndex}_d`,
      `${this.roomIndex}_b`,
      `${this.roomIndex}_f`,
    ];
    let boxMaterials = [];
    arr.forEach((item) => {
      // 纹理加载
      const texture = new THREE.TextureLoader().load(
        this.textureUrl + item + ".jpg"
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

    this.cube = new THREE.Mesh(geometry, boxMaterials);
    this.cube.position.copy(this.position);
    this.cube.rotation.copy(this.euler);
  }
}

export { Room };
