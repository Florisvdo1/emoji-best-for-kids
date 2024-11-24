
// Emoji Data Object with Real Event Structure Emojis
const rawEmojiData = {
  activities: [
    '🚗','🏃‍♂️','🧘‍♀️','🚴‍♀️','🏊‍♂️','🛹','🧗‍♂️','🏋️‍♀️','🤸‍♂️','🕺',
    '🚶‍♀️','🛶','🎣','🥋','🎮','🛷','🎲','♠️','♥️','♦️',
    '♣️','🎭','🎨','🎤','🎧','🎼','🎹','🥁','🎷','🎺',
    '🎸','🎻','🎬','🖼️','🖌️','🧩','🎯','🎱','🏓','🏸',
    // Add more practical emojis as needed
  ],
  cars: [
    '🚗','🚕','🚙','🚌','🚎','🏎️','🚓','🚑','🚒','🚐',
    '🚚','🚛','🚜','🏍️','🛵','🚲','🛴','🚏','🛣️','🛤️',
    '🚨','🚥','🚦','⛽','🚧','⚓','⛵','🛶','🚤','🛳️',
    // Add more car-related emojis as needed
  ],
  wellness: [
    '🧘‍♀️','🏋️‍♀️','🛀','🧖‍♂️','🧗‍♀️','🤸‍♀️','🥋','🏄‍♂️','🤼‍♂️','🧘‍♂️',
    '🧗‍♂️','🤾‍♀️','🤾‍♂️','🏇','🏂','⛷️','🏌️‍♀️','🏌️‍♂️','🏄‍♀️','🏊‍♀️',
    // Add more wellness-related emojis as needed
  ],
  // Additional categories can be added here
};

// Constants
const EMOJIS_PER_PAGE = 20; // Number of emojis per category page
let currentCategoryIndex = 0;
const categories = [];

// Process rawEmojiData to split large categories into manageable subcategories
const emojiData = {};

// Split large categories into subcategories
Object.keys(rawEmojiData).forEach(category => {
  const emojis = rawEmojiData[category];
  if (emojis.length > EMOJIS_PER_PAGE) {
    const parts = Math.ceil(emojis.length / EMOJIS_PER_PAGE);
    for (let i = 0; i < parts; i++) {
      const partName = `${capitalizeFirstLetter(category)} Part ${i + 1}`;
      emojiData[partName] = emojis.slice(i * EMOJIS_PER_PAGE, (i + 1) * EMOJIS_PER_PAGE);
      categories.push(partName);
    }
  } else {
    const formattedName = capitalizeFirstLetter(category);
    emojiData[formattedName] = emojis;
    categories.push(formattedName);
  }
});

// Function to capitalize the first letter of a string
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Function to load emojis into the grid based on the current category
function loadEmojis() {
  const grid = document.getElementById('emoji-grid');
  const category = categories[currentCategoryIndex];
  document.getElementById('category-name').textContent = category;
  grid.innerHTML = '';
  const emojis = emojiData[category];
  emojis.forEach((emoji) => {
    const item = document.createElement('div');
    item.className = 'emoji-item';
    item.textContent = emoji;
    item.draggable = true;
    // Add event listeners for drag and touch events
    item.addEventListener('dragstart', handleDragStart);
    item.addEventListener('touchstart', handleTouchStart, { passive: false });
    grid.appendChild(item);
  });
}

// Function to navigate between emoji categories
function navigateCategory(direction) {
  if (direction === 'next') {
    currentCategoryIndex = (currentCategoryIndex + 1) % categories.length;
  } else {
    currentCategoryIndex = (currentCategoryIndex - 1 + categories.length) % categories.length;
  }
  loadEmojis();
}

// Event listeners for navigation buttons
document.getElementById('next-page').addEventListener('click', () => navigateCategory('next'));
document.getElementById('prev-page').addEventListener('click', () => navigateCategory('prev'));

// Initial load of emojis
loadEmojis();

// Drag and Drop functionality variables
let draggedEmoji = null;

// Function to handle the start of dragging an emoji
function handleDragStart(e) {
  draggedEmoji = this.textContent;
  e.dataTransfer.setData('text/plain', draggedEmoji);
  // Mobile vibration feedback
  if (navigator.vibrate) {
    navigator.vibrate(50);
  }
}

// Function to handle drag over event on placeholders
function handleDragOver(e) {
  e.preventDefault();
  this.classList.add('highlight');
}

// Function to handle drag leave event on placeholders
function handleDragLeave(e) {
  this.classList.remove('highlight');
}

// Function to handle drop event on placeholders
function handleDrop(e) {
  e.preventDefault();
  this.classList.remove('highlight');
  this.textContent = draggedEmoji;
  // Magnet attach effect
  this.classList.add('magnet-effect');
  setTimeout(() => {
    this.classList.remove('magnet-effect');
  }, 300);
  // Save the current state of placeholders
  savePlaceholders();
}

// Touch Drag and Drop functionality variables and functions
function handleTouchStart(e) {
  e.preventDefault();
  const touch = e.touches[0];
  draggedEmoji = this.textContent;

  const ghost = this.cloneNode(true);
  ghost.style.position = 'absolute';
  ghost.style.top = `${touch.pageY - 25}px`;
  ghost.style.left = `${touch.pageX - 25}px`;
  ghost.id = 'dragging-emoji';
  ghost.style.pointerEvents = 'none';
  ghost.style.zIndex = '1000';
  ghost.style.animation = 'zoomEmoji 5s infinite';
  document.body.appendChild(ghost);

  // Function to handle touch move
  function moveListener(e) {
    const touch = e.touches[0];
    ghost.style.top = `${touch.pageY - 25}px`;
    ghost.style.left = `${touch.pageX - 25}px`;
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    if (element && element.classList.contains('emoji-placeholder')) {
      element.classList.add('highlight');
    } else {
      document.querySelectorAll('.emoji-placeholder.highlight').forEach(el => el.classList.remove('highlight'));
    }
  }

  // Function to handle touch end
  function endListener(e) {
    const touch = e.changedTouches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    if (element && element.classList.contains('emoji-placeholder')) {
      element.textContent = draggedEmoji;
      // Magnet attach effect
      element.classList.add('magnet-effect');
      setTimeout(() => {
        element.classList.remove('magnet-effect');
      }, 300);
      // Save the current state of placeholders
      savePlaceholders();
    }
    ghost.remove();
    document.removeEventListener('touchmove', moveListener);
    document.removeEventListener('touchend', endListener);
    document.querySelectorAll('.emoji-placeholder.highlight').forEach(el => el.classList.remove('highlight'));
  }

  // Attach event listeners for touch move and end
  document.addEventListener('touchmove', moveListener, { passive: false });
  document.addEventListener('touchend', endListener, { passive: false });

  // Mobile vibration feedback
  if (navigator.vibrate) {
    navigator.vibrate(50);
  }
}

// Function to attach drag and drop events to placeholders
function attachPlaceholderEvents() {
  const placeholders = document.querySelectorAll('.emoji-placeholder');
  placeholders.forEach(placeholder => {
    placeholder.addEventListener('dragover', handleDragOver);
    placeholder.addEventListener('dragleave', handleDragLeave);
    placeholder.addEventListener('drop', handleDrop);
  });
}

// Initial attachment of events
attachPlaceholderEvents();

// Reset button functionality to clear all placeholders
document.getElementById('reset-button').addEventListener('click', () => {
  const placeholders = document.querySelectorAll('.emoji-placeholder');
  placeholders.forEach(placeholder => {
    placeholder.textContent = '';
  });
  // Remove saved state from localStorage
  localStorage.removeItem('emojiPlaceholders');
});

// Huiswerk button functionality to toggle its state
const huiswerkButton = document.getElementById('huiswerk-button');
huiswerkButton.addEventListener('click', () => {
  huiswerkButton.classList.toggle('green');
});

// Live time update functionality
function updateTime() {
  const now = new Date();
  const timeString = now.toLocaleTimeString();
  document.getElementById('live-time').textContent = timeString;
}
setInterval(updateTime, 1000); // Update every second
updateTime(); // Initial call

// Function to save the current state of placeholders to localStorage
function savePlaceholders() {
  const placeholders = document.querySelectorAll('.emoji-placeholder');
  const data = {};
  placeholders.forEach((placeholder, index) => {
    data[index] = placeholder.textContent;
  });
  localStorage.setItem('emojiPlaceholders', JSON.stringify(data));
}

// Function to load the saved state of placeholders from localStorage
function loadPlaceholders() {
  const data = JSON.parse(localStorage.getItem('emojiPlaceholders'));
  if (data) {
    const placeholders = document.querySelectorAll('.emoji-placeholder');
    placeholders.forEach((placeholder, index) => {
      if (data[index]) {
        placeholder.textContent = data[index];
      }
    });
  }
}

// Load placeholders on initial load
window.addEventListener('load', loadPlaceholders);

// Function to adjust the layout dynamically based on viewport size
function adjustLayout() {
  const header = document.querySelector('header');
  const huiswerkContainer = document.getElementById('huiswerk-container');
  const planner = document.getElementById('planner');
  const emojiDeck = document.getElementById('emoji-deck');

  const windowHeight = window.innerHeight;
  const headerHeight = header.offsetHeight;
  const huiswerkHeight = huiswerkContainer.offsetHeight;
  const emojiDeckHeight = emojiDeck.offsetHeight;

  const availableHeight = windowHeight - (headerHeight + huiswerkHeight + emojiDeckHeight);

  // Adjust planner height to fit within the remaining viewport
  planner.style.height = `${availableHeight}px`;
}

// Attach event listeners for window load and resize to adjust layout
window.addEventListener('load', adjustLayout);
window.addEventListener('resize', adjustLayout);

// Welcome Screen Functionality
const welcomeScreen = document.getElementById('welcome-screen');
const nextSlideBtn = document.getElementById('next-slide');
const prevSlideBtn = document.getElementById('prev-slide');
const finishWelcomeBtn = document.getElementById('finish-welcome');
const skipWelcomeBtn = document.getElementById('skip-welcome');
const dots = document.querySelectorAll('.dot');
let currentSlide = 1;
const totalSlides = 3;

function showSlide(n) {
  const slides = document.querySelectorAll('.slide');
  if (n > totalSlides) { currentSlide = 1; }
  if (n < 1) { currentSlide = totalSlides; }
  slides.forEach((slide, index) => {
    slide.classList.remove('active');
    if (index === currentSlide - 1) {
      slide.classList.add('active');
    }
  });
  dots.forEach(dot => {
    dot.classList.remove('active');
    if (parseInt(dot.getAttribute('data-slide')) === currentSlide) {
      dot.classList.add('active');
    }
  });
}

function nextSlide() {
  currentSlide++;
  showSlide(currentSlide);
}

function prevSlideFn() {
  currentSlide--;
  showSlide(currentSlide);
}

function goToSlide(n) {
  currentSlide = n;
  showSlide(currentSlide);
}

nextSlideBtn.addEventListener('click', nextSlide);
prevSlideBtn.addEventListener('click', prevSlideFn);
finishWelcomeBtn.addEventListener('click', () => {
  welcomeScreen.style.display = 'none';
});
skipWelcomeBtn.addEventListener('click', () => {
  welcomeScreen.style.display = 'none';
});
dots.forEach(dot => {
  dot.addEventListener('click', () => {
    const slideNumber = parseInt(dot.getAttribute('data-slide'));
    goToSlide(slideNumber);
  });
});
