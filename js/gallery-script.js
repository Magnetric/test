// Load photos from localStorage or use default sample data
let photos = [];

function loadPhotosFromStorage() {
    const savedPhotos = localStorage.getItem('galleryPhotos');
    if (savedPhotos) {
        photos = JSON.parse(savedPhotos);
    } else {
        // Default sample photos if no saved data
        photos = [
            {
                id: 1,
                title: "Mountain Sunrise",
                location: "Swiss Alps",
                year: 2024,
                image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop",
                description: "Early morning light over the Swiss Alps. The golden hour creates a magical atmosphere as the sun rises behind the snow-capped peaks, casting long shadows across the pristine landscape."
            },
            {
                id: 2,
                title: "City Streets",
                location: "New York",
                year: 2023,
                image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1200&h=800&fit=crop",
                description: "Urban life in the city that never sleeps. The bustling streets of New York capture the energy and diversity of one of the world's most iconic cities."
            },
            {
                id: 3,
                title: "Ocean Waves",
                location: "Hawaii",
                year: 2023,
                image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=800&fit=crop",
                description: "Crystal clear waters of the Pacific. The turquoise waves crash against the volcanic rocks, creating a mesmerizing display of nature's power and beauty."
            },
            {
                id: 4,
                title: "Desert Sunset",
                location: "Arizona",
                year: 2022,
                image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop",
                description: "Golden hour in the desert. The warm light of sunset paints the arid landscape in brilliant oranges and reds, creating a stark contrast against the blue sky."
            },
            {
                id: 5,
                title: "Forest Path",
                location: "Oregon",
                year: 2022,
                image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=800&fit=crop",
                description: "Peaceful walk through the woods. The dense canopy filters the sunlight, creating a serene atmosphere perfect for reflection and connection with nature."
            },
            {
                id: 6,
                title: "Urban Architecture",
                location: "Tokyo",
                year: 2021,
                image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200&h=800&fit=crop",
                description: "Modern cityscape of Tokyo. The futuristic architecture stands as a testament to human innovation, while traditional elements blend seamlessly with contemporary design."
            }
        ];
    }
}

// DOM Elements
const galleryTitle = document.getElementById('galleryTitle');
const galleryLocation = document.getElementById('galleryLocation');
const galleryYear = document.getElementById('galleryYear');
const photoCount = document.getElementById('photoCount');
const galleryDescription = document.getElementById('galleryDescription');
const photosGrid = document.getElementById('photosGrid');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

// Full-screen viewer elements
const fullscreenViewer = document.getElementById('fullscreenViewer');
const fullscreenImage = document.getElementById('fullscreenImage');
const prevPhotoBtn = document.getElementById('prevPhotoBtn');
const nextPhotoBtn = document.getElementById('nextPhotoBtn');
const closeViewerBtn = document.getElementById('closeViewerBtn');
const currentPhotoIndex = document.getElementById('currentPhotoIndex');
const totalPhotos = document.getElementById('totalPhotos');

// Full-screen viewer state
let currentGalleryPhotos = [];
let currentPhotoIndexValue = 0;

// Get gallery ID from URL parameter
function getGalleryIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('gallery') || null;
}

// Get gallery data
function getGalleryData() {
    const galleryId = getGalleryIdFromUrl();
    
    if (galleryId) {
        // Find gallery from localStorage
        const savedPhotos = localStorage.getItem('galleryPhotos');
        if (savedPhotos) {
            const allPhotos = JSON.parse(savedPhotos);
            const galleryPhotos = allPhotos.filter(photo => photo.galleryId == galleryId);
            
            if (galleryPhotos.length > 0) {
                // Extract gallery info from first photo
                const firstPhoto = galleryPhotos[0];
                return {
                    id: galleryId,
                    name: firstPhoto.galleryName || 'Unnamed Gallery',
                    location: firstPhoto.location,
                    year: firstPhoto.year,
                    photos: galleryPhotos,
                    description: firstPhoto.galleryDescription || ''
                };
            }
        }
    }
    
    // Fallback to default gallery
    return {
        id: 'default',
        name: 'Sample Gallery',
        location: 'Various Locations',
        year: 2024,
        photos: photos,
        description: 'A collection of beautiful photographs from around the world.'
    };
}

// Load gallery data
function loadGallery() {
    const gallery = getGalleryData();
    
    // Update page title
    document.title = `${gallery.name} - Photography Portfolio`;
    
    // Update gallery header
    galleryTitle.textContent = gallery.name;
    galleryLocation.textContent = gallery.location;
    galleryYear.textContent = gallery.year;
    photoCount.textContent = gallery.photos.length;
    galleryDescription.textContent = gallery.description;
    
    // Store photos for full-screen viewer
    currentGalleryPhotos = gallery.photos;
    
    // Load photos grid
    loadPhotosGrid(gallery.photos);
}

// Load photos into grid
function loadPhotosGrid(photos) {
    photosGrid.innerHTML = '';
    
    if (photos.length === 0) {
        photosGrid.innerHTML = '<div class="no-photos">No photos found in this gallery.</div>';
        return;
    }
    
    photos.forEach((photo, index) => {
        const photoElement = createPhotoElement(photo, index);
        photosGrid.appendChild(photoElement);
    });
}

// Create photo element
function createPhotoElement(photo, index) {
    const photoElement = document.createElement('div');
    photoElement.className = 'photo-item';
    photoElement.setAttribute('data-index', index);
    
    photoElement.innerHTML = `
        <img src="${photo.thumbnail || photo.image}" alt="${photo.title}" loading="lazy">
        <div class="photo-overlay">
            <div class="photo-info">
            </div>
        </div>
    `;
    
    // Add click event to open full-screen viewer
    photoElement.addEventListener('click', () => {
        openFullscreenViewer(index);
    });
    
    return photoElement;
}

// Setup navigation
function setupNavigation() {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });
}

// Full-screen viewer functions
function openFullscreenViewer(index) {
    currentPhotoIndexValue = index;
    const photo = currentGalleryPhotos[index];
    
    // Update full-screen viewer content
    fullscreenImage.src = photo.image; // Use original image for full-screen
    fullscreenImage.alt = photo.title;
    
    // Update counter
    currentPhotoIndex.textContent = index + 1;
    totalPhotos.textContent = currentGalleryPhotos.length;
    
    // Show full-screen viewer
    fullscreenViewer.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeFullscreenViewer() {
    fullscreenViewer.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
}

function showPreviousPhoto() {
    if (currentPhotoIndexValue > 0) {
        openFullscreenViewer(currentPhotoIndexValue - 1);
    }
}

function showNextPhoto() {
    if (currentPhotoIndexValue < currentGalleryPhotos.length - 1) {
        openFullscreenViewer(currentPhotoIndexValue + 1);
    }
}

// Setup full-screen viewer event listeners
function setupFullscreenViewer() {
    // Close button
    closeViewerBtn.addEventListener('click', closeFullscreenViewer);
    
    // Navigation buttons
    prevPhotoBtn.addEventListener('click', showPreviousPhoto);
    nextPhotoBtn.addEventListener('click', showNextPhoto);
    
    // Close on background click
    fullscreenViewer.addEventListener('click', (e) => {
        if (e.target === fullscreenViewer) {
            closeFullscreenViewer();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!fullscreenViewer.classList.contains('active')) return;
        
        switch(e.key) {
            case 'Escape':
                closeFullscreenViewer();
                break;
            case 'ArrowLeft':
                showPreviousPhoto();
                break;
            case 'ArrowRight':
                showNextPhoto();
                break;
        }
    });
}

// Initialize the gallery page
function init() {
    loadPhotosFromStorage();
    loadGallery();
    setupNavigation();
    setupFullscreenViewer();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init); 