import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { initAuthListeners } from "./auth.js";

// Multi-language translation layer
const translations = {
    en: {
        brand: "ANTIM",
        subtitle: "Some memories never leave.",
        ctaSave: "Save Memory",
        ctaWrite: "Write Letter",
        ctaExplore: "Explore Stories",
        loginTab: "Login",
        signupTab: "Sign Up",
        labelEmail: "Email Address",
        labelPassword: "Password",
        forgotPassword: "Forgot Password?",
        loginSubmit: "Enter Platform",
        labelUsername: "Username",
        signupSubmit: "Begin Journey",
        dividerText: "Or Connect Via",
        googleAuth: "Continue with Google",
        onboardTitle: "Complete Your Vessel",
        onboardSubtitle: "Establish your persona within the digital sanctuary.",
        labelDisplayName: "Display Name",
        labelBio: "Personal Sanctuary Description (Bio)",
        onboardSubmit: "Finalize Vessel",
        logout: "Logout"
    },
    hi: {
        brand: "अंतिम",
        subtitle: "कुछ यादें कभी नहीं जातीं।",
        ctaSave: "यादें सुरक्षित करें",
        ctaWrite: "पत्र लिखें",
        ctaExplore: "कहानियों को खोजें",
        loginTab: "लॉगिन",
        signupTab: "साइन अप",
        labelEmail: "ईमेल पता",
        labelPassword: "पासवर्ड",
        forgotPassword: "पासवर्ड भूल गए?",
        loginSubmit: "प्लेटफॉर्म में प्रवेश करें",
        labelUsername: "यूज़रनेम",
        signupSubmit: "यात्रा शुरू करें",
        dividerText: "या इसके माध्यम से जुड़ें",
        googleAuth: "गूगल के साथ जारी रखें",
        onboardTitle: "अपनी पहचान पूरी करें",
        onboardSubtitle: "डिजिटल अभयारण्य के भीतर अपना व्यक्तित्व स्थापित करें।",
        labelDisplayName: "प्रदर्शित नाम",
        labelBio: "व्यक्तिगत अभयारण्य विवरण (बायो)",
        onboardSubmit: "पहचान सुरक्षित करें",
        logout: "लॉगआउट"
    }
};

// Application State Management Core Object Context
window.AntimApp = {
    currentUser: null,
    currentLanguage: 'en',
    
    init: function() {
        this.generateAmbientParticles();
        this.initLocalization();
        initAuthListeners();
        this.listenAuthState();
    },

    generateAmbientParticles: function() {
        const container = document.getElementById("particles-container");
        const particleCount = 40;
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement("div");
            particle.classList.add("particle");
            particle.style.left = `${Math.random() * 100}vw`;
            particle.style.width = particle.style.height = `${Math.random() * 4 + 2}px`;
            particle.style.animationDelay = `${Math.random() * 8}s`;
            particle.style.animationDuration = `${Math.random() * 12 + 8}s`;
            container.appendChild(particle);
        }
    },

    initLocalization: function() {
        const switcher = document.getElementById("lang-switcher");
        switcher.addEventListener("change", (e) => {
            this.setLanguage(e.target.value);
        });
        this.setLanguage('en');
    },

    setLanguage: function(lang) {
        this.currentLanguage = lang;
        document.querySelectorAll("[data-localize]").forEach(element => {
            const key = element.getAttribute("data-localize");
            if (translations[lang][key]) {
                if(element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
                    element.placeholder = translations[lang][key];
                } else {
                    element.textContent = translations[lang][key];
                }
            }
        });
    },

    listenAuthState: function() {
        onAuthStateChanged(auth, async (user) => {
            const logoutBtn = document.getElementById("logout-btn");
            if (user) {
                this.currentUser = user;
                logoutBtn.classList.remove("hidden");
                
                // Verify user database registration profile structural health
                const userDocRef = doc(db, "users", user.uid);
                const userDocSnap = await getDoc(userDocRef);
                
                if (!userDocSnap.exists()) {
                    this.switchView("onboarding-view");
                } else {
                    this.switchView("hero-view");
                }
            } else {
                this.currentUser = null;
                logoutBtn.classList.add("hidden");
                this.switchView("hero-view");
            }
        });
    },

    switchView: function(viewId) {
        document.querySelectorAll(".view").forEach(view => {
            view.classList.add("hidden");
        });
        const targetView = document.getElementById(viewId);
        if(targetView) targetView.classList.remove("hidden");
    }
};

// Self Start Setup Runtime Initialization Execution Block
document.addEventListener("DOMContentLoaded", () => {
    window.AntimApp.init();
});
