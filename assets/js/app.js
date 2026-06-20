import { initAuthMechanisms } from "./auth.js";
import { 
    collection, 
    addDoc, 
    query, 
    where, 
    orderBy, 
    onSnapshot, 
    doc, 
    updateDoc, 
    deleteDoc 
} from "firebase/firestore";
import { 
    ref, 
    uploadBytesResumable, 
    getDownloadURL 
} from "firebase/storage";

let primaryMemoriesDataset = [];
let localActiveLanguage = "EN";
let realTimeUnsubscribeHandle = null;

document.addEventListener("DOMContentLoaded", () => {
    initializeParticlesBackground();
    initializeGeneralDomRouting();
    initializeInterfaceThemeEngine();
    initAuthMechanisms(handleUserSessionActivation, handleUserSessionTermination);
});

function initializeParticlesBackground() {
    if (document.getElementById("particles-js") && typeof particlesJS !== "undefined") {
        particlesJS("particles-js", {
            "particles": {
                "number": { "value": 40, "density": { "enable": true, "value_area": 800 } },
                "color": { "value": "#a78bfa" },
                "shape": { "type": "circle" },
                "opacity": { "value": 0.2, "random": true },
                "size": { "value": 2, "random": true },
                "line_linked": { "enable": false },
                "move": { "enable": true, "speed": 0.6, "direction": "top", "random": true, "straight": false, "out_mode": "out" }
            },
            "interactivity": { "detect_on": "canvas", "events": { "onhover": { "enable": false }, "onclick": { "enable": false } } },
            "retina_detect": true
        });
    }
}

function initializeGeneralDomRouting() {
    const hamburger = document.getElementById("hamburger");
    const navMenu = document.getElementById("nav-menu");
    const links = document.querySelectorAll(".nav-link, .nav-logo");
    const langToggle = document.getElementById("lang-toggle");
    const fileInput = document.getElementById("memory-image");
    const dropzone = document.getElementById("dropzone");
    const memoryForm = document.getElementById("memory-form");
    const searchInput = document.getElementById("timeline-search");
    const heroBtn = document.getElementById("hero-primary-btn");
    
    const editForm = document.getElementById("edit-form");
    const editCancelBtn = document.getElementById("edit-cancel-btn");

    if (hamburger && navMenu) {
        hamburger.addEventListener("click", () => {
            navMenu.classList.toggle("active");
            hamburger.classList.toggle("active");
        });
    }

    links.forEach(link => {
        link.addEventListener("click", (e) => {
            const destinationAttr = link.getAttribute("href");
            if (!destinationAttr.startsWith("#")) return;
            e.preventDefault();
            
            if (navMenu) {
                navMenu.classList.remove("active");
                hamburger.classList.remove("active");
            }

            const targetId = destinationAttr.substring(1);
            if (targetId === "" || targetId === "hero") {
                executeDirectSectionRouting("hero");
                setActiveNavbarLink("nav-logo");
            } else {
                if (!auth.currentUser) {
                    executeDirectSectionRouting("auth-container");
                } else {
                    executeDirectSectionRouting(targetId);
                    setActiveNavbarLink(`nav-${targetId}`);
                }
            }
        });
    });

    if (heroBtn) {
        heroBtn.addEventListener("click", () => {
            if (auth.currentUser) {
                executeDirectSectionRouting("vault");
                setActiveNavbarLink("nav-vault");
            } else {
                executeDirectSectionRouting("auth-container");
            }
        });
    }

    if (langToggle) {
        langToggle.addEventListener("click", () => {
            localActiveLanguage = localActiveLanguage === "EN" ? "HI" : "EN";
            langToggle.textContent = localActiveLanguage === "EN" ? "HI" : "EN";
            executeLanguageArchitectureShift();
        });
    }

    if (fileInput && dropzone) {
        const labelText = document.getElementById("file-label-text");
        fileInput.addEventListener("change", (e) => {
            if (e.target.files.length > 0) {
                labelText.textContent = e.target.files[0].name;
            } else {
                labelText.textContent = localActiveLanguage === "EN" ? "Click or Drag an image asset" : "एक छवि एसेट क्लिक या ड्रैग करें";
            }
        });

        ["dragenter", "dragover"].forEach(eventName => {
            dropzone.addEventListener(eventName, (e) => { e.preventDefault(); dropzone.classList.add("dragover"); }, false);
        });
        ["dragleave", "drop"].forEach(eventName => {
            dropzone.addEventListener(eventName, (e) => { e.preventDefault(); dropzone.classList.remove("dragover"); }, false);
        });
        dropzone.addEventListener("drop", (e) => {
            const dt = e.dataTransfer;
            const files = dt.files;
            if (files.length > 0) {
                fileInput.files = files;
                labelText.textContent = files[0].name;
            }
        });
    }

    if (memoryForm) {
        memoryForm.addEventListener("submit", executeMemoryStorageTransaction);
    }

    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            filterAndRenderTimelineInterface(e.target.value.trim());
        });
    }

    if (editForm) {
        editForm.addEventListener("submit", executeUpdateMemoryTransaction);
    }

    if (editCancelBtn) {
        editCancelBtn.addEventListener("click", () => {
            document.getElementById("edit-modal").classList.add("hidden");
        });
    }

    setInitialSystemDateValues();
}

function setInitialSystemDateValues() {
    const dateInput = document.getElementById("memory-date");
    if (dateInput) {
        const today = new Date().toISOString().split("T")[0];
        dateInput.value = today;
    }
}

function executeDirectSectionRouting(sectionId) {
    const coreSections = ["hero", "auth-container", "vault", "timeline", "profile"];
    coreSections.forEach(id => {
        const sectionEl = document.getElementById(id);
        if (sectionEl) {
            if (id === sectionId) {
                sectionEl.classList.remove("hidden");
                if (id !== "hero" && id !== "auth-container") {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                }
            } else {
                sectionEl.classList.add("hidden");
            }
        }
    });
}

function setActiveNavbarLink(elementId) {
    document.querySelectorAll(".nav-link").forEach(l => l.classList.remove("active"));
    const targetedActiveEl = document.getElementById(elementId);
    if (targetedActiveEl && targetedActiveEl.classList.contains("nav-link")) {
        targetedActiveEl.classList.add("active");
    }
}

function initializeInterfaceThemeEngine() {
    const toggleBtn = document.getElementById("theme-toggle");
    const cachedConfigTheme = localStorage.getItem("antim-theme") || "dark";
    document.documentElement.setAttribute("data-theme", cachedConfigTheme);

    if (toggleBtn) {
        toggleBtn.addEventListener("click", () => {
            const schemeCurrent = document.documentElement.getAttribute("data-theme");
            const alternativeScheme = schemeCurrent === "dark" ? "light" : "dark";
            document.documentElement.setAttribute("data-theme", alternativeScheme);
            localStorage.setItem("antim-theme", alternativeScheme);
        });
    }
}

function executeLanguageArchitectureShift() {
    const elementsToTranslate = document.querySelectorAll("[data-en][data-hi]");
    elementsToTranslate.forEach(element => {
        element.textContent = element.getAttribute(`data-${localActiveLanguage.toLowerCase()}`);
    });

    const elementsWithPlaceholders = document.querySelectorAll("[data-en-placeholder][data-hi-placeholder]");
    elementsWithPlaceholders.forEach(element => {
        const stringVal = element.getAttribute(`data-${localActiveLanguage.toLowerCase()}-placeholder`);
        element.setAttribute("placeholder", stringVal);
    });

    const fileInput = document.getElementById("memory-image");
    const labelText = document.getElementById("file-label-text");
    if (fileInput && labelText && fileInput.files.length === 0) {
        labelText.textContent = localActiveLanguage === "EN" ? "Click or Drag an image asset" : "एक छवि एसेट क्लिक या ड्रैग करें";
    }
}

function handleUserSessionActivation(user) {
    document.getElementById("nav-vault").classList.remove("hidden");
    document.getElementById("nav-timeline").classList.remove("hidden");
    document.getElementById("nav-profile").classList.remove("hidden");

    document.getElementById("profile-display-name").textContent = user.displayName || "Anonymous Soul";
    document.getElementById("profile-email-display").textContent = user.email;
    
    const initialsContainer = document.getElementById("profile-avatar-letters");
    if (initialsContainer) {
        initialsContainer.textContent = user.displayName ? user.displayName.charAt(0).toUpperCase() : "A";
    }

    if (!document.getElementById("auth-container").classList.contains("hidden")) {
        executeDirectSectionRouting("vault");
        setActiveNavbarLink("nav-vault");
    }

    initializeRealtimeDataSubscription(user.uid);
}

function handleUserSessionTermination() {
    document.getElementById("nav-vault").classList.add("hidden");
    document.getElementById("nav-timeline").classList.add("hidden");
    document.getElementById("nav-profile").classList.add("hidden");

    if (realTimeUnsubscribeHandle) {
        realTimeUnsubscribeHandle();
        realTimeUnsubscribeHandle = null;
    }

    primaryMemoriesDataset = [];
    updateDashboardStatisticalCounters();

    const activeView = ["vault", "timeline", "profile", "auth-container"].find(id => !document.getElementById(id).classList.contains("hidden"));
    if (activeView && activeView !== "auth-container") {
        executeDirectSectionRouting("hero");
        setActiveNavbarLink("nav-logo");
    }
}

function initializeRealtimeDataSubscription(uid) {
    if (realTimeUnsubscribeHandle) realTimeUnsubscribeHandle();

    const firestoreQueryConstraints = query(
        collection(db, "memories"),
        where("userId", "==", uid),
        orderBy("memoryDate", "desc")
    );

    realTimeUnsubscribeHandle = onSnapshot(firestoreQueryConstraints, (snapshot) => {
        primaryMemoriesDataset = [];
        snapshot.forEach((doc) => {
            const structure = doc.data();
            structure.id = doc.id;
            primaryMemoriesDataset.push(structure);
        });
        updateDashboardStatisticalCounters();
        filterAndRenderTimelineInterface(document.getElementById("timeline-search").value.trim());
    }, (error) => {
        console.error("Realtime operational pipeline failure: ", error);
    });
}

function updateDashboardStatisticalCounters() {
    const count = primaryMemoriesDataset.length;
    const totalCountEl = document.getElementById("stat-total-count");
    const profileCountEl = document.getElementById("profile-stat-count");
    const lastSyncEl = document.getElementById("stat-last-sync");

    if (totalCountEl) totalCountEl.textContent = count;
    if (profileCountEl) profileCountEl.textContent = count;
    
    if (lastSyncEl) {
        const syncTime = new Date().toLocaleTimeString();
        lastSyncEl.textContent = localActiveLanguage === "EN" ? `Synced at ${syncTime}` : `सिंक्रनाइज़ ${syncTime}`;
    }
}

async function executeMemoryStorageTransaction(e) {
    e.preventDefault();
    const activeAuthUser = auth.currentUser;
    if (!activeAuthUser) return;

    const saveBtn = document.getElementById("save-memory-btn");
    const title = document.getElementById("memory-title").value.trim();
    const desc = document.getElementById("memory-desc").value.trim();
    const dateVal = document.getElementById("memory-date").value;
    const mood = document.getElementById("memory-mood").value;
    const imageAssetFile = document.getElementById("memory-image").files[0];

    saveBtn.disabled = true;
    saveBtn.textContent = localActiveLanguage === "EN" ? "Archiving..." : "संग्रहित किया जा रहा है...";

    try {
        let externalImageUrl = "";
        if (imageAssetFile) {
            externalImageUrl = await executeBinaryImageUploadTask(imageAssetFile, activeAuthUser.uid);
        }

        await addDoc(collection(db, "memories"), {
            userId: activeAuthUser.uid,
            title: title,
            description: desc,
            memoryDate: dateVal,
            emotionalMood: mood,
            imageUrl: externalImageUrl,
            timestampSystem: Date.now()
        });

        document.getElementById("memory-form").reset();
        setInitialSystemDateValues();
        const dropzoneText = document.getElementById("file-label-text");
        if (dropzoneText) {
            dropzoneText.textContent = localActiveLanguage === "EN" ? "Click or Drag an image asset" : "एक छवि एसेट क्लिक या ड्रैग करें";
        }

        executeDirectSectionRouting("timeline");
        setActiveNavbarLink("nav-timeline");
    } catch (err) {
        console.error("Critical structural execution error writing database trace: ", err);
        alert(localActiveLanguage === "EN" ? "Error preserving memory framework." : "स्मृति संरचना को सहेजने में त्रुटि।");
    } finally {
        saveBtn.disabled = false;
        saveBtn.textContent = localActiveLanguage === "EN" ? "Seal Memory Into Firestore" : "फायरस्टोर में स्मृति को सील करें";
    }
}

function executeBinaryImageUploadTask(fileObject, userId) {
    return new Promise((resolve, reject) => {
        const progressiveStoragePath = `memories/${userId}/${Date.now()}_${fileObject.name}`;
        const storageReferencePointer = ref(storage, progressiveStoragePath);
        const processingUploadTask = uploadBytesResumable(storageReferencePointer, fileObject);
        const containerUi = document.getElementById("upload-progress-container");
        const progressFill = document.getElementById("upload-progress-fill");

        if (containerUi) containerUi.classList.remove("hidden");

        processingUploadTask.on('state_changed', 
            (snapshot) => {
                const calculatedProgressPercent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                if (progressFill) progressFill.style.width = `${calculatedProgressPercent}%`;
            }, 
            (error) => {
                if (containerUi) containerUi.classList.add("hidden");
                reject(error);
            }, 
            async () => {
                try {
                    const structuralDownloadUrl = await getDownloadURL(processingUploadTask.snapshot.ref);
                    if (containerUi) containerUi.classList.add("hidden");
                    if (progressFill) progressFill.style.width = "0%";
                    resolve(structuralDownloadUrl);
                } catch (urlExtractionError) {
                    reject(urlExtractionError);
                }
            }
        );
    });
}

function filterAndRenderTimelineInterface(filterQueryString = "") {
    const timelineContainer = document.getElementById("timeline-container");
    const timelineEmptyState = document.getElementById("timeline-empty");
    
    if (!timelineContainer || !timelineEmptyState) return;

    let processingFilterArray = primaryMemoriesDataset;
    if (filterQueryString !== "") {
        const standardizedQuery = filterQueryString.toLowerCase();
        processingFilterArray = primaryMemoriesDataset.filter(item => {
            return item.title.toLowerCase().includes(standardizedQuery) || 
                   item.emotionalMood.toLowerCase().includes(standardizedQuery) ||
                   item.description.toLowerCase().includes(standardizedQuery);
        });
    }

    if (processingFilterArray.length === 0) {
        timelineContainer.classList.add("hidden");
        timelineEmptyState.classList.remove("hidden");
        return;
    }

    timelineEmptyState.classList.add("hidden");
    timelineContainer.classList.remove("hidden");
    timelineContainer.innerHTML = "";

    processingFilterArray.forEach(memoryItem => {
        const itemStructureElement = document.createElement("div");
        itemStructureElement.className = "timeline-item";

        let mediaAssetFragmentMarkup = "";
        if (memoryItem.imageUrl && memoryItem.imageUrl !== "") {
            mediaAssetFragmentMarkup = `
                <div class="timeline-image-wrapper">
                    <img src="${memoryItem.imageUrl}" class="timeline-img" alt="Memory Attachment Artifact" loading="lazy">
                </div>
            `;
        }

        const localizedEditString = localActiveLanguage === "EN" ? "Refine Entry" : "संपादित करें";
        const localizedDeleteString = localActiveLanguage === "EN" ? "Purge Entry" : "हटाएं";

        itemStructureElement.innerHTML = `
            <div class="timeline-marker"></div>
            <div class="timeline-card" data-id="${memoryItem.id}">
                <div class="timeline-meta">
                    <span class="timeline-date">${formatSystemDateDisplayString(memoryItem.memoryDate)}</span>
                    <span class="timeline-mood-badge">${getLocalizedMoodString(memoryItem.emotionalMood)}</span>
                </div>
                <h3 class="timeline-title">${escapeSecurityStringMarkup(memoryItem.title)}</h3>
                ${mediaAssetFragmentMarkup}
                <p class="timeline-desc">${escapeSecurityStringMarkup(memoryItem.description)}</p>
                <div class="timeline-actions">
                    <button class="action-btn action-edit" data-action="edit">${localizedEditString}</button>
                    <button class="action-btn action-delete" data-action="delete">${localizedDeleteString}</button>
                </div>
            </div>
        `;

        itemStructureElement.querySelector('.action-edit').addEventListener('click', () => initiateEditWorkflowModal(memoryItem));
        itemStructureElement.querySelector('.action-delete').addEventListener('click', () => executeDataPurgeTransaction(memoryItem.id));

        timelineContainer.appendChild(itemStructureElement);
    });
}

function getLocalizedMoodString(moodValue) {
    if (localActiveLanguage === "EN") {
        return moodValue + " ⏳";
    }
    switch(moodValue) {
        case "Melancholic": return "उदासी 🌧️";
        case "Nostalgic": return "अतीत की यादें ⏳";
        case "Peaceful": return "शांत 🍃";
        case "Joyous": return "हर्षित ✨";
        case "Grateful": return "कृतज्ञ ❤️";
        default: return moodValue;
    }
}

function formatSystemDateDisplayString(dateStringValue) {
    if (!dateStringValue) return "";
    const internalDateObj = new Date(dateStringValue);
    if (isNaN(internalDateObj.getTime())) return dateStringValue;
    
    const operationalFormattingOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return internalDateObj.toLocaleDateString(localActiveLanguage === "EN" ? "en-US" : "hi-IN", operationalFormattingOptions);
}

function initiateEditWorkflowModal(memoryReferenceObject) {
    const modal = document.getElementById("edit-modal");
    if (!modal) return;

    document.getElementById("edit-id").value = memoryReferenceObject.id;
    document.getElementById("edit-title").value = memoryReferenceObject.title;
    document.getElementById("edit-desc").value = memoryReferenceObject.description;
    document.getElementById("edit-date").value = memoryReferenceObject.memoryDate;
    document.getElementById("edit-mood").value = memoryReferenceObject.emotionalMood;

    modal.classList.remove("hidden");
}

async function executeUpdateMemoryTransaction(e) {
    e.preventDefault();
    const docId = document.getElementById("edit-id").value;
    const title = document.getElementById("edit-title").value.trim();
    const desc = document.getElementById("edit-desc").value.trim();
    const dateVal = document.getElementById("edit-date").value;
    const mood = document.getElementById("edit-mood").value;

    try {
        const referenceDocPointer = doc(db, "memories", docId);
        await updateDoc(referenceDocPointer, {
            title: title,
            description: desc,
            memoryDate: dateVal,
            emotionalMood: mood
        });
        document.getElementById("edit-modal").classList.add("hidden");
    } catch (err) {
        console.error("Error executing transactional document updates: ", err);
        alert(localActiveLanguage === "EN" ? "Failed to update archival memory node metrics." : "स्मृति नोड को अपडेट करने में विफल।");
    }
}

async function executeDataPurgeTransaction(documentId) {
    const confirmationPromptString = localActiveLanguage === "EN" ? 
        "Are you explicitly certain you wish to completely purge this memory? This process cannot be undone." : 
        "क्या आप पूरी तरह से आश्वस्त हैं कि आप इस स्मृति को मिटाना चाहते हैं? यह प्रक्रिया वापस नहीं ली जा सकती।";
        
    if (confirm(confirmationPromptString)) {
        try {
            await deleteDoc(doc(db, "memories", documentId));
        } catch (err) {
            console.error("Critical failure during terminal record delete sequence: ", err);
            alert(localActiveLanguage === "EN" ? "Error processing purge transaction." : "हटाने की प्रक्रिया में त्रुटि।");
        }
    }
}

function escapeSecurityStringMarkup(dangerousInputString) {
    if (!dangerousInputString) return "";
    return dangerousInputString
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
