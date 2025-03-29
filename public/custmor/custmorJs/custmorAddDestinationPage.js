document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("submitButton")
    .addEventListener("click", async function (event) {
      event.preventDefault();

      const destinationName = document.getElementById("destination_name")?.value.trim();
      const destinationFooterLink = document.getElementById("footerDestinationLink")?.value.trim();
      const htmlContent = document.getElementById("htmlText")?.value.trim();

      if (!destinationName || !destinationFooterLink || !htmlContent) {
        alert("All fields are required!");
        return;
      }

      // Parse HTML to extract `.destination_info` content
      let destinationInfoContent = "";
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, "text/html");
      const destinationInfoDiv = doc.querySelector("div.destination_info");

      if (!destinationInfoDiv) {
        alert("Invalid HTML: .destination_info div is missing!");
        return;
      }

      destinationInfoContent = destinationInfoDiv.innerHTML.trim();

      // Get checkbox values
      const addToServiceHeader = document.getElementById("addToServiceHeader")?.checked ?? false;
      const addDestinationLinkToFooter = document.getElementById("addDestinationLinkToFooter")?.checked ?? false;
      const addToHolidayWindow = document.getElementById("addToHolidayWindow")?.checked ?? false;

      // Get image file
      const uploadInput = document.getElementById("upload_destinationImg");
      const destination_img = uploadInput?.files[0];

      if (!destination_img) {
        alert("Please upload an image!");
        return;
      }

      // Create formData
      const formData = new FormData();
      formData.append("destinationName", destinationName);
      formData.append("destinationFooterLinkName", destinationFooterLink);
      formData.append("destinationHtmlContent", encodeURIComponent(destinationInfoContent));
      formData.append("addToServiceHeader", addToServiceHeader);
      formData.append("addDestinationLinkToFooter", addDestinationLinkToFooter);
      formData.append("addToHolidayWindow", addToHolidayWindow);
      formData.append("destinationImg", destination_img);

      // Send data to backend
      try {
        const response = await fetch("/custmor/upload/destinationImg/uploadDestinationData", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Error during upload");
        }

        window.location.href = `/custmor/addDestination?status=success&message=${result.sms}`;
      } catch (err) {
        console.error(`Error: ${err.message}`);
        alert("Error during uploading data. Please try again.");
      }
    });
});
