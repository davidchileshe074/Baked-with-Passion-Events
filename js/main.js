document.addEventListener('DOMContentLoaded', () => {
    // 0. Preloader removal
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            preloader.style.transition = 'opacity 1.5s ease-in-out';
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
                document.body.style.overflow = 'auto'; // ensure overflow is reset
                document.body.style.overflowX = 'clip'; // keep x clip
            }, 1500);
        });
        // Backup
        setTimeout(() => {
            if (preloader.style.display !== 'none') {
                preloader.style.transition = 'opacity 1s';
                preloader.style.opacity = '0';
                setTimeout(() => { 
                    preloader.style.display = 'none';
                    document.body.style.overflow = 'auto';
                    document.body.style.overflowX = 'clip';
                }, 1000);
            }
        }, 4000);
    }

    // 1. Scroll Progress Logic (Native)
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
                window.scrollTo({
                    top: el.offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 2. Custom Cursor Logic
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    
    if (cursor && follower) {
        cursor.style.transition = 'transform 0.1s ease';
        follower.style.transition = 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';

        document.addEventListener('mousemove', (e) => {
            const mouseX = e.clientX;
            const mouseY = e.clientY;
            
            const isScale = cursor.classList.contains('active') ? 'scale(3)' : '';
            const isFollowerScale = follower.classList.contains('active') ? 'scale(1.5)' : '';

            cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) ${isScale}`;
            follower.style.transform = `translate3d(${mouseX - 11}px, ${mouseY - 11}px, 0) ${isFollowerScale}`;
        });

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

    // 3. Fade in sections and reveal elements using vanilla IntersectionObserver
    const animatedElements = document.querySelectorAll('section, .reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('reveal')) {
                    entry.target.classList.add('active');
                } else {
                    entry.target.style.transition = 'opacity 1s ease-out, transform 1s ease-out';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
                observer.unobserve(entry.target);
            }
        });
    }, { rootMargin: '0px 0px -50px 0px', threshold: 0 });

    animatedElements.forEach(el => {
        if (!el.classList.contains('reveal')) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(50px)';
        }
        observer.observe(el);
    });

    // Hero Parallax
    const heroMedia = document.querySelector('.hero-media');
    if (heroMedia) {
        window.addEventListener('scroll', () => {
            let scrolled = window.pageYOffset;
            heroMedia.style.transform = `translateY(${scrolled * 0.3}px)`;
        });
    }

    // Hero Content Stagger
    const heroP = document.querySelector('.hero-content p');
    const heroH1 = document.querySelector('.hero-content h1');
    const heroBtns = document.querySelector('.hero-btns');
    
    setTimeout(() => {
        if(heroP) { heroP.style.transition = 'opacity 1s, transform 1s'; heroP.style.opacity = '1'; heroP.style.transform = 'translateY(0)'; }
    }, 500);
    setTimeout(() => {
        if(heroH1) { heroH1.style.transition = 'opacity 1s, transform 1s'; heroH1.style.opacity = '1'; heroH1.style.transform = 'translateY(0)'; }
    }, 1000);
    setTimeout(() => {
        if(heroBtns) { heroBtns.style.transition = 'opacity 1s, transform 1s'; heroBtns.style.opacity = '1'; heroBtns.style.transform = 'translateY(0)'; }
    }, 1500);

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

    if (nextBtn && dreamerSteps.length > 0) {
        nextBtn.addEventListener('click', () => {
            if (currentStep < dreamerSteps.length - 1) {
                const current = dreamerSteps[currentStep];
                current.style.transition = 'opacity 0.5s, transform 0.5s';
                current.style.opacity = '0';
                current.style.transform = 'translateX(-50px)';
                
                setTimeout(() => {
                    current.style.display = 'none';
                    currentStep++;
                    const next = dreamerSteps[currentStep];
                    next.style.display = 'block';
                    next.style.opacity = '0';
                    next.style.transform = 'translateX(50px)';
                    
                    // Trigger reflow
                    void next.offsetWidth;
                    
                    next.style.transition = 'opacity 0.5s, transform 0.5s';
                    next.style.opacity = '1';
                    next.style.transform = 'translateX(0)';
                    
                    if (currentStep === dreamerSteps.length - 1) {
                        nextBtn.innerHTML = 'Complete My Dream';
                    }
                }, 500);
            } else {
                // Success animation
                const card = document.querySelector('.dreamer-card');
                card.style.transition = 'transform 0.3s ease';
                card.style.transform = 'scale(1.05)';
                setTimeout(() => {
                    card.style.transform = 'scale(1)';
                    setTimeout(() => {
                        alert("Our luxury event planners have received your dream! We'll contact you shortly.");
                    }, 300);
                }, 300);
            }
        });
    }

    // 9. Magnetic Buttons (Vanilla JS)
    const magnets = document.querySelectorAll('.btn-primary, .btn-outline, .logo');
    magnets.forEach((btn) => {
        btn.addEventListener('mousemove', (e) => {
            const position = btn.getBoundingClientRect();
            const x = e.pageX - position.left - position.width / 2;
            const y = e.pageY - position.top - position.height / 2;

            btn.style.transition = 'none';
            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            btn.style.transform = `translate(0, 0)`;
        });
    });

    // 10. 3D Tilt Effect for Glass Cards (Vanilla JS)
    const cards = document.querySelectorAll('.glass-card');
    cards.forEach((card) => {
        card.addEventListener('mousemove', (e) => {
            const position = card.getBoundingClientRect();
            const x = e.pageX - position.left - position.width / 2;
            const y = e.pageY - position.top - position.height / 2;
            
            const rotateX = -y / 15;
            const rotateY = x / 15;

            card.style.transition = 'none';
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transition = 'transform 0.5s ease-out';
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
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
