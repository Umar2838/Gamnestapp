function redirectToPage() {
    setTimeout(function() {
      window.location.href = "loginshow";  
    }, 3000); 
  }
  
window.onload = redirectToPage;



function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }
  const csrftoken = getCookie('csrftoken');
  

  document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginform");

    loginForm && loginForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const csrftoken = document.querySelector("[name=csrfmiddlewaretoken]").value;

        if (!email || !password) {
            document.getElementById("error").textContent = "Both email and password are required.";
            const errorModal = new bootstrap.Modal(document.getElementById("errorModal"));
            errorModal.show();
            return;
        }

        const data = { email: email, password: password };

        // Disable button & show loader
        document.getElementById("loginButton").disabled = true;
        document.getElementById("buttonText").style.display = "none";
        document.getElementById("loader").style.display = "inline-block";

        fetch("loginemail", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrftoken
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById("success").textContent = data.message;
                const successModal = new bootstrap.Modal(document.getElementById("successModal"));
                successModal.show();
                
                setTimeout(() => {
                    successModal.hide();
                    window.location.href = data.redirect_url;
                }, 1000);
            } else {
                document.getElementById("error").textContent = data.message;
                const errorModal = new bootstrap.Modal(document.getElementById("errorModal"));
                errorModal.show();
            }
        })
        .catch(error => {
            console.error("Error:", error);
            document.getElementById("error").textContent = "An error occurred. Please try again.";
            const errorModal = new bootstrap.Modal(document.getElementById("errorModal"));
            errorModal.show();
        })
        .finally(() => {
            document.getElementById("loginButton").disabled = false;
            document.getElementById("buttonText").style.display = "inline";
            document.getElementById("loader").style.display = "none";
        });
    });
});




const signupForm = document.getElementById("signupForm");

signupForm && signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const signupButton = document.getElementById("signupButton");
    const signupButtonText = document.getElementById("signupbuttonText");
    const signupLoader = document.getElementById("signuploader");

    if (!username || !email || !password) {
        const erromodal = new bootstrap.Modal(document.getElementById('errorModal'));
        erromodal.show();
        document.getElementById('error').textContent =  "All fields are required";
  
    }

    const signupData = {
        username: username,
        email: email,
        password: password
    };

 

    signupButton.disabled = true;
    signupButtonText.style.display = "none";
    signupLoader.style.display = "inline-block";


    console.log(signupData)

    fetch("signupemail", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken
        },
        body: JSON.stringify(signupData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const successModalElement = document.getElementById('successModal');
            const successmodal = new bootstrap.Modal(successModalElement);
              successmodal.show();
              document.getElementById("success").textContent = data.message;
              setTimeout(()=>{
                successmodal.hide()
                window.location.href = data.redirect_url
              },500)
           
        } else {
            const erromodal = new bootstrap.Modal(document.getElementById('errorModal'));
            erromodal.show();
            document.getElementById('error').textContent = data.message;
        }
    })
    .catch(error => {
        console.error("Error:", error);
        const erromodal = new bootstrap.Modal(document.getElementById('errorModal'));
        erromodal.show();
        document.getElementById('error').textContent = "An error occurred. Please try again.";
      
    })
    .finally(() => {
        signupButton.disabled = false;
        signupButtonText.style.display = "inline";
        signupLoader.style.display = "none";
    });
});

