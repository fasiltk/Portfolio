/**
 * Script.js
 * Muhammed Fasil T K - Portfolio Interactive Logic
 * Vanilla JavaScript implementation (particles, tilt, typing, scroll spy, counters)
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    lucide.createIcons();

    // ==========================================================================
    // 1. Mobile Menu Navigation
    // ==========================================================================
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    let isMenuOpen = false;

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            isMenuOpen = !isMenuOpen;
            navMenu.classList.toggle('open');
            
            // Toggle menu icon between burger and close x
            const icon = navToggle.querySelector('i');
            if (isMenuOpen) {
                icon.setAttribute('data-lucide', 'x');
            } else {
                icon.setAttribute('data-lucide', 'menu');
            }
            lucide.createIcons();
        });
    }

    // Close mobile menu when a nav link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (isMenuOpen) {
                isMenuOpen = false;
                navMenu.classList.remove('open');
                const icon = navToggle.querySelector('i');
                icon.setAttribute('data-lucide', 'menu');
                lucide.createIcons();
            }
        });
    });

    // Add scroll class to navbar
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ==========================================================================
    // 2. Mouse-Following Glow Effect
    // ==========================================================================
    const cursorGlow = document.getElementById('cursor-glow');
    let mouseX = 0;
    let mouseY = 0;
    let currentGlowX = 0;
    let currentGlowY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Smooth lerp (linear interpolation) animation for the cursor glow
    function animateCursorGlow() {
        const dx = mouseX - currentGlowX;
        const dy = mouseY - currentGlowY;
        
        // Speed multiplier (lower = smoother/slower)
        const lerpFactor = 0.08;
        
        currentGlowX += dx * lerpFactor;
        currentGlowY += dy * lerpFactor;
        
        if (cursorGlow) {
            cursorGlow.style.left = `${currentGlowX}px`;
            cursorGlow.style.top = `${currentGlowY}px`;
        }
        
        requestAnimationFrame(animateCursorGlow);
    }
    animateCursorGlow();

    // ==========================================================================
    // 3. Canvas Particles System
    // ==========================================================================
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    
    // Mouse properties for particle interaction
    const particleMouse = {
        x: null,
        y: null,
        radius: 120 // Interaction radius
    };

    window.addEventListener('mousemove', (e) => {
        particleMouse.x = e.clientX;
        particleMouse.y = e.clientY;
    });

    window.addEventListener('mouseout', () => {
        particleMouse.x = null;
        particleMouse.y = null;
    });

    // Resize canvas dynamically
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();
    }
    window.addEventListener('resize', resizeCanvas);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
            this.color = color;
            this.baseSize = size;
        }

        // Draw individual particle
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }

        // Update particle movements and mouse reactions
        update() {
            // Bounce off edges
            if (this.x > canvas.width || this.x < 0) {
                this.directionX = -this.directionX;
            }
            if (this.y > canvas.height || this.y < 0) {
                this.directionY = -this.directionY;
            }

            // Move particle
            this.x += this.directionX;
            this.y += this.directionY;

            // Mouse interaction (repulsion)
            if (particleMouse.x !== null && particleMouse.y !== null) {
                let dx = this.x - particleMouse.x;
                let dy = this.y - particleMouse.y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < particleMouse.radius) {
                    // Calculate force vector
                    const force = (particleMouse.radius - distance) / particleMouse.radius;
                    const forceX = (dx / distance) * force * 3;
                    const forceY = (dy / distance) * force * 3;

                    this.x += forceX;
                    this.y += forceY;
                    
                    // Slightly increase size when interactive
                    this.size = this.baseSize * 1.5;
                } else {
                    if (this.size > this.baseSize) {
                        this.size -= 0.05;
                    }
                }
            } else {
                if (this.size > this.baseSize) {
                    this.size -= 0.05;
                }
            }

            this.draw();
        }
    }

    // Initialize particles array
    function initParticles() {
        particlesArray = [];
        // Reduce particles count on smaller screens for mobile optimization
        const numberOfParticles = window.innerWidth < 768 ? 40 : 100;
        
        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 2) + 0.8;
            let x = (Math.random() * ((canvas.width - size * 2) - (size * 2)) + size * 2);
            let y = (Math.random() * ((canvas.height - size * 2) - (size * 2)) + size * 2);
            let directionX = (Math.random() * 0.4) - 0.2;
            let directionY = (Math.random() * 0.4) - 0.2;
            
            // Randomly pick cyan, purple or gray colors
            const colors = ['rgba(0, 212, 255, 0.4)', 'rgba(123, 97, 255, 0.3)', 'rgba(255, 255, 255, 0.15)'];
            let color = colors[Math.floor(Math.random() * colors.length)];

            particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
        }
    }

    // Connect particles close to each other
    function connect() {
        let opacityValue = 1;
        const maxDistance = window.innerWidth < 768 ? 90 : 130;
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let dx = particlesArray[a].x - particlesArray[b].x;
                let dy = particlesArray[a].y - particlesArray[b].y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < maxDistance) {
                    opacityValue = 1 - (distance / maxDistance);
                    ctx.strokeStyle = `rgba(0, 212, 255, ${opacityValue * 0.09})`;
                    ctx.lineWidth = 0.8;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    // Canvas animation loop
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
        connect();
        requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();

    // ==========================================================================
    // 4. Typing Text Animation
    // ==========================================================================
    const typingTextEl = document.getElementById('typing-text');
    const roles = ["Python Developer", "Django Developer", "Backend Engineer", "Software Engineer"];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            // Delete text
            typingTextEl.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            // Write text
            typingTextEl.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 120;
        }

        // Handle states transition
        if (!isDeleting && charIndex === currentRole.length) {
            // Pause at end of word
            isDeleting = true;
            typingSpeed = 2200; // Hold full word in viewport
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typingSpeed = 300; // Small delay before next word starts typing
        }

        setTimeout(type, typingSpeed);
    }

    if (typingTextEl) {
        setTimeout(type, 800);
    }

    // ==========================================================================
    // 5. 3D Tilt Effect on Cards
    // ==========================================================================
    const tiltCards = document.querySelectorAll('.tilt-card');
    
    // Disable on touch screens for accessibility and responsiveness
    if (window.matchMedia('(hover: hover)').matches) {
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left; // x coordinate within element
                const y = e.clientY - rect.top;  // y coordinate within element
                
                const width = rect.width;
                const height = rect.height;
                
                // Rotation ratios (max 10 degrees tilt)
                const rotateX = -((y - height / 2) / height) * 12;
                const rotateY = ((x - width / 2) / width) * 12;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
                
                // Adjust card inner glowing reflection position
                const cardGlow = card.querySelector('.card-glow');
                if (cardGlow) {
                    cardGlow.style.top = `${y - 125}px`;
                    cardGlow.style.left = `${x - 125}px`;
                    cardGlow.style.background = 'radial-gradient(circle, rgba(0, 212, 255, 0.12) 0%, transparent 60%)';
                }
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
                
                const cardGlow = card.querySelector('.card-glow');
                if (cardGlow) {
                    cardGlow.style.top = '-125px';
                    cardGlow.style.left = 'auto';
                    cardGlow.style.right = '-125px';
                    cardGlow.style.background = 'radial-gradient(circle, rgba(123, 97, 255, 0.05) 0%, transparent 60%)';
                }
            });
        });
    }

    // ==========================================================================
    // 6. Intersection Observers: Scroll Reveal, Skills Bar, Achievements
    // ==========================================================================
    
    // 6a. Scroll Reveal (Fade/Slide-in elements)
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target); // Trigger only once
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // 6b. Skill Progress Bars Animation
    const skillsSection = document.getElementById('skills');
    const skillBars = document.querySelectorAll('.skill-bar-fill');
    const skillPercentages = document.querySelectorAll('.skill-percentage');
    let skillsAnimated = false;

    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !skillsAnimated) {
                // Animate bars
                skillBars.forEach(bar => {
                    const targetWidth = bar.getAttribute('data-width');
                    bar.style.width = targetWidth;
                });

                // Count up percentages text
                skillPercentages.forEach(percentage => {
                    const target = parseInt(percentage.getAttribute('data-target'));
                    let current = 0;
                    const duration = 1500;
                    const stepTime = Math.abs(Math.floor(duration / target));
                    
                    const timer = setInterval(() => {
                        current += 1;
                        percentage.textContent = `${current}%`;
                        if (current >= target) {
                            percentage.textContent = `${target}%`;
                            clearInterval(timer);
                        }
                    }, stepTime);
                });

                skillsAnimated = true;
                skillsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    if (skillsSection) {
        skillsObserver.observe(skillsSection);
    }

    // 6c. Achievements Count-up Numbers
    const achievementsSection = document.querySelector('.achievements-section');
    const counterNumbers = document.querySelectorAll('.counter-number');
    let countersAnimated = false;

    const achievementsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !countersAnimated) {
                counterNumbers.forEach(counter => {
                    const target = parseInt(counter.getAttribute('data-target'));
                    let current = 0;
                    const duration = 2000; // 2 seconds animation
                    
                    // Increment intervals based on targets (to complete together)
                    const increment = target > 500 ? Math.ceil(target / 60) : 1;
                    const stepTime = Math.max(Math.floor(duration / (target / increment)), 15);

                    const timer = setInterval(() => {
                        current += increment;
                        counter.textContent = current;
                        if (current >= target) {
                            counter.textContent = target;
                            clearInterval(timer);
                        }
                    }, stepTime);
                });
                
                countersAnimated = true;
                achievementsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    if (achievementsSection) {
        achievementsObserver.observe(achievementsSection);
    }

    // ==========================================================================
    // 7. Scroll Spy & Nav Link Highlights
    // ==========================================================================
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150; // offset for nav height
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${currentSectionId}`) {
                item.classList.add('active');
            }
        });
    });
});
