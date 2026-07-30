"use client";

import { useEffect, useRef } from "react";
import type { Mesh, MeshStandardMaterial, Object3D } from "three";

export function AvatarViewer() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    async function init() {
      const THREE = await import("three");
      const { GLTFLoader } = await import("three/examples/jsm/loaders/GLTFLoader.js");
      const { OrbitControls } = await import("three/examples/jsm/controls/OrbitControls.js");

      if (cancelled || !container) return;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        75,
        container.clientWidth / container.clientHeight,
        0.1,
        1000,
      );
      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
      });

      renderer.setPixelRatio(1);
      renderer.setSize(container.clientWidth, container.clientHeight);
      container.appendChild(renderer.domElement);

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.07);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 11.5);
      directionalLight.position.set(5, 10, 7.5);
      scene.add(directionalLight);

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.screenSpacePanning = false;
      controls.enableZoom = false;
      controls.target.set(0, 0, 0);

      let model: Object3D | null = null;
      let animationId = 0;
      let lastRenderTime = 0;
      const renderInterval = 1000 / 24;
      let loaded = false;

      function animate() {
        if (!document.hidden) {
          animationId = requestAnimationFrame(animate);
          const currentTime = performance.now();
          if (currentTime - lastRenderTime < renderInterval) return;
          lastRenderTime = currentTime;

          if (model) {
            model.rotation.y += 0.005;
          }
          controls.update();
          renderer.render(scene, camera);
        } else {
          animationId = requestAnimationFrame(animate);
        }
      }

      function loadModel() {
        if (loaded) return;
        loaded = true;
        const loader = new GLTFLoader();
        loader.load(
          "/home-page/3dfiles/avatar.glb",
          (gltf) => {
            if (cancelled) return;
            model = gltf.scene;
            model.position.set(0, -1, 0);
            scene.add(model);
            camera.position.z = 1.3;

            model.traverse((node) => {
              const mesh = node as Mesh;
              if (mesh.isMesh) {
                const material = mesh.material as MeshStandardMaterial;
                if (material) {
                  material.roughness = 0.6;
                  material.metalness = 0.5;
                }
              }
            });

            animate();
          },
          undefined,
          (error) => {
            console.error("An error occurred:", error);
          },
        );
      }

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              loadModel();
              observer.disconnect();
            }
          });
        },
        { threshold: 0.1 },
      );

      observer.observe(container);

      function onResize() {
        if (!container) return;
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
      }

      window.addEventListener("resize", onResize);

      function onContextLost(event: Event) {
        event.preventDefault();
        console.warn("WebGL context lost");
      }

      renderer.domElement.addEventListener("webglcontextlost", onContextLost);

      cleanup = () => {
        cancelled = true;
        observer.disconnect();
        window.removeEventListener("resize", onResize);
        renderer.domElement.removeEventListener("webglcontextlost", onContextLost);
        cancelAnimationFrame(animationId);
        controls.dispose();
        renderer.dispose();
        if (renderer.domElement.parentNode === container) {
          container.removeChild(renderer.domElement);
        }
      };
    }

    void init();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  return <div id="avatar-container" ref={containerRef} className="h-screen w-full" />;
}
