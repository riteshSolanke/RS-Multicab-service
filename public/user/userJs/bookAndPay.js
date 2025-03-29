document.addEventListener("DOMContentLoaded", function () {
    const carRent = Number(document.getElementById("car_rent_price").textContent.trim()) || 0;
    const driverAllowance = 500; // Fixed driver allowance
    const subtotal = carRent;
    const totalCost = subtotal + driverAllowance;

    // Update the values in the table
    document.getElementById("subtotal").textContent = subtotal;
    document.getElementById("totalCost").textContent = totalCost;
});
document.getElementById("paymentForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const carId = document.getElementById("carId").value;
    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const email = document.getElementById("email").value;
    const destination = document.getElementById("destination").value;
    const pick_up_address = document.getElementById("pick-up-address").value;
    const date = document.getElementById("date").value;

    try {
      const response = await fetch("/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, phone, email, destination, pick_up_address, date, carId }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Error processing payment");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  });