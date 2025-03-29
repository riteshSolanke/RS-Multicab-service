//---------------------slider script -------------------------------------------

// image_slider logic
const slider_box = document.querySelector(".slider_image_box");
const sliderImages = document.querySelectorAll(".slider_img");
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");
let slide_count = 0;

sliderImages[slide_count].classList.add("active");

const nextslide = () => {
  sliderImages[slide_count].classList.remove("active");
  slide_count = (slide_count + 1) % sliderImages.length;
  sliderImages[slide_count].classList.add("active");
  slider_box.style.transform = `translateX(${-slide_count * 100}%)`;
};

const prevslide = () => {
  sliderImages[slide_count].classList.remove("active");
  slide_count = (slide_count - 1 + sliderImages.length) % sliderImages.length;
  sliderImages[slide_count].classList.add("active");
  slider_box.style.transform = `translateX(${-slide_count * 100}%)`;
};

nextBtn.addEventListener("click", nextslide);
prevBtn.addEventListener("click", prevslide);

// adding style to button....
const handleButtonClick = (event) => {
  event.stopPropagation();
  prevBtn.style.backgroundColor = "rgba(36, 31, 31, 0.574)";
  nextBtn.style.backgroundColor = "rgba(36, 31, 31, 0.574)";
  if (event.target === prevBtn) {
    prevBtn.style.backgroundColor = "orange";
  } else if (event.target === nextBtn) {
    nextBtn.style.backgroundColor = "orange";
  }
};
const handleDocumentClick = (event) => {
  prevBtn.style.backgroundColor = "rgba(36, 31, 31, 0.574)";
  nextBtn.style.backgroundColor = "rgba(36, 31, 31, 0.574)";
};

prevBtn.addEventListener("click", handleButtonClick);
nextBtn.addEventListener("click", handleButtonClick);
document.addEventListener("click", handleButtonClick);

prevBtn.addEventListener("click", (event) => event.stopPropagation());
nextBtn.addEventListener("click", (event) => event.stopPropagation());

// auto-slideing logic

const mainArea = document.querySelector(".slider_button_area");

const startAutoSlider = () => {
  autoSlideInterval = setInterval(nextslide, 6000);
};

const stopAutoSlider = () => {
  clearInterval(autoSlideInterval);
};

mainArea.addEventListener("mouseleave", startAutoSlider);

mainArea.addEventListener("mouseenter", stopAutoSlider);

startAutoSlider();
// ------------------------------------------------------------------

// -------------------------------------- choose us slider bar -------------------------------------

document.addEventListener("DOMContentLoaded", () => {
  const sliderFraction = document.querySelector(".slider_containt");
  const sliderButtons = document.querySelectorAll("input[name='slide']");

  // Set the first button as checked by default (if not already set in HTML)
  if (!Array.from(sliderButtons).some((button) => button.checked)) {
    sliderButtons[0].checked = true;
  }

  const chooseIndex = (event) => {
    const newIndex = Array.from(sliderButtons).indexOf(event.target);
    updateIndex(newIndex);
  };

  const updateIndex = (index) => {
    sliderFraction.style.transform = `translateX(-${100 * index}%)`;
  };

  sliderButtons.forEach((button) => {
    button.addEventListener("click", chooseIndex);
  });

  // Set initial position based on the initially checked radio button
  const initialCheckedIndex = Array.from(sliderButtons).findIndex(
    (button) => button.checked
  );
  updateIndex(initialCheckedIndex);

  // Auto sliding
  let autoIndex = initialCheckedIndex;
  let autoSliderInterval;

  const autoSliding = () => {
    autoSliderInterval = setInterval(() => {
      autoIndex = (autoIndex + 1) % sliderButtons.length;
      updateIndex(autoIndex);
      sliderButtons[autoIndex].checked = true;
    }, 6000);
  };

  const stopAutoSlider = () => {
    clearInterval(autoSliderInterval);
  };

  // Start auto sliding when the page loads
  autoSliding();

  // Stop auto sliding when user interacts with the slider
  sliderFraction.addEventListener("mouseover", stopAutoSlider);
  sliderFraction.addEventListener("mouseleave", autoSliding);
});
