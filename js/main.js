document.addEventListener('DOMContentLoaded', () => {
    // 0. Preloader removal
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            gsap.to(preloader, {
                opacity: 0,
                duration: 1.5,
                ease: 'power2.inOut',
                onComplete: () => {
                    preloader.style.display = 'none';
                    document.body.style.overflow = 'auto';
                }
            });
        });
        // Backup: Hide after 4s regardless of load event
        setTimeout(() => {
            if (preloader.style.display !== 'none') {
                preloader.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        }, 4000);
    }

    // 1. Initialize Lenis Smooth Scroll
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // 2. Custom Cursor Logic
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    let posX = 0, posY = 0, mouseX = 0, mouseY = 0;

    if (cursor && follower) {
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            gsap.to(cursor, {
                x: mouseX,
                y: mouseY,
                duration: 0.1
            });
            
            gsap.to(follower, {
                x: mouseX - 11,
                y: mouseY - 11,
                duration: 0.3
            });
        });

        // Hover effect on links/buttons
        const interactive = document.querySelectorAll('a, button, .btn, .gallery-item, .glass-card, .service-card');
        interactive.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('active');
                follower.classList.add('active');
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('active');
                follower.classList.remove('active');
            });
        });
    }

    // 3. GSAP Animations
    gsap.registerPlugin(ScrollTrigger);

    // Fade in sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        gsap.from(section, {
            opacity: 0,
            y: 50,
            duration: 1,
            scrollTrigger: {
                trigger: section,
                start: 'top 80%',
                toggleActions: 'play none none none'
            }
        });
    });

    // Hero Parallax
    gsap.to('.hero-media', {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        }
    });

    // Hero Content Stagger
    const heroTl = gsap.timeline();
    heroTl.to('.hero-content p', { opacity: 1, y: 0, duration: 1, delay: 0.5 })
          .to('.hero-content h1', { opacity: 1, y: 0, duration: 1 }, '-=0.5')
          .to('.hero-btns', { opacity: 1, y: 0, duration: 1 }, '-=0.5');

    // Nav scroll effect
    const nav = document.querySelector('nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // 4. Mobile Menu
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileToggle.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.replace('fa-bars', 'fa-times');
            } else {
                icon.classList.replace('fa-times', 'fa-bars');
            }
        });
    }

    // 5. Dynamic year in footer
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // 6. Music Toggle
    const musicBtn = document.createElement('div');
    musicBtn.className = 'music-toggle';
    musicBtn.innerHTML = '<i class="fas fa-music"></i>';
    document.body.appendChild(musicBtn);

    const audio = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'); 
    audio.loop = true;

    musicBtn.addEventListener('click', () => {
        if (audio.paused) {
            audio.play().catch(e => console.log("Audio play blocked"));
            musicBtn.classList.add('playing');
        } else {
            audio.pause();
            musicBtn.classList.remove('playing');
        }
    });

    // 7. Event Dreamer Interactive Tool
    const dreamerSteps = document.querySelectorAll('.dreamer-step');
    const nextBtn = document.querySelector('.dreamer-next');
    let currentStep = 0;

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (currentStep < dreamerSteps.length - 1) {
                gsap.to(dreamerSteps[currentStep], { opacity: 0, x: -50, display: 'none', duration: 0.5 });
                currentStep++;
                gsap.fromTo(dreamerSteps[currentStep], 
                    { opacity: 0, x: 50, display: 'block' },
                    { opacity: 1, x: 0, duration: 0.5 }
                );
                
                if (currentStep === dreamerSteps.length - 1) {
                    nextBtn.innerHTML = 'Complete My Dream';
                }
            } else {
                // Success animation
                const card = document.querySelector('.dreamer-card');
                gsap.to(card, { 
                    scale: 1.05, 
                    duration: 0.3, 
                    yoyo: true, 
                    repeat: 1, 
                    onComplete: () => {
                        alert("Our luxury event planners have received your dream! We'll contact you shortly.");
                        // Reset or redirect
                    }
                });
            }
        });
    }

    // 8. Scroll Progress Logic
    const dots = document.querySelectorAll('.progress-dot');
    const dotSections = ['hero', 'marquee', 'services', 'highlights', 'gallery', 'dreamer', 'testimonials'];

    window.addEventListener('scroll', () => {
        let current = "";
        dotSections.forEach(section => {
            const el = document.getElementById(section);
            if (el) {
                const sectionTop = el.offsetTop;
                if (window.pageYOffset >= sectionTop - 100) {
                    current = section;
                }
            }
        });

        dots.forEach(dot => {
            dot.classList.remove('active');
            if (dot.getAttribute('data-target') === current) {
                dot.classList.add('active');
            }
        });
    });

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const target = dot.getAttribute('data-target');
            const el = document.getElementById(target);
            if (el) {
                lenis.scrollTo(el);
            }
        });
    });

    // 9. Magnetic Buttons
    const magnets = document.querySelectorAll('.btn-primary, .btn-outline, .logo');
    magnets.forEach((btn) => {
        btn.addEventListener('mousemove', (e) => {
            const position = btn.getBoundingClientRect();
            const x = e.pageX - position.left - position.width / 2;
            const y = e.pageY - position.top - position.height / 2;

            gsap.to(btn, {
                x: x * 0.3,
                y: y * 0.3,
                duration: 0.5,
                ease: 'power2.out'
            });
        });

        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: 'elastic.out(1, 0.3)'
            });
        });
    });

    // 10. 3D Tilt Effect for Glass Cards
    const cards = document.querySelectorAll('.glass-card');
    cards.forEach((card) => {
        card.addEventListener('mousemove', (e) => {
            const position = card.getBoundingClientRect();
            const x = e.pageX - position.left - position.width / 2;
            const y = e.pageY - position.top - position.height / 2;
            
            const rotateX = -y / 15;
            const rotateY = x / 15;

            gsap.to(card, {
                rotateX: rotateX,
                rotateY: rotateY,
                duration: 0.5,
                ease: 'power2.out',
                perspective: 1000
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                rotateX: 0,
                rotateY: 0,
                duration: 0.5,
                ease: 'power2.out'
            });
        });
    });

    // 11. Particles Background (Gold Dust)
    const initParticles = () => {
        const canvas = document.getElementById('hero-particles');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let particles = [];
        const particleCount = 100;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        class Particle {
            constructor() {
                this.reset();
            }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 1;
                this.speedX = Math.random() * 0.5 - 0.25;
                this.speedY = Math.random() * 0.5 - 0.25;
                this.opacity = Math.random() * 0.5 + 0.1;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.x > canvas.width || this.x < 0 || this.y > canvas.height || this.y < 0) {
                    this.reset();
                }
            }
            draw() {
                ctx.fillStyle = `rgba(212, 175, 55, ${this.opacity})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const createParticles = () => {
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animate);
        };

        window.addEventListener('resize', resize);
        resize();
        createParticles();
        animate();
    };
    initParticles();
});
