const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");


// Login
if (loginForm) {

    loginForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        if (!email || !password) {
            alert("Please fill all fields.");
            return;
        }

        alert("Login successful!");

        window.location.href = "menu.html";
    });
}


// Register
if (registerForm) {

    registerForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const name = document.getElementById("name").value;
        const email = document.getElementById("register-email").value;
        const password =
            document.getElementById("register-password").value;

        const confirmPassword =
            document.getElementById("confirm-password").value;


        if (!name || !email || !password || !confirmPassword) {

            alert("Please fill all fields.");

            return;
        }


        if (password !== confirmPassword) {

            alert("Passwords do not match.");

            return;
        }


        alert("Account created successfully!");

        window.location.href = "login.html";
    });
}