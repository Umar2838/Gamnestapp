function redirectToPage() {
    setTimeout(function() {
      window.location.href = "signup";  
    }, 3000); 
  }
  
window.onload = redirectToPage;

var error = document.getElementById("error")
var signuperror = document.getElementById("signuperror")

const loginForm = document.getElementById("loginform");
    
    loginForm && loginForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        // const agreeCheckbox = document.getElementById("agreeCheckbox").checked;
        let isValid = true;

        // Username validation
        if (!username) {
            document.getElementById("usernameError").style.display = "block";
            isValid = false;
        } else {
            document.getElementById("usernameError").style.display = "none";
        }

        // Password validation
        const passwordError = document.getElementById("passwordError");
        if (!(password)) {
            passwordError.style.display = "block";
            isValid = false;
        } else {
            passwordError.style.display = "none";
        }

       

        // If form is valid, show loader and submit the form via AJAX
        if (isValid) {
            document.getElementById("loginButton").disabled = true; // Disable button
            document.getElementById("buttonText").style.display = "none"; // Hide "Login" text
            document.getElementById("loader").style.display = "inline-block"; // Show loader

            const formData = new FormData(loginForm);

            // Use Fetch to send the data asynchronously
            fetch("loginemail", {  // Replace 'loginemail' with your actual view name
                method: 'POST',
                body: formData,
            })
            .then(response => response.json()) // Assuming the server responds with JSON
            .then(data => {
                // Handle success or failure
                if (data.success) {
                    // Redirect or show success message
                    window.location.href = data.redirect_url;  // Replace with the redirect URL
                } else {
                    // Show error message
                    error.textContent = data.message;  // Show the error message returned by the server
                }
            })
            .catch(err => {
                // Handle errors
                console.error('Error:', err);
                error.textContent = 'Something went wrong. Please try again later.(400)';
            })
            .finally(() => {
                // Hide loader and reset button
                document.getElementById("loginButton").disabled = false;
                document.getElementById("buttonText").style.display = "inline"; // Show "Login" text
                document.getElementById("loader").style.display = "none"; // Hide loader
            });
        }
    });
// Password validation function



const signupForm = document.getElementById("signupForm");

signupForm && signupForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(signupForm);
    const signupButton = document.getElementById("signupButton");
    const signupButtonText = document.getElementById("signupbuttonText");
    const signupLoader = document.getElementById("signuploader");
    const signuperror = document.getElementById("signuperror");

    // Show loader and hide button text
    signupButton.disabled = true;
    signupButtonText.style.display = "none";
    signupLoader.style.display = "block";

    fetch("signupemail", {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location.href = data.redirect_url;
        } else {
            signuperror.textContent = data.message;
        }
    })
    .catch(error => {
        console.error('Error:', error);
        signuperror.textContent = 'An error occurred. Please try again. (400)';
    })
    .finally(() => {
        signupButton.disabled = false;
        signupButtonText.style.display = "inline";
        signupLoader.style.display = "none";
    });
});
