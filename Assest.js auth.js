/* Glassmorphism Platform Component Implementation */
.glass-card {
    background: var(--glass-background);
    border: 1px solid var(--glass-border);
    backdrop-filter: blur(20px) saturate(160%);
    -webkit-backdrop-filter: blur(20px) saturate(160%);
    border-radius: 12px;
    box-shadow: var(--glass-glow);
    padding: 40px;
    width: 100%;
    max-width: 450px;
    position: relative;
    z-index: 100;
}

.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(5, 5, 7, 0.8);
    backdrop-filter: blur(8px);
    z-index: 99;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    transition: var(--transition-smooth);
}

.close-modal {
    position: absolute;
    top: 20px;
    right: 25px;
    background: transparent;
    border: none;
    color: var(--text-muted);
    font-size: 1.8rem;
    cursor: pointer;
    transition: var(--transition-smooth);
}

.close-modal:hover {
    color: var(--text-primary);
}

/* Tab Structure */
.auth-tabs {
    display: flex;
    border-bottom: 1px solid var(--glass-border);
    margin-bottom: 28px;
}

.tab-btn {
    flex: 1;
    background: transparent;
    border: none;
    color: var(--text-muted);
    padding: 12px 0;
    font-size: 1rem;
    font-family: var(--font-body);
    font-weight: 500;
    cursor: pointer;
    transition: var(--transition-smooth);
    position: relative;
}

.tab-btn.active {
    color: var(--text-primary);
}

.tab-btn.active::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 100%;
    height: 2px;
    background: var(--accent-glow);
    box-shadow: 0 0 8px var(--accent-glow);
}

/* Fields & Input Modules */
.input-group {
    margin-bottom: 20px;
}

.input-group label {
    display: block;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    color: var(--text-secondary);
    margin-bottom: 8px;
}

.input-group input, .input-group textarea {
    width: 100%;
    background: rgba(0, 0, 0, 0.4);
    border: 1px solid var(--glass-border);
    border-radius: 4px;
    padding: 12px 16px;
    color: #fff;
    font-family: var(--font-body);
    font-size: 0.95rem;
    transition: var(--transition-smooth);
}

.input-group input:focus, .input-group textarea:focus {
    border-color: var(--accent-glow);
    box-shadow: 0 0 10px rgba(129, 140, 248, 0.2);
    outline: none;
}

.form-actions {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 20px;
}

.btn-link {
    background: transparent;
    border: none;
    color: var(--text-muted);
    font-size: 0.85rem;
    cursor: pointer;
    transition: var(--transition-smooth);
}

.btn-link:hover {
    color: var(--accent-glow);
}

.btn-block {
    width: 100%;
}

.divider {
    text-align: center;
    margin: 24px 0;
    position: relative;
}

.divider::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    height: 1px;
    background: var(--glass-border);
    z-index: 1;
}

.divider span {
    background: #0f0f19;
    padding: 0 12px;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: var(--text-muted);
    position: relative;
    z-index: 2;
}

.btn-google {
    background: #fff;
    color: #111;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    font-weight: 600;
}

.btn-google:hover {
    background: #f1f1f1;
}

/* Feedback Context Banners */
.feedback-banner {
    padding: 12px;
    border-radius: 4px;
    font-size: 0.85rem;
    margin-bottom: 20px;
    text-align: center;
}

.feedback-banner.error {
    background: rgba(239, 68, 68, 0.15);
    border: 1px solid var(--accent-danger);
    color: #fca5a5;
}

.feedback-banner.success {
    background: rgba(16, 185, 129, 0.15);
    border: 1px solid var(--accent-success);
    color: #a7f3d0;
}
