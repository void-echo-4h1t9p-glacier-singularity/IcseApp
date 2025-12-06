// ICSE Class 10 Question Papers - Interactive JavaScript

// Sample data for question papers (you can expand this)
const questionPapers = [
    {
        id: 1,
        subject: 'mathematics',
        year: 2024,
        title: 'Mathematics',
        description: 'Complete question paper with all sections including MCQs, short answers, and long answers.',
        duration: '3 Hours',
        marks: '80 Marks',
        filename: 'IOQM_Sample_Paper.exe',
        isLatest: true
    },
    {
        id: 2,
        subject: 'english',
        year: 2024,
        title: 'English',
        description: 'English Language and Literature paper with comprehension, grammar, and essay sections.',
        duration: '3 Hours',
        marks: '80 Marks',
        filename: 'english-2024.pdf',
        isLatest: true
    },
    {
        id: 3,
        subject: 'physics',
        year: 2024,
        title: 'Physics',
        description: 'Physics question paper covering mechanics, light, sound, electricity, and magnetism.',
        duration: '2 Hours',
        marks: '80 Marks',
        filename: 'Physics_Sample_Paper.exe',
        isLatest: true
    },
    {
        id: 4,
        subject: 'chemistry',
        year: 2024,
        title: 'Chemistry',
        description: 'Chemistry paper covering organic, inorganic, and physical chemistry concepts.',
        duration: '2 Hours',
        marks: '80 Marks',
        filename: 'chemistry-2024.pdf',
        isLatest: true
    },
    {
        id: 5,
        subject: 'biology',
        year: 2024,
        title: 'Biology',
        description: 'Biology paper covering botany, zoology, and human biology topics.',
        duration: '2 Hours',
        marks: '80 Marks',
        filename: 'biology-2024.pdf',
        isLatest: true
    },
    {
        id: 6,
        subject: 'history',
        year: 2024,
        title: 'History',
        description: 'History paper covering Indian independence movement and world history.',
        duration: '2 Hours',
        marks: '80 Marks',
        filename: 'history-2024.pdf',
        isLatest: true
    },
    {
        id: 7,
        subject: 'geography',
        year: 2024,
        title: 'Geography',
        description: 'Geography paper covering physical and human geography concepts.',
        duration: '2 Hours',
        marks: '80 Marks',
        filename: 'geography-2024.pdf',
        isLatest: true
    },
    {
        id: 8,
        subject: 'hindi',
        year: 2024,
        title: 'Hindi',
        description: 'Hindi language and literature paper with grammar and comprehension.',
        duration: '3 Hours',
        marks: '80 Marks',
        filename: 'hindi-2024.pdf',
        isLatest: true
    },
    // Add more papers for previous years
    {
        id: 9,
        subject: 'mathematics',
        year: 2023,
        title: 'Mathematics',
        description: 'Mathematics question paper from 2023 examination.',
        duration: '3 Hours',
        marks: '80 Marks',
        filename: 'mathematics-2023.pdf',
        isLatest: false
    },
    {
        id: 10,
        subject: 'english',
        year: 2023,
        title: 'English',
        description: 'English Language and Literature paper from 2023.',
        duration: '3 Hours',
        marks: '80 Marks',
        filename: 'english-2023.pdf',
        isLatest: false
    }
];

// Subject configurations
const subjectConfig = {
    mathematics: { color: 'blue', icon: 'calculator' },
    english: { color: 'purple', icon: 'book' },
    physics: { color: 'orange', icon: 'lightning' },
    chemistry: { color: 'green', icon: 'beaker' },
    biology: { color: 'emerald', icon: 'heart' },
    history: { color: 'amber', icon: 'clock' },
    geography: { color: 'teal', icon: 'globe' },
    hindi: { color: 'red', icon: 'chat' }
};

// Global variables
let currentFilter = 'all';
let currentSearchTerm = '';
let papersPerPage = 6;
let currentPage = 1;

// DOM Elements
const papersGrid = document.getElementById('papersGrid');
const searchInput = document.getElementById('searchInput');
const filterButtons = document.querySelectorAll('.filter-btn');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const downloadModal = document.getElementById('downloadModal');
const loadingSpinner = document.getElementById('loadingSpinner');
const closeModalBtn = document.getElementById('closeModal');

// File upload elements
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const subjectSelect = document.getElementById('subjectSelect');
const yearInput = document.getElementById('yearInput');
const uploadBtn = document.getElementById('uploadBtn');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    renderPapers();
    animateOnScroll();
});

// Initialize application
function initializeApp() {
    // Add fade-in animation to sections
    const sections = document.querySelectorAll('section');
    sections.forEach((section, index) => {
        section.style.animationDelay = `${index * 0.1}s`;
        section.classList.add('fade-in-up');
    });
    
    // Initialize smooth scrolling for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    searchInput.addEventListener('input', handleSearch);
    
    // Filter buttons
    filterButtons.forEach(btn => {
        btn.addEventListener('click', handleFilter);
    });
    
    // Load more button
    loadMoreBtn.addEventListener('click', loadMorePapers);
    
    // Modal close
    closeModalBtn.addEventListener('click', closeModal);
    
    // Click outside modal to close
    downloadModal.addEventListener('click', function(e) {
        if (e.target === downloadModal) {
            closeModal();
        }
    });
    
    // File upload functionality
    setupFileUpload();
    
    // Download buttons (delegated event listener)
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('download-btn') || e.target.closest('.download-btn')) {
            const btn = e.target.classList.contains('download-btn') ? e.target : e.target.closest('.download-btn');
            const subject = btn.getAttribute('data-subject');
            handleDownload(subject);
        }
    });
}

// Handle search functionality
function handleSearch(e) {
    currentSearchTerm = e.target.value.toLowerCase();
    currentPage = 1;
    renderPapers();
}

// Handle filter functionality
function handleFilter(e) {
    const subject = e.target.getAttribute('data-subject');
    
    // Update active filter
    filterButtons.forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    
    currentFilter = subject;
    currentPage = 1;
    renderPapers();
}

// Filter papers based on current criteria
function filterPapers() {
    return questionPapers.filter(paper => {
        const matchesSubject = currentFilter === 'all' || paper.subject === currentFilter;
        const matchesSearch = !currentSearchTerm || 
            paper.title.toLowerCase().includes(currentSearchTerm) ||
            paper.subject.toLowerCase().includes(currentSearchTerm) ||
            paper.year.toString().includes(currentSearchTerm) ||
            paper.description.toLowerCase().includes(currentSearchTerm);
        
        return matchesSubject && matchesSearch;
    });
}

// Render papers grid
function renderPapers() {
    const filteredPapers = filterPapers();
    const startIndex = 0;
    const endIndex = currentPage * papersPerPage;
    const papersToShow = filteredPapers.slice(startIndex, endIndex);
    
    papersGrid.innerHTML = '';
    
    if (papersToShow.length === 0) {
        papersGrid.innerHTML = `
            <div class="col-span-full text-center py-12">
                <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <h3 class="text-xl font-semibold text-gray-600 mb-2">No Papers Found</h3>
                <p class="text-gray-500">Try adjusting your search or filter criteria.</p>
            </div>
        `;
        loadMoreBtn.style.display = 'none';
        return;
    }
    
    papersToShow.forEach((paper, index) => {
        const paperCard = createPaperCard(paper);
        paperCard.style.animationDelay = `${index * 0.1}s`;
        papersGrid.appendChild(paperCard);
    });
    
    // Show/hide load more button
    loadMoreBtn.style.display = filteredPapers.length > endIndex ? 'block' : 'none';
}

// Create paper card element
function createPaperCard(paper) {
    const config = subjectConfig[paper.subject];
    const div = document.createElement('div');
    div.className = 'paper-card fade-in-up';
    div.setAttribute('data-subject', paper.subject);
    div.setAttribute('data-year', paper.year);
    
    div.innerHTML = `
        <div class="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100">
            <div class="flex items-start justify-between mb-4">
                <div class="flex items-center space-x-3">
                    <div class="bg-${config.color}-100 p-3 rounded-lg">
                        ${getSubjectIcon(paper.subject)}
                    </div>
                    <div>
                        <h4 class="font-semibold text-gray-900">${paper.title}</h4>
                        <p class="text-sm text-gray-500">ICSE ${paper.year}</p>
                    </div>
                </div>
                ${paper.isLatest ? '<span class="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">Latest</span>' : ''}
            </div>
            <p class="text-gray-600 mb-4 text-sm">${paper.description}</p>
            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4 text-sm text-gray-500">
                    <span class="flex items-center">
                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        ${paper.duration}
                    </span>
                    <span class="flex items-center">
                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        ${paper.marks}
                    </span>
                </div>
                <button class="download-btn bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors" data-subject="${paper.subject}">
                    <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    Download
                </button>
            </div>
        </div>
    `;
    
    return div;
}

// Get subject icon SVG
function getSubjectIcon(subject) {
    const icons = {
        mathematics: `<svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
        </svg>`,
        english: `<svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
        </svg>`,
        physics: `<svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
        </svg>`,
        chemistry: `<svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
        </svg>`,
        biology: `<svg class="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
        </svg>`,
        history: `<svg class="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>`,
        geography: `<svg class="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>`,
        hindi: `<svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
        </svg>`
    };
    
    return icons[subject] || icons.mathematics;
}

// Handle download functionality
function handleDownload(subject) {
    if (!subject) {
        showToast('Error: Subject not found', 'error');
        return;
    }
    
    // Get download URL from config
    const downloadUrl = paperDownloads[subject];
    
    if (!downloadUrl) {
        showToast('Error: Download link not configured for ' + subject, 'error');
        return;
    }
    
    // Direct download - no delay
    window.open(downloadUrl, '_blank');
    
    // Show success message
    showToast('Download started for ' + subject + ' paper', 'success');
    
    // Track download
    trackDownload(subject);
}

// Setup file upload functionality
function setupFileUpload() {
    // Click to upload
    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });
    
    // File selection
    fileInput.addEventListener('change', handleFileSelection);
    
    // Drag and drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileSelection({ target: { files } });
        }
    });
    
    // Upload button
    uploadBtn.addEventListener('click', handleFileUpload);
}

// Handle file selection
function handleFileSelection(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file type
    if (file.type !== 'application/pdf') {
        showToast('Please select a PDF file only', 'error');
        return;
    }
    
    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
        showToast('File size must be less than 10MB', 'error');
        return;
    }
    
    // Update UI to show selected file
    const uploadText = uploadArea.querySelector('p');
    uploadText.textContent = `Selected: ${file.name}`;
    uploadBtn.disabled = false;
}

// Handle file upload
function handleFileUpload() {
    const subject = subjectSelect.value;
    const year = yearInput.value;
    const file = fileInput.files[0];
    
    if (!subject || !year || !file) {
        showToast('Please fill all fields and select a file', 'error');
        return;
    }
    
    showLoading();
    
    // Simulate upload process
    setTimeout(() => {
        hideLoading();
        
        // Create new paper object
        const newPaper = {
            id: questionPapers.length + 1,
            subject: subject,
            year: parseInt(year),
            title: subject.charAt(0).toUpperCase() + subject.slice(1),
            description: `${subject.charAt(0).toUpperCase() + subject.slice(1)} question paper from ${year} examination.`,
            duration: subject === 'english' || subject === 'mathematics' || subject === 'hindi' ? '3 Hours' : '2 Hours',
            marks: '80 Marks',
            filename: `${subject}-${year}.pdf`,
            isLatest: year == 2024
        };
        
        // Add to papers array
        questionPapers.unshift(newPaper);
        
        // Reset form
        subjectSelect.value = '';
        yearInput.value = '';
        fileInput.value = '';
        uploadBtn.disabled = true;
        uploadArea.querySelector('p').textContent = 'Click to upload or drag and drop';
        
        // Re-render papers
        renderPapers();
        
        showToast('Question paper uploaded successfully!', 'success');
    }, 2000);
}

// Load more papers
function loadMorePapers() {
    currentPage++;
    renderPapers();
}

// Show download modal
function showDownloadModal() {
    downloadModal.classList.remove('hidden');
    downloadModal.classList.add('show');
}

// Close modal
function closeModal() {
    downloadModal.classList.add('hidden');
    downloadModal.classList.remove('show');
}

// Show loading spinner
function showLoading() {
    loadingSpinner.classList.remove('hidden');
    loadingSpinner.classList.add('show');
}

// Hide loading spinner
function hideLoading() {
    loadingSpinner.classList.add('hidden');
    loadingSpinner.classList.remove('show');
}

// Show toast notification
function showToast(message, type = 'info') {
    // Remove existing toasts
    document.querySelectorAll('.toast').forEach(toast => toast.remove());
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <div class="flex items-center">
            <div class="flex-shrink-0">
                ${type === 'success' ? 
                    '<svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>' :
                    '<svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'
                }
            </div>
            <div class="ml-3">
                <p class="text-sm font-medium text-gray-900">${message}</p>
            </div>
            <div class="ml-4">
                <button class="text-gray-400 hover:text-gray-600" onclick="this.parentElement.parentElement.parentElement.remove()">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    // Show toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        toast.remove();
    }, 5000);
}

// Track download analytics
function trackDownload(filename) {
    const downloads = JSON.parse(localStorage.getItem('downloads') || '[]');
    downloads.push({
        filename: filename,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
    });
    localStorage.setItem('downloads', JSON.stringify(downloads));
}

// Animate elements on scroll
function animateOnScroll() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe all sections and cards
    document.querySelectorAll('section, .paper-card, .subject-card').forEach((el) => {
        observer.observe(el);
    });
}

// Counter animation for statistics
function animateCounters() {
    const counters = document.querySelectorAll('.stats-counter');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                const duration = 2000;
                const increment = target / (duration / 16);
                let current = 0;
                
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    counter.textContent = Math.floor(current) + (counter.getAttribute('data-suffix') || '');
                }, 16);
                
                observer.unobserve(counter);
            }
        });
    });
    
    counters.forEach(counter => observer.observe(counter));
}

// Initialize counter animation
document.addEventListener('DOMContentLoaded', () => {
    animateCounters();
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInput.focus();
    }
    
    // Escape to close modals
    if (e.key === 'Escape') {
        closeModal();
    }
});

// Subject card click handlers
document.addEventListener('DOMContentLoaded', () => {
    const subjectCards = document.querySelectorAll('.subject-card');
    subjectCards.forEach(card => {
        card.addEventListener('click', () => {
            const subject = card.querySelector('h4').textContent.toLowerCase();
            
            // Update filter
            currentFilter = subject;
            currentPage = 1;
            
            // Update active filter button
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                if (btn.getAttribute('data-subject') === subject) {
                    btn.classList.add('active');
                }
            });
            
            // Scroll to papers section
            document.getElementById('papers').scrollIntoView({ behavior: 'smooth' });
            
            // Render filtered papers
            renderPapers();
        });
    });
});

// Performance optimization: Debounce search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Replace the direct search handler with debounced version
const debouncedSearch = debounce(handleSearch, 300);
searchInput.removeEventListener('input', handleSearch);
searchInput.addEventListener('input', debouncedSearch);

// Lazy loading for images (if any are added later)
function setupLazyLoading() {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Error handling for downloads
function handleDownloadError(filename) {
    showToast(`Error downloading ${filename}. Please try again.`, 'error');
}

// Service worker registration for offline support (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Analytics tracking (placeholder)
function trackEvent(eventName, eventData) {
    // You can integrate with Google Analytics or other analytics services here
    console.log('Event tracked:', eventName, eventData);
}

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        filterPapers,
        createPaperCard,
        handleDownload,
        questionPapers
    };
}
