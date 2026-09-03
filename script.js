document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const togglePasswordBtn = document.getElementById('togglePasswordBtn');
    const emailGroup = emailInput.closest('.form-group');
    const passwordGroup = passwordInput.closest('.form-group');
    const toast = document.getElementById('toast');
    const googleBtn = document.querySelector('.google-btn');

    // Toggle Password Visibility
    if (togglePasswordBtn && passwordInput) {
        togglePasswordBtn.addEventListener('click', () => {
            const isPassword = passwordInput.getAttribute('type') === 'password';
            passwordInput.setAttribute('type', isPassword ? 'text' : 'password');

            // Toggle eye icon appearance
            const eyeIcon = togglePasswordBtn.querySelector('svg');
            if (isPassword) {
                eyeIcon.innerHTML = `
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" stroke-width="1.8"></line>
                `;
                togglePasswordBtn.setAttribute('aria-label', 'Hide password');
            } else {
                eyeIcon.innerHTML = `
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                `;
                togglePasswordBtn.setAttribute('aria-label', 'Show password');
            }
        });
    }

    // Email format validator
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email.trim());
    }

    // Clear error on typing
    emailInput.addEventListener('input', () => {
        if (emailGroup.classList.contains('error')) {
            emailGroup.classList.remove('error');
        }
    });

    passwordInput.addEventListener('input', () => {
        if (passwordGroup.classList.contains('error')) {
            passwordGroup.classList.remove('error');
        }
    });

    // Form Submission Handling
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        let valid = true;

        if (!isValidEmail(emailInput.value)) {
            emailGroup.classList.add('error');
            valid = false;
        } else {
            emailGroup.classList.remove('error');
        }

        if (passwordInput.value.trim().length < 6) {
            passwordGroup.classList.add('error');
            valid = false;
        } else {
            passwordGroup.classList.remove('error');
        }

        if (valid) {
            showToast('Login successful! Redirecting...', 'success');
        } else {
            showToast('Please fix the errors in the form.', 'error');
        }
    });

    // Google Social Login Click
    if (googleBtn) {
        googleBtn.addEventListener('click', () => {
            showToast('Connecting to Google Authentication...', 'success');
        });
    }

    // Helper: Toast Notifications
    function showToast(message, type = 'success') {
        toast.textContent = message;
        toast.className = `toast show ${type}`;

        setTimeout(() => {
            toast.className = 'toast hidden';
        }, 3200);
    }
});
