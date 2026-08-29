/* ========================================
   Blog Application — JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', function () {

    // ===== Hamburger Menu Toggle =====
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function () {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // ===== Active Nav Link Highlighting =====
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(function (link) {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        }
    });

    // Also highlight sidebar nav links
    document.querySelectorAll('.sidebar-nav a').forEach(function (link) {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        }
    });

    // ===== Login Form Validation =====
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            let isValid = true;

            const email = document.getElementById('loginEmail');
            const password = document.getElementById('loginPassword');

            // Reset errors
            clearErrors(loginForm);

            // Validate email
            if (!email.value.trim()) {
                showError(email, 'Email is required');
                isValid = false;
            } else if (!isValidEmail(email.value)) {
                showError(email, 'Please enter a valid email');
                isValid = false;
            }

            // Validate password
            if (!password.value.trim()) {
                showError(password, 'Password is required');
                isValid = false;
            } else if (password.value.length < 6) {
                showError(password, 'Password must be at least 6 characters');
                isValid = false;
            }

            if (isValid) {
                showAlert('loginAlert', 'Login successful! Redirecting...', 'success');
                setTimeout(function () {
                    window.location.href = 'dashboard.html';
                }, 1500);
            }
        });
    }

    // ===== Register Form Validation =====
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function (e) {
            e.preventDefault();
            let isValid = true;

            const fullName = document.getElementById('regName');
            const email = document.getElementById('regEmail');
            const password = document.getElementById('regPassword');
            const confirmPassword = document.getElementById('regConfirmPassword');

            // Reset errors
            clearErrors(registerForm);

            // Validate name
            if (!fullName.value.trim()) {
                showError(fullName, 'Full name is required');
                isValid = false;
            } else if (fullName.value.trim().length < 2) {
                showError(fullName, 'Name must be at least 2 characters');
                isValid = false;
            }

            // Validate email
            if (!email.value.trim()) {
                showError(email, 'Email is required');
                isValid = false;
            } else if (!isValidEmail(email.value)) {
                showError(email, 'Please enter a valid email');
                isValid = false;
            }

            // Validate password
            if (!password.value) {
                showError(password, 'Password is required');
                isValid = false;
            } else if (password.value.length < 6) {
                showError(password, 'Password must be at least 6 characters');
                isValid = false;
            }

            // Validate confirm password
            if (!confirmPassword.value) {
                showError(confirmPassword, 'Please confirm your password');
                isValid = false;
            } else if (password.value !== confirmPassword.value) {
                showError(confirmPassword, 'Passwords do not match');
                isValid = false;
            }

            if (isValid) {
                showAlert('registerAlert', 'Account created successfully! Redirecting to login...', 'success');
                setTimeout(function () {
                    window.location.href = 'login.html';
                }, 1500);
            }
        });

        // Password Strength Indicator
        const regPassword = document.getElementById('regPassword');
        if (regPassword) {
            regPassword.addEventListener('input', function () {
                updatePasswordStrength(this.value);
            });
        }
    }

    // ===== Create Blog Form Validation =====
    const createBlogForm = document.getElementById('createBlogForm');
    if (createBlogForm) {
        createBlogForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const action = e.submitter ? e.submitter.dataset.action : 'publish';
            let isValid = true;

            const title = document.getElementById('blogTitle');
            const category = document.getElementById('blogCategory');
            const content = document.getElementById('blogContent');

            // Reset errors
            clearErrors(createBlogForm);

            // Validate title
            if (!title.value.trim()) {
                showError(title, 'Blog title is required');
                isValid = false;
            } else if (title.value.trim().length < 5) {
                showError(title, 'Title must be at least 5 characters');
                isValid = false;
            }

            // Validate category
            if (!category.value) {
                showError(category, 'Please select a category');
                isValid = false;
            }

            // Validate content
            if (!content.value.trim()) {
                showError(content, 'Blog content is required');
                isValid = false;
            } else if (content.value.trim().length < 50) {
                showError(content, 'Content must be at least 50 characters');
                isValid = false;
            }

            if (isValid) {
                if (action === 'draft') {
                    showAlert('blogAlert', 'Blog saved as draft!', 'success');
                } else {
                    showAlert('blogAlert', 'Blog published successfully!', 'success');
                }
                setTimeout(function () {
                    window.location.href = 'dashboard.html';
                }, 1500);
            }
        });

        // Word & Character Count
        const blogContent = document.getElementById('blogContent');
        if (blogContent) {
            blogContent.addEventListener('input', function () {
                updateWordCount(this.value);
            });
        }
    }

    // ===== Sidebar Toggle (Dashboard) =====
    const sidebarToggle = document.querySelector('.sidebar-toggle-btn');
    const sidebar = document.querySelector('.sidebar');

    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', function () {
            sidebar.classList.toggle('active');
        });

        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', function (e) {
            if (window.innerWidth <= 768) {
                if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
                    sidebar.classList.remove('active');
                }
            }
        });
    }

    // ===== Image Upload Placeholder =====
    const imageUpload = document.querySelector('.image-upload');
    if (imageUpload) {
        imageUpload.addEventListener('click', function () {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.addEventListener('change', function (e) {
                if (e.target.files.length > 0) {
                    const fileName = e.target.files[0].name;
                    imageUpload.innerHTML = '<i class="fas fa-check-circle" style="color: var(--success);"></i><p>Selected: <strong>' + fileName + '</strong></p><span>Click to change</span>';
                }
            });
            input.click();
        });
    }

    // ===== Delete Post Confirmation =====
    document.querySelectorAll('.action-btn.delete').forEach(function (btn) {
        btn.addEventListener('click', function () {
            if (confirm('Are you sure you want to delete this post?')) {
                const row = this.closest('tr');
                if (row) {
                    row.style.opacity = '0';
                    row.style.transform = 'translateX(-20px)';
                    row.style.transition = 'all 0.3s ease';
                    setTimeout(function () {
                        row.remove();
                    }, 300);
                }
            }
        });
    });

    // ===== Helper Functions =====

    function isValidEmail(email) {
        var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function showError(input, message) {
        input.classList.add('error');
        var formGroup = input.closest('.form-group');
        var errorMsg = formGroup.querySelector('.error-msg');
        if (errorMsg) {
            errorMsg.textContent = message;
            errorMsg.classList.add('show');
        }
    }

    function clearErrors(form) {
        form.querySelectorAll('input, textarea, select').forEach(function (input) {
            input.classList.remove('error');
        });
        form.querySelectorAll('.error-msg').forEach(function (msg) {
            msg.classList.remove('show');
            msg.textContent = '';
        });
    }

    function showAlert(alertId, message, type) {
        var alert = document.getElementById(alertId);
        if (alert) {
            alert.className = 'alert alert-' + type + ' show';
            alert.innerHTML = '<i class="fas fa-' + (type === 'success' ? 'check-circle' : 'exclamation-circle') + '"></i> ' + message;
        }
    }

    function updatePasswordStrength(password) {
        var strengthFill = document.querySelector('.strength-bar-fill');
        var strengthText = document.querySelector('.strength-text');

        if (!strengthFill || !strengthText) return;

        var strength = 0;
        if (password.length >= 6) strength++;
        if (password.length >= 10) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;

        var percentage = (strength / 5) * 100;
        var label, color;

        if (strength <= 1) {
            label = 'Weak';
            color = '#dc3545';
        } else if (strength <= 2) {
            label = 'Fair';
            color = '#ffc107';
        } else if (strength <= 3) {
            label = 'Good';
            color = '#17a2b8';
        } else {
            label = 'Strong';
            color = '#28a745';
        }

        strengthFill.style.width = percentage + '%';
        strengthFill.style.backgroundColor = color;
        strengthText.textContent = label;
        strengthText.style.color = color;
    }

    function updateWordCount(text) {
        var charCount = document.getElementById('charCount');
        var wordCountEl = document.getElementById('wordCount');

        if (charCount) {
            charCount.textContent = text.length;
        }
        if (wordCountEl) {
            var words = text.trim() ? text.trim().split(/\s+/).length : 0;
            wordCountEl.textContent = words;
        }
    }

});
