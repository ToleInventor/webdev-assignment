const registrationForm = document.getElementById("regform");
const successMessage = document.getElementById("successMsg");
const memberList = document.getElementById("memberList");
const memberCounter = document.getElementById("count");
const themeToggle = document.getElementById("theme");

console.log("Registration form:", registrationForm);
console.log("Success message:", successMessage);
console.log("Member list:", memberList);
console.log("Member counter:", memberCounter);
console.log("Theme toggle:", themeToggle);

const fields = {
  name: document.getElementById("name"),
  email: document.getElementById("email"),
  password: document.getElementById("password"),
  confirmPassword: document.getElementById("confirm-password"),
  gender: document.getElementById("gender"),
  dob: document.getElementById("dob"),
  country: document.getElementById("country"),
  phone: document.getElementById("phone"),
  bio: document.getElementById("bio"),
};

function getErrorMessage(fieldName) {
  const value =
    fieldName === "password" || fieldName === "confirmPassword"
      ? fields[fieldName].value
      : fields[fieldName].value.trim();

  switch (fieldName) {
    case "name":
      return value.length < 2 ? "Please enter your full name." : "";
    case "email":
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
        ? ""
        : "Please enter a valid email address.";
    case "password":
      return value.length < 8 ? "Password must be at least 8 characters." : "";
    case "confirmPassword":
      return value === fields.password.value
        ? ""
        : "Passwords do not match.";
    case "gender":
      return value ? "" : "Please select your gender.";
    case "dob":
      if (!value) {
        return "Please enter your date of birth.";
      }
      return new Date(value) > new Date()
        ? "Date of birth cannot be in the future."
        : "";
    case "country":
      return value ? "" : "Please enter your country.";
    case "phone": {
      const digits = value.replace(/\D/g, "");
      return /^[+\d().\-\s]+$/.test(value) && digits.length >= 7 && digits.length <= 15
        ? ""
        : "Please enter a valid phone number.";
    }
    case "bio":
      return value ? "" : "Please tell us a little about yourself.";
    default:
      return "";
  }
}

function validateField(fieldName) {
  const field = fields[fieldName];
  const error = field.closest(".field").querySelector(".error");
  const message = getErrorMessage(fieldName);

  error.textContent = message;
  field.classList.toggle("invalid", Boolean(message));
  field.setAttribute("aria-invalid", String(Boolean(message)));

  return !message;
}

const touchedFields = new Set();

Object.entries(fields).forEach(([fieldName, field]) => {
  const validateAfterInteraction = () => {
    touchedFields.add(fieldName);
    validateField(fieldName);

    if (
      fieldName === "password" &&
      (touchedFields.has("confirmPassword") || fields.confirmPassword.value)
    ) {
      validateField("confirmPassword");
    }
  };

  field.addEventListener(
    field.tagName === "SELECT" ? "change" : "input",
    validateAfterInteraction,
  );
  field.addEventListener("blur", validateAfterInteraction);
});

registrationForm.addEventListener("submit", (event) => {
  event.preventDefault();
  successMessage.classList.add("hidden");

  const isValid = Object.keys(fields).map(validateField).every(Boolean);
  if (!isValid) {
    return;
  }

  const emptyNote = document.getElementById("emptyNote");
  if (emptyNote) {
    emptyNote.remove();
  }

  const member = document.createElement("li");
  member.className = "member-item";

  const info = document.createElement("div");
  info.className = "info";

  const name = document.createElement("strong");
  name.textContent = fields.name.value.trim();

  const email = document.createElement("span");
  email.textContent = fields.email.value.trim();

  const removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.className = "remove";
  removeButton.textContent = "Remove";
  removeButton.setAttribute("aria-label", `Remove ${name.textContent}`);

  info.append(name, email);
  member.append(info, removeButton);
  memberList.append(member);
  memberCounter.textContent = memberList.querySelectorAll(".member-item").length;

  successMessage.textContent = `${fields.name.value.trim()} has been registered successfully!`;
  successMessage.classList.remove("hidden");
  registrationForm.reset();
  Object.values(fields).forEach((field) => {
    field.classList.remove("invalid");
    field.removeAttribute("aria-invalid");
    field.closest(".field").querySelector(".error").textContent = "";
  });
});

memberList.addEventListener("click", (event) => {
  if (!event.target.matches(".remove")) {
    return;
  }

  event.target.closest(".member-item").remove();
  const members = memberList.querySelectorAll(".member-item");
  memberCounter.textContent = members.length;

  if (members.length === 0) {
    const emptyNote = document.createElement("li");
    emptyNote.className = "empty";
    emptyNote.id = "emptyNote";
    emptyNote.textContent = "No members yet. Register someone to begin.";
    memberList.append(emptyNote);
  }
});

themeToggle.addEventListener("click", (event) => {
  const bounds = themeToggle.getBoundingClientRect();
  const x = event.clientX || bounds.left + bounds.width / 2;
  const y = event.clientY || bounds.top + bounds.height / 2;

  document.documentElement.style.setProperty("--theme-x", `${x}px`);
  document.documentElement.style.setProperty("--theme-y", `${y}px`);

  const toggleTheme = () => {
    const isDark = document.body.classList.toggle("dark");
    themeToggle.textContent = isDark ? "Light Mode" : "Dark Mode";
    themeToggle.setAttribute("aria-pressed", String(isDark));
  };

  if (document.startViewTransition) {
    document.startViewTransition(toggleTheme);
  } else {
    toggleTheme();
  }
});