// =============================================
// TREFZ Website - Gemeinsame JavaScript-Funktionen
// =============================================

// Badge für offene Stellen laden
document.addEventListener('DOMContentLoaded', function() {
    loadJobBadge();
    setCurrentYear();
});

// Aktuelles Jahr im Footer setzen
function setCurrentYear() {
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}

function loadJobBadge() {
    fetch('jobs.json')
        .then(response => response.json())
        .then(jobs => {
            const count = jobs.length;
            
            // Desktop Badge
            const badge = document.getElementById('job-badge');
            if (badge) {
                if (count > 0) {
                    badge.textContent = count;
                    badge.classList.add('visible');
                } else {
                    badge.classList.remove('visible');
                }
            }

            // Mobile Badge
            const badgeMobile = document.getElementById('job-badge-mobile');
            if (badgeMobile) {
                if (count > 0) {
                    badgeMobile.textContent = count;
                    badgeMobile.classList.add('visible');
                } else {
                    badgeMobile.classList.remove('visible');
                }
            }
        })
        .catch(error => {
            console.log('Jobs konnten nicht geladen werden:', error);
        });
}

// Mobile Menu Toggle
function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    if (menu) {
        menu.classList.toggle('active');
    }
}

// Modal Funktionen
function openModal(type) {
    const modal = document.getElementById(type + '-modal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(type) {
    const modal = document.getElementById(type + '-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Bewerbung Modal
function openApplyModal(position) {
    const title = document.getElementById('apply-modal-title');
    const positionInput = document.getElementById('apply-position');
    
    if (title) {
        title.textContent = 'Bewerbung: ' + position;
    }
    if (positionInput) {
        positionInput.value = position;
    }
    
    openModal('apply');
}

// Modal bei Klick außerhalb schließen
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Modal mit Escape-Taste schließen
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal.active').forEach(modal => {
            modal.classList.remove('active');
        });
        document.body.style.overflow = '';
    }
});

// Smooth Scroll für Anker-Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            
            // Mobile Menu schließen falls offen
            const menu = document.getElementById('mobile-menu');
            if (menu) {
                menu.classList.remove('active');
            }
        }
    });
});

// File Upload Handling
const fileInput = document.getElementById('file-input');
const fileList = document.getElementById('file-list');
let uploadedFiles = [];

if (fileInput) {
    fileInput.addEventListener('change', function(e) {
        const files = Array.from(e.target.files);
        files.forEach(file => {
            if (!uploadedFiles.find(f => f.name === file.name)) {
                uploadedFiles.push(file);
            }
        });
        updateFileList();
    });
}

function updateFileList() {
    if (!fileList) return;
    
    fileList.innerHTML = uploadedFiles.map((file, index) => `
        <div class="file-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
            </svg>
            <span>${file.name}</span>
            <button type="button" class="file-remove" onclick="removeFile(${index})">×</button>
        </div>
    `).join('');
}

function removeFile(index) {
    uploadedFiles.splice(index, 1);
    updateFileList();
}

// Drag and Drop für Datei-Upload
const uploadArea = document.getElementById('file-upload-area');
if (uploadArea) {
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        uploadArea.addEventListener(eventName, () => {
            uploadArea.style.borderColor = 'var(--black)';
            uploadArea.style.background = 'var(--gray-50)';
        }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, () => {
            uploadArea.style.borderColor = 'var(--gray-300)';
            uploadArea.style.background = '';
        }, false);
    });

    uploadArea.addEventListener('drop', function(e) {
        const files = Array.from(e.dataTransfer.files);
        files.forEach(file => {
            if (!uploadedFiles.find(f => f.name === file.name)) {
                uploadedFiles.push(file);
            }
        });
        updateFileList();
    });
}
