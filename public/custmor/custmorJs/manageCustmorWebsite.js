

document.addEventListener("DOMContentLoaded", function () {
  // Toggle Section Expand/Collapse
  const headers = document.querySelectorAll(".toggle-header");
  headers.forEach((header) => {
    header.addEventListener("click", function () {
      const content = this.nextElementSibling;
      const icon = this.querySelector("span");

      const isHidden =
        content.style.display === "none" || content.style.display === "";
      content.style.display = isHidden ? "block" : "none";
      icon.innerHTML = isHidden ? "&#9660;" : "&#9650;"; // Down or Up Arrow
    });
  });

  // Form Handling
  const popDestinationInfoForm = document.getElementById(
    "uploadPopDestinationInfo"
  );

  if (!popDestinationInfoForm) {
    console.error("Form not found!");
    return;
  }

  // Get the data-endpoint value
  const endpoint = popDestinationInfoForm.getAttribute("data-endpoint");

  if (!endpoint) {
    console.error("Data-endpoint attribute is missing!");
    return;
  }

  popDestinationInfoForm.addEventListener("submit", function (event) {
    event.preventDefault();

    console.log("Form submitted");
    console.log("Endpoint:", endpoint);

    const formData = new FormData(popDestinationInfoForm);

    fetch(endpoint, {
      method: "POST",
      body: formData,
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorText = await response.text(); // Read error message from the server
          throw new Error(
            `HTTP error! Status: ${response.status}, Message: ${errorText}`
          );
        }
        return response.json();
      })
      .then((data) => {
        if (data.message) {
          window.location.href = `/custmor/manageDestination?status=success&message=${data.message}`

          
        }
      })
      .catch((err) => {
        console.error("Error:", err);
        alert(`Failed to upload destination images: ${err.message}`);
      });
  });
});
