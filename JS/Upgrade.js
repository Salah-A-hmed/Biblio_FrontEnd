// Upgrade Page JavaScript

// Get current plan from localStorage or default to 'free'
function getCurrentPlan() {
    const storedPlan = localStorage.getItem('userPlan');
    return storedPlan || 'free';
}

// Set current plan in localStorage
function setCurrentPlan(plan) {
    localStorage.setItem('userPlan', plan);
    updateUI();
}

// Update UI based on current plan
function updateUI() {
    const currentPlan = getCurrentPlan();
    const currentPlanText = document.getElementById('currentPlanText');
    const currentPlanBadge = document.getElementById('currentPlanBadge');
    const freePlanCard = document.getElementById('freePlanCard');
    const proPlanCard = document.getElementById('proPlanCard');
    const upgradeToProBtn = document.getElementById('upgradeToProBtn');
    const finalUpgradeBtn = document.getElementById('finalUpgradeBtn');

    if (currentPlan === 'pro') {
        // User is on Pro plan
        currentPlanText.textContent = 'Current Plan: Library Pro';
        currentPlanBadge.classList.remove('!bg-[#E8EFF3]');
        currentPlanBadge.classList.add('!bg-[#4bc1d2]', '!text-white');
        
        // Update Free plan card
        const freeBadge = freePlanCard.querySelector('span');
        if (freeBadge) {
            freeBadge.textContent = 'Downgrade';
            freeBadge.classList.remove('!bg-[#E8EFF3]');
            freeBadge.classList.add('!bg-[#E8EFF3]', '!text-[#34495E]');
        }
        const freeButton = freePlanCard.querySelector('button');
        if (freeButton) {
            freeButton.disabled = false;
            freeButton.classList.remove('!bg-[#E8EFF3]', '!cursor-not-allowed');
            freeButton.classList.add('!bg-[#E8EFF3]', '!text-[#34495E]', '!cursor-pointer', 'hover:!bg-gray-200');
            freeButton.innerHTML = '<i class="fas fa-arrow-down !mr-2"></i>Downgrade to Free';
            freeButton.onclick = () => handleDowngrade();
        }

        // Update Pro plan card
        const proBadge = proPlanCard.querySelector('span');
        if (proBadge) {
            proBadge.textContent = 'Current';
        }
        if (upgradeToProBtn) {
            upgradeToProBtn.disabled = true;
            upgradeToProBtn.classList.remove('!bg-white', '!text-[#4bc1d2]', 'hover:!bg-[#E8EFF3]');
            upgradeToProBtn.classList.add('!bg-white/50', '!text-white', '!cursor-not-allowed');
            upgradeToProBtn.innerHTML = '<i class="fas fa-check-circle !mr-2"></i>Current Plan';
        }
        if (finalUpgradeBtn) {
            finalUpgradeBtn.disabled = true;
            finalUpgradeBtn.classList.remove('hover:!bg-[#E8EFF3]', 'hover:!shadow-2xl', 'hover:!scale-105');
            finalUpgradeBtn.classList.add('!opacity-50', '!cursor-not-allowed');
            finalUpgradeBtn.innerHTML = '<i class="fas fa-check-circle !mr-2"></i>You\'re Already on Pro';
        }
    } else {
        // User is on Free plan
        currentPlanText.textContent = 'Current Plan: Free';
        currentPlanBadge.classList.add('!bg-[#E8EFF3]', '!text-[#2C3E50]');
        currentPlanBadge.classList.remove('!bg-[#4bc1d2]', '!text-white');
    }
}

// Handle upgrade to Pro
function handleUpgrade() {
    const upgradeModal = document.getElementById('upgradeModal');
    if (upgradeModal) {
        upgradeModal.classList.remove('!hidden');
        upgradeModal.classList.add('!flex');
    }
}

// Handle downgrade to Free
function handleDowngrade() {
    if (confirm('Are you sure you want to downgrade to the Free plan? You will lose access to Pro features.')) {
        setCurrentPlan('free');
        showToast('Successfully downgraded to Free plan', 'info');
        setTimeout(() => {
            location.reload();
        }, 1500);
    }
}

// Confirm upgrade
function confirmUpgrade() {
    // Simulate API call
    const upgradeModal = document.getElementById('upgradeModal');
    
    // Show loading state
    const confirmBtn = document.getElementById('confirmUpgradeBtn');
    const originalText = confirmBtn.innerHTML;
    confirmBtn.disabled = true;
    confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin !mr-2"></i>Processing...';

    // Simulate API delay
    setTimeout(() => {
        setCurrentPlan('pro');
        upgradeModal.classList.add('!hidden');
        upgradeModal.classList.remove('!flex');
        showToast('Successfully upgraded to Library Pro!', 'success');
        
        // Reset button
        confirmBtn.disabled = false;
        confirmBtn.innerHTML = originalText;
        
        // Reload page after a short delay to show updated UI
        setTimeout(() => {
            location.reload();
        }, 2000);
    }, 1500);
}

// Cancel upgrade
function cancelUpgrade() {
    const upgradeModal = document.getElementById('upgradeModal');
    upgradeModal.classList.add('!hidden');
    upgradeModal.classList.remove('!flex');
}

// Show toast notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('successToast');
    if (!toast) return;

    // Update message
    const toastText = toast.querySelector('span');
    if (toastText) {
        toastText.textContent = message;
    }

    // Update color based on type
    toast.classList.remove('!bg-green-500', '!bg-blue-500', '!bg-red-500');
    if (type === 'success') {
        toast.classList.add('!bg-green-500');
        const icon = toast.querySelector('i');
        if (icon) {
            icon.className = 'fas fa-check-circle !text-xl';
        }
    } else if (type === 'info') {
        toast.classList.add('!bg-blue-500');
        const icon = toast.querySelector('i');
        if (icon) {
            icon.className = 'fas fa-info-circle !text-xl';
        }
    } else if (type === 'error') {
        toast.classList.add('!bg-red-500');
        const icon = toast.querySelector('i');
        if (icon) {
            icon.className = 'fas fa-exclamation-circle !text-xl';
        }
    }

    // Show toast
    toast.classList.remove('!hidden');
    toast.classList.add('!animate-slide-in');

    // Hide toast after 3 seconds
    setTimeout(() => {
        toast.classList.add('!hidden');
        toast.classList.remove('!animate-slide-in');
    }, 3000);
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Update UI based on current plan
    updateUI();

    // Add event listeners
    const upgradeToProBtn = document.getElementById('upgradeToProBtn');
    const finalUpgradeBtn = document.getElementById('finalUpgradeBtn');
    const confirmUpgradeBtn = document.getElementById('confirmUpgradeBtn');
    const cancelUpgradeBtn = document.getElementById('cancelUpgradeBtn');
    const upgradeModal = document.getElementById('upgradeModal');

    if (upgradeToProBtn) {
        upgradeToProBtn.addEventListener('click', handleUpgrade);
    }

    if (finalUpgradeBtn) {
        finalUpgradeBtn.addEventListener('click', handleUpgrade);
    }

    if (confirmUpgradeBtn) {
        confirmUpgradeBtn.addEventListener('click', confirmUpgrade);
    }

    if (cancelUpgradeBtn) {
        cancelUpgradeBtn.addEventListener('click', cancelUpgrade);
    }

    // Close modal when clicking outside
    if (upgradeModal) {
        upgradeModal.addEventListener('click', function(e) {
            if (e.target === upgradeModal) {
                cancelUpgrade();
            }
        });
    }

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && upgradeModal && !upgradeModal.classList.contains('!hidden')) {
            cancelUpgrade();
        }
    });

    // Add smooth scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe pricing cards
    const cards = document.querySelectorAll('[id$="PlanCard"]');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
});

