// Check if already logged in
const savedRole = localStorage.getItem("userRole");

if (savedRole === "user") {
    window.location.href = "user.html";
}

if (savedRole === "admin") {
    window.location.href = "admin.html";
}

let selectedRole = "user";


function selectRole(role) {

    selectedRole = role;

    document
        .getElementById("user-role")
        .classList.remove("active");

    document
        .getElementById("admin-role")
        .classList.remove("active");


    document
        .getElementById(`${role}-role`)
        .classList.add("active");
}


document
    .getElementById("login-form")
    .addEventListener("submit", function(event) {

        event.preventDefault();


        const name =
            document.getElementById("name").value.trim();

        const password =
            document.getElementById("password").value;


        const error =
            document.getElementById("login-error");


        // User login
        if (selectedRole === "user" && password === "1234") {

            localStorage.setItem("userName", name);
            localStorage.setItem("userRole", "user");

            window.location.href = "user.html";

            return;
        }


        // Admin login
        if (selectedRole === "admin" && password === "4321") {

            localStorage.setItem("adminName", name);
            localStorage.setItem("userRole", "admin");

            window.location.href = "admin.html";

            return;
        }


        error.textContent =
            "Invalid password. Please try again.";

    });