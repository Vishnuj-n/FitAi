/**
 * FitAi - Events Page Functionality
 * This file provides the functionality for the events.html page
 */

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle (from main script.js)
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
    
    // Events Location Filter Functionality
    const citySelect = document.getElementById('city-select');
    const countrySelect = document.getElementById('country-select');
    const searchButton = document.getElementById('search-events');
    const eventCards = document.querySelectorAll('.event-card');
    
    if (searchButton) {
        searchButton.addEventListener('click', function() {
            const selectedCity = citySelect.value;
            const selectedCountry = countrySelect.value;
            
            // Show loading state
            searchButton.innerHTML = '<span class="inline-block animate-spin mr-2">⟳</span> Searching...';
            searchButton.disabled = true;
            
            // Simulate search delay for demonstration
            setTimeout(() => {
                filterEvents(selectedCity, selectedCountry);
                
                // Reset button state
                searchButton.innerHTML = '<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg> Search Events';
                searchButton.disabled = false;
            }, 1000);
        });
    }
    
    function filterEvents(city, country) {
        console.log(`Filtering events: City=${city}, Country=${country}`);
        
        // In a real implementation, this would filter actual events
        // For demo purposes, we'll just show a result message
        
        // Demo data - mapping cities to their countries
        const cityCountryMap = {
            'new-york': 'usa',
            'los-angeles': 'usa',
            'chicago': 'usa',
            'houston': 'usa',
            'miami': 'usa',
            'seattle': 'usa',
            'boston': 'usa',
            'denver': 'usa',
            'san-francisco': 'usa',
            'atlanta': 'usa'
        };
        
        // Get results container or create one if it doesn't exist
        let resultsInfo = document.getElementById('filter-results-info');
        if (!resultsInfo) {
            resultsInfo = document.createElement('div');
            resultsInfo.id = 'filter-results-info';
            resultsInfo.className = 'text-center text-primary font-medium mb-6';
            const eventsSection = document.querySelector('.container h2').parentNode.parentNode;
            eventsSection.insertBefore(resultsInfo, eventsSection.querySelector('.grid'));
        }
        
        if (!city && !country) {
            resultsInfo.textContent = 'Showing all events';
            showAllEvents();
        } else if (city && !country) {
            resultsInfo.textContent = `Showing events in ${getCityName(city)}`;
            simulateFilteredEvents(city);
        } else if (!city && country) {
            resultsInfo.textContent = `Showing events in ${getCountryName(country)}`;
            simulateFilteredEvents(null, country);
        } else {
            // Both city and country selected
            const cityCountry = cityCountryMap[city];
            if (cityCountry === country) {
                resultsInfo.textContent = `Showing events in ${getCityName(city)}, ${getCountryName(country)}`;
                simulateFilteredEvents(city, country);
            } else {
                resultsInfo.textContent = `No events found in ${getCityName(city)}, ${getCountryName(country)}`;
                hideAllEvents();
            }
        }
    }
    
    function showAllEvents() {
        eventCards.forEach(card => {
            card.style.display = 'block';
        });
    }
    
    function hideAllEvents() {
        eventCards.forEach(card => {
            card.style.display = 'none';
        });
    }
    
    function simulateFilteredEvents(city, country) {
        // For demo purposes, randomly show/hide event cards
        // In a real app, this would filter based on actual event data
        eventCards.forEach((card, index) => {
            if (city && country) {
                // With both filters, be more selective
                card.style.display = index % 3 === 0 ? 'block' : 'none';
            } else if (city) {
                // With city filter, show some events
                card.style.display = index % 2 === 0 ? 'block' : 'none';
            } else if (country) {
                // With country filter, show most events
                card.style.display = index % 4 !== 0 ? 'block' : 'none';
            }
        });
    }
    
    function getCityName(cityValue) {
        const cityNames = {
            'new-york': 'New York',
            'los-angeles': 'Los Angeles',
            'chicago': 'Chicago',
            'houston': 'Houston',
            'miami': 'Miami',
            'seattle': 'Seattle',
            'boston': 'Boston',
            'denver': 'Denver',
            'san-francisco': 'San Francisco',
            'atlanta': 'Atlanta'
        };
        return cityNames[cityValue] || cityValue;
    }
    
    function getCountryName(countryValue) {
        const countryNames = {
            'usa': 'United States',
            'canada': 'Canada',
            'uk': 'United Kingdom',
            'australia': 'Australia',
            'germany': 'Germany',
            'france': 'France',
            'japan': 'Japan',
            'india': 'India',
            'brazil': 'Brazil',
            'mexico': 'Mexico'
        };
        return countryNames[countryValue] || countryValue;
    }
});
