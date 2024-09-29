// Target the HTML elements
const titleElement = document.getElementById('title');
const glitchElement = document.getElementById('glitch');
const morseElement = document.getElementById('morse-code');
const inputArea = document.getElementById('input-area');
const feedbackElement = document.getElementById('feedback');
const blanksElement = document.getElementById('blanks');
const questionElement = document.getElementById('question');
const cameraSection = document.getElementById('camera-section');
const cameraQuestionElement = document.getElementById('camera-question');
const cameraResponseElement = document.getElementById('camera-response');
const locationSection = document.getElementById('location-section');
const locationQuestionElement = document.getElementById('location-question');
const locationResponseElement = document.getElementById('location-response');
const videoElement = document.getElementById('video');
const locationPermissionElement = document.getElementById('location-permission');

// Helper function: Type out the text one character at a time
function typeOutText(text, element, callback, speed = 100) {
    let index = 0;

    function type() {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
            setTimeout(type, speed);
        } else if (callback) {
            setTimeout(callback, 500); // Call the next function after typing is done
        }
    }

    type();
}

// Show Morse code and glitch effect
function glitchEffect() {
    titleElement.textContent = ""; // Clear the title

    let glitchChars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let glitchLength = 6;
    let glitchTime = 7000; // 7 seconds
    let glitchSpeed = 100;

    let interval = setInterval(() => {
        let glitchText = "";
        for (let i = 0; i < glitchLength; i++) {
            glitchText += glitchChars.charAt(Math.floor(Math.random() * glitchChars.length));
        }

        titleElement.textContent = `Is your name ${glitchText}?`;
        glitchLength = Math.floor(Math.random() * 10); // Randomize glitch length
    }, glitchSpeed);

    setTimeout(() => {
        clearInterval(interval);
        titleElement.textContent = "";
        showMorseMessage();
    }, glitchTime);
}

// Show Morse code message
function showMorseMessage() {
    titleElement.textContent = ""; // Clear title
    morseElement.textContent = "-.-- --- ..- .-. / -. --- - / .- .-.. --- -. ."; // Morse code message
    morseElement.style.visibility = 'visible';
    setTimeout(spellDeadQuestion, 5000); // Move on to the next part
}

// Ask user to spell "dead"
function spellDeadQuestion() {
    morseElement.style.visibility = 'hidden'; // Hide Morse code
    inputArea.style.visibility = 'visible'; // Show input area
    questionElement.textContent = "How do you spell dead?";

    let correctAnswer = "dead";
    let userAnswer = "";
    let blanks = "_ _ _ _";
    blanksElement.textContent = blanks;

    // Handle key press to input letters directly onto the blanks
    document.addEventListener('keydown', function handleKeyPress(event) {
        if (/^[a-zA-Z]$/.test(event.key) && userAnswer.length < correctAnswer.length) {
            userAnswer += event.key.toLowerCase();
            blanksElement.textContent = userAnswer.split('').join(' ') + " " + "_".repeat(correctAnswer.length - userAnswer.length).split('').join(' ');
        }

        if (userAnswer.length === correctAnswer.length) {
            if (userAnswer === correctAnswer) {
                document.removeEventListener('keydown', handleKeyPress);
                showErrorsScreen();
            } else {
                feedbackElement.textContent = "Try again".split('').join(' ');
                setTimeout(() => {
                    feedbackElement.textContent = "";
                    blanksElement.textContent = "_ _ _ _"; // Reset the blanks
                    userAnswer = ""; // Reset the user input
                }, 1500);
            }
        }
    });
}

// Show error messages on the screen
function showErrorsScreen() {
    inputArea.style.visibility = 'hidden'; // Hide the input area

    let errorInterval = setInterval(() => {
        let errorElement = document.createElement('div');
        errorElement.textContent = `ERROR ${Math.random().toString(36).substring(7)}`;
        errorElement.style.position = "absolute";
        errorElement.style.left = `${Math.random() * window.innerWidth}px`;
        errorElement.style.top = `${Math.random() * window.innerHeight}px`;
        errorElement.style.color = 'red';
        errorElement.style.fontSize = '20px';
        document.body.appendChild(errorElement);

        setTimeout(() => document.body.removeChild(errorElement), 2000);
    }, 500);

    setTimeout(() => {
        clearInterval(errorInterval);
        showWelcomeMessage();
    }, 7000);
}

// Show welcome message after errors
function showWelcomeMessage() {
    document.body.classList.add('blue-screen');
    titleElement.textContent = "";
    typeOutText("Welcome to your Personalized Computer", titleElement, showFaceRequest);
}

// After welcome message, ask "Can I see your Face?"
function showFaceRequest() {
    cameraSection.style.display = 'block'; // Show the camera section

    // Scroll down smoothly to the camera question
    cameraSection.scrollIntoView({ behavior: "smooth", block: "center" });

    typeOutText("Can I see your Face?", cameraQuestionElement, () => {
        setTimeout(autoTypeYes, 5000); // Delay for 5 seconds before typing "yes"
    });
}

// Automatically type "yes" after asking the face question
function autoTypeYes() {
    typeOutText("yes", cameraResponseElement, requestCameraAccess);
}

// Request access to the camera
function requestCameraAccess() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
        .then(function(stream) {
            videoElement.srcObject = stream;
            askForLocationPermission(); // Move to location permission after camera
        })
        .catch(function(err) {
            cameraResponseElement.textContent = "Camera access denied!";
            askForLocationPermission(); // Move on even if the camera is denied
        });
    } else {
        cameraResponseElement.textContent = "Camera access not supported on this device.";
        askForLocationPermission(); // Move on if camera is not supported
    }
}

// Ask for location permission
function askForLocationPermission() {
    locationSection.style.display = 'block'; // Show the location section
    locationSection.scrollIntoView({ behavior: "smooth", block: "center" });

    // Ask the user if the game can use their location
    typeOutText("Can we use your location to guess where you are?", locationPermissionElement, () => {
        // Show yes and no buttons for permission
        const yesButton = document.createElement('button');
        yesButton.textContent = "Yes";
        yesButton.onclick = () => getLocation();

        const noButton = document.createElement('button');
        noButton.textContent = "No";
        noButton.onclick = () => {
            locationResponseElement.textContent = "You chose not to share your location.";
        };

        locationPermissionElement.appendChild(yesButton);
        locationPermissionElement.appendChild(noButton);
    });
}

// Get the user's location
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showLocation, showLocationError);
    } else {
        locationResponseElement.textContent = "Geolocation is not supported by this browser.";
    }
}

// Show the user's location
function showLocation(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const locationCity = "Your City"; // Replace with a method to fetch the actual city
    const locationState = "Your State"; // Replace with a method to fetch the actual state

    locationResponseElement.textContent = `I bet I know what state you live in: ${locationState}`;
}

// Handle location errors
function showLocationError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            locationResponseElement.textContent = "User denied the request for Geolocation.";
            break;
        case error.POSITION_UNAVAILABLE:
            locationResponseElement.textContent = "Location information is unavailable.";
            break;
        case error.TIMEOUT:
            locationResponseElement.textContent = "The request to get user location timed out.";
            break;
        case error.UNKNOWN_ERROR:
            locationResponseElement.textContent = "An unknown error occurred.";
            break;
    }
}

// Start the game with glitch effect
glitchEffect();
