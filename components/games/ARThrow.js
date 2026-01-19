// let startY;
// let thrown = false;
// let score = 0;

// const velocity = new THREE.Vector3();
// const gravity = 9.8;
// const clock = new THREE.Clock();

// const sceneEl = document.querySelector("#scene");
// const cam = document.querySelector("#camera");
// const ball = document.querySelector("#ball");
// const basket = document.querySelector("#basket");

// /* 🚨 WAIT FOR SCENE TO LOAD */
// sceneEl.addEventListener("loaded", () => {
//   resetBall();   // ✅ NOW camera exists
// });

// /* ---------- Swipe Controls ---------- */
// document.addEventListener("touchstart", e => {
//   if (thrown) return;
//   startY = e.touches[0].clientY;
// });

// document.addEventListener("touchend", e => {
//   if (thrown) return;

//   const swipe = startY - e.changedTouches[0].clientY;
//   if (swipe < 30) return;

//   throwBall(Math.min(swipe / 40, 8));
// });

// /* ---------- Throw ---------- */
// function throwBall(power) {
//   thrown = true;

//   const dir = new THREE.Vector3();
//   cam.object3D.getWorldDirection(dir);

//   velocity.copy(dir.multiplyScalar(power));
//   velocity.y += power / 2;
// }

// /* ---------- Physics ---------- */
// AFRAME.registerComponent("ball-motion", {
//   tick() {
//     if (!thrown) return;

//     const dt = clock.getDelta();
//     velocity.y -= gravity * dt;

//     ball.object3D.position.add(
//       velocity.clone().multiplyScalar(dt)
//     );

//     checkHit();
//   }
// });

// /* ---------- Collision ---------- */
// function checkHit() {
//   const bp = basket.object3D.position;
//   const p = ball.object3D.position;

//   if (p.distanceTo(bp) < 0.35) {
//     score++;
//     document.getElementById("score").innerText = `Score: ${score}`;
//     resetBall();
//   }
// }

// /* ---------- Reset ---------- */
// function resetBall() {
//   thrown = false;
//   velocity.set(0, 0, 0);

//   const dir = new THREE.Vector3();
//   cam.object3D.getWorldDirection(dir);

//   ball.object3D.position.copy(
//     cam.object3D.position.clone().add(dir.multiplyScalar(0.6))
//   );
// }