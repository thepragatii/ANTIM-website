import { 
    auth 
} from "./firebase-config.js";
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signOut, 
    updateProfile,
    onAuthStateChanged 
} from "firebase/auth";

export function initAuthMechanisms(onUserAuthenticated, onUserLoggedOut) {
    const tabLogin = document.getElementById("tab-login");
    const tabSignup = document.getElementById("tab-signup");
    const loginForm = document.getElementById("login-form");
    const signupForm = document.getElementById("signup-form");
    const loginError = document.getElementById("login-error");
    const signupError = document.getElementById("signup-error");
    const authActionBtn = document.getElementById("auth-action-btn");
    const profileLogoutBtn = document.getElementById("profile-logout-btn");
    const authContainer = document.getElementById("auth-container");

    if (tabLogin && tabSignup && loginForm && signupForm) {
        tabLogin.addEventListener("click", () => {
            tabLogin.classList.add("active");
            tabSignup.classList.remove("active");
            loginForm.classList.remove("hidden");
            signupForm.classList.add("hidden");
            loginError.classList.add("hidden");
        });

        tabSignup.addEventListener("click", () => {
            tabSignup.classList.add("active");
            tabLogin.classList.remove("active");
            signupForm.classList.remove("hidden");
            loginForm.classList.add("hidden");
            signupError.classList.add("hidden");
        });
    }

    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            loginError.classList.add("hidden");
            const email = document.getElementById("login-email").value.trim();
            const pass = document.getElementById("login-password").value;

            try {
                await signInWithEmailAndPassword(auth, email, pass);
                loginForm.reset();
            } catch (error) {
                loginError.textContent = getAuthenticationErrorMessage(error.code);
                loginError.classList.remove("hidden");
            }
        });
    }

    if (signupForm) {
        signupForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            signupError.classList.add("hidden");
            const name = document.getElementById("signup-name").value.trim();
            const email = document.getElementById("signup-email").value.trim();
            const pass = document.getElementById("signup-password").value;

            if (pass.length < 6) {
                signupError.textContent = "Password security threshold failure: Minimum 6 characters required.";
                signupError.classList.remove("hidden");
                return;
            }

            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
                await updateProfile(userCredential.user, { displayName: name });
                signupForm.reset();
            } catch (error) {
                signupError.textContent = getAuthenticationErrorMessage(error.code);
                signupError.classList.remove("hidden");
            }
        });
    }

    if (authActionBtn) {
        authActionBtn.addEventListener("click", () => {
            const currentUser = auth.currentUser;
            if (currentUser) {
                signOut(auth).catch((err) => console.error("Signout execution error", err));
            } else {
                showExplicitSection("auth-container");
            }
        });
    }

    if (profileLogoutBtn) {
        profileLogoutBtn.addEventListener("click", () => {
            signOut(auth).catch((err) => console.error("Profile logout exception", err));
        });
    }

    onAuthStateChanged(auth, (user) => {
        if (user) {
            configureAuthButtonState(true);
            onUserAuthenticated(user);
        } else {
            configureAuthButtonState(false);
            onUserLoggedOut();
        }
    });
}

function configureAuthButtonState(isAuthenticated) {
    const btn = document.getElementById("auth-action-btn");
    if (!btn) return;
    const currentLang = document.getElementById("lang-toggle").textContent === "EN" ? "HI" : "EN";
    
    if (isAuthenticated) {
        btn.setAttribute("data-en", "Logout");
        btn.setAttribute("data-hi", "लॉगआउट");
        btn.textContent = currentLang === "HI" ? "Logout" : "लॉगआउट";
        btn.classList.add("btn-danger");
    } else {
        btn.setAttribute("data-en", "Login");
        btn.setAttribute("data-hi", "लॉगिन");
        btn.textContent = currentLang === "HI" ? "Login" : "लॉगिन";
        btn.classList.remove("btn-danger");
    }
}

function showExplicitSection(sectionId) {
    const sections = ["hero", "auth-container", "vault", "timeline", "profile"];
    sections.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            if (id === sectionId) {
                el.classList.remove("hidden");
            } else {
                el.classList.add("hidden");
            }
        }
    });
}

function getAuthenticationErrorMessage(code) {
    switch (code) {
        case "auth/invalid-email":
            return "The email layout provided does not match secure formatting rules.";
        case "auth/user-disabled":
            return "This user credentials file has been administratively disabled.";
        case "auth/user-not-found":
            return "No matching archival records found with these email metrics.";
        case "auth/wrong-password":
            return "Authentication rejected. Invalid core password sequence matches.";
        case "auth/email-already-in-use":
            return "This structural email asset is already allocated to another vault ecosystem.";
        case "auth/weak-password":
            return "The password array provided fails basic protective encryption weight criteria.";
        case "auth/invalid-credential":
            return "Invalid security criteria verified. Check credentials configuration.";
        default:
            return "An internal verification system fault occurred. Trace pattern blocked.";
    }
}
