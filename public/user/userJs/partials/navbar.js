
  
  const toggleBtn = document.querySelector(".toggleBtn");
  
  function displayNav() {
    const navbar = document.querySelector(".navEle");
    navbar.classList.toggle("displayClass");
  }
  
  toggleBtn.addEventListener("click", displayNav);
  
  const aboutUsDropDownBtn = document.querySelector("#aboutUsDropDownBtn i");
  const servicesEleDropDownBtn = document.querySelector(
    "#servicesEleDropDownBtn i"
  );
  
  function displayElement(caretEle, ele) {
    //  displaying child ele of navEle
    if (getComputedStyle(ele).display === "none") {
      ele.style.display = "block";
      caretEle.style.transform = "rotate(180deg)";
    } else {
      ele.style.display = "none";
      caretEle.style.transform = "rotate(0deg)";
    }
  }
  
  aboutUsDropDownBtn.addEventListener("click", () => {
    const aboutUsChildEle = document.querySelector(".about_us_services");
    displayElement(aboutUsDropDownBtn, aboutUsChildEle);
  });
  
  servicesEleDropDownBtn.addEventListener("click", () => {
    const servicesChildEle = document.querySelector(".destinationLinks");
    displayElement(servicesEleDropDownBtn, servicesChildEle);
  });
  