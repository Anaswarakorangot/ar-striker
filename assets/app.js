(() => {
  const viewer = document.querySelector('#characterViewer');
  const actionBtns = document.querySelectorAll('.action-btn');
  const arMiniBtns = document.querySelectorAll('.ar-mini-btn');
  const statusEl = document.querySelector('#characterStatus');
  const statusIndicator = document.querySelector('.status-indicator');
  const effectToast = document.querySelector('#effectToast');
  const arSupportText = document.querySelector('#arSupportText');
  const arBadge = document.querySelector('#arBadge');
  const progress = document.querySelector('#progress');
  const progressBar = progress ? progress.querySelector('span') : null;

  const btnSpeed = document.querySelector('#btnSpeed');
  const btnRotate = document.querySelector('#btnRotate');
  const btnReset = document.querySelector('#btnReset');

  // Animation descriptions for feedback toasts
  const animDetails = {
    Run: {
      label: 'RUNNING',
      toast: '🏃 High-energy dynamic running stride active',
      usdz: 'models/character_run.usdz'
    },
    Walk: {
      label: 'WALKING',
      toast: '🚶 Casual confident walking gait active',
      usdz: 'models/character_walk.usdz'
    },
    Wave: {
      label: 'WAVING',
      toast: '👋 Friendly cheerful greeting wave active',
      usdz: 'models/character_wave.usdz'
    },
    Still: {
      label: 'STILL',
      toast: '⏸️ Character standing still • Motion paused',
      usdz: 'models/character_still.usdz'
    }
  };

  let currentAnim = 'Still';
  let speedModes = [
    { label: '⏱️ Speed: 1.0x', val: 1.0 },
    { label: '⚡ Speed: 1.5x', val: 1.5 },
    { label: '🐢 Speed: 0.75x', val: 0.75 }
  ];
  let speedIdx = 0;

  function showToast(message) {
    if (!effectToast) return;
    effectToast.textContent = message;
    effectToast.classList.remove('flash');
    requestAnimationFrame(() => effectToast.classList.add('flash'));
  }

  function setAnimation(animName) {
    if (!animDetails[animName]) return;
    currentAnim = animName;

    if (viewer) {
      if (animName === 'Still') {
        try {
          viewer.pause();
        } catch (err) {
          console.warn('Pause notice:', err);
        }
      } else {
        try {
          viewer.animationName = animName;
          viewer.play();
        } catch (err) {
          console.warn('Animation switch notice:', err);
        }
      }

      // Dynamically update USDZ for iOS Safari Quick Look so AR matches active animation
      viewer.setAttribute('ios-src', animDetails[animName].usdz);
    }

    // Update active classes on main buttons
    actionBtns.forEach((btn) => {
      const isMatch = btn.getAttribute('data-anim') === animName;
      btn.classList.toggle('active', isMatch);
      btn.setAttribute('aria-pressed', String(isMatch));
    });

    // Update active classes on WebXR AR overlay buttons
    arMiniBtns.forEach((btn) => {
      const isMatch = btn.getAttribute('data-anim') === animName;
      btn.classList.toggle('active', isMatch);
    });

    // Update status badge
    if (statusEl) {
      statusEl.textContent = animDetails[animName].label;
    }

    if (statusIndicator) {
      statusIndicator.classList.toggle('still', animName === 'Still');
    }

    // Show feedback toast
    showToast(animDetails[animName].toast);
  }

  // Bind clicks on main action buttons
  actionBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const anim = btn.getAttribute('data-anim');
      setAnimation(anim);
    });
  });

  // Bind clicks on WebXR AR overlay buttons
  arMiniBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const anim = btn.getAttribute('data-anim');
      setAnimation(anim);
    });
  });

  // Speed Toggle
  if (btnSpeed && viewer) {
    btnSpeed.addEventListener('click', () => {
      speedIdx = (speedIdx + 1) % speedModes.length;
      const current = speedModes[speedIdx];
      btnSpeed.textContent = current.label;
      viewer.timeScale = current.val;
      showToast(`Playback speed set to ${current.val}x`);
    });
  }

  // Auto-rotate Toggle
  if (btnRotate && viewer) {
    btnRotate.addEventListener('click', () => {
      viewer.autoRotate = !viewer.autoRotate;
      btnRotate.textContent = `🔄 Auto-rotate: ${viewer.autoRotate ? 'On' : 'Off'}`;
      btnRotate.setAttribute('aria-pressed', String(viewer.autoRotate));
    });
  }

  // Reset Camera View
  if (btnReset && viewer) {
    btnReset.addEventListener('click', () => {
      viewer.cameraOrbit = '0deg 75deg 1.35m';
      viewer.cameraTarget = '0m 0.28m 0m';
      viewer.fieldOfView = '32deg';
      if (typeof viewer.jumpCameraToGoal === 'function') {
        viewer.jumpCameraToGoal();
      }
      showToast('🎯 Camera view reset to center');
    });
  }

  // Model viewer event listeners
  if (viewer) {
    viewer.addEventListener('progress', (event) => {
      if (!progressBar || !progress) return;
      const percent = Math.round(event.detail.totalProgress * 100);
      progressBar.style.width = `${percent}%`;
      progress.setAttribute('aria-valuenow', String(percent));
      progress.classList.toggle('hide', percent >= 100);
    });

    viewer.addEventListener('load', () => {
      if (arSupportText) {
        arSupportText.textContent = viewer.canActivateAR
          ? 'AR ready • Tap "View Character in AR" for iPhone Quick Look or WebXR'
          : 'Interactive 3D preview active • AR requires a compatible mobile browser';
      }

      if (arBadge) {
        arBadge.textContent = viewer.canActivateAR ? 'AR READY' : '3D READY';
      }

      // Guarantee the character is STILL and not moving at start
      try {
        viewer.pause();
      } catch (err) {
        console.warn('Initial pause note:', err);
      }
    });

    viewer.addEventListener('error', (err) => {
      console.error('Model loading error:', err);
      if (arSupportText) {
        arSupportText.textContent = '3D model loading failed. Please refresh the page.';
      }
    });
  }

  // Initialize in still mode
  setAnimation('Still');
})();
