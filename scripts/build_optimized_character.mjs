globalThis.FileReader = class FileReader {
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then(buf => {
      this.result = buf;
      if (this.onloadend) this.onloadend();
    });
  }
};

import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { USDZExporter } from 'three/examples/jsm/exporters/USDZExporter.js';
import fs from 'fs';
import path from 'path';

const outDir = 'C:/Users/Admin/ar-striker/models';

function createBox(w, h, d, mat) {
  return new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
}

function createCylinder(rTop, rBot, h, segs, mat) {
  return new THREE.Mesh(new THREE.CylinderGeometry(rTop, rBot, h, segs), mat);
}

function createSphere(r, mat, sx = 1, sy = 1, sz = 1, segs = 20) {
  const geom = new THREE.SphereGeometry(r, segs, Math.round(segs * 0.75));
  geom.scale(sx, sy, sz);
  return new THREE.Mesh(geom, mat);
}

function createTorus(r, tube, radSegs, tubSegs, mat) {
  return new THREE.Mesh(new THREE.TorusGeometry(r, tube, radSegs, tubSegs), mat);
}

function quatFromEuler(x, y, z) {
  const q = new THREE.Quaternion();
  q.setFromEuler(new THREE.Euler(x, y, z));
  return [q.x, q.y, q.z, q.w];
}

function buildModel() {
  const root = new THREE.Group();
  root.name = 'root';

  // 1. Materials matching reference photo:
  const baseMat = new THREE.MeshStandardMaterial({
    color: 0x0a101d,
    roughness: 0.35,
    metalness: 0.65
  });

  const rimNeonMat = new THREE.MeshStandardMaterial({
    color: 0x00f0ff,
    emissive: 0x00f0ff,
    emissiveIntensity: 0.6,
    roughness: 0.2
  });

  const innerRingMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    emissive: 0x0284c7,
    emissiveIntensity: 0.4,
    roughness: 0.3
  });

  // Character Materials:
  const skinMat = new THREE.MeshStandardMaterial({
    color: 0xd19875,
    roughness: 0.55,
    metalness: 0.02
  });

  const hairMat = new THREE.MeshStandardMaterial({
    color: 0x221f22,
    roughness: 0.38,
    metalness: 0.08
  });

  const jacketMat = new THREE.MeshStandardMaterial({
    color: 0x7a4d38,
    roughness: 0.48,
    metalness: 0.04
  });

  const cuffMat = new THREE.MeshStandardMaterial({
    color: 0x663d2a,
    roughness: 0.52,
    metalness: 0.04
  });

  const shirtMat = new THREE.MeshStandardMaterial({
    color: 0xf4bf34,
    roughness: 0.62,
    metalness: 0.02
  });

  const jeansMat = new THREE.MeshStandardMaterial({
    color: 0x5b82a7,
    roughness: 0.70,
    metalness: 0.04
  });

  const jeanCuffMat = new THREE.MeshStandardMaterial({
    color: 0x7b9ebd,
    roughness: 0.68,
    metalness: 0.04
  });

  const beltMat = new THREE.MeshStandardMaterial({
    color: 0x202226,
    roughness: 0.45,
    metalness: 0.1
  });

  const buckleMat = new THREE.MeshStandardMaterial({
    color: 0xdde3ea,
    roughness: 0.22,
    metalness: 0.85
  });

  const sockMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    roughness: 0.55,
    metalness: 0.02
  });

  const shoeMat = new THREE.MeshStandardMaterial({
    color: 0x252528,
    roughness: 0.42,
    metalness: 0.12
  });

  const soleMat = new THREE.MeshStandardMaterial({
    color: 0xf4f6f8,
    roughness: 0.35,
    metalness: 0.05
  });

  const laceMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.4,
    metalness: 0.0
  });

  const goldMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    roughness: 0.22,
    metalness: 0.9
  });

  const eyeMat = new THREE.MeshStandardMaterial({
    color: 0x141416,
    roughness: 0.15,
    metalness: 0.1
  });

  const mouthMat = new THREE.MeshStandardMaterial({
    color: 0x8b3240,
    roughness: 0.45
  });

  const teethMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.25
  });

  const blushMat = new THREE.MeshStandardMaterial({
    color: 0xd77880,
    roughness: 0.85
  });

  // Podium Base (y = 0.01)
  const baseDisc = createCylinder(0.24, 0.25, 0.02, 48, baseMat);
  baseDisc.position.y = 0.01;
  baseDisc.name = 'podiumBase';
  root.add(baseDisc);

  const torusGeom = new THREE.TorusGeometry(0.242, 0.005, 16, 64);
  torusGeom.rotateX(Math.PI / 2);
  const outerRing = new THREE.Mesh(torusGeom, rimNeonMat);
  outerRing.position.y = 0.02;
  outerRing.name = 'outerRing';
  root.add(outerRing);

  const innerTorus = new THREE.TorusGeometry(0.14, 0.003, 12, 48);
  innerTorus.rotateX(Math.PI / 2);
  const innerRing = new THREE.Mesh(innerTorus, innerRingMat);
  innerRing.position.y = 0.021;
  innerRing.name = 'innerRing';
  root.add(innerRing);

  // Character Root (sitting directly on podium platform at y = 0.02)
  const character = new THREE.Group();
  character.name = 'character';
  character.position.set(0, 0.02, 0);
  root.add(character);

  // Hips Root at y = 0.22 (height fits nicely on platform)
  const hips = new THREE.Group();
  hips.name = 'hips';
  hips.position.set(0, 0.22, 0);
  character.add(hips);

  // Pelvis (Blue Jeans)
  const pelvis = createBox(0.088, 0.042, 0.055, jeansMat);
  pelvis.name = 'pelvis';
  hips.add(pelvis);

  // Belt & Buckle
  const belt = createBox(0.09, 0.014, 0.057, beltMat);
  belt.position.y = 0.016;
  belt.name = 'belt';
  hips.add(belt);

  const buckle = createBox(0.022, 0.016, 0.005, buckleMat);
  buckle.position.set(0, 0.016, 0.03);
  buckle.name = 'buckle';
  hips.add(buckle);

  // Torso Root at y = 0.021 on hips
  const torso = new THREE.Group();
  torso.name = 'torso';
  torso.position.set(0, 0.021, 0);
  hips.add(torso);

  // Yellow Top
  const yellowTop = createBox(0.084, 0.11, 0.052, shirtMat);
  yellowTop.position.set(0, 0.055, 0);
  yellowTop.name = 'yellowTop';
  torso.add(yellowTop);

  // Brown Jacket Panels
  const jacketBack = createBox(0.088, 0.105, 0.035, jacketMat);
  jacketBack.position.set(0, 0.055, -0.012);
  jacketBack.name = 'jacketBack';
  torso.add(jacketBack);

  const leftLapel = createBox(0.024, 0.105, 0.018, jacketMat);
  leftLapel.position.set(0.036, 0.055, 0.02);
  leftLapel.name = 'leftLapel';
  torso.add(leftLapel);

  const rightLapel = createBox(0.024, 0.105, 0.018, jacketMat);
  rightLapel.position.set(-0.036, 0.055, 0.02);
  rightLapel.name = 'rightLapel';
  torso.add(rightLapel);

  // Head and Neck at y = 0.11 on torso
  const headGroup = new THREE.Group();
  headGroup.name = 'headGroup';
  headGroup.position.set(0, 0.11, 0);
  torso.add(headGroup);

  const neck = createCylinder(0.016, 0.018, 0.024, 16, skinMat);
  neck.position.set(0, 0.012, 0);
  neck.name = 'neck';
  headGroup.add(neck);

  const skull = createSphere(0.042, skinMat, 1.0, 1.15, 1.05, 24);
  skull.position.set(0, 0.052, 0.002);
  skull.name = 'skull';
  headGroup.add(skull);

  // Eyes
  const leftEye = createSphere(0.007, eyeMat, 0.9, 1.2, 0.6, 12);
  leftEye.position.set(0.018, 0.056, 0.042);
  leftEye.name = 'leftEye';
  headGroup.add(leftEye);

  const rightEye = createSphere(0.007, eyeMat, 0.9, 1.2, 0.6, 12);
  rightEye.position.set(-0.018, 0.056, 0.042);
  rightEye.name = 'rightEye';
  headGroup.add(rightEye);

  // Cheerful Mouth
  const mouth = createBox(0.016, 0.006, 0.004, mouthMat);
  mouth.position.set(0, 0.038, 0.043);
  mouth.name = 'mouth';
  headGroup.add(mouth);

  const teeth = createBox(0.012, 0.003, 0.005, teethMat);
  teeth.position.set(0, 0.04, 0.043);
  teeth.name = 'teeth';
  headGroup.add(teeth);

  // Cheeks blush
  const leftBlush = createSphere(0.007, blushMat, 1.2, 0.7, 0.4, 10);
  leftBlush.position.set(0.028, 0.048, 0.036);
  headGroup.add(leftBlush);

  const rightBlush = createSphere(0.007, blushMat, 1.2, 0.7, 0.4, 10);
  rightBlush.position.set(-0.028, 0.048, 0.036);
  headGroup.add(rightBlush);

  // Gold Earring
  const earring = createTorus(0.006, 0.002, 12, 24, goldMat);
  earring.position.set(0.044, 0.052, 0);
  earring.rotation.y = Math.PI / 2;
  earring.name = 'earring';
  headGroup.add(earring);

  // Hair Bob
  const hair = createSphere(0.046, hairMat, 1.08, 1.15, 1.08, 24);
  hair.position.set(0, 0.062, -0.006);
  hair.name = 'hair';
  headGroup.add(hair);

  const hairBangs = createSphere(0.034, hairMat, 1.1, 0.7, 0.8, 16);
  hairBangs.position.set(0.012, 0.076, 0.028);
  hairBangs.rotation.z = -0.25;
  hairBangs.name = 'hairBangs';
  headGroup.add(hairBangs);

  // Arms (Rolled up jacket sleeve + bare forearm)
  function createArm(isLeft) {
    const side = isLeft ? 1 : -1;
    const shoulder = new THREE.Group();
    shoulder.name = isLeft ? 'leftArm' : 'rightArm';
    shoulder.position.set(side * 0.062, 0.095, 0);
    torso.add(shoulder);

    // Shoulder cap (Brown jacket)
    const cap = createSphere(0.019, jacketMat, 1, 1, 1, 12);
    cap.name = isLeft ? 'leftShoulderCap' : 'rightShoulderCap';
    shoulder.add(cap);

    // Upper sleeve (Brown jacket)
    const upperArm = createCylinder(0.016, 0.014, 0.065, 16, jacketMat);
    upperArm.position.y = -0.035;
    shoulder.add(upperArm);

    // Rolled cuff
    const cuff = createTorus(0.016, 0.0045, 12, 20, cuffMat);
    cuff.rotation.x = Math.PI / 2;
    cuff.position.y = -0.068;
    cuff.name = isLeft ? 'leftCuff' : 'rightCuff';
    shoulder.add(cuff);

    // Forearm Group (Articulated at elbow)
    const forearm = new THREE.Group();
    forearm.name = isLeft ? 'leftForearm' : 'rightForearm';
    forearm.position.set(0, -0.07, 0);
    shoulder.add(forearm);

    // Bare caramel skin forearm
    const forearmSkin = createCylinder(0.012, 0.010, 0.065, 16, skinMat);
    forearmSkin.position.y = -0.032;
    forearm.add(forearmSkin);

    // Hand
    const hand = createSphere(0.011, skinMat, 0.9, 1.2, 0.8, 12);
    hand.position.y = -0.068;
    forearm.add(hand);

    return { shoulder, forearm };
  }

  const leftArm = createArm(true);
  const rightArm = createArm(false);

  // Legs (Jeans + rolled cuffs + white socks + dark sneakers)
  function createLeg(isLeft) {
    const side = isLeft ? 1 : -1;
    const hip = new THREE.Group();
    hip.name = isLeft ? 'leftLegHip' : 'rightLegHip';
    hip.position.set(side * 0.028, -0.015, 0);
    hips.add(hip);

    // Thigh (Blue jeans)
    const thigh = createCylinder(0.021, 0.018, 0.11, 16, jeansMat);
    thigh.position.y = -0.055;
    hip.add(thigh);

    // Knee Group
    const knee = new THREE.Group();
    knee.name = isLeft ? 'leftLegKnee' : 'rightLegKnee';
    knee.position.set(0, -0.11, 0);
    hip.add(knee);

    // Calf (Blue jeans)
    const calf = createCylinder(0.018, 0.015, 0.10, 16, jeansMat);
    calf.position.y = -0.05;
    knee.add(calf);

    // Rolled Jean Cuff
    const jeanCuff = createCylinder(0.0195, 0.0195, 0.018, 16, jeanCuffMat);
    jeanCuff.position.y = -0.095;
    knee.add(jeanCuff);

    // White Sock
    const sock = createCylinder(0.014, 0.0135, 0.016, 14, sockMat);
    sock.position.y = -0.108;
    knee.add(sock);

    // Sneaker Body
    const shoe = createBox(0.026, 0.022, 0.058, shoeMat);
    shoe.position.set(0, -0.12, 0.012);
    knee.add(shoe);

    // White Sole
    const sole = createBox(0.028, 0.006, 0.062, soleMat);
    sole.position.set(0, -0.132, 0.012);
    knee.add(sole);

    // White Lace bar
    const lace = createBox(0.016, 0.003, 0.016, laceMat);
    lace.position.set(0, -0.108, 0.014);
    knee.add(lace);

    return { hip, knee };
  }

  const leftLeg = createLeg(true);
  const rightLeg = createLeg(false);

  // ==========================================
  // ANIMATION CLIPS (Proper 60fps timecodes)
  // ==========================================

  // 1. STILL CLIP (1.0s static hold)
  const stillTimes = [0, 1.0];
  const stillHipsPos = [0, 0.22, 0, 0, 0.22, 0];
  const stillHipsQuat = [...quatFromEuler(0, 0, 0), ...quatFromEuler(0, 0, 0)];
  const stillLeftArm = [...quatFromEuler(0.08, 0, 0.12), ...quatFromEuler(0.08, 0, 0.12)];
  const stillRightArm = [...quatFromEuler(0.08, 0, -0.12), ...quatFromEuler(0.08, 0, -0.12)];
  const stillLeftLeg = [...quatFromEuler(0, 0, 0.01), ...quatFromEuler(0, 0, 0.01)];
  const stillRightLeg = [...quatFromEuler(0, 0, -0.01), ...quatFromEuler(0, 0, -0.01)];

  const stillClip = new THREE.AnimationClip('Still', 1.0, [
    new THREE.VectorKeyframeTrack('hips.position', stillTimes, stillHipsPos),
    new THREE.QuaternionKeyframeTrack('hips.quaternion', stillTimes, stillHipsQuat),
    new THREE.QuaternionKeyframeTrack('leftArm.quaternion', stillTimes, stillLeftArm),
    new THREE.QuaternionKeyframeTrack('rightArm.quaternion', stillTimes, stillRightArm),
    new THREE.QuaternionKeyframeTrack('leftLegHip.quaternion', stillTimes, stillLeftLeg),
    new THREE.QuaternionKeyframeTrack('rightLegHip.quaternion', stillTimes, stillRightLeg)
  ]);

  // 2. RUN CLIP (0.8s athletic run cycle matching reference image)
  const runTimes = [0, 0.2, 0.4, 0.6, 0.8];
  const runHipsPos = [
    0, 0.22, 0,
    0, 0.205, 0,
    0, 0.22, 0,
    0, 0.205, 0,
    0, 0.22, 0
  ];
  const runLeftArm = [
    ...quatFromEuler(-0.95, 0, 0.3),
    ...quatFromEuler(-0.05, 0, 0.2),
    ...quatFromEuler(0.75, 0, 0.15),
    ...quatFromEuler(-0.05, 0, 0.2),
    ...quatFromEuler(-0.95, 0, 0.3)
  ];
  const runLeftForearm = [
    ...quatFromEuler(-0.85, 0, 0),
    ...quatFromEuler(-0.55, 0, 0),
    ...quatFromEuler(-0.35, 0, 0),
    ...quatFromEuler(-0.6, 0, 0),
    ...quatFromEuler(-0.85, 0, 0)
  ];
  const runRightArm = [
    ...quatFromEuler(0.75, 0, -0.15),
    ...quatFromEuler(-0.05, 0, -0.2),
    ...quatFromEuler(-0.95, 0, -0.3),
    ...quatFromEuler(-0.05, 0, -0.2),
    ...quatFromEuler(0.75, 0, -0.15)
  ];
  const runRightForearm = [
    ...quatFromEuler(-0.35, 0, 0),
    ...quatFromEuler(-0.6, 0, 0),
    ...quatFromEuler(-0.85, 0, 0),
    ...quatFromEuler(-0.55, 0, 0),
    ...quatFromEuler(-0.35, 0, 0)
  ];

  const runLeftLegHip = [
    ...quatFromEuler(-0.65, 0, -0.04),
    ...quatFromEuler(-0.1, 0, -0.02),
    ...quatFromEuler(0.75, 0, 0.04),
    ...quatFromEuler(0.18, 0, 0.02),
    ...quatFromEuler(-0.65, 0, -0.04)
  ];
  const runLeftLegKnee = [
    ...quatFromEuler(1.1, 0, 0),
    ...quatFromEuler(0.4, 0, 0),
    ...quatFromEuler(0.2, 0, 0),
    ...quatFromEuler(0.7, 0, 0),
    ...quatFromEuler(1.1, 0, 0)
  ];

  const runRightLegHip = [
    ...quatFromEuler(0.75, 0, 0.04),
    ...quatFromEuler(0.18, 0, 0.02),
    ...quatFromEuler(-0.65, 0, -0.04),
    ...quatFromEuler(-0.1, 0, -0.02),
    ...quatFromEuler(0.75, 0, 0.04)
  ];
  const runRightLegKnee = [
    ...quatFromEuler(0.2, 0, 0),
    ...quatFromEuler(0.7, 0, 0),
    ...quatFromEuler(1.1, 0, 0),
    ...quatFromEuler(0.4, 0, 0),
    ...quatFromEuler(0.2, 0, 0)
  ];

  const runClip = new THREE.AnimationClip('Run', 0.8, [
    new THREE.VectorKeyframeTrack('hips.position', runTimes, runHipsPos),
    new THREE.QuaternionKeyframeTrack('leftArm.quaternion', runTimes, runLeftArm),
    new THREE.QuaternionKeyframeTrack('leftForearm.quaternion', runTimes, runLeftForearm),
    new THREE.QuaternionKeyframeTrack('rightArm.quaternion', runTimes, runRightArm),
    new THREE.QuaternionKeyframeTrack('rightForearm.quaternion', runTimes, runRightForearm),
    new THREE.QuaternionKeyframeTrack('leftLegHip.quaternion', runTimes, runLeftLegHip),
    new THREE.QuaternionKeyframeTrack('leftLegKnee.quaternion', runTimes, runLeftLegKnee),
    new THREE.QuaternionKeyframeTrack('rightLegHip.quaternion', runTimes, runRightLegHip),
    new THREE.QuaternionKeyframeTrack('rightLegKnee.quaternion', runTimes, runRightLegKnee)
  ]);

  // 3. WALK CLIP (1.2s fluid walk cycle)
  const walkTimes = [0, 0.3, 0.6, 0.9, 1.2];
  const walkHipsPos = [0, 0.22, 0, 0, 0.213, 0, 0, 0.22, 0, 0, 0.213, 0, 0, 0.22, 0];
  const walkLeftArm = [
    ...quatFromEuler(-0.45, 0, 0.15),
    ...quatFromEuler(0.02, 0, 0.12),
    ...quatFromEuler(0.42, 0, 0.1),
    ...quatFromEuler(0.02, 0, 0.12),
    ...quatFromEuler(-0.45, 0, 0.15)
  ];
  const walkRightArm = [
    ...quatFromEuler(0.42, 0, -0.1),
    ...quatFromEuler(0.02, 0, -0.12),
    ...quatFromEuler(-0.45, 0, -0.15),
    ...quatFromEuler(0.02, 0, -0.12),
    ...quatFromEuler(0.42, 0, -0.1)
  ];
  const walkLeftLeg = [
    ...quatFromEuler(-0.38, 0, -0.02),
    ...quatFromEuler(0, 0, 0),
    ...quatFromEuler(0.45, 0, 0.02),
    ...quatFromEuler(0.12, 0, 0.01),
    ...quatFromEuler(-0.38, 0, -0.02)
  ];
  const walkRightLeg = [
    ...quatFromEuler(0.45, 0, 0.02),
    ...quatFromEuler(0.12, 0, 0.01),
    ...quatFromEuler(-0.38, 0, -0.02),
    ...quatFromEuler(0, 0, 0),
    ...quatFromEuler(0.45, 0, 0.02)
  ];

  const walkClip = new THREE.AnimationClip('Walk', 1.2, [
    new THREE.VectorKeyframeTrack('hips.position', walkTimes, walkHipsPos),
    new THREE.QuaternionKeyframeTrack('leftArm.quaternion', walkTimes, walkLeftArm),
    new THREE.QuaternionKeyframeTrack('rightArm.quaternion', walkTimes, walkRightArm),
    new THREE.QuaternionKeyframeTrack('leftLegHip.quaternion', walkTimes, walkLeftLeg),
    new THREE.QuaternionKeyframeTrack('rightLegHip.quaternion', walkTimes, walkRightLeg)
  ]);

  // 4. WAVE CLIP (2.0s cheerful wave)
  const waveTimes = [0, 0.35, 0.65, 0.95, 1.25, 1.55, 1.85, 2.0];
  const waveRightArm = [
    ...quatFromEuler(0.05, 0, -0.1),
    ...quatFromEuler(-1.25, 0, -0.45),
    ...quatFromEuler(-1.3, 0, -0.45),
    ...quatFromEuler(-1.25, 0, -0.45),
    ...quatFromEuler(-1.3, 0, -0.45),
    ...quatFromEuler(-1.25, 0, -0.45),
    ...quatFromEuler(-0.6, 0, -0.25),
    ...quatFromEuler(0.05, 0, -0.1)
  ];
  const waveRightForearm = [
    ...quatFromEuler(-0.15, 0, 0),
    ...quatFromEuler(-0.85, 0.35, -0.45),
    ...quatFromEuler(-0.85, 0.35, 0.4),
    ...quatFromEuler(-0.85, 0.35, -0.45),
    ...quatFromEuler(-0.85, 0.35, 0.4),
    ...quatFromEuler(-0.85, 0.35, -0.45),
    ...quatFromEuler(-0.4, 0.1, -0.1),
    ...quatFromEuler(-0.15, 0, 0)
  ];
  const waveHead = [
    ...quatFromEuler(0, 0, 0),
    ...quatFromEuler(-0.05, -0.08, -0.12),
    ...quatFromEuler(-0.02, -0.08, -0.09),
    ...quatFromEuler(-0.05, -0.08, -0.12),
    ...quatFromEuler(-0.02, -0.08, -0.09),
    ...quatFromEuler(-0.05, -0.08, -0.12),
    ...quatFromEuler(-0.02, -0.04, -0.05),
    ...quatFromEuler(0, 0, 0)
  ];

  const waveClip = new THREE.AnimationClip('Wave', 2.0, [
    new THREE.QuaternionKeyframeTrack('rightArm.quaternion', waveTimes, waveRightArm),
    new THREE.QuaternionKeyframeTrack('rightForearm.quaternion', waveTimes, waveRightForearm),
    new THREE.QuaternionKeyframeTrack('headGroup.quaternion', waveTimes, waveHead)
  ]);

  root.updateMatrixWorld(true);

  return {
    root,
    clips: [runClip, walkClip, waveClip, stillClip],
    runClip,
    walkClip,
    waveClip,
    stillClip
  };
}

async function exportAll() {
  const gltfExporter = new GLTFExporter();
  const usdzExporter = new USDZExporter();

  console.log('Building clean optimized stylized character...');
  const char = buildModel();
  char.root.updateMatrixWorld(true);

  // 1. Export master GLB
  console.log('Exporting character.glb...');
  const masterGlb = await gltfExporter.parseAsync(char.root, { binary: true, animations: char.clips });
  fs.writeFileSync(path.join(outDir, 'character.glb'), Buffer.from(masterGlb));
  console.log('Saved character.glb:', masterGlb.byteLength, 'bytes');

  // 2. Export USDZ files (Always pass animations for proper timecodes in Quick Look!)
  console.log('Exporting character_still.usdz...');
  const stillUsdz = await usdzExporter.parseAsync(char.root, { quickLookCompatible: true, animations: [char.stillClip] });
  fs.writeFileSync(path.join(outDir, 'character_still.usdz'), Buffer.from(stillUsdz));
  console.log('Saved character_still.usdz:', stillUsdz.byteLength, 'bytes');

  console.log('Exporting character_run.usdz...');
  const runUsdz = await usdzExporter.parseAsync(char.root, { quickLookCompatible: true, animations: [char.runClip] });
  fs.writeFileSync(path.join(outDir, 'character_run.usdz'), Buffer.from(runUsdz));
  console.log('Saved character_run.usdz:', runUsdz.byteLength, 'bytes');

  console.log('Exporting character_walk.usdz...');
  const walkUsdz = await usdzExporter.parseAsync(char.root, { quickLookCompatible: true, animations: [char.walkClip] });
  fs.writeFileSync(path.join(outDir, 'character_walk.usdz'), Buffer.from(walkUsdz));
  console.log('Saved character_walk.usdz:', walkUsdz.byteLength, 'bytes');

  console.log('Exporting character_wave.usdz...');
  const waveUsdz = await usdzExporter.parseAsync(char.root, { quickLookCompatible: true, animations: [char.waveClip] });
  fs.writeFileSync(path.join(outDir, 'character_wave.usdz'), Buffer.from(waveUsdz));
  console.log('Saved character_wave.usdz:', waveUsdz.byteLength, 'bytes');

  // Default character.usdz is still mode
  fs.writeFileSync(path.join(outDir, 'character.usdz'), Buffer.from(stillUsdz));
  console.log('Saved default character.usdz (still mode)');

  console.log('All models exported successfully!');
}

exportAll().catch(err => {
  console.error('Fatal export error:', err);
  process.exit(1);
});
