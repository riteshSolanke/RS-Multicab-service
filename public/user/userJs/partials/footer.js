const destinationNames = document.querySelector("div.destinationNames");

async function fetchDestinationDetails() {
  const response = await fetch(
    "../../../json/custmor/destination/destinationDetails.json"
  );
  const destinationDetails = await response.json();
  console.log(destinationDetails);
  destinationDetails.forEach((element) => {
    const addToFooter = element.addDestinationLinkToFooter === "true";

    if (addToFooter) {
      const listEle = document.createElement("li");
      const anchor = document.createElement("a");
      anchor.innerHTML = element.destinationFooterLink;
      anchor.href = `/custmor/destination/dynamicDestinationPage/${element.destinationFooterLink}`;

      listEle.appendChild(anchor);
      destinationNames.appendChild(listEle);
    }
  });
}

addEventListener("DOMContentLoaded", fetchDestinationDetails);
