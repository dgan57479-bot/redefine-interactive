const screens = {
  intro: document.getElementById('introScreen'),
  video: document.getElementById('videoScreen'),
  choice: document.getElementById('choiceScreen'),
  ending: document.getElementById('endingScreen')
};

const video = document.getElementById('storyVideo');
const placeholder = document.getElementById('videoPlaceholder');
const continueButton = document.getElementById('continueButton');
const progressFill = document.getElementById('progressFill');

// Confirmed file mapping from the user.
const chapters = {
  1: { file: 'videos/video-01.mp4', title: 'The Beginning', route: 'THE BEGINNING', hint: 'Every story starts somewhere.' },
  2: { file: 'videos/video-02.mp4', title: 'Your First Choice', route: 'CONTACT', hint: 'You chose to reach out.' },
  3: { file: 'videos/video-03.mp4', title: 'A Different Choice', route: "DON'T CONTACT", hint: 'You chose not to reach out.' },
  4: { file: 'videos/video-04.mp4', title: 'The Next Moment', route: 'DON’T CONTACT', hint: 'Continue watching the story.' },
  5: { file: 'videos/video-05.mp4', title: 'The Next Moment', route: 'CONTACT', hint: 'Continue watching the story.' },
  6: { file: 'videos/video-06.mp4', title: 'Before We Meet Again', route: 'CONTACT', hint: 'One more moment before both paths meet.' },
  7: { file: 'https://res.cloudinary.com/pyeqnlpa/video/upload/f_mp4,vc_h264/video-07', title: 'What Remains',title: 'What Remains', route: 'SAME DESTINATION', hint: 'Different paths lead to this shared ending.' } 

let currentChapter = 1;
let videoFinished = false;
let selectedRoute = null;

function showScreen(name) {
  Object.values(screens).forEach(screen => screen.classList.remove('active'));
  screens[name].classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showChapter(number) {
  currentChapter = number;
  const chapter = chapters[number];
  video.pause();
  video.removeAttribute('src');
  video.load();
  videoFinished = false;
  continueButton.disabled = true;
  continueButton.textContent = 'CONTINUE →';
  placeholder.classList.remove('hidden');
  progressFill.style.width = '0%';

  document.getElementById('chapterLabel').textContent = `VIDEO ${number} / 7`;
  document.getElementById('routeLabel').textContent = chapter.route;
  document.getElementById('videoTitle').textContent = chapter.title;
  document.getElementById('videoHint').textContent = chapter.hint;

  video.src = chapter.file;
  video.load();
  showScreen('video');
}

video.addEventListener('loadeddata', () => placeholder.classList.add('hidden'));
video.addEventListener('error', () => placeholder.classList.remove('hidden'));
video.addEventListener('timeupdate', () => {
  if (Number.isFinite(video.duration) && video.duration > 0) {
    progressFill.style.width = `${(video.currentTime / video.duration) * 100}%`;
  }
});
video.addEventListener('ended', () => {
  videoFinished = true;
  continueButton.disabled = false;
});

// Video 1 -> choice. Contact: 2 -> 5 -> 6 -> 7.
// Don't contact: 3 -> 4 -> 7.
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
    showScreen('ending');
  }
});

document.getElementById('startButton').addEventListener('click', () => showChapter(1));
document.getElementById('homeLogo').addEventListener('click', event => {
  event.preventDefault();
  video.pause();
  showScreen('intro');
});

document.querySelectorAll('.choice-card').forEach(button => {
  button.addEventListener('click', () => {
    selectedRoute = button.dataset.choice;
    showChapter(selectedRoute === 'contact' ? 2 : 3);
  });
});

document.getElementById('replayButton').addEventListener('click', () => {
  selectedRoute = null;
  showChapter(1);
});
