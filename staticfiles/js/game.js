
 const swiperno1 = new Swiper('.swiper', {
    direction: 'horizontal',
    loop: true,
    pagination: {
      el: '.custom-swiper-pagination',
      clickable: true,
      bulletClass: "swiper-pagination-bullet",
      bulletActiveClass: "swiper-pagination-bullet-active",
    },
  
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  
    scrollbar: {
      el: ".swiper-scrollbar",
    },
  });
  
  var swiper = new Swiper(".mySwiper", {
    effect: "coverflow",
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: "auto",
    coverflowEffect: {
      rotate: 0,
      stretch: 0,
      depth: 300,
      modifier: 1,
      slideShadows: false,
    },
    pagination: {
      el: ".swiper-pagination",
    },
  });
  document.addEventListener("DOMContentLoaded", function () {
    // Function to show the selected tab and update the URL
    function showTab(targetId) {
        // Hide all tab wrappers
        const wrappers = document.querySelectorAll('.game-wrapper, .support-wrapper, .qr-wrapper, .ticket-wrapper, .profile-wrapper');
        wrappers.forEach(wrapper => {
            wrapper.classList.add('hidden');
        });

        // Show the selected tab
        const targetWrapper = document.getElementById(targetId);
        if (targetWrapper) {
            targetWrapper.classList.remove('hidden');
        }

        // Update the URL without reloading the page
        history.pushState(null, null, `#${targetId}`);

        // Highlight the active link in the app bar
        const links = document.querySelectorAll('.icon-bar a');
        links.forEach(link => {
            link.classList.remove('active'); // Remove active class from all links
            if (link.getAttribute('href') === `#${targetId}`) {
                link.classList.add('active'); // Add active class to the current link
            }
        });
    }

    // Get the current hash from the URL
    const currentHash = window.location.hash.substring(1);
    if (currentHash) {
        showTab(currentHash);
    } else {
        showTab('games'); // Default tab to show if no hash
    }

    // Add click event listeners to the icon bar links
    const links = document.querySelectorAll('.icon-bar a');
    links.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault(); // Prevent default anchor behavior
            const targetId = this.getAttribute('href').substring(1);
            showTab(targetId);
        });
    });
});
  var swiper = new Swiper(".listmySwiper", {
    slidesPerView: 5,
    spaceBetween: 20,
  });
  
  const icons = document.querySelectorAll('.icon-bar a');
  
  // Loop through all icons and add a click event listener
  icons.forEach((icon) => {
    icon.addEventListener("click", function () {
      // Remove the 'active' class from all icons
      icons.forEach((i) => i.classList.remove("active"));
  
      this.classList.add("active");
    });
  });
  
  // Get all the icons in the icon bar
  const iconLinks = document.querySelectorAll(".icon-bar a");
  
  // Function to show the relevant section and hide others
  function showContent(targetId) {
    // Hide all content sections
    const sections = document.querySelectorAll(
      ".game-wrapper, .support-wrapper, .qr-wrapper, .ticket-wrapper, .profile-wrapper"
    );
    sections.forEach((section) => {
      section.classList.add("hidden");
      document.getElementById("ownedticket").style.display="none"
      // Add 'hidden' class to hide the section
    });
  
    // Show the selected section
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
      targetSection.classList.remove("hidden"); 
  
      document.getElementById("ownedticket").style.display="none"

    }
  
    // Remove 'active' class from all icons
    iconLinks.forEach((icon) => icon.classList.remove("active"));
  
    // Add 'active' class to the clicked icon
    const clickedIcon = document.querySelector(`a[data-target="${targetId}"]`);
    if (clickedIcon) {
      clickedIcon.classList.add("active");
    }
  }
  
  

  // Function to fetch venue names from the API
// Function to fetch venue names from the API
async function fetchVenueNames() {
  try {
      const response = await fetch('https://dashboard.gamenest.se/api/getVenuename/');
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      const venueData = await response.json();
      
      // Extract names from the venue data
      const venueNames = venueData.map(venue => venue.name ); // Assuming venueData is an array of objects
      return venueNames; // Return an array of venue names
  } catch (error) {
      console.error('Error fetching venue names:', error);
      return [];
  }
}

// Inside your existing code
iconLinks.forEach((link) => {
  link.addEventListener("click", function (event) {
      event.preventDefault();
      const targetId = this.getAttribute("data-target");
      showContent(targetId);

      if (targetId == "qr") {
          const qrCodeSuccessCallback = async (decodedText, decodedResult) => {
              console.log(decodedResult);
              const venueNames = await fetchVenueNames(); // Fetch venue names from the API
              localStorage.setItem("venueName",decodedText)
              // Check if the decoded text matches any venue name from the API
              if (venueNames.includes(decodedText)) {
                  if (ticketAvailability && ticketAvailability.children.length > 0) {
                      venuenonavailability.style.display = "none";
                      ticketAvailability.classList.add("ticket-animate");
                      ticketAvailability.style.display = "block";
                  } else {
                      // Otherwise, show the no tickets available message
                      venuenonavailability.style.display = "none";
                      ticketNonAvailability.style.display = "block";
                      ticketNonAvailability.classList.add("ticket-animate");
                  }

                  // Add blur effect to the background
                  appBody.classList.add("blur-background");
              } else {
                  venuenonavailability.classList.add("ticket-animate");
                  venuenonavailability.style.display = "block";
                  appBody.classList.add("blur-background");
              }

              appBody.addEventListener("click", () => {
                  if (ticketNonAvailability) {
                      ticketNonAvailability.style.display = "none";
                      ticketNonAvailability.classList.remove("ticket-animate");
                  }

                  if (ticketAvailability) {
                      ticketAvailability.style.display = "none";
                      ticketAvailability.classList.remove("ticket-animate");
                  }
                  if (venuenonavailability) {
                      venuenonavailability.style.display = "none";
                      venuenonavailability.classList.remove("ticket-animate");
                  }

                  appBody.classList.remove("blur-background");
              });
          };

          // Configuration for QR code scanner
          const config = {
              fps: 90,
              qrbox: {
                  width: 250,
                  height: 250
              }
          };

          // Create an instance of the QR scanner
          const qrCodeScanner = new Html5Qrcode("qr-video-container");

          // Start scanning the QR code
          qrCodeScanner.start(
              { facingMode: "environment" }, // Use the environment camera
              config,
              qrCodeSuccessCallback
          ).catch((err) => {
              console.error("QR Code scanning failed", err);
          });

          const refreshButton = document.querySelector("#qr-scanner #refresh");

          // Add an event listener to the refresh button if it exists
          if (refreshButton) {
              refreshButton.addEventListener("click", () => {
                  window.location.reload();
              });
          }
      }
  });
});
  
  // Initially show the games section (or any default section)
  showContent("games");
  
  const ticketowned = document.getElementById("ownedticketsShower");
  
  ticketowned &&
    ticketowned.addEventListener("click", () => {
      document.getElementById("ticket").style.display = "none";
      document.getElementById("ownedticket").style.display = "block";
    });
    document.addEventListener("DOMContentLoaded", function () {
      // Wallet Arrow Logic
      const walletArrow = document.getElementById("walletarrow");
      const otherPayment = document.getElementById("otherpayment");
  
      if (walletArrow) {
          walletArrow.addEventListener("click", function () {
              const isRightArrow = walletArrow.src.includes("_content-right.png");
              
              // Update arrow image dynamically
              walletArrow.src = isRightArrow
                  ? "static/assets/arrow-up.png"
                  : "static/assets/_content-right.png";
              
              // Toggle visibility of the other payment options
              otherPayment.style.display = isRightArrow ? "block" : "none";
          });
      }
  
      // Payment Arrow Logic
      const paymentArrow = document.getElementById("paymentarrow");
      const paymentDetails = document.getElementById("paymentdetails"); // Ensure this ID exists in the HTML
  
      if (paymentArrow) {
          paymentArrow.addEventListener("click", function () {
              const isRightArrow = paymentArrow.src.includes("_content-right.png");
  
              // Update arrow image dynamically
              paymentArrow.src = isRightArrow
                  ? "static/assets/arrow-up.png"
                  : "static/assets/_content-right.png";
  
              // Toggle visibility of payment details
              if (paymentDetails) {
                  paymentDetails.style.display = isRightArrow ? "block" : "none";
              }
          });
      }
  });
  

  
    const settingsLink = document.getElementById("moreoption");
    const settingsDrawer = document.getElementById('settingsDrawer');
    const overlay = document.getElementById('overlay');
    
  
    // Open the drawer when clicking the settings link
    settingsLink && settingsLink.addEventListener('click', function (e) {
      e.preventDefault(); // Prevent the default anchor behavior
      settingsDrawer.classList.add('open');
      overlay.classList.remove('hidden');
      settingsDrawer.classList.remove('hidden');
    });
  
    // Close the drawer and overlay when clicking outside the drawer (on the overlay)
    overlay && overlay.addEventListener('click', function () {
      settingsDrawer.classList.remove('open');
      setTimeout(() => {
        overlay.classList.add('hidden');
        settingsDrawer.classList.add('hidden');
      }); // Wait for the transition to finish before hiding
    });
  
  const gamesTab = document.getElementById('gamesTab');
  const ticketsTab = document.getElementById('tickets');
  const gameunderline = document.getElementById("gameunderline");
  const ticketunderline = document.getElementById("ticketunderline");
  const gamecontent = document.getElementById("gamecontent")
  const ticketcontent = document.getElementById("ticketcontent")
  
  ticketsTab &&  ticketsTab.addEventListener('click', function () {
  gameunderline.classList.remove("underline");
  gamecontent.style.display="none"
  ticketunderline.classList.add("underline");
  ticketcontent.style.display="block"
  
  });
  
  // Event listener for Games tab click
  gamesTab && gamesTab.addEventListener('click', function () {
    ticketcontent.style.display="none"
    ticketunderline.classList.remove("underline");
    gameunderline.classList.add("underline");
    gamecontent.style.display="block"
  });
  
  const locationActive = document.getElementById("locationActive")
  locationActive && locationActive.addEventListener("click",()=>{
    locationActive.classList.add("font-bold")
  })
  
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
  
  // Support tab functionality

  let currentContactInfo = '';
  // Open the modal with relevant details
  function openModal(type, content) {
      const modal = document.getElementById('contactModal');
      const modalTitle = document.getElementById('modalTitle');
      const modalContent = document.getElementById('modalContent');
      const copiedMessage = document.getElementById('copiedMessage');

      currentContactInfo = content; // Save the current content for copying

      if (type === 'call') {
          modalTitle.textContent = 'Call Us';
          modalContent.textContent = `Phone Number: ${content}`;
      } else if (type === 'email') {
          modalTitle.textContent = 'Email Us';
          modalContent.textContent = `Email: ${content}`;
      }

      // Hide the copied message by default when opening the modal
      copiedMessage.classList.add('hidden');

      modal.classList.remove('hidden');
  }

  // Close the modal
  function closeModal() {
      const modal = document.getElementById('contactModal');
      modal.classList.add('hidden');
  }

  // Copy the contact information to clipboard
  function copyToClipboard() {
      const copiedMessage = document.getElementById('copiedMessage');

      navigator.clipboard.writeText(currentContactInfo).then(() => {
          // Display the success message inside the modal
          copiedMessage.classList.remove('hidden');

          // Optionally, you can hide the "Copied" message after a few seconds
          setTimeout(() => {
              copiedMessage.classList.add('hidden');
          }, 2000); // Hide after 2 seconds
      }).catch((err) => {
          // In case of an error, you can handle it here
          alert('Failed to copy: ', err);
      });
  }

  // Select all elements with the class 'rating'
  const ratings = document.querySelectorAll('.rating');

  ratings.forEach(rating => {
      // Get the rating value from the data attribute
      const ratingValue = parseFloat(rating.getAttribute('data-rating'));
      const fullStars = Math.floor(ratingValue); // Full stars
      const halfStar = ratingValue % 1 >= 0.5 ? 1 : 0; // Half star
      const emptyStars = 5 - fullStars - halfStar; // Empty stars

      // Create the star HTML
      let starsHTML = '';

      // Add full stars
      for (let i = 0; i < fullStars; i++) {
          starsHTML += '⭐'; // Full star
      }

      // Add half star if applicable
      if (halfStar) {
          starsHTML += '⭐'; // Half star (you can use a different character or image for half star)
      }

      // Add empty stars
      for (let i = 0; i < emptyStars; i++) {
          starsHTML += '☆'; // Empty star
      }

      // Set the inner HTML of the rating element
      rating.innerHTML = `${starsHTML} (${ratingValue})`;
  });

  const support = document.getElementById('supportForm');
  const supportText = document.getElementById("supportText");
  const loader = document.getElementById("loader");
  const supportError = document.getElementById("supportError");
  
  support && support.addEventListener('submit', function (e) {
      e.preventDefault();  
  
      const title = document.getElementById('title').value;
      const description = document.getElementById('description').value;
      const fileInput = document.getElementById('fileInput');
      const attachment = fileInput.files[0];
  
      // Get selected venue (radio button)
      const selectedVenue = document.querySelector('input[name="venues"]:checked');
      const venueName = selectedVenue ? selectedVenue.value : '';
  
      if (!title || !description || !venueName) {
        document.getElementById("supporterror").textContent = "Title, description, and venue are required!";
        const errorModal = new bootstrap.Modal(document.getElementById("supporterrorModal"));
        errorModal.show();
          return;
      }
  
      supportText.style.display = "none";
      loader.style.display = "block";
  
      // Use FormData to handle form submission with files
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('venue', venueName);
      if (attachment) {
          formData.append('attachment', attachment);
      }
  
      fetch('submitTicket', {  
          method: 'POST',
          headers: {
              'X-CSRFToken': csrftoken  // CSRF token is required
          },
          body: formData
      })
      .then(response => response.json())
      .then(data => {
          if (data.status === 'success') {
              supportError.textContent = "";
              supportText.style.display = "block";
              loader.style.display = "none";
  
              document.getElementById("supportsuccess").textContent = data.message;
                const successModal = new bootstrap.Modal(document.getElementById("supportsuccessModal"));
                successModal.show();
                setTimeout(() => {
                    successModal.hide();
                    window.location.href = "./gamepage01";
                  }, 1000);
          } else {
            document.getElementById("supporterror").textContent = data.message;
            const errorModal = new bootstrap.Modal(document.getElementById("supporterrorModal"));
            errorModal.show();
              loader.style.display = "none";
          }
      })
      .catch(error => {
          console.error('Error:', error);
          document.getElementById("supporterror").textContent ='An error occurred while submitting the ticket.';
            const errorModal = new bootstrap.Modal(document.getElementById("supporterrorModal"));
            errorModal.show();
          supportText.style.display = "block";
          loader.style.display = "none";
      });
  });
  


// Edit profile functionality

function showFileName(event) {
  const fileName = event.target.files[0]?.name || "No file chosen";
  document.getElementById('fileName').innerText = fileName;
}


const editForm = document.getElementById('editForm');
const submitButton = document.getElementById('profilebtn');
const buttonText = document.getElementById('buttonText');
const profileloader = document.getElementById('profileloader'); // Get the loader element
const errorContainer = document.getElementById("errorContainer")
const messageContainer = document.getElementById("messageContainer")

editForm && editForm.addEventListener('submit', (e) => {
  errorContainer = ''
  messageContainer = ''
  e.preventDefault();

  // Show loader, hide "Done" text
  buttonText.style.display = 'none';
  profileloader.style.display="block";

  const fname = document.getElementById('fname').value;
  const username = document.getElementById('username').value;
  const date = document.getElementById('date').value;
  const email = document.getElementById('email').value;
  const fileInput = document.getElementById('fileInput').files[0];
  const currentPassword = document.getElementById('currentPassword').value;
  const newPassword = document.getElementById('newPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  const formData = new FormData();

  // Append form data fields
  formData.append('fname', fname);
  formData.append('username', username);
  formData.append('date', date);
  formData.append('email', email);
  formData.append('currentPassword', currentPassword);
  formData.append('newPassword', newPassword);
  formData.append('confirmPassword', confirmPassword);

  if (fileInput) {
      formData.append('fileInput', fileInput);
  }

  // Clear previous messages
  const messageContainer = document.getElementById('messageContainer');
  messageContainer.textContent = '';
  messageContainer.classList.remove('text-red-500', 'text-green-500');

  fetch('editprofile', {
      method: 'POST',
      headers: {
          'X-CSRFToken': csrftoken,
          'Content-Type': 'application/json' // Expect JSON response
      },
      body: formData
  })
  .then(response => {
      if (!response.ok) { // If HTTP status is not OK
          throw response;
      }
      return response.json();
  })
  .then(data => {
      
      // Display the message based on status
      if (data.status === 'error') {
      } else {
        
      }
  })
  .catch(async error => {
      // Hide loader, show "Done" text
      profileloader.style.display = "none";
      buttonText.style.display = 'inline'; // Show the "Done" text

      let errorMessage = 'An error occurred while updating the profile.';
      if (error.json) { // Attempt to parse JSON if available
          const errData = await error.json();
          errorMessage = errData.message || errorMessage;
      }
      console.error('Error:', errorMessage);
      messageContainer.textContent = errorMessage;
      messageContainer.classList.add('text-red-500');
  });
});



var swiper = new Swiper(".gamesmySwiper", {
  effect: "coverflow",
  grabCursor: true,

  slidesPerView: 2,
  coverflowEffect: {
    rotate: 50,
    stretch: 0,
    depth: 20,
    modifier: 1,
  },
});


const appBody = document.getElementById("qr"); 
const ticketAvailability = document.getElementById("ticketavailability");
const ticketNonAvailability = document.getElementById("ticketnonavailability");
const venuenonavailability = document.getElementById("venuenonavailability")


// Hide availability and remove blur when clicking on appBody

const qrloader = document.getElementById("qrloader");
const qrbody = document.getElementById("qr");

async function handleTicketClick(event) {
  const button = event.currentTarget;
  const ticketId = button.getAttribute("data-ticketid");
  const purchasedTicketId = button.getAttribute("data-purchasedticketid");
  const userId = button.getAttribute("data-userid");
  const ticketPrice = button.getAttribute("data-ticketprice");
  const venueData = JSON.parse(button.getAttribute("data-ticketVenue"));

  // Show loader
  qrbody.style.display = "none";
  qrloader.style.display = "flex";

  try {
      // Fetch ticket details from API
      const response = await fetch("https://dashboard.gamenest.se/api/getTickets/");
      const tickets = await response.json();

      // Find the clicked ticket in API response
      const ticket = tickets.find(t => t.id === parseInt(ticketId));

      if (!ticket) {
          alert("Ticket not found in the system.");
          qrbody.style.display = "flex";
          qrloader.style.display = "none";
          return;
      }

      // Check if any venue linked to the ticket is active
      let venueActive = false;
      let venueId = null;
console.log(venueData)
      for (let venue of venueData) {
          if (ticket.status[String(venue.id)] === "active") {
              venueActive = true;
              venueId = venue.id; // Store active venue ID
              break;
          }
      }

      if (!venueActive) {
          alert("This ticket is inactive for all linked venues.");
          qrbody.style.display = "flex";
          qrloader.style.display = "none";
          return;
      }

      // Proceed with the ticket update request
      const updateResponse = await fetch("gamepage01", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              "X-CSRFToken": csrftoken,
          },
          body: JSON.stringify({
              ticketpurchaseid: purchasedTicketId,
              userid: userId,
              ticketprice: ticketPrice,
              venue_id: venueId // Send the active venue ID
          }),
      });

      const data = await updateResponse.json();

      if (data.success) {
          console.log("Ticket updated successfully");
          window.location.href = "gamepage01";
      } else {
          alert(data.message || "Error updating ticket.");
      }
  } catch (error) {
      console.error("Error:", error);
      alert("Failed to process ticket.");
  }

  // Hide loader
  qrbody.style.display = "flex";
  qrloader.style.display = "none";
}




    
// ==========================Ticket data =======================================



  // Select all elements with the class 'ticket-buy'
  const ticketButtons = document.querySelectorAll('.ticket-buy');

  async function fetchVenueData() {
    try {
      const response = await fetch('https://dashboard.gamenest.se/api/getVenuename/');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const venueData = await response.json();
  
      // Extract both id and name from the venue data
      const venueNames = venueData.map(venue => ({
        id: venue.id,
        name: venue.name
      }));
  
      return venueNames; // Return an array of objects with id and name
    } catch (error) {
      console.error('Error fetching venue names:', error);
      return [];
    }
  }
  
  ticketButtons.forEach(button => {
    button.addEventListener('click', async function(event) {
      // Prevent the default anchor click behavior
      event.preventDefault();
  
      const ticketId = this.getAttribute('data-id');
      const ticketName = this.getAttribute('data-name');
      const ticketPrice = parseFloat(this.getAttribute('data-price'));
      const ticketCredits = this.getAttribute('data-credits');
      const ticketStatus = this.getAttribute("data-status");
  
      // Create a ticket object
      const ticketData = {
        id: ticketId,
        name: ticketName,
        price: ticketPrice,
        credits: ticketCredits,
        status: ticketStatus
      };
  
      // Save to local storage
      localStorage.setItem('selectedTicket', JSON.stringify(ticketData));
  
      const ticketData1 = JSON.parse(localStorage.getItem('selectedTicket'));
      console.log(ticketData1);
  
      // Parse the status and filter for active status
      const statusObj = JSON.parse(ticketData1.status.replace(/'/g, '"'));
  
      // Filter the status to get only the active keys
      const activeStatuses = Object.entries(statusObj)
        .filter(([key, value]) => value === 'active')
        .map(([key, value]) => key);
  
      console.log('Active Statuses:', activeStatuses);
  
      // Fetch venue data
      const venueData = await fetchVenueData();
      console.log(venueData);
  
      // Filter the venues that match the active statuses
      const activeVenues = venueData.filter(venue => activeStatuses.includes(venue.id.toString()));
  
      // Show the venue names in the modal
      const venueSelectionContainer = document.getElementById('venue-selection-container');
      venueSelectionContainer.innerHTML = ''; // Clear any previous content
  
      if (activeVenues.length === 0) {
        // Show message if no venues are available
        const noVenuesMessage = document.createElement('p');
        noVenuesMessage.textContent = "No venues available for this ticket.";
        venueSelectionContainer.appendChild(noVenuesMessage);
      } else {
        // Show venues as checkboxes
        activeVenues.forEach(venue => {
          const venueElement = document.createElement('div');
          venueElement.classList.add('venue-option');
          
          // Create a checkbox for the venue
          const venueCheckbox = document.createElement('input');
          venueCheckbox.type = 'checkbox';
          venueCheckbox.id = `venue-${venue.id}`;
          venueCheckbox.value = venue.id;
          
          const venueLabel = document.createElement('label');
          venueLabel.setAttribute('for', `venue-${venue.id}`);
          venueLabel.textContent = venue.name;
  
          venueElement.appendChild(venueCheckbox);
          venueElement.appendChild(venueLabel);
          venueSelectionContainer.appendChild(venueElement);
          
               
        });
      }
  
      // Show the modal
      const venueModal = new bootstrap.Modal(document.getElementById('venueTicket'));
      message.textContent = ""
      venueModal.show();

  
      // Add functionality to confirm the venue selection
      const confirmButton = document.getElementById('confirm-venue-selection');
      confirmButton.addEventListener('click', function() {
        const selectedVenueCheckboxes = document.querySelectorAll('.venue-option input[type="checkbox"]:checked');
        const selectedVenueIds = [];
  
        selectedVenueCheckboxes.forEach(checkbox => {
          selectedVenueIds.push(checkbox.value);
        });
  
        if (selectedVenueIds.length > 0) {
          const selectedVenues = activeVenues.filter(venue => selectedVenueIds.includes(venue.id.toString()));
          console.log('Selected Venues:', selectedVenues);
          message.textContent = `You selected the following venues: ${selectedVenues.map(venue => venue.name).join(', ')}`
          // Store selected venues in localStorage or process further
          localStorage.setItem('selectedVenues', JSON.stringify(selectedVenues));
          const finalticketData = {
            id: ticketId,
            name: ticketName,
            price: ticketPrice,
            credits: ticketCredits,
            venue : selectedVenues
          }; 
          localStorage.setItem("finalticketData",JSON.stringify(finalticketData))
          // Close the modal
          venueModal.hide();
          message.textContent = ""
          window.location.href = "paymentMethod"
        } else {
          message.textContent = 'Please select at least one venue.'
        }
      });
    });
  });
  
  
  

// ======================================Product Information===================================

 // Retrieve ticket data from local storage
 const finalticketData = JSON.parse(localStorage.getItem('finalticketData'));
 console.log(finalticketData);

 if (finalticketData) {
     // Update the product name
     document.getElementById('productname').textContent = finalticketData.name;

     // Update the product subtotal, total payment, and Buy Now price
     document.getElementById('subtotal').textContent = finalticketData.price;
     document.getElementById('total').textContent = finalticketData.price;
     document.getElementById('buy-now-price').textContent = finalticketData.price;

const buyBtn = document.getElementById("buyBtn")

buyBtn.addEventListener("click",()=>{

  fetch("paymentconfirmation",{
    method: 'POST',
    headers: {
         'Content-Type': 'application/json',
         'X-CSRFTOKEN':csrftoken
        },
     body: JSON.stringify(finalticketData)
    })
  })
  } else {
    console.error('No ticket data found in local storage.');
  }
  

 
