// Add this to dashboard.js or create as separate file

// Initialize flight manager when Flights tab is clicked
document.addEventListener('DOMContentLoaded', () => {
    const flightsTab = document.querySelector('[data-section="flights"]');
    
    if (flightsTab) {
        flightsTab.addEventListener('click', () => {
            // Initialize flight manager if not already done
            if (!window.flightManager) {
                window.flightManager = new FlightManager();
            } else {
                // Reload flights
                window.flightManager.loadFlights();
            }
        });
    }
});
