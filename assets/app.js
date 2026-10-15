(() => {
  const viewer = document.querySelector('#characterViewer');
  const actionBtns = document.querySelectorAll('.action-btn');
  const status = document.querySelector('#characterStatus');
  const effect = document.querySelector('#effect');
  const support = document.querySelector('#arSupport');
  const progress = document.querySelector('#progress');
  const bar = progress ? progress.querySelector('span') : null;
  const rotate = document.querySelector('#rotate');
  const reset = document.querySelector('#reset');

  const animDetails = {
    Run: {
      statusText: 'RUNNING',
      toast: '🏃 Dynamic running stride active',
      usdz: 'models/character_run.usdz'
    },
    Walk: {
      statusText: 'WALKING',
      toast: '🚶 Casual walking motion active',
      usdz: 'models/character_walk.usdz'
    },
    Wave: {
      statusText: 'WAVING',
      toast: '👋 Cheerful greeting wave active',
      usdz: 'models/character_wave.usdz'
    },
    Still: {
      statusText: 'STILL',
      toast: '⏸️ Character standing still • Motion paused',
      usdz: 'models/character_still.usdz'
    }
  };

  let currentAnim = 'Still';

  function showEffect(text) {
    if (!effect) return;
    effect.textContent = text;
    effect.classList.remove('flash');
    requestAnimationFrame(() => effect.classList.add('flash'));
  }

  function setAnimation(name) {
    const config = animDetails[name];
    if (!config) return;
    currentAnim = name;

    if (viewer) {
      if (name === 'Still') {
        try {
          viewer.pause();
        } catch (e) {
          console.warn('Pause notice:', e);
        }
      } else {
        try {
          viewer.animationName = name;
          viewer.currentTime = 0;
          viewer.play();
        } catch (e) {
          console.warn('Animation notice:', e);
        }
      }

      // Update Quick Look USDZ dynamically
      viewer.setAttribute('ios-src', config.usdz);
    }

    // Update active button state
    actionBtns.forEach((btn) => {
      const isMatch = btn.getAttribute('data-anim') === name;
      btn.classList.toggle('active', isMatch);
      btn.setAttribute('aria-pressed', String(isMatch));
    });

    if (status) {
      status.textContent = config.statusText;
      status.classList.toggle('active-motion', name !== 'Still');
    }

    showEffect(config.toast);
  }

  // Bind motion button clicks
  actionBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const anim = btn.getAttribute('data-anim');
      setAnimation(anim);
    });
  });

  // Model viewer event listeners
  if (viewer) {
    viewer.addEventListener('progress', (event) => {
      if (!bar || !progress) return;
      const percent = Math.round(event.detail.totalProgress * 100);
      bar.style.width = `${percent}%`;
      progress.setAttribute('aria-valuenow', String(percent));
      progress.classList.toggle('hide', percent >= 100);
    });

    viewer.addEventListener('load', () => {
      if (support) {
        support.textContent = viewer.canActivateAR
          ? 'AR ready • iPhone Safari uses Quick Look'
          : 'Interactive 3D preview active • AR available on supported mobile devices.';
      }
    });

    viewer.addEventListener('error', (err) => {
      console.warn('Model load event:', err);
      if (support) {
        support.textContent = 'The 3D model could not load. Check your connection and refresh.';
      }
    });
  }

  // Auto-rotate toggle
  if (rotate && viewer) {
    rotate.addEventListener('click', () => {
      viewer.autoRotate = !viewer.autoRotate;
      rotate.textContent = `Auto-rotate: ${viewer.autoRotate ? 'On' : 'Off'}`;
      rotate.setAttribute('aria-pressed', String(viewer.autoRotate));
    });
  }

  // Reset camera view
  if (reset && viewer) {
    reset.addEventListener('click', () => {
      viewer.cameraOrbit = '0deg 75deg 105%';
      viewer.fieldOfView = '30deg';
      if (typeof viewer.jumpCameraToGoal === 'function') {
        viewer.jumpCameraToGoal();
      }
      showEffect('🎯 Camera view reset');
    });
  }
})();
