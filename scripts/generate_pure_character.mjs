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

function createSphere(r, mat, sx = 1, sy = 1, sz = 1, segs = 24) {
  const geom = new THREE.SphereGeometry(r, segs, Math.round(segs * 0.8));
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

function buildCharacter() {
  const root = new THREE.Group();
  root.name = 'root';

  // 1. Materials matching the reference character image
  const skinMat = new THREE.MeshStandardMaterial({
    color: 0xd19875,
    roughness: 0.55,
    metalness: 0.02
  });

  const hairMat = new THREE.MeshStandardMaterial({
    color: 0x242023,
    roughness: 0.38,
    metalness: 0.08
  });

  const jacketMat = new THREE.MeshStandardMaterial({
    color: 0x7c4e39,
    roughness: 0.48,
    metalness: 0.04
  });

  const cuffMat = new THREE.MeshStandardMaterial({
    color: 0x673e2b,
    roughness: 0.52,
    metalness: 0.04
  });

  const shirtMat = new THREE.MeshStandardMaterial({
    color: 0xf4bf35,
    roughness: 0.62,
    metalness: 0.02
  });

  const jeansMat = new THREE.MeshStandardMaterial({
    color: 0x5b82a7,
    roughness: 0.72,
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
    color: 0xf5f6f8,
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

  const eyeHighlightMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.1,
    emissive: 0xffffff,
    emissiveIntensity: 0.25
  });

  const eyebrowMat = new THREE.MeshStandardMaterial({
    color: 0x1e1c1f,
    roughness: 0.5
  });

  const mouthInteriorMat = new THREE.MeshStandardMaterial({
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

  // Podium Base (Clean, elegant, minimal floating platform)
  const baseDisc = createCylinder(0.24, 0.25, 0.018, 48, new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    roughness: 0.35,
    metalness: 0.6
  }));
  baseDisc.position.y = 0.009;
  baseDisc.name = 'podiumBase';
  root.add(baseDisc);

  const neonRingGeom = new THREE.TorusGeometry(0.242, 0.004, 16, 64);
  neonRingGeom.rotateX(Math.PI / 2);
  const neonRing = new THREE.Mesh(neonRingGeom, new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    emissive: 0x0284c7,
    emissiveIntensity: 0.6,
    roughness: 0.2
  }));
  neonRing.position.y = 0.018;
  neonRing.name = 'podiumNeonRing';
  root.add(neonRing);

  // Character hierarchy
  const character = new THREE.Group();
  character.name = 'character';
  root.add(character);

  // Hips / Pelvis root (Standing height y ~ 0.355 above platform)
  const hips = new THREE.Group();
  hips.name = 'hips';
  hips.position.set(0, 0.355, 0);
  character.add(hips);

  // Pelvis mesh (Blue jeans waist)
  const pelvisGeom = new THREE.CylinderGeometry(0.046, 0.043, 0.048, 24);
  const pelvis = new THREE.Mesh(pelvisGeom, jeansMat);
  pelvis.name = 'pelvis';
  hips.add(pelvis);

  // Belt & Silver Buckle
  const beltGeom = new THREE.CylinderGeometry(0.047, 0.047, 0.013, 24);
  const belt = new THREE.Mesh(beltGeom, beltMat);
  belt.position.y = 0.021;
  belt.name = 'belt';
  hips.add(belt);

  // Buckle (Outer metallic frame + pin)
  const buckleGroup = new THREE.Group();
  buckleGroup.name = 'buckleGroup';
  buckleGroup.position.set(0, 0.021, 0.048);
  hips.add(buckleGroup);

  const buckleFrame = createBox(0.02, 0.014, 0.004, buckleMat);
  buckleFrame.name = 'buckleFrame';
  buckleGroup.add(buckleFrame);

  const buckleInner = createBox(0.012, 0.008, 0.005, beltMat);
  buckleGroup.add(buckleInner);

  const bucklePin = createBox(0.003, 0.01, 0.006, buckleMat);
  buckleGroup.add(bucklePin);

  // Torso (Yellow top + Brown jacket)
  const torso = new THREE.Group();
  torso.name = 'torso';
  torso.position.set(0, 0.025, 0);
  hips.add(torso);

  // Yellow Top (Tucked in, curves gently upwards)
  const shirtGeom = new THREE.CylinderGeometry(0.052, 0.044, 0.125, 24);
  const shirt = new THREE.Mesh(shirtGeom, shirtMat);
  shirt.position.y = 0.062;
  shirt.name = 'yellowTop';
  torso.add(shirt);

  // Yellow Crewneck collar
  const collarTorus = createTorus(0.023, 0.004, 12, 24, shirtMat);
  collarTorus.rotation.x = Math.PI / 2;
  collarTorus.position.set(0, 0.126, 0);
  collarTorus.name = 'shirtCollar';
  torso.add(collarTorus);

  // Brown Jacket (Open in front, wraps back and sides)
  const jacketGroup = new THREE.Group();
  jacketGroup.name = 'jacket';
  torso.add(jacketGroup);

  // Back panel of jacket
  const jacketBack = createCylinder(0.056, 0.048, 0.12, 20, jacketMat);
  jacketBack.position.set(0, 0.062, -0.01);
  jacketBack.scale.set(1.02, 1, 0.95);
  jacketGroup.add(jacketBack);

  // Left Jacket Lapel (Open flap on side)
  const leftLapel = createBox(0.028, 0.115, 0.016, jacketMat);
  leftLapel.position.set(0.038, 0.062, 0.036);
  leftLapel.rotation.y = -0.35;
  jacketGroup.add(leftLapel);

  // Right Jacket Lapel (Open flap on side)
  const rightLapel = createBox(0.028, 0.115, 0.016, jacketMat);
  rightLapel.position.set(-0.038, 0.062, 0.036);
  rightLapel.rotation.y = 0.35;
  jacketGroup.add(rightLapel);

  // Jacket Collar Fold
  const leftCollarFold = createBox(0.022, 0.045, 0.012, jacketMat);
  leftCollarFold.position.set(0.034, 0.112, 0.03);
  leftCollarFold.rotation.z = -0.3;
  jacketGroup.add(leftCollarFold);

  const rightCollarFold = createBox(0.022, 0.045, 0.012, jacketMat);
  rightCollarFold.position.set(-0.034, 0.112, 0.03);
  rightCollarFold.rotation.z = 0.3;
  jacketGroup.add(rightCollarFold);

  // Side pockets on jacket
  const leftPocket = createBox(0.018, 0.016, 0.006, cuffMat);
  leftPocket.position.set(0.048, 0.024, 0.025);
  jacketGroup.add(leftPocket);

  const rightPocket = createBox(0.018, 0.016, 0.006, cuffMat);
  rightPocket.position.set(-0.048, 0.024, 0.025);
  jacketGroup.add(rightPocket);

  // Head and Neck Group
  const headGroup = new THREE.Group();
  headGroup.name = 'headGroup';
  headGroup.position.set(0, 0.126, 0);
  torso.add(headGroup);

  // Slender Neck (Caramel skin)
  const neck = createCylinder(0.017, 0.019, 0.03, 16, skinMat);
  neck.position.y = 0.015;
  neck.name = 'neck';
  headGroup.add(neck);

  // Stylized Face & Skull
  const skull = createSphere(0.048, skinMat, 1.0, 1.15, 1.04, 32);
  skull.position.set(0, 0.062, 0.004);
  skull.name = 'skull';
  headGroup.add(skull);

  // Soft Chin definition
  const chin = createSphere(0.022, skinMat, 1.0, 0.9, 1.05, 16);
  chin.position.set(0, 0.024, 0.024);
  chin.name = 'chin';
  headGroup.add(chin);

  // Eyes (Glossy dark stylized cartoon eyes)
  function createEye(isLeft) {
    const side = isLeft ? 1 : -1;
    const eyeGroup = new THREE.Group();
    eyeGroup.name = isLeft ? 'leftEye' : 'rightEye';
    eyeGroup.position.set(side * 0.021, 0.068, 0.045);

    // Eye pupil/cornea
    const pupil = createSphere(0.0082, eyeMat, 0.85, 1.15, 0.5, 16);
    pupil.name = 'pupil';
    eyeGroup.add(pupil);

    // Catchlight highlight
    const glint = createSphere(0.0028, eyeHighlightMat, 1, 1, 1, 8);
    glint.position.set(side * 0.002, 0.003, 0.004);
    eyeGroup.add(glint);

    // Eyebrow
    const brow = createBox(0.018, 0.004, 0.004, eyebrowMat);
    brow.position.set(0, 0.016, 0.002);
    brow.rotation.z = side * -0.15;
    brow.name = 'eyebrow';
    eyeGroup.add(brow);

    return eyeGroup;
  }

  headGroup.add(createEye(true));
  headGroup.add(createEye(false));

  // Cute Button Nose
  const nose = createSphere(0.006, skinMat, 1.1, 0.9, 1.2, 12);
  nose.position.set(0, 0.058, 0.051);
  nose.name = 'nose';
  headGroup.add(nose);

  // Cheerful Smiling Open Mouth
  const mouthGroup = new THREE.Group();
  mouthGroup.name = 'mouth';
  mouthGroup.position.set(0, 0.042, 0.046);
  headGroup.add(mouthGroup);

  const mouthCavity = createSphere(0.009, mouthInteriorMat, 1.3, 0.75, 0.5, 12);
  mouthGroup.add(mouthCavity);

  const teeth = createBox(0.013, 0.0035, 0.003, teethMat);
  teeth.position.set(0, 0.003, 0.003);
  mouthGroup.add(teeth);

  // Rosy Cheek Blush
  const leftBlush = createSphere(0.009, blushMat, 1.3, 0.8, 0.4, 12);
  leftBlush.position.set(0.033, 0.054, 0.037);
  headGroup.add(leftBlush);

  const rightBlush = createSphere(0.009, blushMat, 1.3, 0.8, 0.4, 12);
  rightBlush.position.set(-0.033, 0.054, 0.037);
  headGroup.add(rightBlush);

  // Stylized Ears with Gold Earring
  function createEar(isLeft) {
    const side = isLeft ? 1 : -1;
    const earGroup = new THREE.Group();
    earGroup.name = isLeft ? 'leftEar' : 'rightEar';
    earGroup.position.set(side * 0.049, 0.062, 0.004);

    const earLobule = createSphere(0.012, skinMat, 0.6, 1.2, 0.8, 12);
    earGroup.add(earLobule);

    // Gold earring hoop on ear (visible in image)
    const earring = createTorus(0.007, 0.0022, 12, 24, goldMat);
    earring.position.set(side * 0.003, -0.008, 0);
    earring.rotation.y = Math.PI / 2;
    earring.name = 'goldEarring';
    earGroup.add(earring);

    return earGroup;
  }

  headGroup.add(createEar(true));
  headGroup.add(createEar(false));

  // Hair (Dark brown/black stylized bob with side bangs & curled back roll)
  const hairGroup = new THREE.Group();
  hairGroup.name = 'hairGroup';
  hairGroup.position.set(0, 0.062, 0.002);
  headGroup.add(hairGroup);

  // Main hair crown volume
  const hairCrown = createSphere(0.053, hairMat, 1.05, 1.16, 1.08, 32);
  hairCrown.position.set(0, 0.012, -0.008);
  hairCrown.name = 'hairCrown';
  hairGroup.add(hairCrown);

  // Back bob roll (curving gently under the back of skull)
  const hairBackRoll = createSphere(0.046, hairMat, 1.15, 0.85, 1.1, 24);
  hairBackRoll.position.set(0, -0.022, -0.034);
  hairBackRoll.name = 'hairBackRoll';
  hairGroup.add(hairBackRoll);

  // Left hair lobe (framing left jaw)
  const hairLeftLobe = createSphere(0.034, hairMat, 0.9, 1.35, 1.1, 20);
  hairLeftLobe.position.set(0.044, -0.01, -0.008);
  hairGroup.add(hairLeftLobe);

  // Right hair lobe (framing right jaw)
  const hairRightLobe = createSphere(0.034, hairMat, 0.9, 1.35, 1.1, 20);
  hairRightLobe.position.set(-0.044, -0.01, -0.008);
  hairGroup.add(hairRightLobe);

  // Front Bangs (Side parted sweep across forehead)
  const frontBangsSweep = createSphere(0.042, hairMat, 1.1, 0.7, 0.9, 20);
  frontBangsSweep.position.set(0.014, 0.038, 0.032);
  frontBangsSweep.rotation.z = -0.25;
  hairGroup.add(frontBangsSweep);

  const sideLock = createSphere(0.024, hairMat, 0.8, 1.2, 0.9, 16);
  sideLock.position.set(-0.038, 0.022, 0.028);
  sideLock.rotation.z = 0.3;
  hairGroup.add(sideLock);

  // Arms (Rolled up jacket sleeve + caramel skin forearm + hand)
  function createArm(isLeft) {
    const side = isLeft ? 1 : -1;
    const shoulder = new THREE.Group();
    shoulder.name = isLeft ? 'leftShoulder' : 'rightShoulder';
    shoulder.position.set(side * 0.076, 0.118, 0);
    torso.add(shoulder);

    // Shoulder cap (Brown jacket)
    const shoulderCap = createSphere(0.022, jacketMat, 1, 1, 1, 16);
    shoulder.add(shoulderCap);

    // Upper arm (Brown jacket sleeve)
    const upperArm = createCylinder(0.019, 0.017, 0.08, 16, jacketMat);
    upperArm.position.y = -0.042;
    shoulder.add(upperArm);

    // Rolled up sleeve cuff ring (Distinct dark brown rolled cuff)
    const cuff = createTorus(0.0195, 0.005, 12, 24, cuffMat);
    cuff.rotation.x = Math.PI / 2;
    cuff.position.y = -0.082;
    cuff.name = isLeft ? 'leftCuff' : 'rightCuff';
    shoulder.add(cuff);

    // Forearm Group (Articulated at elbow)
    const forearm = new THREE.Group();
    forearm.name = isLeft ? 'leftForearm' : 'rightForearm';
    forearm.position.set(0, -0.085, 0);
    shoulder.add(forearm);

    // Bare caramel skin forearm (as shown in reference image!)
    const forearmSkin = createCylinder(0.015, 0.0125, 0.082, 16, skinMat);
    forearmSkin.position.y = -0.041;
    forearm.add(forearmSkin);

    // Hand Group (Caramel skin stylized cartoon hand)
    const hand = new THREE.Group();
    hand.name = isLeft ? 'leftHand' : 'rightHand';
    hand.position.set(0, -0.085, 0);
    forearm.add(hand);

    const palm = createSphere(0.013, skinMat, 1.0, 1.25, 0.7, 16);
    palm.position.y = -0.01;
    hand.add(palm);

    const thumb = createSphere(0.006, skinMat, 0.8, 1.4, 0.8, 10);
    thumb.position.set(side * 0.01, -0.008, 0.006);
    thumb.rotation.z = side * -0.4;
    hand.add(thumb);

    return { shoulder, forearm, hand };
  }

  const leftArm = createArm(true);
  const rightArm = createArm(false);

  // Legs (High-waisted jeans + rolled cuffs + white socks + dark sneakers)
  function createLeg(isLeft) {
    const side = isLeft ? 1 : -1;
    const hip = new THREE.Group();
    hip.name = isLeft ? 'leftLegHip' : 'rightLegHip';
    hip.position.set(side * 0.034, -0.016, 0);
    hips.add(hip);

    // Thigh (Blue jeans)
    const thigh = createCylinder(0.025, 0.021, 0.15, 18, jeansMat);
    thigh.position.y = -0.075;
    hip.add(thigh);

    // Knee Group (Articulated)
    const knee = new THREE.Group();
    knee.name = isLeft ? 'leftLegKnee' : 'rightLegKnee';
    knee.position.set(0, -0.15, 0);
    hip.add(knee);

    // Calf / Lower Leg (Blue jeans)
    const calf = createCylinder(0.021, 0.0185, 0.14, 18, jeansMat);
    calf.position.y = -0.07;
    knee.add(calf);

    // Rolled Jeans Cuff at bottom of leg (Lighter blue folded hem)
    const cuffGeom = new THREE.CylinderGeometry(0.0225, 0.0225, 0.024, 18);
    const jeanCuff = new THREE.Mesh(cuffGeom, jeanCuffMat);
    jeanCuff.position.y = -0.138;
    jeanCuff.name = isLeft ? 'leftJeanCuff' : 'rightJeanCuff';
    knee.add(jeanCuff);

    // Ankle Group
    const ankle = new THREE.Group();
    ankle.name = isLeft ? 'leftAnkle' : 'rightAnkle';
    ankle.position.set(0, -0.15, 0);
    knee.add(ankle);

    // White Sock (peeking between cuff and shoe)
    const sock = createCylinder(0.0165, 0.016, 0.022, 16, sockMat);
    sock.position.y = -0.011;
    ankle.add(sock);

    // Sneaker / Shoe Group
    const shoeGroup = new THREE.Group();
    shoeGroup.name = isLeft ? 'leftShoe' : 'rightShoe';
    shoeGroup.position.set(0, -0.022, 0.01);
    ankle.add(shoeGroup);

    // Main dark sneaker body
    const shoeBody = createSphere(0.021, shoeMat, 0.95, 0.75, 1.6, 16);
    shoeBody.position.set(0, -0.005, 0.008);
    shoeGroup.add(shoeBody);

    // White rubber sole rim
    const soleGeom = new THREE.BoxGeometry(0.038, 0.008, 0.076);
    const sole = new THREE.Mesh(soleGeom, soleMat);
    sole.position.set(0, -0.018, 0.008);
    shoeGroup.add(sole);

    // White laces across tongue
    for (let laceIdx = 0; laceIdx < 3; laceIdx++) {
      const lace = createBox(0.018, 0.003, 0.004, laceMat);
      lace.position.set(0, 0.008 - laceIdx * 0.005, 0.012 - laceIdx * 0.008);
      shoeGroup.add(lace);
    }

    return { hip, knee, ankle };
  }

  const leftLeg = createLeg(true);
  const rightLeg = createLeg(false);

  // ==========================================
  // ANIMATION CLIPS: Run, Walk, Wave, Idle
  // ==========================================

  // --- 1. RUN CLIP (0.8s Loop) ---
  // Perfectly captures the dynamic, athletic running stride from the reference photo!
  const runTimes = [0, 0.2, 0.4, 0.6, 0.8];

  // Hips bounce & slight twist
  const runHipsPos = [
    0, 0.355, 0,
    0, 0.338, 0,
    0, 0.355, 0,
    0, 0.338, 0,
    0, 0.355, 0
  ];
  const runHipsQuats = [
    ...quatFromEuler(0.04, -0.1, 0.02),
    ...quatFromEuler(0.02, 0, 0),
    ...quatFromEuler(0.04, 0.1, -0.02),
    ...quatFromEuler(0.02, 0, 0),
    ...quatFromEuler(0.04, -0.1, 0.02)
  ];

  // Torso forward lean & counter-twist
  const runTorsoQuats = [
    ...quatFromEuler(0.18, 0.12, 0),
    ...quatFromEuler(0.15, 0, 0),
    ...quatFromEuler(0.18, -0.12, 0),
    ...quatFromEuler(0.15, 0, 0),
    ...quatFromEuler(0.18, 0.12, 0)
  ];

  // Head stabilizes forward
  const runHeadQuats = [
    ...quatFromEuler(-0.06, -0.05, 0),
    ...quatFromEuler(-0.04, 0, 0),
    ...quatFromEuler(-0.06, 0.05, 0),
    ...quatFromEuler(-0.04, 0, 0),
    ...quatFromEuler(-0.06, -0.05, 0)
  ];

  // Arms: Left arm forward (X: -0.9), Right arm back (X: +0.7) at t=0
  const runLeftShoulderQuats = [
    ...quatFromEuler(-0.95, 0, 0.35),
    ...quatFromEuler(-0.1, 0, 0.25),
    ...quatFromEuler(0.75, 0, 0.2),
    ...quatFromEuler(-0.1, 0, 0.25),
    ...quatFromEuler(-0.95, 0, 0.35)
  ];
  const runLeftForearmQuats = [
    ...quatFromEuler(-0.85, 0, 0),
    ...quatFromEuler(-0.55, 0, 0),
    ...quatFromEuler(-0.35, 0, 0),
    ...quatFromEuler(-0.65, 0, 0),
    ...quatFromEuler(-0.85, 0, 0)
  ];

  const runRightShoulderQuats = [
    ...quatFromEuler(0.75, 0, -0.2),
    ...quatFromEuler(-0.1, 0, -0.25),
    ...quatFromEuler(-0.95, 0, -0.35),
    ...quatFromEuler(-0.1, 0, -0.25),
    ...quatFromEuler(0.75, 0, -0.2)
  ];
  const runRightForearmQuats = [
    ...quatFromEuler(-0.35, 0, 0),
    ...quatFromEuler(-0.65, 0, 0),
    ...quatFromEuler(-0.85, 0, 0),
    ...quatFromEuler(-0.55, 0, 0),
    ...quatFromEuler(-0.35, 0, 0)
  ];

  // Legs: Right leg swinging forward (X: +0.75), Left leg trailing back (X: -0.65) at t=0
  const runLeftHipQuats = [
    ...quatFromEuler(-0.65, 0, -0.04),
    ...quatFromEuler(-0.15, 0, -0.02),
    ...quatFromEuler(0.75, 0, 0.04),
    ...quatFromEuler(0.2, 0, 0.02),
    ...quatFromEuler(-0.65, 0, -0.04)
  ];
  const runLeftKneeQuats = [
    ...quatFromEuler(1.15, 0, 0),
    ...quatFromEuler(0.45, 0, 0),
    ...quatFromEuler(0.25, 0, 0),
    ...quatFromEuler(0.75, 0, 0),
    ...quatFromEuler(1.15, 0, 0)
  ];
  const runLeftAnkleQuats = [
    ...quatFromEuler(0.25, 0, 0),
    ...quatFromEuler(0.05, 0, 0),
    ...quatFromEuler(-0.15, 0, 0),
    ...quatFromEuler(0.1, 0, 0),
    ...quatFromEuler(0.25, 0, 0)
  ];

  const runRightHipQuats = [
    ...quatFromEuler(0.75, 0, 0.04),
    ...quatFromEuler(0.2, 0, 0.02),
    ...quatFromEuler(-0.65, 0, -0.04),
    ...quatFromEuler(-0.15, 0, -0.02),
    ...quatFromEuler(0.75, 0, 0.04)
  ];
  const runRightKneeQuats = [
    ...quatFromEuler(0.25, 0, 0),
    ...quatFromEuler(0.75, 0, 0),
    ...quatFromEuler(1.15, 0, 0),
    ...quatFromEuler(0.45, 0, 0),
    ...quatFromEuler(0.25, 0, 0)
  ];
  const runRightAnkleQuats = [
    ...quatFromEuler(-0.15, 0, 0),
    ...quatFromEuler(0.1, 0, 0),
    ...quatFromEuler(0.25, 0, 0),
    ...quatFromEuler(0.05, 0, 0),
    ...quatFromEuler(-0.15, 0, 0)
  ];

  const runClip = new THREE.AnimationClip('Run', 0.8, [
    new THREE.VectorKeyframeTrack('hips.position', runTimes, runHipsPos),
    new THREE.QuaternionKeyframeTrack('hips.quaternion', runTimes, runHipsQuats),
    new THREE.QuaternionKeyframeTrack('torso.quaternion', runTimes, runTorsoQuats),
    new THREE.QuaternionKeyframeTrack('headGroup.quaternion', runTimes, runHeadQuats),
    new THREE.QuaternionKeyframeTrack('leftShoulder.quaternion', runTimes, runLeftShoulderQuats),
    new THREE.QuaternionKeyframeTrack('leftForearm.quaternion', runTimes, runLeftForearmQuats),
    new THREE.QuaternionKeyframeTrack('rightShoulder.quaternion', runTimes, runRightShoulderQuats),
    new THREE.QuaternionKeyframeTrack('rightForearm.quaternion', runTimes, runRightForearmQuats),
    new THREE.QuaternionKeyframeTrack('leftLegHip.quaternion', runTimes, runLeftHipQuats),
    new THREE.QuaternionKeyframeTrack('leftLegKnee.quaternion', runTimes, runLeftKneeQuats),
    new THREE.QuaternionKeyframeTrack('leftAnkle.quaternion', runTimes, runLeftAnkleQuats),
    new THREE.QuaternionKeyframeTrack('rightLegHip.quaternion', runTimes, runRightHipQuats),
    new THREE.QuaternionKeyframeTrack('rightLegKnee.quaternion', runTimes, runRightKneeQuats),
    new THREE.QuaternionKeyframeTrack('rightAnkle.quaternion', runTimes, runRightAnkleQuats)
  ]);

  // --- 2. WALK CLIP (1.2s Loop) ---
  const walkTimes = [0, 0.3, 0.6, 0.9, 1.2];
  const walkHipsPos = [
    0, 0.355, 0,
    0, 0.347, 0,
    0, 0.355, 0,
    0, 0.347, 0,
    0, 0.355, 0
  ];
  const walkHipsQuats = [
    ...quatFromEuler(0.02, -0.06, 0.02),
    ...quatFromEuler(0, 0, 0),
    ...quatFromEuler(0.02, 0.06, -0.02),
    ...quatFromEuler(0, 0, 0),
    ...quatFromEuler(0.02, -0.06, 0.02)
  ];
  const walkTorsoQuats = [
    ...quatFromEuler(0.06, 0.06, 0),
    ...quatFromEuler(0.05, 0, 0),
    ...quatFromEuler(0.06, -0.06, 0),
    ...quatFromEuler(0.05, 0, 0),
    ...quatFromEuler(0.06, 0.06, 0)
  ];
  const walkHeadQuats = [
    ...quatFromEuler(-0.02, -0.03, 0),
    ...quatFromEuler(-0.01, 0, 0),
    ...quatFromEuler(-0.02, 0.03, 0),
    ...quatFromEuler(-0.01, 0, 0),
    ...quatFromEuler(-0.02, -0.03, 0)
  ];

  const walkLeftShoulderQuats = [
    ...quatFromEuler(-0.45, 0, 0.15),
    ...quatFromEuler(0.02, 0, 0.12),
    ...quatFromEuler(0.42, 0, 0.1),
    ...quatFromEuler(0.02, 0, 0.12),
    ...quatFromEuler(-0.45, 0, 0.15)
  ];
  const walkLeftForearmQuats = [
    ...quatFromEuler(-0.35, 0, 0),
    ...quatFromEuler(-0.25, 0, 0),
    ...quatFromEuler(-0.15, 0, 0),
    ...quatFromEuler(-0.25, 0, 0),
    ...quatFromEuler(-0.35, 0, 0)
  ];

  const walkRightShoulderQuats = [
    ...quatFromEuler(0.42, 0, -0.1),
    ...quatFromEuler(0.02, 0, -0.12),
    ...quatFromEuler(-0.45, 0, -0.15),
    ...quatFromEuler(0.02, 0, -0.12),
    ...quatFromEuler(0.42, 0, -0.1)
  ];
  const walkRightForearmQuats = [
    ...quatFromEuler(-0.15, 0, 0),
    ...quatFromEuler(-0.25, 0, 0),
    ...quatFromEuler(-0.35, 0, 0),
    ...quatFromEuler(-0.25, 0, 0),
    ...quatFromEuler(-0.15, 0, 0)
  ];

  const walkLeftHipQuats = [
    ...quatFromEuler(-0.38, 0, -0.02),
    ...quatFromEuler(0, 0, 0),
    ...quatFromEuler(0.45, 0, 0.02),
    ...quatFromEuler(0.12, 0, 0.01),
    ...quatFromEuler(-0.38, 0, -0.02)
  ];
  const walkLeftKneeQuats = [
    ...quatFromEuler(0.55, 0, 0),
    ...quatFromEuler(0.2, 0, 0),
    ...quatFromEuler(0.08, 0, 0),
    ...quatFromEuler(0.45, 0, 0),
    ...quatFromEuler(0.55, 0, 0)
  ];
  const walkLeftAnkleQuats = [
    ...quatFromEuler(0.15, 0, 0),
    ...quatFromEuler(0, 0, 0),
    ...quatFromEuler(-0.1, 0, 0),
    ...quatFromEuler(0.05, 0, 0),
    ...quatFromEuler(0.15, 0, 0)
  ];

  const walkRightHipQuats = [
    ...quatFromEuler(0.45, 0, 0.02),
    ...quatFromEuler(0.12, 0, 0.01),
    ...quatFromEuler(-0.38, 0, -0.02),
    ...quatFromEuler(0, 0, 0),
    ...quatFromEuler(0.45, 0, 0.02)
  ];
  const walkRightKneeQuats = [
    ...quatFromEuler(0.08, 0, 0),
    ...quatFromEuler(0.45, 0, 0),
    ...quatFromEuler(0.55, 0, 0),
    ...quatFromEuler(0.2, 0, 0),
    ...quatFromEuler(0.08, 0, 0)
  ];
  const walkRightAnkleQuats = [
    ...quatFromEuler(-0.1, 0, 0),
    ...quatFromEuler(0.05, 0, 0),
    ...quatFromEuler(0.15, 0, 0),
    ...quatFromEuler(0, 0, 0),
    ...quatFromEuler(-0.1, 0, 0)
  ];

  const walkClip = new THREE.AnimationClip('Walk', 1.2, [
    new THREE.VectorKeyframeTrack('hips.position', walkTimes, walkHipsPos),
    new THREE.QuaternionKeyframeTrack('hips.quaternion', walkTimes, walkHipsQuats),
    new THREE.QuaternionKeyframeTrack('torso.quaternion', walkTimes, walkTorsoQuats),
    new THREE.QuaternionKeyframeTrack('headGroup.quaternion', walkTimes, walkHeadQuats),
    new THREE.QuaternionKeyframeTrack('leftShoulder.quaternion', walkTimes, walkLeftShoulderQuats),
    new THREE.QuaternionKeyframeTrack('leftForearm.quaternion', walkTimes, walkLeftForearmQuats),
    new THREE.QuaternionKeyframeTrack('rightShoulder.quaternion', walkTimes, walkRightShoulderQuats),
    new THREE.QuaternionKeyframeTrack('rightForearm.quaternion', walkTimes, walkRightForearmQuats),
    new THREE.QuaternionKeyframeTrack('leftLegHip.quaternion', walkTimes, walkLeftHipQuats),
    new THREE.QuaternionKeyframeTrack('leftLegKnee.quaternion', walkTimes, walkLeftKneeQuats),
    new THREE.QuaternionKeyframeTrack('leftAnkle.quaternion', walkTimes, walkLeftAnkleQuats),
    new THREE.QuaternionKeyframeTrack('rightLegHip.quaternion', walkTimes, walkRightHipQuats),
    new THREE.QuaternionKeyframeTrack('rightLegKnee.quaternion', walkTimes, walkRightKneeQuats),
    new THREE.QuaternionKeyframeTrack('rightAnkle.quaternion', walkTimes, walkRightAnkleQuats)
  ]);

  // --- 3. WAVE CLIP (2.0s Loop) ---
  // Cheerful, expressive hand waving with smiling head tilt and relaxed body shift!
  const waveTimes = [0, 0.35, 0.65, 0.95, 1.25, 1.55, 1.85, 2.0];
  const waveHipsPos = [
    0, 0.355, 0,
    0.008, 0.354, 0,
    0.01, 0.354, 0,
    0.01, 0.354, 0,
    0.01, 0.354, 0,
    0.01, 0.354, 0,
    0.005, 0.355, 0,
    0, 0.355, 0
  ];
  const waveHipsQuats = [
    ...quatFromEuler(0, 0, 0),
    ...quatFromEuler(0, 0.05, -0.04),
    ...quatFromEuler(0, 0.05, -0.04),
    ...quatFromEuler(0, 0.05, -0.04),
    ...quatFromEuler(0, 0.05, -0.04),
    ...quatFromEuler(0, 0.05, -0.04),
    ...quatFromEuler(0, 0.02, -0.02),
    ...quatFromEuler(0, 0, 0)
  ];
  const waveTorsoQuats = [
    ...quatFromEuler(0.04, 0, 0),
    ...quatFromEuler(0.02, -0.04, 0.03),
    ...quatFromEuler(0.02, -0.04, 0.03),
    ...quatFromEuler(0.02, -0.04, 0.03),
    ...quatFromEuler(0.02, -0.04, 0.03),
    ...quatFromEuler(0.02, -0.04, 0.03),
    ...quatFromEuler(0.03, -0.02, 0.01),
    ...quatFromEuler(0.04, 0, 0)
  ];
  const waveHeadQuats = [
    ...quatFromEuler(0, 0, 0),
    ...quatFromEuler(-0.05, -0.08, -0.12),
    ...quatFromEuler(-0.02, -0.08, -0.09),
    ...quatFromEuler(-0.05, -0.08, -0.12),
    ...quatFromEuler(-0.02, -0.08, -0.09),
    ...quatFromEuler(-0.05, -0.08, -0.12),
    ...quatFromEuler(-0.02, -0.04, -0.05),
    ...quatFromEuler(0, 0, 0)
  ];

  // Right arm waving high
  const waveRightShoulderQuats = [
    ...quatFromEuler(0.05, 0, -0.1),
    ...quatFromEuler(-1.25, 0, -0.45),
    ...quatFromEuler(-1.3, 0, -0.45),
    ...quatFromEuler(-1.25, 0, -0.45),
    ...quatFromEuler(-1.3, 0, -0.45),
    ...quatFromEuler(-1.25, 0, -0.45),
    ...quatFromEuler(-0.6, 0, -0.25),
    ...quatFromEuler(0.05, 0, -0.1)
  ];
  const waveRightForearmQuats = [
    ...quatFromEuler(-0.15, 0, 0),
    ...quatFromEuler(-0.85, 0.35, -0.45),
    ...quatFromEuler(-0.85, 0.35, 0.4),
    ...quatFromEuler(-0.85, 0.35, -0.45),
    ...quatFromEuler(-0.85, 0.35, 0.4),
    ...quatFromEuler(-0.85, 0.35, -0.45),
    ...quatFromEuler(-0.4, 0.1, -0.1),
    ...quatFromEuler(-0.15, 0, 0)
  ];

  // Left arm relaxed at side
  const waveLeftShoulderQuats = [
    ...quatFromEuler(0.05, 0, 0.1),
    ...quatFromEuler(0.08, 0, 0.15),
    ...quatFromEuler(0.08, 0, 0.15),
    ...quatFromEuler(0.08, 0, 0.15),
    ...quatFromEuler(0.08, 0, 0.15),
    ...quatFromEuler(0.08, 0, 0.15),
    ...quatFromEuler(0.06, 0, 0.12),
    ...quatFromEuler(0.05, 0, 0.1)
  ];
  const waveLeftForearmQuats = [
    ...quatFromEuler(-0.15, 0, 0),
    ...quatFromEuler(-0.25, 0, 0),
    ...quatFromEuler(-0.25, 0, 0),
    ...quatFromEuler(-0.25, 0, 0),
    ...quatFromEuler(-0.25, 0, 0),
    ...quatFromEuler(-0.25, 0, 0),
    ...quatFromEuler(-0.2, 0, 0),
    ...quatFromEuler(-0.15, 0, 0)
  ];

  const waveLeftHipQuats = [
    ...quatFromEuler(0, 0, 0.02),
    ...quatFromEuler(0.03, 0, 0.05),
    ...quatFromEuler(0.03, 0, 0.05),
    ...quatFromEuler(0.03, 0, 0.05),
    ...quatFromEuler(0.03, 0, 0.05),
    ...quatFromEuler(0.03, 0, 0.05),
    ...quatFromEuler(0.01, 0, 0.03),
    ...quatFromEuler(0, 0, 0.02)
  ];
  const waveLeftKneeQuats = [
    ...quatFromEuler(0.08, 0, 0),
    ...quatFromEuler(0.12, 0, 0),
    ...quatFromEuler(0.12, 0, 0),
    ...quatFromEuler(0.12, 0, 0),
    ...quatFromEuler(0.12, 0, 0),
    ...quatFromEuler(0.12, 0, 0),
    ...quatFromEuler(0.1, 0, 0),
    ...quatFromEuler(0.08, 0, 0)
  ];
  const waveLeftAnkleQuats = [
    ...quatFromEuler(0, 0, 0),
    ...quatFromEuler(0, 0, 0),
    ...quatFromEuler(0, 0, 0),
    ...quatFromEuler(0, 0, 0),
    ...quatFromEuler(0, 0, 0),
    ...quatFromEuler(0, 0, 0),
    ...quatFromEuler(0, 0, 0),
    ...quatFromEuler(0, 0, 0)
  ];

  const waveRightHipQuats = [
    ...quatFromEuler(0, 0, -0.02),
    ...quatFromEuler(-0.02, 0, -0.03),
    ...quatFromEuler(-0.02, 0, -0.03),
    ...quatFromEuler(-0.02, 0, -0.03),
    ...quatFromEuler(-0.02, 0, -0.03),
    ...quatFromEuler(-0.02, 0, -0.03),
    ...quatFromEuler(-0.01, 0, -0.02),
    ...quatFromEuler(0, 0, -0.02)
  ];
  const waveRightKneeQuats = [
    ...quatFromEuler(0.08, 0, 0),
    ...quatFromEuler(0.05, 0, 0),
    ...quatFromEuler(0.05, 0, 0),
    ...quatFromEuler(0.05, 0, 0),
    ...quatFromEuler(0.05, 0, 0),
    ...quatFromEuler(0.05, 0, 0),
    ...quatFromEuler(0.06, 0, 0),
    ...quatFromEuler(0.08, 0, 0)
  ];
  const waveRightAnkleQuats = [
    ...quatFromEuler(0, 0, 0),
    ...quatFromEuler(0, 0, 0),
    ...quatFromEuler(0, 0, 0),
    ...quatFromEuler(0, 0, 0),
    ...quatFromEuler(0, 0, 0),
    ...quatFromEuler(0, 0, 0),
    ...quatFromEuler(0, 0, 0),
    ...quatFromEuler(0, 0, 0)
  ];

  const waveClip = new THREE.AnimationClip('Wave', 2.0, [
    new THREE.VectorKeyframeTrack('hips.position', waveTimes, waveHipsPos),
    new THREE.QuaternionKeyframeTrack('hips.quaternion', waveTimes, waveHipsQuats),
    new THREE.QuaternionKeyframeTrack('torso.quaternion', waveTimes, waveTorsoQuats),
    new THREE.QuaternionKeyframeTrack('headGroup.quaternion', waveTimes, waveHeadQuats),
    new THREE.QuaternionKeyframeTrack('rightShoulder.quaternion', waveTimes, waveRightShoulderQuats),
    new THREE.QuaternionKeyframeTrack('rightForearm.quaternion', waveTimes, waveRightForearmQuats),
    new THREE.QuaternionKeyframeTrack('leftShoulder.quaternion', waveTimes, waveLeftShoulderQuats),
    new THREE.QuaternionKeyframeTrack('leftForearm.quaternion', waveTimes, waveLeftForearmQuats),
    new THREE.QuaternionKeyframeTrack('leftLegHip.quaternion', waveTimes, waveLeftHipQuats),
    new THREE.QuaternionKeyframeTrack('leftLegKnee.quaternion', waveTimes, waveLeftKneeQuats),
    new THREE.QuaternionKeyframeTrack('leftAnkle.quaternion', waveTimes, waveLeftAnkleQuats),
    new THREE.QuaternionKeyframeTrack('rightLegHip.quaternion', waveTimes, waveRightHipQuats),
    new THREE.QuaternionKeyframeTrack('rightLegKnee.quaternion', waveTimes, waveRightKneeQuats),
    new THREE.QuaternionKeyframeTrack('rightAnkle.quaternion', waveTimes, waveRightAnkleQuats)
  ]);

  // --- 4. IDLE CLIP (2.4s Loop) ---
  // Gentle breathing, relaxed poise, natural micro-motion
  const idleTimes = [0, 0.6, 1.2, 1.8, 2.4];
  const idleHipsPos = [
    0, 0.355, 0,
    0, 0.353, 0,
    0, 0.355, 0,
    0, 0.353, 0,
    0, 0.355, 0
  ];
  const idleHipsQuats = [
    ...quatFromEuler(0, 0, 0),
    ...quatFromEuler(0.01, 0.02, 0.01),
    ...quatFromEuler(0, 0, 0),
    ...quatFromEuler(0.01, -0.02, -0.01),
    ...quatFromEuler(0, 0, 0)
  ];
  const idleTorsoQuats = [
    ...quatFromEuler(0.03, 0, 0),
    ...quatFromEuler(0.05, 0.02, 0),
    ...quatFromEuler(0.03, 0, 0),
    ...quatFromEuler(0.05, -0.02, 0),
    ...quatFromEuler(0.03, 0, 0)
  ];
  const idleHeadQuats = [
    ...quatFromEuler(-0.01, 0, 0),
    ...quatFromEuler(0.02, -0.04, -0.02),
    ...quatFromEuler(-0.01, 0, 0),
    ...quatFromEuler(0.02, 0.04, 0.02),
    ...quatFromEuler(-0.01, 0, 0)
  ];

  const idleLeftShoulderQuats = [
    ...quatFromEuler(0.04, 0, 0.1),
    ...quatFromEuler(0.06, 0, 0.12),
    ...quatFromEuler(0.04, 0, 0.1),
    ...quatFromEuler(0.06, 0, 0.12),
    ...quatFromEuler(0.04, 0, 0.1)
  ];
  const idleLeftForearmQuats = [
    ...quatFromEuler(-0.18, 0, 0),
    ...quatFromEuler(-0.24, 0, 0),
    ...quatFromEuler(-0.18, 0, 0),
    ...quatFromEuler(-0.24, 0, 0),
    ...quatFromEuler(-0.18, 0, 0)
  ];

  const idleRightShoulderQuats = [
    ...quatFromEuler(0.04, 0, -0.1),
    ...quatFromEuler(0.06, 0, -0.12),
    ...quatFromEuler(0.04, 0, -0.1),
    ...quatFromEuler(0.06, 0, -0.12),
    ...quatFromEuler(0.04, 0, -0.1)
  ];
  const idleRightForearmQuats = [
    ...quatFromEuler(-0.18, 0, 0),
    ...quatFromEuler(-0.24, 0, 0),
    ...quatFromEuler(-0.18, 0, 0),
    ...quatFromEuler(-0.24, 0, 0),
    ...quatFromEuler(-0.18, 0, 0)
  ];

  const idleLegQuats = [
    ...quatFromEuler(0, 0, 0),
    ...quatFromEuler(0.02, 0, 0),
    ...quatFromEuler(0, 0, 0),
    ...quatFromEuler(0.02, 0, 0),
    ...quatFromEuler(0, 0, 0)
  ];

  const idleClip = new THREE.AnimationClip('Idle', 2.4, [
    new THREE.VectorKeyframeTrack('hips.position', idleTimes, idleHipsPos),
    new THREE.QuaternionKeyframeTrack('hips.quaternion', idleTimes, idleHipsQuats),
    new THREE.QuaternionKeyframeTrack('torso.quaternion', idleTimes, idleTorsoQuats),
    new THREE.QuaternionKeyframeTrack('headGroup.quaternion', idleTimes, idleHeadQuats),
    new THREE.QuaternionKeyframeTrack('leftShoulder.quaternion', idleTimes, idleLeftShoulderQuats),
    new THREE.QuaternionKeyframeTrack('leftForearm.quaternion', idleTimes, idleLeftForearmQuats),
    new THREE.QuaternionKeyframeTrack('rightShoulder.quaternion', idleTimes, idleRightShoulderQuats),
    new THREE.QuaternionKeyframeTrack('rightForearm.quaternion', idleTimes, idleRightForearmQuats),
    new THREE.QuaternionKeyframeTrack('leftLegHip.quaternion', idleTimes, idleLegQuats),
    new THREE.QuaternionKeyframeTrack('leftLegKnee.quaternion', idleTimes, idleLegQuats),
    new THREE.QuaternionKeyframeTrack('rightLegHip.quaternion', idleTimes, idleLegQuats),
    new THREE.QuaternionKeyframeTrack('rightLegKnee.quaternion', idleTimes, idleLegQuats)
  ]);

  // Ensure matrix hierarchy is fully evaluated
  root.updateMatrixWorld(true);

  return {
    root,
    clips: [runClip, walkClip, waveClip, idleClip],
    runClip,
    walkClip,
    waveClip,
    idleClip
  };
}

async function exportAll() {
  const gltfExporter = new GLTFExporter();
  const usdzExporter = new USDZExporter();

  console.log('Building pure stylized character with Run, Walk, Wave, Idle animations...');
  const char = buildCharacter();
  char.root.updateMatrixWorld(true);

  // 1. Export master GLB containing all 4 clips
  console.log('Exporting character.glb with all 4 animation clips...');
  const masterGlb = await gltfExporter.parseAsync(char.root, { binary: true, animations: char.clips });
  fs.writeFileSync(path.join(outDir, 'character.glb'), Buffer.from(masterGlb));
  console.log('Saved character.glb:', masterGlb.byteLength, 'bytes');

  // 2. Export Quick Look USDZ files for each animation mode
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

  console.log('Exporting character_idle.usdz...');
  const idleUsdz = await usdzExporter.parseAsync(char.root, { quickLookCompatible: true, animations: [char.idleClip] });
  fs.writeFileSync(path.join(outDir, 'character_idle.usdz'), Buffer.from(idleUsdz));
  console.log('Saved character_idle.usdz:', idleUsdz.byteLength, 'bytes');

  // Export static still pose for Quick Look
  console.log('Exporting character_still.usdz...');
  const stillUsdz = await usdzExporter.parseAsync(char.root, { quickLookCompatible: true });
  fs.writeFileSync(path.join(outDir, 'character_still.usdz'), Buffer.from(stillUsdz));
  console.log('Saved character_still.usdz:', stillUsdz.byteLength, 'bytes');

  // Write default character.usdz (still mode at start)
  fs.writeFileSync(path.join(outDir, 'character.usdz'), Buffer.from(stillUsdz));
  console.log('Saved default character.usdz (still mode)');

  console.log('All character models and animations exported successfully!');
}

exportAll().catch(err => {
  console.error('Fatal export error:', err);
  process.exit(1);
});
