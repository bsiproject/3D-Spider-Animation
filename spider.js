let scene, camera, renderer, spider, mixer, scrollY;
let web, fly, webMixer, flyMixer; // Objek dan mixer tambahan untuk jaring dan serangga
let clock = new THREE.Clock();
let lastScrollY = 0;

document.addEventListener("DOMContentLoaded", init);

function init() {
    // Inisialisasi scene, kamera, dan renderer
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x121212, 10, 50); // Kabut untuk suasana gelap

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('spider-canvas').appendChild(renderer.domElement);

    // Tambahkan pencahayaan
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 1).normalize();
    scene.add(light);

    // Muat model spider
    const loader = new THREE.GLTFLoader();
    loader.load(
        'assets/spider.glb',
        function (gltf) {
            spider = gltf.scene;
            spider.position.set(0, 0, 0);
            spider.scale.set(1.5, 1.5, 1.5); // Perbesar ukuran spider

            scene.add(spider);

            mixer = new THREE.AnimationMixer(spider);
            const action = mixer.clipAction(gltf.animations[0]);
            action.play();

            animate();
        },
        undefined,
        function (error) {
            console.error('Error loading spider model:', error);
        }
    );

    // Muat model jaring laba-laba
    loader.load(
        'assets/web.glb',
        function (gltf) {
            web = gltf.scene;
            web.position.set(0, -2, 0); // Atur posisi jaring di bawah spider
            web.scale.set(4, 4, 4); // Perbesar jaring agar lebih jelas
            web.rotation.x = -Math.PI / 2; // Rotasi jaring agar datar seperti lantai
            scene.add(web);

            webMixer = new THREE.AnimationMixer(web);
        },
        undefined,
        function (error) {
            console.error('Error loading web model:', error);
        }
    );

    // Muat model serangga atau lalat (mangsa spider)
    loader.load(
        'assets/fly.glb',
        function (gltf) {
            fly = gltf.scene;
            fly.position.set(-0.9, -2.9, 0.8); // Tempatkan serangga di atas jaring
            fly.scale.set(0.5, 0.5, 0.5); // Perbesar serangga agar terlihat lebih jelas
            scene.add(fly);

            flyMixer = new THREE.AnimationMixer(fly);
            const flyAction = flyMixer.clipAction(gltf.animations[0]);
            flyAction.play(); // Putar animasi serangga jika tersedia
        },
        undefined,
        function (error) {
            console.error('Error loading fly model:', error);
        }
    );

    // Event resize dan scroll
    window.addEventListener('resize', onWindowResize, false);
    window.addEventListener('scroll', onScroll, false);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onScroll() {
    scrollY = window.scrollY;
}

function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();
    if (mixer) mixer.update(delta);
    if (webMixer) webMixer.update(delta);
    if (flyMixer) flyMixer.update(delta);

    // Gerakan spider mengikuti scroll
    if (spider) {
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        const scrollProgress = scrollY / maxScroll;
        spider.position.y = -scrollProgress * 5;

        // Rotasi spider agar menghadap ke arah scroll
        if (scrollY > lastScrollY) {
            spider.rotation.x = Math.PI / 2; // Menghadap ke bawah saat scroll ke bawah
        } else if (scrollY < lastScrollY) {
            spider.rotation.x = -Math.PI / 2; // Menghadap ke atas saat scroll ke atas
        }
        lastScrollY = scrollY;
    }

    renderer.render(scene, camera);
}
// script.js

// Fungsi untuk menambahkan scroll halus
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        // Scroll halus ke bagian yang dipilih
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
