
const projectsGrid = document.getElementById('projectsGrid');
const searchInput = document.getElementById('searchInput');
const filterButtons = document.querySelectorAll('.filter-btn');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Variables
let visibleProjects = 6;
let currentFilter = 'all';
let currentSearchTerm = '';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderProjects();
    setupEventListeners();
});

// Render projects
function renderProjects() {
    projectsGrid.innerHTML = '';

    const filteredProjects = projects.filter(project => {
        const matchesFilter = currentFilter === 'all' || project.tags.includes(currentFilter);
        const matchesSearch = project.title.toLowerCase().includes(currentSearchTerm) ||
            project.description.toLowerCase().includes(currentSearchTerm);
        return matchesFilter && matchesSearch;
    });

    const projectsToShow = filteredProjects.slice(0, visibleProjects);

    if (projectsToShow.length === 0) {
        projectsGrid.innerHTML = `
                    <div class="col-span-full text-center py-10">
                        <i class="fas fa-search text-4xl text-[#4B5563] mb-4"></i>
                        <p class="text-xl text-[#4B5563]">No projects found matching your criteria.</p>
                    </div>
                `;
        return;
    }

    projectsToShow.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.className = 'bg-white rounded-lg overflow-hidden shadow-md card-hover';
        projectCard.innerHTML = `
                    <img src="${project.image}" alt="${project.title}" class="w-full h-48 object-cover">
                    <div class="p-6">
                        <h3 class="text-xl font-semibold mb-2">${project.title}</h3>
                        <p class="text-[#4B5563] mb-4">${project.description}</p>
                        <div class="flex flex-wrap gap-2 mb-4">
                            ${project.tags.map(tag => `
                                <span class="text-xs px-2 py-1 bg-[#F9F9F9] text-[#4B5563] rounded">${tag.toUpperCase()}</span>
                            `).join('')}
                        </div>
                        <a href="${project.link}" class="inline-block bg-[#0A84FF] hover:bg-[#0077E6] text-white font-medium py-2 px-4 rounded-lg transition duration-300">
                            View Project
                        </a>
                    </div>
                `;
        projectsGrid.appendChild(projectCard);
    });

    // Show/hide load more button
    loadMoreBtn.style.display = visibleProjects < filteredProjects.length ? 'block' : 'none';
}

// Setup event listeners
function setupEventListeners() {
    // Search input
    searchInput.addEventListener('input', (e) => {
        currentSearchTerm = e.target.value.toLowerCase();
        visibleProjects = 6;
        renderProjects();
    });

    // Filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button styling
            filterButtons.forEach(btn => {
                if (btn.dataset.filter === button.dataset.filter) {
                    btn.classList.remove('bg-white', 'text-[#4B5563]', 'border');
                    btn.classList.add('bg-[#0A84FF]', 'text-white');
                } else {
                    btn.classList.remove('bg-[#0A84FF]', 'text-white');
                    btn.classList.add('bg-white', 'text-[#4B5563]', 'border');
                }
            });

            currentFilter = button.dataset.filter;
            visibleProjects = 6;
            renderProjects();
        });
    });

    // Load more button
    loadMoreBtn.addEventListener('click', () => {
        visibleProjects += 6;
        renderProjects();
    });

    // Mobile menu toggle
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.innerHTML = navMenu.classList.contains('active') ?
            '<i class="fas fa-times text-2xl"></i>' :
            '<i class="fas fa-bars text-2xl"></i>';
    });

    // Close mobile menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                hamburger.innerHTML = '<i class="fas fa-bars text-2xl"></i>';
            }
        });
    });

    // Highlight active navigation link on scroll
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;

        document.querySelectorAll('section').forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionBottom = sectionTop + section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                const id = section.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active-link');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active-link');
                    }
                });
            }
        });
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}