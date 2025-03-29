document.addEventListener("DOMContentLoaded", function () {
  function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  }

  const status = getQueryParam("status");
  const message = getQueryParam("message");

  if (status && message) {
    Swal.fire({
      icon: status === "success" ? "success" : "error",
      title: status === "success" ? "Success!" : "Oops...",
      text: decodeURIComponent(message),
      confirmButtonColor: status === "success" ? "#3085d6" : "#d33",
      confirmButtonText: "OK",
    }).then(() => {
      // Remove query parameters from the URL after showing alert
      window.history.replaceState(null, null, window.location.pathname);
    });
  }
});
