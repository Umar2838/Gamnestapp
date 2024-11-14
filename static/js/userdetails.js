// Get CSRF token
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

// Form validation
function validateForm() {
    const name = document.getElementById('name').value.trim();
    const gender = document.querySelector('input[name="gender"]:checked') ? document.querySelector('input[name="gender"]:checked').value : null;
    document.getElementById('nameError').textContent = '';
    document.getElementById('genderError').textContent = '';
    let isValid = true;

    if (!name) {
        document.getElementById('nameError').textContent = 'Name is required.';
        isValid = false;
    }
    if (!gender) {
        document.getElementById('genderError').textContent = 'Gender is required.';
        isValid = false;
    }
    return isValid;
}

// Event listener for form submission
document.getElementById('donebtn').addEventListener("click", (event) => {
    event.preventDefault();

    // Show loader and disable button
    document.getElementById("donebtn").disabled = true;
    document.getElementById("userdetailsbuttonText").style.display = "none";
    document.getElementById("userloader").style.display = "inline-block";

    if (validateForm()) {
        const name = document.getElementById('name').value.trim();
        const gender = document.querySelector('input[name="gender"]:checked').value;
        const userData = { name, gender };

        fetch('userdetails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken
            },
            body: JSON.stringify(userData),
        })
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            if (data.status === "success") {
                const successAlert = document.getElementById("success-alert");
                successAlert.style.display = "block";
                setTimeout(() => successAlert.style.display = "none", 1500);
                window.location.href = 'gamepage01';
            } else {
                document.getElementById("otherError").textContent = 'Failed to update profile.';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById("otherError").textContent = 'An error occurred. Please try again.';
        })
        .finally(() => {
            // Reset button state and hide loader
            document.getElementById("donebtn").disabled = false;
            document.getElementById("userdetailsbuttonText").style.display = "inline"; 
            document.getElementById("userloader").style.display = "none"; 
        });
    } else {
        // Hide loader and reset button if validation fails
        document.getElementById("donebtn").disabled = false;
        document.getElementById("userdetailsbuttonText").style.display = "inline";
        document.getElementById("userloader").style.display = "none";
    }
});
