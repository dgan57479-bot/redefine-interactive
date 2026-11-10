(() => {
  'use strict';

  const byId = (id) => document.getElementById(id);
  const screens = {
    intro: byId('introScreen'),
    video: byId('videoScreen'),
    choice: byId('choiceScreen'),
    ending: byId('endingScreen')
  };
  const video = byId('storyVideo');
  const placeholder = byId('videoPlaceholder');
  const placeholderTitle = byId('placeholderTitle');
  const placeholderText = byId('placeholderText');
  const continueButton = byId('continueButton');
  const progressFill = byId('progressFill');

  // Videos 1–6 are in the repository's /videos folder.
  // Video 7 is served as an H.264 MP4 from Cloudinary.
  const chapters = {
    1: { file: 'videos/video-01.mp4', title: 'The Beginning', route: 'THE BEGINNING', hint: 'Every story starts somewhere.' },
    2: { file: 'videos/video-02.mp4', title: 'Your First Choice', route: 'CONTACT', hint: 'You chose to reach out.' },
    3: { file: 'videos/video-03.mp4', title: 'A Different Choice', route: "DON'T CONTACT", hint: 'You chose not to make the first move.' },
    4: { file: 'videos/video-04.mp4', title: 'The Next Moment', route: "DON'T CONTACT", hint: 'Continue watching to see what happens next.' },
    5: { file: 'videos/video-05.mp4', title: 'The Next Moment', route: 'CONTACT', hint: 'Continue watching to see what happens next.' },
    6: { file: 'videos/video-06.mp4', title: 'Before We Meet Again', route: 'CONTACT', hint: 'One more moment before the ending.' },
    7: { file: 'https://res.cloudinary.com/pyeqnlpa/video/upload/f_mp4,vc_h264/video-07', title: 'What Remains', route: 'SAME DESTINATION', hint: 'Different paths lead to this shared ending.' }
  };

  let currentChapter = 1;
  let videoFinished = false;

  function showScreen(name) {
    Object.entries(screens).forEach(([key, element]) => {
      if (element) element.classList.toggle('active', key === name);
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function setPlaceholder(title, message) {
    placeholderTitle.textContent = title;
    placeholderText.textContent = message;
    placeholder.classList.remove('hidden');
  }

  function showChapter(number) {
    const chapter = chapters[number];
    if (!chapter) return;

    currentChapter = number;
    videoFinished = false;
    continueButton.disabled = true;
    continueButton.textContent = 'CONTINUE →';
    progressFill.style.width = '0%';
    setPlaceholder('LOADING VIDEO…', 'Please wait a moment.');

    byId('chapterLabel').textContent = `VIDEO ${String(number).padStart(2, '0')} / 07`;
    byId('routeLabel').textContent = chapter.route;
    byId('videoTitle').textContent = chapter.title;
    byId('videoHint').textContent = chapter.hint;

    video.pause();
    video.removeAttribute('src');
    video.load();
    showScreen('video');
    video.src = chapter.file;
    video.load();

    // Playback starts only after the visitor taps the native video play control.
  }

  video.addEventListener('loadeddata', () => placeholder.classList.add('hidden'));
  video.addEventListener('canplay', () => placeholder.classList.add('hidden'));
  video.addEventListener('error', () => {
    setPlaceholder('VIDEO COULD NOT LOAD', 'Please check your connection and try again.');
  });
  video.addEventListener('timeupdate', () => {
    if (Number.isFinite(video.duration) && video.duration > 0) {
      progressFill.style.width = `${(video.currentTime / video.duration) * 100}%`;
    }
  });
  video.addEventListener('ended', () => {
    videoFinished = true;
    continueButton.disabled = false;
  });

  byId('startButton').addEventListener('click', () => showChapter(1));
  byId('homeLogo').addEventListener('click', (event) => {
    event.preventDefault();
    video.pause();
    showScreen('intro');
  });

  continueButton.addEventListener('click', () => {
    if (!videoFinished) return;
    if (currentChapter === 1) {
      showScreen('choice');
    } else if (currentChapter === 2) {
      showChapter(5);
    } else if (currentChapter === 5) {
      showChapter(6);
    } else if (currentChapter === 6) {
      showChapter(7);
    } else if (currentChapter === 3) {
      showChapter(4);
    } else if (currentChapter === 4) {
      showChapter(7);
    } else if (currentChapter === 7) {
      video.pause();
      showScreen('ending');
    }
  });

  document.querySelectorAll('.choice-card').forEach((button) => {
    button.addEventListener('click', () => {
      showChapter(button.dataset.choice === 'contact' ? 2 : 3);
    });
  });

  byId('replayButton').addEventListener('click', () => {
    video.pause();
    showChapter(1);
  });
})();
