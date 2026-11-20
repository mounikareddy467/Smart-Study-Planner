/* ===== script.js =====
   Shared page logic: motivational quotes, contact form,
   and initialization for each page.
*/

/* ---------- Motivational Study Quotes ---------- */
var studyQuotes = [
  "The secret of getting ahead is getting started. - Mark Twain",
  "Success is the sum of small efforts repeated day in and day out. - Robert Collier",
  "Don't watch the clock; do what it does. Keep going. - Sam Levenson",
  "The expert in anything was once a beginner. - Helen Hayes",
  "Push yourself, because no one else is going to do it for you.",
  "Dream big. Start small. Act now. - Robin Sharma",
  "The future depends on what you do today. - Mahatma Gandhi",
  "Hard work beats talent when talent doesn't work hard. - Tim Notke",
  "Study while others are sleeping; work while others are loafing. - William A. Ward",
  "Believe you can and you're halfway there. - Theodore Roosevelt",
  "It always seems impossible until it's done. - Nelson Mandela",
  "Quality is not an act, it is a habit. - Aristotle",
  "Strive for progress, not perfection.",
  "The only way to do great work is to love what you do. - Steve Jobs",
  "An investment in knowledge pays the best interest. - Benjamin Franklin"
];

function showRandomQuote() {
  var el = document.getElementById("motivationQuote");
  if (!el) return;
  var index = Math.floor(Math.random() * studyQuotes.length);
  el.textContent = studyQuotes[index];
}

/* ---------- Contact Form ---------- */
function initContactForm() {
  var form = document.getElementById("contactForm");
  if (!form) return;
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var name = document.getElementById("contactName").value.trim();
    var email = document.getElementById("contactEmail").value.trim();
    var message = document.getElementById("contactMessage").value.trim();
    var alertBox = document.getElementById("contactAlert");

    if (!name || !email || !message) {
      if (alertBox) {
        alertBox.className = "alert alert-danger mt-3";
        alertBox.textContent = "Please fill in your name, email and message.";
      }
      return;
    }

    // Basic email format check
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      if (alertBox) {
        alertBox.className = "alert alert-danger mt-3";
        alertBox.textContent = "Please enter a valid email address.";
      }
      return;
    }

    if (alertBox) {
      alertBox.className = "alert alert-success mt-3";
      alertBox.textContent = "Thank you, " + name + "! Your message has been received.";
    }
    form.reset();

    // Hide the alert after 4 seconds
    setTimeout(function () {
      if (alertBox) alertBox.className = "alert alert-success mt-3 d-none";
    }, 4000);
  });
}

/* ---------- Page Initialization ---------- */
document.addEventListener("DOMContentLoaded", function () {
  // Show a random motivational quote on the home page
  showRandomQuote();

  // Initialize the contact form if present
  initContactForm();

  // Initialize the task management page if present
  if (document.getElementById("taskForm")) {
    initTaskPage();
  }

  // Initialize the dashboard page if present
  if (document.getElementById("calendarGrid")) {
    initDashboardPage();
  }
});
