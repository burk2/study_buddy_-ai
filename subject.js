const buttons = document.querySelectorAll(".subjectBtn");

buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    const subject = btn.dataset.subject;
    localStorage.setItem("selectedSubject", subject);
    window.location.href = "dashboard.html";
  });
});
