import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.166.1/build/three.module.js';

const host = document.querySelector('#three-gizmo');
if (host) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
    camera.position.set(4.6, 3.5, 6.2);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    host.appendChild(renderer.domElement);

    const object = new THREE.Group();
    object.rotation.set(-0.35, 0.55, 0.08);
    scene.add(object);

    const makeAxis = (direction, color) => {
        const group = new THREE.Group();
        const material = new THREE.MeshBasicMaterial({ color });
        const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 2.25, 10), material);
        shaft.position.y = 1.125;
        const arrow = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.3, 12), material);
        arrow.position.y = 2.38;
        group.add(shaft, arrow);
        group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
        object.add(group);
    };

    makeAxis(new THREE.Vector3(1, 0, 0), 0xff5148);
    makeAxis(new THREE.Vector3(0, 1, 0), 0x55bd78);
    makeAxis(new THREE.Vector3(0, 0, 1), 0x7198ff);

    let targetX = object.rotation.x;
    let targetY = object.rotation.y;
    let targetZ = object.rotation.z;
    let idleBaseX = targetX;
    let idleBaseY = targetY;
    let idleBaseZ = targetZ;
    let idleStart = 0;
    let velocityX = 0;
    let velocityY = 0;
    let velocityZ = 0;
    const clock = new THREE.Clock();
    let dragX = 0;
    let dragY = 0;
    let dragging = false;

    host.addEventListener('pointerdown', (event) => { dragging = true; velocityX = 0; velocityY = 0; velocityZ = 0; dragX = event.clientX; dragY = event.clientY; host.setPointerCapture(event.pointerId); });
    host.addEventListener('pointermove', (event) => {
        if (!dragging) return;
        const deltaX = event.clientX - dragX;
        const deltaY = event.clientY - dragY;
        targetY += deltaX * 0.012;
        targetX += deltaY * 0.012;
        velocityX = deltaY * 0.0024;
        velocityY = deltaX * 0.0024;
        velocityZ = deltaX * 0.00075;
        dragX = event.clientX; dragY = event.clientY;
    });
    host.addEventListener('pointerup', () => {
        dragging = false;
        idleStart = null;
    });

    const resize = () => {
        const { width, height } = host.getBoundingClientRect();
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    };
    new ResizeObserver(resize).observe(host);
    resize();

    const render = () => {
        const time = clock.getElapsedTime();
        if (!dragging) {
            const isCoasting = Math.abs(velocityX) + Math.abs(velocityY) + Math.abs(velocityZ) > 0.00008;
            if (isCoasting) {
                targetX += velocityX;
                targetY += velocityY;
                targetZ += velocityZ;
                velocityX *= 0.925;
                velocityY *= 0.925;
                velocityZ *= 0.925;
            } else {
                if (idleStart === null) {
                    idleBaseX = object.rotation.x;
                    idleBaseY = object.rotation.y;
                    idleBaseZ = object.rotation.z;
                    targetX = idleBaseX;
                    targetY = idleBaseY;
                    targetZ = idleBaseZ;
                    idleStart = time;
                }
                const idleTime = time - idleStart;
                targetX = idleBaseX + Math.sin(idleTime * 0.37) * 0.36;
                targetY = idleBaseY + idleTime * 0.16;
                targetZ = idleBaseZ + Math.sin(idleTime * 0.29) * 0.24;
            }
        }
        object.rotation.x += (targetX - object.rotation.x) * 0.07;
        object.rotation.y += (targetY - object.rotation.y) * 0.07;
        object.rotation.z += (targetZ - object.rotation.z) * 0.07;
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    };
    render();
}
