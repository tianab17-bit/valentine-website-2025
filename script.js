// Initialize configuration

// put this near the top of script.js (outside DOMContentLoaded)


const config = window.VALENTINE_CONFIG;
let secretScale = 0.3; // start smaller

function growSecretAnswer() {
  const btn = document.getElementById("secretAnswerBtn");
  if (!btn) return;

  secretScale *= 1.4; // growth per click (change to 1.1 or 1.2 if you want)
  btn.style.transform = `scale(${secretScale})`;
}

// Validate configuration
function validateConfig() {

    const warnings = [];

    // Check required fields
    if (!config.valentineName) {
        warnings.push("Valentine's name is not set! Using default.");
        config.valentineName = "My Love";
    }

    // Validate colors
    const isValidHex = (hex) => /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
    Object.entries(config.colors).forEach(([key, value]) => {
        if (!isValidHex(value)) {
            warnings.push(`Invalid color for ${key}! Using default.`);
            config.colors[key] = getDefaultColor(key);
        }
    });

    // Validate animation values
    if (parseFloat(config.animations.floatDuration) < 5) {
        warnings.push("Float duration too short! Setting to 5s minimum.");
        config.animations.floatDuration = "6s";
    }

    if (config.animations.heartExplosionSize < 1 || config.animations.heartExplosionSize > 3) {
        warnings.push("Heart explosion size should be between 1 and 3! Using default.");
        config.animations.heartExplosionSize = 2;
    }

    // Log warnings if any
    if (warnings.length > 0) {
        console.warn("⚠️ Configuration Warnings:");
        warnings.forEach(warning => console.warn("- " + warning));
    }
}

// Default color values
function getDefaultColor(key) {
    const defaults = {
        backgroundStart: "#ffafbd",
        backgroundEnd: "#ffc3a0",
        buttonBackground: "#ff6b6b",
        buttonHover: "#ff8787",
        textColor: "#ff4757"
    };
    return defaults[key];
}

// Set page title
document.title = config.pageTitle;

// Initialize the page content when DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
    // Validate configuration first
    validateConfig();

    // Set texts from config
    document.getElementById('valentineTitle').textContent = `${config.valentineName}`;
    
    // Set first question texts
    document.getElementById('question1Text').textContent = config.questions.first.text;
    document.getElementById('yesBtn1').textContent = config.questions.first.yesBtn;
    document.getElementById('noBtn1').textContent = config.questions.first.noBtn;
    document.getElementById('yesBtn1').addEventListener('click', growSecretAnswer);
    document.getElementById('noBtn1').addEventListener('click', growSecretAnswer);
    document.getElementById('secretAnswerBtn').textContent = config.questions.first.secretAnswer;
    const secretBtn = document.getElementById("secretAnswerBtn");
    secretBtn.style.transform = `scale(${secretScale})`
    

    
    // Set second question texts
    document.getElementById('question2Text').textContent = config.questions.second.text;
    document.getElementById('startText').textContent = config.questions.second.startText;
    document.getElementById('nextBtn').textContent = config.questions.second.nextBtn;
    
    // Set third question texts
    document.getElementById('question3Text').textContent = config.questions.third.text;
    document.getElementById('yesBtn3').textContent = config.questions.third.yesBtn;
    document.getElementById('noBtn3').textContent = config.questions.third.noBtn;

    // Create initial floating elements
    createFloatingElements();
    createFloatingElements();
startEmojiSpawner();


   // Setup music player
    setupMusicPlayer();
});


// Create floating hearts and bears
function createFloatingElements() {
    const container = document.querySelector('.floating-elements');
    
    // Create hearts
    config.floatingEmojis.hearts.forEach(heart => {
        const div = document.createElement('div');
        div.className = 'heart';
        div.innerHTML = heart;
        setRandomPosition(div);
        container.appendChild(div);
    });

    // Create bears
    config.floatingEmojis.bears.forEach(bear => {
        const div = document.createElement('div');
        div.className = 'bear';
        div.innerHTML = bear;
        setRandomPosition(div);
        container.appendChild(div);
    });
}

// Set random position for floating elements
function setRandomPosition(element) {
    // random horizontal position
    element.style.left = Math.random() * 100 + "vw";

    // random duration (prevents clumping)
    element.style.animationDuration = 10 + Math.random() * 20 + "s";

    // small positive delay only (NOT negative)
    element.style.animationDelay = Math.random() * 2 + "s";

    // start BELOW screen so they float upward smoothly
    element.style.top = (100 + Math.random() * 40) + "vh";
}



// Function to show next question
function showNextQuestion(questionNumber) {
    document.querySelectorAll('.question-section').forEach(q => q.classList.add('hidden'));
    document.getElementById(`question${questionNumber}`).classList.remove('hidden');
}

// Function to move the "No" button when clicked
function moveButton(button) {
    const x = Math.random() * (window.innerWidth - button.offsetWidth);
    const y = Math.random() * (window.innerHeight - button.offsetHeight);
    button.style.position = 'fixed';
    button.style.left = x + 'px';
    button.style.top = y + 'px';
}

// Love meter functionality
const loveMeter = document.getElementById('loveMeter');
const loveValue = document.getElementById('loveValue');
const extraLove = document.getElementById('extraLove');

function setInitialPosition() {
    loveMeter.value = 100;
    loveValue.textContent = 100;
    loveMeter.style.width = '100%';
}

loveMeter.addEventListener('input', () => {
    const value = parseInt(loveMeter.value);
    loveValue.textContent = value;

    if (value >=2500) {
    nextBtn.classList.add("enabled");
    nextBtn.style.opacity = "1";
    nextBtn.style.cursor = "pointer";
     } else {
    nextBtn.classList.remove('enabled');
    nextBtn.style.opacity = "0.5";
    nextBtn.style.cursor = "none";

     }


    
    
    if (value > 100) {
        extraLove.classList.remove('hidden');
        const overflowPercentage = (value - 100) / 9900;
        const extraWidth = overflowPercentage * window.innerWidth * 0.8;
        loveMeter.style.width = `calc(100% + ${extraWidth}px)`;
        loveMeter.style.transition = 'width 0.3s';
        
        // Show different messages based on the value
        if (value >= 5000) {
            extraLove.classList.add('super-love');
            extraLove.textContent = config.loveMessages.extreme;
        } else if (value > 1000) {
            extraLove.classList.remove('super-love');
            extraLove.textContent = config.loveMessages.high;
        } else {
            extraLove.classList.remove('super-love');
            extraLove.textContent = config.loveMessages.normal;
        }
    } else {
        extraLove.classList.add('hidden');
        extraLove.classList.remove('super-love');
        loveMeter.style.width = '100%';
    }
});

// Initialize love meter
window.addEventListener('DOMContentLoaded', setInitialPosition);
window.addEventListener('load', setInitialPosition);

// Celebration function
function celebrate() {
    document.querySelectorAll('.question-section').forEach(q => q.classList.add('hidden'));
    const celebration = document.getElementById('celebration');
    celebration.classList.remove('hidden');
    
    // Set celebration messages
    document.getElementById('celebrationTitle').textContent = config.celebration.title;
    document.getElementById('celebrationMessage').textContent = config.celebration.message;
    document.getElementById('celebrationEmojis').textContent = config.celebration.emojis;
    
    // Create heart explosion effect
    createHeartExplosion();
}

// Create heart explosion animation
function createHeartExplosion() {
  const container = document.querySelector(".floating-elements");
  if (!container) return;

  for (let i = 0; i < 40; i++) {
    const heart = document.createElement("div");

    const randomHeart =
      config.floatingEmojis.hearts[Math.floor(Math.random() * config.floatingEmojis.hearts.length)];

    heart.innerHTML = randomHeart;
    heart.className = "explosion-heart"; // IMPORTANT: not "heart"

    const angle = Math.random() * Math.PI * 2;
    const distance = 120 + Math.random() * 220;
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;

    heart.style.setProperty("--x", `${x}px`);
    heart.style.setProperty("--y", `${y}px`);
    heart.style.animationDelay = `${Math.random() * 0.1}s`;

    container.appendChild(heart);

    setTimeout(() => heart.remove(), 1400);
  }
}


// Music Player Setup
function setupMusicPlayer() {
    const musicControls = document.getElementById('musicControls');
    const musicToggle = document.getElementById('musicToggle');
    const bgMusic = document.getElementById('bgMusic');
    const musicSource = document.getElementById('musicSource');

    // Only show controls if music is enabled in config
    if (!config.music.enabled) {
        musicControls.style.display = 'none';
        return;
    }

    // Set music source and volume
   // Set music source and volume
bgMusic.src = config.music.musicUrl;
bgMusic.volume = config.music.volume ?? 0.5;
bgMusic.load();


    // Try autoplay if enabled
    if (config.music.autoplay) {
        const playPromise = bgMusic.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log("Autoplay prevented by browser");
                musicToggle.textContent = config.music.startText;
            });
        }
    }

    // Toggle music on button click
    musicToggle.addEventListener('click', () => {
        if (bgMusic.paused) {
            bgMusic.play();
            musicToggle.textContent = config.music.stopText;
        } else {
            bgMusic.pause();
            musicToggle.textContent = config.music.startText;
        }
    });   

function startEmojiSpawner() {
  const container = document.querySelector(".floating-elements");
  if (!container) return;

  setInterval(() => {
    const div = document.createElement("div");

    const useHeart = Math.random() < 0.8; // 80% hearts
    if (useHeart) {
      div.className = "heart";
      div.innerHTML =
        config.floatingEmojis.hearts[
          Math.floor(Math.random() * config.floatingEmojis.hearts.length)
        ];
    } else {
      div.className = "bear";
      div.innerHTML =
        config.floatingEmojis.bears[
          Math.floor(Math.random() * config.floatingEmojis.bears.length)
        ];
    }

    setRandomPosition(div);
    container.appendChild(div);

    // remove after it's done floating
    setTimeout(() => div.remove(), 1000);
  }, 300); // <-- lower number = more often (try 400, 600, 900)
}

    
} 
