/* ── THREE.JS PARTICLE FIELD ── */
(function () {
  const canvas = document.getElementById("canvas3d");
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
  );
  camera.position.z = 30;

  // Particles
  const N = 1800;
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(N * 3);
  const col = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 120;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 120;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 60;
    const t = Math.random();
    if (t < 0.3) {
      col[i * 3] = 0.784;
      col[i * 3 + 1] = 0.663;
      col[i * 3 + 2] = 0.431; // gold
    } else if (t < 0.5) {
      col[i * 3] = 0.29;
      col[i * 3 + 1] = 0.608;
      col[i * 3 + 2] = 1.0; // blue
    } else {
      col[i * 3] = 0.25;
      col[i * 3 + 1] = 0.25;
      col[i * 3 + 2] = 0.28; // grey
    }
  }
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
  const mat = new THREE.PointsMaterial({
    size: 0.18,
    vertexColors: true,
    transparent: true,
    opacity: 0.65,
    sizeAttenuation: true,
  });
  const pts = new THREE.Points(geo, mat);
  scene.add(pts);

  // Floating geometric rings
  const rings = [];
  for (let i = 0; i < 4; i++) {
    const rg = new THREE.TorusGeometry(6 + i * 4, 0.03, 8, 80);
    const rm = new THREE.MeshBasicMaterial({
      color: i === 0 ? 0xc9a96e : i === 1 ? 0x4a9eff : 0x2a2a2e,
      transparent: true,
      opacity: 0.08 + i * 0.02,
    });
    const ring = new THREE.Mesh(rg, rm);
    ring.rotation.x = Math.random() * Math.PI;
    ring.rotation.y = Math.random() * Math.PI;
    ring.position.set(
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 10,
    );
    scene.add(ring);
    rings.push(ring);
  }

  // Mouse
  let mx = 0,
    my = 0;
  document.addEventListener("mousemove", (e) => {
    mx = (e.clientX / window.innerWidth - 0.5) * 2;
    my = -(e.clientY / window.innerHeight - 0.5) * 2;
  });

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += 0.003;
    pts.rotation.y = t * 0.1 + mx * 0.08;
    pts.rotation.x = t * 0.04 + my * 0.05;
    rings.forEach((r, i) => {
      r.rotation.x += 0.002 * (i % 2 === 0 ? 1 : -1);
      r.rotation.z += 0.001 * (i % 3 === 0 ? 1 : -1);
      r.position.y = Math.sin(t + i) * 2;
    });
    camera.position.x += (mx * 3 - camera.position.x) * 0.04;
    camera.position.y += (my * 2 - camera.position.y) * 0.04;
    camera.lookAt(scene.position);
    renderer.render(scene, camera);
  }
  animate();
})();

/* ── SCROLL PROGRESS ── */
window.addEventListener("scroll", () => {
  const d = document.documentElement;
  document.getElementById("pbar").style.width =
    (d.scrollTop / (d.scrollHeight - d.clientHeight)) * 100 + "%";
  document.getElementById("nav").classList.toggle("scrolled", d.scrollTop > 40);
});

/* ── REVEAL OBSERVER ── */
const obs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add("show");
    });
  },
  { threshold: 0.1 },
);
document
  .querySelectorAll(".reveal,.reveal-l,.reveal-r")
  .forEach((el) => obs.observe(el));

/* ── 3D CARD TILT ── */
document.querySelectorAll(".hero-card,.svc-card").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const r = card.getBoundingClientRect();
    const mx = ((e.clientX - r.left) / r.width - 0.5) * 2;
    const my = -((e.clientY - r.top) / r.height - 0.5) * 2;
    card.style.transform = `perspective(1000px) rotateY(${mx * 8}deg) rotateX(${my * 6}deg) translateZ(6px)`;
    card.style.setProperty(
      "--mx",
      ((e.clientX - r.left) / r.width) * 100 + "%",
    );
    card.style.setProperty(
      "--my",
      ((e.clientY - r.top) / r.height) * 100 + "%",
    );
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform =
      "perspective(1000px) rotateY(0deg) rotateX(0deg) translateZ(0)";
  });
});

/* ── HAMBURGER ── */
const ham = document.getElementById("ham"),
  mob = document.getElementById("mobnav");
let mopen = false;
ham.addEventListener("click", () => {
  mopen = !mopen;
  mob.classList.toggle("open", mopen);
  ham.children[0].style.transform = mopen
    ? "translateY(6px) rotate(45deg)"
    : "";
  ham.children[1].style.opacity = mopen ? "0" : "1";
  ham.children[2].style.transform = mopen
    ? "translateY(-6px) rotate(-45deg)"
    : "";
});
function closeMob() {
  mopen = false;
  mob.classList.remove("open");
  ham.children[0].style.transform = "";
  ham.children[1].style.opacity = "1";
  ham.children[2].style.transform = "";
}

/* ── IMAGE UPLOAD ── */
document.getElementById("imgInput").addEventListener("change", function (e) {
  const f = e.target.files[0];
  if (!f) return;
  const rd = new FileReader();
  rd.onload = function (ev) {
    const w = document.getElementById("avatarWrap");
    document.getElementById("avatarPH").style.display = "none";
    let img = w.querySelector("img");
    if (!img) {
      img = document.createElement("img");
      img.style.cssText =
        "position:absolute;inset:0;width:100%;height:100%;object-fit:cover;";
      w.insertBefore(img, w.firstChild);
    }
    img.src = ev.target.result;
  };
  rd.readAsDataURL(f);
});

/* ── FORM ── */
function submitForm() {
  const n = document.getElementById("fn").value.trim();
  const e = document.getElementById("fe").value.trim();
  const m = document.getElementById("fm").value.trim();
  if (!n || !e || !m) {
    alert("Please fill in name, email, and message.");
    return;
  }
  const ok = document.getElementById("fok");
  ok.style.display = "block";
  ["fn", "fe", "fs", "fm"].forEach(
    (id) => (document.getElementById(id).value = ""),
  );
  setTimeout(() => (ok.style.display = "none"), 5000);
}

/* ── PROJECT CARDS 3D TILT ── */
document.querySelectorAll(".proj-card,.about-card-3d").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const r = card.getBoundingClientRect();
    const mx = ((e.clientX - r.left) / r.width - 0.5) * 2;
    const my = -((e.clientY - r.top) / r.height - 0.5) * 2;
    card.style.transform = `perspective(800px) rotateY(${mx * 6}deg) rotateX(${my * 4}deg) translateY(-8px)`;
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});
async function submitForm() {
  const name = document.getElementById("fn").value;
  const email = document.getElementById("fe").value;
  const subject = document.getElementById("fs").value;
  const message = document.getElementById("fm").value;

  await fetch("http://127.0.0.1:8000/api/submit/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, subject, message }),
  });

  alert("Saved successfully 🔥");
}
