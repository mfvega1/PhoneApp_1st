// Phone App State
let currentNumber = '';
let callHistory = JSON.parse(localStorage.getItem('callHistory')) || [];

// DOM Elements
const phoneDisplay = document.getElementById('phone-display');
const deleteBtn = document.getElementById('delete-btn');
const callBtn = document.getElementById('call-btn');
const historyList = document.getElementById('history-list');
const clearHistoryBtn = document.getElementById('clear-history-btn');
const keys = document.querySelectorAll('.key');
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const contactCallBtns = document.querySelectorAll('.contact-call-btn');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    updateHistoryDisplay();
});

// Setup Event Listeners
function setupEventListeners() {
    // Keypad buttons
    keys.forEach(key => {
        key.addEventListener('click', () => {
            const digit = key.getAttribute('data-key');
            addDigit(digit);
        });
    });

    // Delete button
    deleteBtn.addEventListener('click', deleteDigit);

    // Call button
    callBtn.addEventListener('click', makeCall);

    // Tab buttons
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.getAttribute('data-tab');
            switchTab(tabName);
        });
    });

    // Contact call buttons
    contactCallBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const contactItem = e.target.closest('.contact-item');
            const number = contactItem.getAttribute('data-number');
            callFromContact(number);
        });
    });

    // Contact items (clicking on them fills the number)
    document.querySelectorAll('.contact-item').forEach(item => {
        item.addEventListener('click', () => {
            const number = item.getAttribute('data-number');
            currentNumber = number;
            phoneDisplay.value = currentNumber;
            switchTab('dialer');
        });
    });

    // Clear history button
    clearHistoryBtn.addEventListener('click', clearHistory);

    // Keyboard support
    document.addEventListener('keydown', handleKeyboardInput);
}

// Add digit to display
function addDigit(digit) {
    if (currentNumber.length < 15) {
        currentNumber += digit;
        phoneDisplay.value = currentNumber;
    }
}

// Delete last digit
function deleteDigit() {
    currentNumber = currentNumber.slice(0, -1);
    phoneDisplay.value = currentNumber;
}

// Make a call
function makeCall() {
    if (currentNumber.length === 0) {
        alert('Please enter a phone number');
        return;
    }

    // Add to call history
    const callRecord = {
        number: currentNumber,
        timestamp: new Date().toISOString(),
        type: 'outgoing'
    };
    
    callHistory.unshift(callRecord);
    
    // Keep only last 50 calls
    if (callHistory.length > 50) {
        callHistory = callHistory.slice(0, 50);
    }
    
    localStorage.setItem('callHistory', JSON.stringify(callHistory));
    updateHistoryDisplay();

    // Show call modal
    showCallModal(currentNumber);
}

// Show call modal
function showCallModal(number) {
    const modal = document.createElement('div');
    modal.className = 'call-modal';
    modal.innerHTML = `
        <div class="call-modal-content calling">
            <h2>Calling...</h2>
            <p>${number}</p>
            <button class="end-call-btn">End Call</button>
        </div>
    `;

    document.body.appendChild(modal);

    const endCallBtn = modal.querySelector('.end-call-btn');
    endCallBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
        currentNumber = '';
        phoneDisplay.value = '';
    });

    // Auto-close after 5 seconds
    setTimeout(() => {
        if (document.body.contains(modal)) {
            document.body.removeChild(modal);
            currentNumber = '';
            phoneDisplay.value = '';
        }
    }, 5000);
}

// Call from contact
function callFromContact(number) {
    currentNumber = number;
    makeCall();
}

// Switch tabs
function switchTab(tabName) {
    tabBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-tab') === tabName) {
            btn.classList.add('active');
        }
    });

    tabContents.forEach(content => {
        content.classList.remove('active');
        if (content.id === tabName) {
            content.classList.add('active');
        }
    });
}

// Update history display
function updateHistoryDisplay() {
    if (callHistory.length === 0) {
        historyList.innerHTML = '<p class="empty-message">No call history yet</p>';
        clearHistoryBtn.disabled = true;
        return;
    }

    clearHistoryBtn.disabled = false;
    
    historyList.innerHTML = callHistory.map(call => {
        const date = new Date(call.timestamp);
        const timeString = date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        return `
            <div class="history-item">
                <div class="history-info">
                    <div class="history-number">${call.number}</div>
                    <div class="history-time">${timeString}</div>
                </div>
                <div class="history-icon">📞</div>
            </div>
        `;
    }).join('');

    // Add click handlers to history items
    document.querySelectorAll('.history-item').forEach((item, index) => {
        item.addEventListener('click', () => {
            currentNumber = callHistory[index].number;
            phoneDisplay.value = currentNumber;
            switchTab('dialer');
        });
    });
}

// Clear history
function clearHistory() {
    if (confirm('Are you sure you want to clear all call history?')) {
        callHistory = [];
        localStorage.removeItem('callHistory');
        updateHistoryDisplay();
    }
}

// Keyboard input support
function handleKeyboardInput(e) {
    // Only handle keyboard input when on dialer tab
    const dialerTab = document.getElementById('dialer');
    if (!dialerTab.classList.contains('active')) {
        return;
    }

    // Number keys and special keys
    if (e.key >= '0' && e.key <= '9') {
        addDigit(e.key);
    } else if (e.key === '*' || e.key === '#') {
        addDigit(e.key);
    } else if (e.key === 'Backspace') {
        e.preventDefault();
        deleteDigit();
    } else if (e.key === 'Enter') {
        e.preventDefault();
        makeCall();
    }
}
