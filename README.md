# About
16,384個（128×128）のメッシュをCurlNoiseで動かしているアプリケーションです。

https://nemutas.github.io/r3f-gyogun/

![gyogun](https://user-images.githubusercontent.com/46724121/150670414-1dd2e989-b9c9-40f2-83cc-c7d76d5463f3.gif)

# Technology
* React Three Fiber（Three.js for React）
* InstancedMesh
* Shader
* GPGPU
* Quaternion Rotation
* Post-processing（Volumetric Light）

# Reference
### Document
* [React Three Fiber](https://docs.pmnd.rs/)

### InstancedMesh
* [InstancedMesh](https://threejs.org/docs/#api/en/objects/InstancedMesh)
* [Instanced vertex-colors](https://codesandbox.io/s/instanced-vertex-colors-8fo01)

### GPGPU
* [【React Three Fiber】GPGPUを使用したParticlesの実装](https://qiita.com/nemutas/items/b40baa2a1f33fae6b20d)
* [GPGPUがまったくわからないのでGPUComputationRenderer.jsをまず調べてみるメモ](https://nogson2.hatenablog.com/entry/2018/04/07/130727)
* [GPUComputationRendererを使用している公式サンプル](https://threejs.org/examples/?q=gpg#webgl_gpgpu_birds)

### Quaternion
* [Quaternion](https://threejs.org/docs/index.html?q=Quaternion#api/en/math/Quaternion)
* [GLSLでクォータニオン(四元数)](https://qiita.com/aa_debdeb/items/c34a3088b2d8d3731813)
* [Rotate Box using Quaternion in Shader with r3f](https://codesandbox.io/s/rotate-box-using-quaternion-in-shader-with-r3f-2o0v2)

### VolumetricLight
* [Volumetric light](https://codesandbox.io/s/volumetric-light-w633u)
