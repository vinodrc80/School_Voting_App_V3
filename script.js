// Sample data for candidates (replace with actual candidate data and images)
const candidates = [
    { id: 1, name: 'Sidhi A V', imgSrc: 'image1.jpg', votes: 0 },
    { id: 2, name: 'Ashina M P', imgSrc: 'image2.jpg', votes: 0 },
    { id: 3, name: 'Ayisha Zarwa', imgSrc: 'image3.jpg', votes: 0 },
    { id: 4, name: 'Diya P', imgSrc: 'image4.jpg', votes: 0 },
    { id: 5, name: 'Devika M', imgSrc: 'image5.jpg', votes: 0 },
    { id: 6, name: 'Anoma B Aneesh', imgSrc: 'image6.jpg', votes: 0 },
    { id: 7, name: 'Aysha Zehra', imgSrc: 'image7.jpg', votes: 0 },
    { id: 8, name: 'Aardra Vinod', imgSrc: 'image8.jpg', votes: 0 },
    { id: 9, name: 'Avanthika Lal V T', imgSrc: 'image9.jpg', votes: 0 },
    { id: 10, name: 'Jewel Mariya Majo', imgSrc: 'image10.jpg', votes: 0 },
    { id: 11, name: 'Amna Shazma', imgSrc: 'image11.jpg', votes: 0 },
    { id: 12, name: 'Dhruvi Shibin M', imgSrc: 'image12.jpg', votes: 0 }
];

let totalVotes = 0;
const votingGrid = document.getElementById('voting-grid');
const resultScreen = document.getElementById('result-screen');
const totalVotesElement = document.getElementById('total-votes');
const showResultsButton = document.getElementById('show-results');
const resetPollButton = document.getElementById('reset-poll');
const backToVotingButton = document.getElementById('back-to-voting');
const resultsContainer = document.getElementById('results-container');
const voteCastModal = document.getElementById('vote-cast-modal');
const okButton = document.getElementById('ok-button');

// Function to generate candidate cards
function generateCandidateCards() {
    votingGrid.innerHTML = '';
    candidates.forEach(candidate => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <img src="${candidate.imgSrc}" alt="${candidate.name}" onclick="vote(${candidate.id})">
            <h3>${candidate.name}</h3>
        `;
        votingGrid.appendChild(card);
    });
}

// Function to handle voting
function vote(candidateId) {
    const candidate = candidates.find(c => c.id === candidateId);
    if (candidate) {
        candidate.votes++;
        totalVotes++;
        totalVotesElement.textContent = `Total Votes: ${totalVotes}`;
        localStorage.setItem('candidates', JSON.stringify(candidates));
        localStorage.setItem('totalVotes', totalVotes);
        
        showVoteCastModal();
    }
}

// Function to show the vote cast modal
function showVoteCastModal() {
    voteCastModal.style.display = 'block';
}

// Function to disable voting screen with password protection
function disableVotingScreen() {
    document.querySelector('.container').style.display = 'none';
    const password = prompt('Voting session locked. Enter password to continue voting:');
    if (password === 'next') {
        document.querySelector('.container').style.display = 'block';
    } else {
        alert('Incorrect password!');
        disableVotingScreen();
    }
}

// Function to display results with password protection
function displayResults() {
    const password = prompt('Enter password to view results:');
    if (password === 'admin123') {
        resultsContainer.innerHTML = '<h2>Results</h2>';
        candidates.forEach(candidate => {
            const resultItem = document.createElement('div');
            resultItem.classList.add('result-item');
            resultItem.innerHTML = `<p>${candidate.name}: ${candidate.votes} votes</p>`;
            resultsContainer.appendChild(resultItem);
        });
        document.querySelector('.container').style.display = 'none';
        resultScreen.style.display = 'block';
        saveResultsToFile();
    } else {
        alert('Incorrect password!');
    }
}

// Function to reset the poll with password protection
function resetPoll() {
    const password = prompt('Enter password to reset poll:');
    if (password === 'admin-reset') {
        candidates.forEach(candidate => {
            candidate.votes = 0;
        });
        totalVotes = 0;
        totalVotesElement.textContent = `Total Votes: ${totalVotes}`;
        localStorage.setItem('candidates', JSON.stringify(candidates));
        localStorage.setItem('totalVotes', totalVotes);
        alert('Poll has been reset.');
        generateCandidateCards();
        backToVoting();
    } else {
        alert('Incorrect password!');
    }
}

// Function to go back to voting screen
function backToVoting() {
    resultScreen.style.display = 'none';
    document.querySelector('.container').style.display = 'block';
}

// Function to save results to a file
function saveResultsToFile() {
    let resultsText = `Total Votes: ${totalVotes}\n\n`;
    candidates.forEach(candidate => {
        resultsText += `${candidate.name}: ${candidate.votes} votes\n`;
    });

    const blob = new Blob([resultsText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'results.txt';
    a.click();
    URL.revokeObjectURL(url);
}

// Load data from localStorage if available
window.onload = function() {
    const storedCandidates = localStorage.getItem('candidates');
    const storedTotalVotes = localStorage.getItem('totalVotes');
    if (storedCandidates && storedTotalVotes) {
        const parsedCandidates = JSON.parse(storedCandidates);
        candidates.forEach(candidate => {
            const storedCandidate = parsedCandidates.find(c => c.id === candidate.id);
            if (storedCandidate) {
                candidate.votes = storedCandidate.votes;
            }
        });
        totalVotes = parseInt(storedTotalVotes, 10);
        totalVotesElement.textContent = `Total Votes: ${totalVotes}`;
    }
    generateCandidateCards();
};

// Event listeners for the buttons
showResultsButton.addEventListener('click', displayResults);
resetPollButton.addEventListener('click', resetPoll);
backToVotingButton.addEventListener('click', backToVoting);

// Event listener for the OK button in the modal
okButton.addEventListener('click', function() {
    voteCastModal.style.display = 'none';
    disableVotingScreen();
});

// Generate initial candidate cards
generateCandidateCards();
