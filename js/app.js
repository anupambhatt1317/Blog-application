/* ========================================
   Blog Application — JavaScript (Connected to Node/Express Backend APIs)
   ======================================== */

const API_BASE_URL = window.location.origin.includes('5000') ? '/api' : 'http://localhost:5000/api';

document.addEventListener('DOMContentLoaded', function () {

    // ===== User Session Management =====
    const currentUser = JSON.parse(localStorage.getItem('blog_user') || 'null');
    const authToken = localStorage.getItem('blog_token');

    updateUserInterface(currentUser);

    // ===== Hamburger Menu Toggle =====
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function () {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

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

    document.querySelectorAll('.sidebar-nav a').forEach(function (link) {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        }
    });

    // ===== Fetch & Display Blogs on Home Page =====
    const blogGrid = document.querySelector('.blog-grid');
    if (blogGrid && (currentPage === 'index.html' || currentPage === '')) {
        loadHomeBlogs(blogGrid);
    }

    // ===== Fetch & Display Blogs on Dashboard =====
    const postsTableBody = document.querySelector('.posts-table tbody');
    if (postsTableBody && currentPage === 'dashboard.html') {
        loadDashboardBlogs(postsTableBody);
    }

    // ===== Login Form Submission (API Call) =====
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            let isValid = true;

            const email = document.getElementById('loginEmail');
            const password = document.getElementById('loginPassword');

            clearErrors(loginForm);

            if (!email.value.trim()) {
                showError(email, 'Email is required');
                isValid = false;
            } else if (!isValidEmail(email.value)) {
                showError(email, 'Please enter a valid email');
                isValid = false;
            }

            if (!password.value.trim()) {
                showError(password, 'Password is required');
                isValid = false;
            } else if (password.value.length < 6) {
                showError(password, 'Password must be at least 6 characters');
                isValid = false;
            }

            if (isValid) {
                try {
                    const response = await fetch(`${API_BASE_URL}/login`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            email: email.value.trim(),
                            password: password.value
                        })
                    });

                    const data = await response.json();

                    if (response.ok && data.success) {
                        localStorage.setItem('blog_token', data.token);
                        localStorage.setItem('blog_user', JSON.stringify(data.user));
                        showAlert('loginAlert', 'Login successful! Redirecting to Dashboard...', 'success');
                        setTimeout(function () {
                            window.location.href = 'dashboard.html';
                        }, 1200);
                    } else {
                        showAlert('loginAlert', data.message || 'Login failed', 'error');
                    }
                } catch (err) {
                    showAlert('loginAlert', 'Cannot connect to backend server. Ensure Express backend is running on port 5000.', 'error');
                }
            }
        });
    }

    // ===== Register Form Submission (API Call) =====
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            let isValid = true;

            const fullName = document.getElementById('regName');
            const email = document.getElementById('regEmail');
            const password = document.getElementById('regPassword');
            const confirmPassword = document.getElementById('regConfirmPassword');

            clearErrors(registerForm);

            if (!fullName.value.trim()) {
                showError(fullName, 'Full name is required');
                isValid = false;
            }

            if (!email.value.trim()) {
                showError(email, 'Email is required');
                isValid = false;
            } else if (!isValidEmail(email.value)) {
                showError(email, 'Please enter a valid email');
                isValid = false;
            }

            if (!password.value) {
                showError(password, 'Password is required');
                isValid = false;
            } else if (password.value.length < 6) {
                showError(password, 'Password must be at least 6 characters');
                isValid = false;
            }

            if (!confirmPassword.value) {
                showError(confirmPassword, 'Please confirm your password');
                isValid = false;
            } else if (password.value !== confirmPassword.value) {
                showError(confirmPassword, 'Passwords do not match');
                isValid = false;
            }

            if (isValid) {
                try {
                    const response = await fetch(`${API_BASE_URL}/register`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            fullName: fullName.value.trim(),
                            email: email.value.trim(),
                            password: password.value
                        })
                    });

                    const data = await response.json();

                    if (response.ok && data.success) {
                        showAlert('registerAlert', 'Account created successfully! Redirecting to Login...', 'success');
                        setTimeout(function () {
                            window.location.href = 'login.html';
                        }, 1500);
                    } else {
                        showAlert('registerAlert', data.message || 'Registration failed', 'error');
                    }
                } catch (err) {
                    showAlert('registerAlert', 'Backend server unreachable. Make sure backend is running.', 'error');
                }
            }
        });

        const regPassword = document.getElementById('regPassword');
        if (regPassword) {
            regPassword.addEventListener('input', function () {
                updatePasswordStrength(this.value);
            });
        }
    }

    // ===== Create Blog Form Submission (API Call) =====
    const createBlogForm = document.getElementById('createBlogForm');
    if (createBlogForm) {
        createBlogForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const action = e.submitter ? e.submitter.dataset.action : 'publish';
            let isValid = true;

            const title = document.getElementById('blogTitle');
            const category = document.getElementById('blogCategory');
            const tags = document.getElementById('blogTags');
            const content = document.getElementById('blogContent');

            clearErrors(createBlogForm);

            if (!title.value.trim()) {
                showError(title, 'Blog title is required');
                isValid = false;
            }

            if (!category.value) {
                showError(category, 'Please select a category');
                isValid = false;
            }

            if (!content.value.trim()) {
                showError(content, 'Blog content is required');
                isValid = false;
            }

            if (isValid) {
                try {
                    const response = await fetch(`${API_BASE_URL}/blogs`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            title: title.value.trim(),
                            category: category.value,
                            tags: tags ? tags.value.trim() : '',
                            content: content.value.trim(),
                            status: action === 'draft' ? 'draft' : 'published',
                            author: currentUser ? currentUser.fullName : 'Aman Kumar',
                            userId: currentUser ? currentUser.id : 'user_default'
                        })
                    });

                    const data = await response.json();

                    if (response.ok && data.success) {
                        showAlert('blogAlert', action === 'draft' ? 'Saved as draft!' : 'Blog published successfully!', 'success');
                        setTimeout(function () {
                            window.location.href = 'dashboard.html';
                        }, 1200);
                    } else {
                        showAlert('blogAlert', data.message || 'Failed to create blog post', 'error');
                    }
                } catch (err) {
                    showAlert('blogAlert', 'Error connecting to backend REST API.', 'error');
                }
            }
        });

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

        document.addEventListener('click', function (e) {
            if (window.innerWidth <= 768) {
                if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
                    sidebar.classList.remove('active');
                }
            }
        });
    }

    // ===== Logout Event Handlers =====
    document.querySelectorAll('a[href="login.html"]').forEach(link => {
        if (link.textContent.includes('Logout')) {
            link.addEventListener('click', function () {
                localStorage.removeItem('blog_user');
                localStorage.removeItem('blog_token');
            });
        }
    });

    // ===== Helper Functions =====

    async function loadHomeBlogs(gridElement) {
        try {
            const res = await fetch(`${API_BASE_URL}/blogs`);
            const data = await res.json();

            if (data.success && data.blogs && data.blogs.length > 0) {
                gridElement.innerHTML = data.blogs.map(blog => `
                    <div class="blog-card fade-in">
                        <div class="blog-card-img" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                            <i class="fas fa-file-alt"></i>
                        </div>
                        <div class="blog-card-body">
                            <span class="blog-card-tag tag-tech">${blog.category || 'General'}</span>
                            <h3>${escapeHtml(blog.title)}</h3>
                            <p>${escapeHtml(blog.content.substring(0, 120))}...</p>
                            <div class="blog-card-footer">
                                <div class="blog-author">
                                    <div class="blog-author-avatar">${blog.authorInitials || 'AK'}</div>
                                    <div class="blog-author-info">
                                        <span>${escapeHtml(blog.author)}</span>
                                        <small>${blog.date || 'Recent'}</small>
                                    </div>
                                </div>
                                <a href="#" class="read-more">Read <i class="fas fa-arrow-right"></i></a>
                            </div>
                        </div>
                    </div>
                `).join('');
            }
        } catch (err) {
            console.log('Using default home blogs fallback');
        }
    }

    async function loadDashboardBlogs(tbodyElement) {
        try {
            const userId = currentUser ? currentUser.id : 'all';
            const res = await fetch(`${API_BASE_URL}/blogs/user/${userId}`);
            const data = await res.json();

            if (data.success && data.blogs) {
                const blogs = data.blogs;

                // Update Stats Header Cards
                const totalPostsEl = document.querySelector('.stat-card:nth-child(1) h3');
                const publishedEl = document.querySelector('.stat-card:nth-child(2) h3');
                const draftsEl = document.querySelector('.stat-card:nth-child(3) h3');
                const viewsEl = document.querySelector('.stat-card:nth-child(4) h3');

                const publishedCount = blogs.filter(b => b.status === 'published').length;
                const draftCount = blogs.filter(b => b.status === 'draft').length;
                const totalViews = blogs.reduce((acc, curr) => acc + (curr.views || 0), 0);

                if (totalPostsEl) totalPostsEl.textContent = blogs.length;
                if (publishedEl) publishedEl.textContent = publishedCount;
                if (draftsEl) draftsEl.textContent = draftCount;
                if (viewsEl) viewsEl.textContent = totalViews > 0 ? totalViews : '1.2K';

                // Render Dashboard Table Rows
                tbodyElement.innerHTML = blogs.map(blog => `
                    <tr data-id="${blog.id}">
                        <td><strong>${escapeHtml(blog.title)}</strong></td>
                        <td><span class="status-badge ${blog.status === 'published' ? 'status-published' : 'status-draft'}">${blog.status === 'published' ? 'Published' : 'Draft'}</span></td>
                        <td>${blog.date || 'Aug 2025'}</td>
                        <td>${blog.views || '—'}</td>
                        <td>
                            <div class="action-btns">
                                <button class="action-btn edit" title="Edit">
                                    <i class="fas fa-pen"></i>
                                </button>
                                <button class="action-btn delete" data-id="${blog.id}" title="Delete">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                `).join('');

                // Attach Delete Event Handler
                tbodyElement.querySelectorAll('.action-btn.delete').forEach(btn => {
                    btn.addEventListener('click', async function () {
                        const blogId = this.dataset.id;
                        if (confirm('Are you sure you want to delete this post?')) {
                            try {
                                const delRes = await fetch(`${API_BASE_URL}/blogs/${blogId}`, {
                                    method: 'DELETE'
                                });
                                const delData = await delRes.json();
                                if (delData.success) {
                                    const row = this.closest('tr');
                                    row.style.opacity = '0';
                                    setTimeout(() => row.remove(), 300);
                                }
                            } catch (e) {
                                alert('Error deleting blog post from server.');
                            }
                        }
                    });
                });
            }
        } catch (err) {
            console.log('Error loading dashboard blogs');
        }
    }

    function updateUserInterface(user) {
        if (!user) return;

        // Update profile in sidebar if available
        const sidebarName = document.querySelector('.sidebar-profile h3');
        const sidebarHandle = document.querySelector('.sidebar-profile p');
        const sidebarAvatar = document.querySelector('.sidebar-avatar');

        if (sidebarName) sidebarName.textContent = user.fullName;
        if (sidebarHandle) sidebarHandle.textContent = `@${user.email.split('@')[0]}`;
        if (sidebarAvatar) {
            const initials = user.fullName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
            sidebarAvatar.textContent = initials || 'AK';
        }
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function showError(input, message) {
        input.classList.add('error');
        const formGroup = input.closest('.form-group');
        const errorMsg = formGroup ? formGroup.querySelector('.error-msg') : null;
        if (errorMsg) {
            errorMsg.textContent = message;
            errorMsg.classList.add('show');
        }
    }

    function clearErrors(form) {
        form.querySelectorAll('input, textarea, select').forEach(input => input.classList.remove('error'));
        form.querySelectorAll('.error-msg').forEach(msg => {
            msg.classList.remove('show');
            msg.textContent = '';
        });
    }

    function showAlert(alertId, message, type) {
        const alert = document.getElementById(alertId);
        if (alert) {
            alert.className = `alert alert-${type} show`;
            alert.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i> ${message}`;
        }
    }

    function updatePasswordStrength(password) {
        const strengthFill = document.querySelector('.strength-bar-fill');
        const strengthText = document.querySelector('.strength-text');
        if (!strengthFill || !strengthText) return;

        let strength = 0;
        if (password.length >= 6) strength++;
        if (password.length >= 10) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;

        const percentage = (strength / 4) * 100;
        let label = 'Weak', color = '#dc3545';
        if (strength === 2) { label = 'Fair'; color = '#ffc107'; }
        else if (strength === 3) { label = 'Good'; color = '#17a2b8'; }
        else if (strength >= 4) { label = 'Strong'; color = '#28a745'; }

        strengthFill.style.width = percentage + '%';
        strengthFill.style.backgroundColor = color;
        strengthText.textContent = label;
        strengthText.style.color = color;
    }

    function updateWordCount(text) {
        const charCount = document.getElementById('charCount');
        const wordCountEl = document.getElementById('wordCount');
        if (charCount) charCount.textContent = text.length;
        if (wordCountEl) {
            const words = text.trim() ? text.trim().split(/\s+/).length : 0;
            wordCountEl.textContent = words;
        }
    }

    function escapeHtml(str) {
        if (!str) return '';
        return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    }

});
