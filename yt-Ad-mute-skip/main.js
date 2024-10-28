let normalPlaybackSpeed = 1;
let normalVolume = document.querySelector('video.video-stream')?.volume || 1;
let isAdPlaying = false;
let adPlaybackCheckInterval = null;

function setPlaybackSpeed(speed) {
  const video = document.querySelector('video.video-stream');
  if (video) video.playbackRate = speed;
}

function setVolume(volume) {
  const video = document.querySelector('video.video-stream');
  if (video) video.volume = volume;
}

function trySkipAd() {
  const container = document.querySelector('.ytp-ad-player-overlay-layout__skip-or-preview-container');
  
  if (container) {
    const skipButton = container.querySelector('.ytp-skip-ad-button');
    const videoPlayer = document.querySelector('#movie_player');
    if (skipButton && videoPlayer) {
      videoPlayer.style.position = 'relative';
      Object.assign(skipButton.style, {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '100%',
        height: '100%',
        backgroundColor: '#1A1A1A',
        color: 'white',
        border: '2px solid white',
        zIndex: '1000',
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      });

      const skipText = skipButton.querySelector('.ytp-skip-ad-button__text');
      if (skipText) {
        skipText.style.fontSize = '80px';
        skipText.style.lineHeight = '1.2';
        skipText.style.setProperty('font-size', '70px', 'important');
      }

      const icon = skipButton.querySelector('.ytp-skip-ad-button__icon');
      if (icon) icon.remove();

      setPlaybackSpeed(10);
      setVolume(0);
      isAdPlaying = true;
    }
  } else if (isAdPlaying) {
    setPlaybackSpeed(normalPlaybackSpeed);
    setVolume(normalVolume);
    isAdPlaying = false;
  }
}

function handleAdPlayback() {
  const player = document.querySelector("#movie_player");

  if (player && player.classList.contains("ad-showing")) {
    if (!isAdPlaying) {
      setPlaybackSpeed(10);
      setVolume(0);
      isAdPlaying = true;
      clearInterval(adPlaybackCheckInterval);
    }
  } else {
    if (isAdPlaying) {
      setPlaybackSpeed(normalPlaybackSpeed);
      setVolume(normalVolume);
      isAdPlaying = false;
      adPlaybackCheckInterval = setInterval(handleAdPlayback, 1000);
    }
  }
}

function updateNormalPlaybackSpeed(event) {
  const video = document.querySelector('video.video-stream');
  if (video && !isAdPlaying) {
    normalPlaybackSpeed = video.playbackRate;
    normalVolume = video.volume;
  }
}

document.addEventListener('ratechange', updateNormalPlaybackSpeed);

const observer = new MutationObserver((mutationList) => {
  for (let mutation of mutationList) {
    if (mutation.type == 'childList') {
      trySkipAd();
    }
  }
  handleAdPlayback();
});

observer.observe(document.body, { childList: true, subtree: true });
