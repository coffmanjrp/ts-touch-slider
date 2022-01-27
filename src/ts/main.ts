const slider = document.querySelector('.slider-container') as HTMLDivElement;
const slides = Array.from(
  document.querySelectorAll('.slide')
) as HTMLDivElement[];

let isDragging = false;
let startPos = 0;
let currentTranslate = 0;
let prevTranslate = 0;
let animationID = 0;
let currentIndex = 0;

// Disable context menu
window.oncontextmenu = function (e) {
  e.preventDefault();
  e.stopPropagation();
  return false;
};

function getPositionX(e: MouseEvent | TouchEvent) {
  return e.type.includes('mouse')
    ? (e as MouseEvent).pageX
    : (e as TouchEvent).touches[0].clientX;
}

function touchMove(e: MouseEvent | TouchEvent) {
  if (isDragging) {
    const currentPosition = getPositionX(e);
    currentTranslate = prevTranslate + currentPosition - startPos;
  }
}

function setSliderPosition() {
  slider.style.transform = `translateX(${currentTranslate}px)`;
}

function animation() {
  setSliderPosition();

  if (isDragging) {
    requestAnimationFrame(animation);
  }
}

function touchStart(index: number) {
  return function (e: MouseEvent | TouchEvent) {
    currentIndex = index;
    startPos = getPositionX(e);
    isDragging = true;

    animationID = requestAnimationFrame(animation);
    slider.classList.add('grabbing');
  };
}

function setPositionByIndex() {
  currentTranslate = currentIndex * -window.innerWidth;
  prevTranslate = currentTranslate;
  setSliderPosition();
}

function touchEnd() {
  isDragging = false;
  cancelAnimationFrame(animationID);

  const movedBy = currentTranslate - prevTranslate;

  if (movedBy < -100 && currentIndex < slides.length - 1) {
    currentIndex += 1;
  }

  if (movedBy > 100 && currentIndex > 0) {
    currentIndex -= 1;
  }

  setPositionByIndex();

  slider.classList.remove('grabbing');
}

slides.forEach((slide, index) => {
  const slideImage = slide.querySelector('img');
  slideImage?.addEventListener('dragstart', (e) => e.preventDefault());

  // Touch events
  slide.addEventListener('touchstart', touchStart(index));
  slide.addEventListener('touchend', touchEnd);
  slide.addEventListener('touchmove', touchMove);

  // Mouse events
  slide.addEventListener('mousedown', touchStart(index));
  slide.addEventListener('mouseup', touchEnd);
  slide.addEventListener('mouseleave', touchEnd);
  slide.addEventListener('mousemove', touchMove);
});
