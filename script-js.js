// Constants for calculations
const SECONDS_PER_MONTH = 30 * 24 * 60 * 60;
const MERCH_REVENUE_PER_SUB = 0.01; // Estimated $0.01 per subscriber per month

// Variables to track real-time counter
let startTime;
let perSecondRate = 0;
let totalEarnings = 0;

// Counter animation function
function animateCounter(element, targetValue, duration = 1000) {
    const startValue = parseFloat(element.innerText.replace(/,/g, ''));
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
        const elapsedTime = currentTime - startTime;
        
        if (elapsedTime < duration) {
            const progress = elapsedTime / duration;
            const currentValue = startValue + (targetValue - startValue) * progress;
            element.innerText = formatNumber(currentValue);
            requestAnimationFrame(updateCounter);
        } else {
            element.innerText = formatNumber(targetValue);
        }
    }
    
    requestAnimationFrame(updateCounter);
}

// Format numbers with commas
function formatNumber(number) {
    if (number >= 1) {
        return number.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    } else {
        // For very small numbers (less than 1), show more decimal places
        return number.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 6
        });
    }
}

// Calculate YouTube earnings
function calculateYouTubeEarnings() {
    // Get input values
    const channelName = $('#channelName').val() || 'YouTuber';
    const subscribers = parseFloat($('#subscribers').val()) || 0;
    const monthlyViews = parseFloat($('#monthlyViews').val()) || 0;
    const engagementRate = parseFloat($('#engagementRate').val()) || 8;
    const cpm = parseFloat($('#cpm').val()) || 4.5;
    const brandDeals = parseFloat($('#brandDeals').val()) || 0;
    
    // Calculate revenues
    const adRevenue = (monthlyViews / 1000) * cpm;
    const brandRevenue = brandDeals;
    const merchRevenue = subscribers * MERCH_REVENUE_PER_SUB;
    const monthlyTotal = adRevenue + brandRevenue + merchRevenue;
    
    // Calculate per-second rate for real-time counter
    perSecondRate = monthlyTotal / SECONDS_PER_MONTH;
    
    // Display channel name
    $('#ytChannelTitle').text(`${channelName} Earnings`);
    
    // Animate counters
    animateCounter(document.getElementById('adRevenue'), adRevenue);
    animateCounter(document.getElementById('brandRevenue'), brandRevenue);
    animateCounter(document.getElementById('merchRevenue'), merchRevenue);
    animateCounter(document.getElementById('monthlyTotal'), monthlyTotal);
    
    // Update time-based rates
    animateCounter(document.getElementById('perSecond'), perSecondRate);
    animateCounter(document.getElementById('perMinute'), perSecondRate * 60);
    animateCounter(document.getElementById('perHour'), perSecondRate * 60 * 60);
    
    // Show results container
    $('#resultsContainer').removeClass('hidden');
    
    // Reset real-time counter
    startTime = new Date();
    totalEarnings = 0;
    document.getElementById('realtimeCounter').innerText = '0.00';
    
    // Start real-time counter
    startRealtimeCounter();
}

// Start real-time earnings counter
function startRealtimeCounter() {
    // Clear any existing interval
    if (window.counterInterval) {
        clearInterval(window.counterInterval);
    }
    
    window.counterInterval = setInterval(() => {
        const now = new Date();
        const elapsedSeconds = (now - startTime) / 1000;
        totalEarnings = perSecondRate * elapsedSeconds;
        
        document.getElementById('realtimeCounter').innerText = formatNumber(totalEarnings);
    }, 50); // Update every 50ms for smooth animation
}

// Event listeners
$(document).ready(function() {
    $('#calculateBtn').click(function() {
        calculateYouTubeEarnings();
    });
    
    // Prefill with example data for demo purposes if fields are empty
    if (!$('#subscribers').val() && !$('#monthlyViews').val()) {
        $('#channelName').val('MrBeast');
        $('#subscribers').val('100000000');
        $('#monthlyViews').val('500000000');
        $('#engagementRate').val('8');
        $('#cpm').val('4.50');
        $('#brandDeals').val('2000000');
    }
});
