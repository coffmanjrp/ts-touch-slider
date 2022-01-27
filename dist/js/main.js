"use strict";
var slider = document.querySelector('.slider-container');
var slides = Array.from(document.querySelectorAll('.slide'));
var isDragging = false;
var startPos = 0;
var currentTranslate = 0;
var prevTranslate = 0;
var animationID = 0;
var currentIndex = 0;
// Disable context menu
window.oncontextmenu = function (e) {
    e.preventDefault();
    e.stopPropagation();
    return false;
};
function getPositionX(e) {
    return e.type.includes('mouse')
        ? e.pageX
        : e.touches[0].clientX;
}
function touchMove(e) {
    if (isDragging) {
        var currentPosition = getPositionX(e);
        currentTranslate = prevTranslate + currentPosition - startPos;
    }
}
function setSliderPosition() {
    slider.style.transform = "translateX(".concat(currentTranslate, "px)");
}
function animation() {
    setSliderPosition();
    if (isDragging) {
        requestAnimationFrame(animation);
    }
}
function touchStart(index) {
    return function (e) {
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
    var movedBy = currentTranslate - prevTranslate;
    if (movedBy < -100 && currentIndex < slides.length - 1) {
        currentIndex += 1;
    }
    if (movedBy > 100 && currentIndex > 0) {
        currentIndex -= 1;
    }
    setPositionByIndex();
    slider.classList.remove('grabbing');
}
slides.forEach(function (slide, index) {
    var slideImage = slide.querySelector('img');
    slideImage === null || slideImage === void 0 ? void 0 : slideImage.addEventListener('dragstart', function (e) { return e.preventDefault(); });
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
