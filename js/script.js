// Elementos DOM
document.addEventListener('DOMContentLoaded', function() {
    // Ano atual no footer
    document.getElementById('year').textContent = new Date().getFullYear();
    
    // Menu mobile
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('nav ul');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
    }
    
    // Fechar menu ao clicar em links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });
    
    // Efeito de digitação
    const typedTextElement = document.querySelector('.typed-text');
    const cursorElement = document.querySelector('.cursor');
    
    const textArray = [
        "Sistemas de Vendas",
        "Controle de Estoque",
        "Páginas Web",
        "Aplicativos"
    ];
    
    let textArrayIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingDelay = 100;
    
    function type() {
        const currentText = textArray[textArrayIndex];
        
        if (isDeleting) {
            typedTextElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            typingDelay = 50;
        } else {
            typedTextElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            typingDelay = 100;
        }
        
        if (!isDeleting && charIndex === currentText.length) {
            isDeleting = true;
            typingDelay = 1000; // Pausa antes de começar a apagar
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textArrayIndex = (textArrayIndex + 1) % textArray.length;
            typingDelay = 500; // Pausa antes de começar a digitar o próximo texto
        }
        
        setTimeout(type, typingDelay);
    }
    
    if (typedTextElement && cursorElement) {
        setTimeout(type, 1000);
    }
    
    // Animação de estatísticas
    const statNumbers = document.querySelectorAll('.stat-number');
    
    function animateStats() {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count'));
            const duration = 2000; // 2 segundos
            const step = target / (duration / 20); // 20ms por passo
            let current = 0;
            
            const updateStat = () => {
                current += step;
                if (current < target) {
                    stat.textContent = Math.floor(current);
                    requestAnimationFrame(updateStat);
                } else {
                    stat.textContent = target;
                }
            };
            
            updateStat();
        });
    }
    
    // Animação das barras de habilidades
    const skillLevels = document.querySelectorAll('.skill-level');
    
    function animateSkills() {
        skillLevels.forEach(skill => {
            const width = skill.style.width;
            skill.style.width = '0';
            setTimeout(() => {
                skill.style.width = width;
            }, 300);
        });
    }
    
    // Cursor personalizado
    const cursor = document.querySelector('.cursor-follower');
    
    if (cursor) {
        document.addEventListener('mousemove', e => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });
        
        document.addEventListener('mousedown', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(0.8)';
            cursor.style.backgroundColor = 'rgba(16, 185, 129, 0.5)';
        });
        
        document.addEventListener('mouseup', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            cursor.style.backgroundColor = 'rgba(37, 99, 235, 0.5)';
        });
        
        document.querySelectorAll('a, button, .btn, .filter-btn, .social-link').forEach(item => {
            item.addEventListener('mouseenter', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
                cursor.style.backgroundColor = 'rgba(16, 185, 129, 0.3)';
                cursor.style.mixBlendMode = 'difference';
            });
            
            item.addEventListener('mouseleave', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(1)';
                cursor.style.backgroundColor = 'rgba(37, 99, 235, 0.5)';
                cursor.style.mixBlendMode = 'screen';
            });
        });
    }
    
    // Filtro de projetos
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remover classe ativa de todos os botões
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Adicionar classe ativa ao botão clicado
            button.classList.add('active');
            
            const filter = button.getAttribute('data-filter');
            
            projectCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
    
    // Formulário de contato
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        // Configurar URL de redirecionamento após envio
        const currentUrl = window.location.href.split('#')[0];
        const nextInput = contactForm.querySelector('input[name="_next"]');
        if (nextInput) {
            nextInput.value = currentUrl + '#contato?success=true';
        }
        
        contactForm.addEventListener('submit', function(e) {
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            submitButton.disabled = true;
            submitButton.textContent = 'Enviando...';
            submitButton.style.opacity = '0.7';
            
            // O formulário será enviado normalmente via FormSubmit
            // Se houver erro, o botão será reabilitado
            setTimeout(() => {
                // Se após 10 segundos ainda estiver na mesma página, pode ter havido erro
                const checkError = setTimeout(() => {
                    if (submitButton.disabled) {
                        submitButton.disabled = false;
                        submitButton.textContent = originalText;
                        submitButton.style.opacity = '1';
                    }
                }, 10000);
            }, 100);
        });
        
        // Verificar se há parâmetro de sucesso na URL
        if (window.location.search.includes('success=true') || window.location.hash.includes('success=true')) {
            // Criar e exibir mensagem de sucesso
            const successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            successMessage.style.cssText = `
                background: linear-gradient(135deg, #10b981, #059669);
                color: white;
                padding: 15px 20px;
                border-radius: 8px;
                margin-bottom: 20px;
                text-align: center;
                font-weight: 500;
                animation: slideDown 0.3s ease-out;
            `;
            successMessage.textContent = '✓ Mensagem enviada com sucesso! Em breve entrarei em contato.';
            contactForm.insertBefore(successMessage, contactForm.firstChild);
            
            // Remover mensagem após 5 segundos
            setTimeout(() => {
                successMessage.style.animation = 'slideUp 0.3s ease-out';
                setTimeout(() => successMessage.remove(), 300);
            }, 5000);
            
            // Limpar URL
            if (window.history && window.history.replaceState) {
                window.history.replaceState({}, document.title, window.location.pathname + '#contato');
            }
        }
    }
    
    // Animação ao scroll
    const sections = document.querySelectorAll('section');
    const navHeight = document.querySelector('header').offsetHeight;
    
    function animateOnScroll() {
        let scrollPosition = window.pageYOffset;
        
        // Efeito parallax no hero
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.backgroundPositionY = scrollPosition * 0.5 + 'px';
        }
        
        // Animar header ao scroll
        const header = document.querySelector('header');
        if (scrollPosition > 100) {
            header.style.height = '70px';
            header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.height = '80px';
            header.style.boxShadow = 'none';
        }
        
        // Verificar seções visíveis
        sections.forEach(section => {
            const sectionTop = section.offsetTop - navHeight - 100;
            const sectionBottom = sectionTop + section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                // Ativar link de navegação correspondente
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
                
                // Animar elementos específicos quando a seção estiver visível
                if (sectionId === 'habilidades' && !section.classList.contains('animated')) {
                    animateSkills();
                    section.classList.add('animated');
                }
                
                if (sectionId === 'sobre' && !section.classList.contains('animated')) {
                    animateStats();
                    section.classList.add('animated');
                }
            }
        });
    }
    
    // Iniciar animações
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Executar uma vez no carregamento
    
    // Smooth scroll para links internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - navHeight;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
});
