/* ========================================
   Blog Application — JavaScript (Module 3: Database & Single Blog Integration)
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

    // ===== Category Icon & Gradient Mapper =====
    function getCategoryStyle(category) {
        const cat = (category || '').toLowerCase();
        if (cat.includes('tech') || cat.includes('code') || cat.includes('web')) {
            return { icon: 'fa-code', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', tagClass: 'tag-tech' };
        } else if (cat.includes('design') || cat.includes('ui') || cat.includes('ux') || cat.includes('art')) {
            return { icon: 'fa-palette', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', tagClass: 'tag-design' };
        } else if (cat.includes('life') || cat.includes('health') || cat.includes('mind')) {
            return { icon: 'fa-leaf', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', tagClass: 'tag-lifestyle' };
        } else if (cat.includes('biz') || cat.includes('business') || cat.includes('career') || cat.includes('finance')) {
            return { icon: 'fa-chart-line', gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', tagClass: 'tag-business' };
        }
        return { icon: 'fa-newspaper', gradient: 'linear-gradient(135deg, #6C63FF 0%, #3F3D56 100%)', tagClass: 'tag-tech' };
    }

    // ===== Fetch & Display Blogs on Home Page =====
    const blogGrid = document.querySelector('.blog-grid');
    if (blogGrid && (currentPage === 'index.html' || currentPage === '')) {
        loadHomeBlogs(blogGrid);
    }

    // ===== Fetch & Display Individual Blog Details (Module 3) =====
    if (currentPage.includes('blog-details.html')) {
        loadSingleBlogDetails();
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

            const name = document.getElementById('regName');
            const email = document.getElementById('regEmail');
            const password = document.getElementById('regPassword');
            const confirm = document.getElementById('regConfirmPassword');
            const terms = document.getElementById('regTerms');

            clearErrors(registerForm);

            if (!name.value.trim()) {
                showError(name, 'Full name is required');
                isValid = false;
            }

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

            if (confirm.value !== password.value) {
                showError(confirm, 'Passwords do not match');
                isValid = false;
            }

            if (terms && !terms.checked) {
                showError(terms, 'You must agree to the Terms of Service');
                isValid = false;
            }

            if (isValid) {
                try {
                    const response = await fetch(`${API_BASE_URL}/register`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            fullName: name.value.trim(),
                            email: email.value.trim(),
                            password: password.value
                        })
                    });

                    const data = await response.json();

                    if (response.ok && data.success) {
                        showAlert('registerAlert', 'Account registered successfully! Redirecting to login...', 'success');
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
                            userId: currentUser ? (currentUser.id || currentUser._id) : 'user_default'
                        })
                    });

                    const data = await response.json();

                    if (response.ok && data.success) {
                        showAlert('blogAlert', action === 'draft' ? 'Saved as draft in database!' : 'Blog published successfully to Database!', 'success');
                        setTimeout(function () {
                            window.location.href = 'dashboard.html';
                        }, 1200);
                    } else {
                        showAlert('blogAlert', data.message || 'Failed to create blog post', 'error');
                    }
                } catch (err) {
                    showAlert('blogAlert', 'Error connecting to backend database server', 'error');
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

    // ===== API Loader Functions =====

    async function loadHomeBlogs(gridElement) {
        try {
            const res = await fetch(`${API_BASE_URL}/blogs`);
            const data = await res.json();

            if (data.success && data.blogs && data.blogs.length > 0) {
                gridElement.innerHTML = data.blogs.map(blog => {
                    const blogId = blog._id || blog.id;
                    const style = getCategoryStyle(blog.category);
                    return `
                    <div class="blog-card fade-in" onclick="window.location.href='blog-details.html?id=${blogId}'" style="cursor: pointer;">
                        <div class="blog-card-img" style="background: ${style.gradient};">
                            <i class="fas ${style.icon}"></i>
                        </div>
                        <div class="blog-card-body">
                            <span class="blog-card-tag ${style.tagClass}">${escapeHtml(blog.category || 'Technology')}</span>
                            <h3>${escapeHtml(blog.title)}</h3>
                            <p>${escapeHtml(blog.content.substring(0, 120))}...</p>
                            <div class="blog-card-footer">
                                <div class="blog-author">
                                    <div class="blog-author-avatar">${escapeHtml(blog.authorInitials || 'AU')}</div>
                                    <div class="blog-author-info">
                                        <span>${escapeHtml(blog.author || 'Anonymous')}</span>
                                        <small>${blog.date || 'Recent'}</small>
                                    </div>
                                </div>
                                <a href="blog-details.html?id=${blogId}" class="read-more" onclick="event.stopPropagation();">
                                    Read <i class="fas fa-arrow-right"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                `;
                }).join('');
            }
        } catch (err) {
            console.log('Error loading home blogs from backend:', err);
        }
    }

    async function loadSingleBlogDetails() {
        const urlParams = new URLSearchParams(window.location.search);
        const blogId = urlParams.get('id');

        const loadingEl = document.getElementById('detailsLoading');
        const contentEl = document.getElementById('detailsContent');
        const errorEl = document.getElementById('detailsError');

        if (!blogId) {
            if (loadingEl) loadingEl.style.display = 'none';
            if (errorEl) errorEl.style.display = 'block';
            return;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/blogs/${blogId}`);
            const data = await res.json();

            if (data.success && data.blog) {
                const blog = data.blog;
                const style = getCategoryStyle(blog.category);

                document.title = `${blog.title} — BlogSpace`;

                // Update text elements
                const titleEl = document.getElementById('articleTitle');
                const bodyEl = document.getElementById('articleBody');
                const catEl = document.getElementById('articleCategory');
                const breadcrumbCatEl = document.getElementById('breadcrumbCategory');
                const authorEl = document.getElementById('articleAuthor');
                const avatarEl = document.getElementById('articleAuthorAvatar');
                const dateEl = document.getElementById('articleDate');
                const viewsEl = document.getElementById('articleViews');
                const readTimeEl = document.getElementById('articleReadTime');
                const bannerEl = document.getElementById('articleBanner');
                const tagsListEl = document.getElementById('articleTagsList');

                if (titleEl) titleEl.textContent = blog.title;
                if (bodyEl) bodyEl.textContent = blog.content;
                if (catEl) catEl.textContent = blog.category || 'Technology';
                if (breadcrumbCatEl) breadcrumbCatEl.textContent = blog.category || 'Technology';
                if (authorEl) authorEl.textContent = blog.author || 'Anonymous';
                if (avatarEl) avatarEl.textContent = blog.authorInitials || 'AU';
                if (dateEl) dateEl.textContent = `Published on ${blog.date || 'Recent'}`;
                if (viewsEl) viewsEl.textContent = blog.views || 1;

                // Reading time calculation (average 200 words per min)
                const wordCount = (blog.content || '').trim().split(/\s+/).length;
                const readMinutes = Math.max(1, Math.ceil(wordCount / 200));
                if (readTimeEl) readTimeEl.textContent = `${readMinutes} min read`;

                // Banner styling
                if (bannerEl) {
                    bannerEl.style.background = style.gradient;
                    bannerEl.innerHTML = `<i class="fas ${style.icon}"></i>`;
                }

                // Tags rendering
                if (tagsListEl) {
                    if (blog.tags && blog.tags.trim()) {
                        const tagsArr = blog.tags.split(',').map(t => t.trim()).filter(Boolean);
                        tagsListEl.innerHTML = tagsArr.map(tag => `<span class="article-tag-pill">#${escapeHtml(tag)}</span>`).join('');
                    } else {
                        tagsListEl.innerHTML = `<span class="article-tag-pill">#${blog.category || 'tech'}</span>`;
                    }
                }

                if (loadingEl) loadingEl.style.display = 'none';
                if (contentEl) contentEl.style.display = 'block';
            } else {
                if (loadingEl) loadingEl.style.display = 'none';
                if (errorEl) errorEl.style.display = 'block';
            }
        } catch (err) {
            console.error('Error fetching blog details:', err);
            if (loadingEl) loadingEl.style.display = 'none';
            if (errorEl) errorEl.style.display = 'block';
        }
    }

    async function loadDashboardBlogs(tbodyElement) {
        try {
            const userId = currentUser ? (currentUser.id || currentUser._id) : 'all';
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
                tbodyElement.innerHTML = blogs.map(blog => {
                    const bId = blog._id || blog.id;
                    return `
                    <tr data-id="${bId}">
                        <td>
                            <a href="blog-details.html?id=${bId}" style="color: var(--primary); font-weight: 600;">
                                ${escapeHtml(blog.title)}
                            </a>
                        </td>
                        <td><span class="status-badge ${blog.status === 'published' ? 'status-published' : 'status-draft'}">${blog.status === 'published' ? 'Published' : 'Draft'}</span></td>
                        <td>${blog.date || 'Aug 2025'}</td>
                        <td>${blog.views || 0}</td>
                        <td>
                            <div class="action-btns">
                                <a href="blog-details.html?id=${bId}" class="action-btn" title="View Details" style="display: inline-flex; align-items: center; justify-content: center;">
                                    <i class="fas fa-eye"></i>
                                </a>
                                <button class="action-btn delete" data-id="${bId}" title="Delete">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                `;
                }).join('');

                // Attach delete button listeners
                tbodyElement.querySelectorAll('.action-btn.delete').forEach(btn => {
                    btn.addEventListener('click', async function () {
                        const blogId = this.dataset.id;
                        if (confirm('Are you sure you want to delete this post from database?')) {
                            try {
                                const delRes = await fetch(`${API_BASE_URL}/blogs/${blogId}`, {
                                    method: 'DELETE'
                                });
                                const delData = await delRes.json();
                                if (delData.success) {
                                    const row = this.closest('tr');
                                    row.style.opacity = '0';
                                    setTimeout(() => {
                                        row.remove();
                                        loadDashboardBlogs(tbodyElement);
                                    }, 300);
                                }
                            } catch (e) {
                                alert('Error deleting blog post from database.');
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

        // Update Navbar Links for logged in user
        const navLinksContainer = document.querySelector('.nav-links');
        if (navLinksContainer) {
            const loginLink = navLinksContainer.querySelector('a[href="login.html"]');
            const signupLink = navLinksContainer.querySelector('a[href="register.html"]');
            if (loginLink && signupLink) {
                signupLink.textContent = 'Logout';
                signupLink.href = '#';
                signupLink.classList.remove('btn-primary');
                signupLink.classList.add('btn-outline');
                signupLink.addEventListener('click', function (e) {
                    e.preventDefault();
                    localStorage.removeItem('blog_token');
                    localStorage.removeItem('blog_user');
                    window.location.href = 'index.html';
                });
                loginLink.style.display = 'none';
            }
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
