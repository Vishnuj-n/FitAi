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
    
    // Cities by country mapping
    const citiesByCountry = {
        'india': [
            { value: 'bengaluru', name: 'Bengaluru' },
            { value: 'mumbai', name: 'Mumbai' },
            { value: 'delhi', name: 'Delhi' },
            { value: 'hyderabad', name: 'Hyderabad' },
            { value: 'chennai', name: 'Chennai' },
            { value: 'kolkata', name: 'Kolkata' },
            { value: 'pune', name: 'Pune' },
            { value: 'ahmedabad', name: 'Ahmedabad' }
        ],
        'usa': [
            { value: 'new-york', name: 'New York' },
            { value: 'los-angeles', name: 'Los Angeles' },
            { value: 'chicago', name: 'Chicago' },
            { value: 'houston', name: 'Houston' },
            { value: 'miami', name: 'Miami' },
            { value: 'seattle', name: 'Seattle' },
            { value: 'boston', name: 'Boston' },
            { value: 'san-francisco', name: 'San Francisco' }
        ],
        'uk': [
            { value: 'london', name: 'London' },
            { value: 'manchester', name: 'Manchester' },
            { value: 'birmingham', name: 'Birmingham' },
            { value: 'liverpool', name: 'Liverpool' },
            { value: 'edinburgh', name: 'Edinburgh' },
            { value: 'glasgow', name: 'Glasgow' },
            { value: 'bristol', name: 'Bristol' },
            { value: 'leeds', name: 'Leeds' }
        ],
        'australia': [
            { value: 'sydney', name: 'Sydney' },
            { value: 'melbourne', name: 'Melbourne' },
            { value: 'brisbane', name: 'Brisbane' },
            { value: 'perth', name: 'Perth' },
            { value: 'adelaide', name: 'Adelaide' },
            { value: 'gold-coast', name: 'Gold Coast' },
            { value: 'canberra', name: 'Canberra' },
            { value: 'newcastle', name: 'Newcastle' }
        ],
        'japan': [
            { value: 'tokyo', name: 'Tokyo' },
            { value: 'osaka', name: 'Osaka' },
            { value: 'kyoto', name: 'Kyoto' },
            { value: 'yokohama', name: 'Yokohama' },
            { value: 'sapporo', name: 'Sapporo' },
            { value: 'nagoya', name: 'Nagoya' },
            { value: 'kobe', name: 'Kobe' },
            { value: 'fukuoka', name: 'Fukuoka' }
        ],
        'singapore': [
            { value: 'central', name: 'Central Singapore' },
            { value: 'east', name: 'East Singapore' },
            { value: 'north', name: 'North Singapore' },
            { value: 'north-east', name: 'North-East Singapore' },
            { value: 'west', name: 'West Singapore' },
            { value: 'sentosa', name: 'Sentosa' },
            { value: 'jurong', name: 'Jurong' },
            { value: 'changi', name: 'Changi' }
        ]
    };
    
    // Populate city dropdown based on selected country
    function populateCities(country) {
        // Clear existing options
        citySelect.innerHTML = '<option value="">Select City</option>';
        
        if (!country) return;
        
        const cities = citiesByCountry[country] || [];
        
        cities.forEach(city => {
            const option = document.createElement('option');
            option.value = city.value;
            option.textContent = city.name;
            // Set Bengaluru as default for India
            if (country === 'india' && city.value === 'bengaluru') {
                option.selected = true;
            }
            citySelect.appendChild(option);
        });
    }
    
    // Initialize city dropdown with the default country (India)
    populateCities('india');
    
    // Update cities when country changes
    if (countrySelect) {
        countrySelect.addEventListener('change', function() {
            populateCities(this.value);
        });
    }
    
    // Hide default event cards on page load
    hideAllEvents();
    
    // Initialize the empty state in search results container (don't search automatically)
    
    if (searchButton) {
        searchButton.addEventListener('click', function() {
            const selectedCity = citySelect.value;
            const selectedCountry = countrySelect.value;
            
            // Show loading state
            searchButton.innerHTML = '<span class="inline-block animate-spin mr-2">⟳</span> Searching...';
            searchButton.disabled = true;
            
            // Call the filterEvents function with the selected values
            filterEvents(selectedCity, selectedCountry)
                .finally(() => {
                    // Reset button state
                    searchButton.innerHTML = '<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg> Search Events';
                    searchButton.disabled = false;
                });
        });
    }
    
    // Add keypress event to trigger search on Enter key
    [citySelect, countrySelect].forEach(select => {
        select.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && searchButton) {
                searchButton.click();
            }
        });
        
        // No auto-search on dropdown changes - user must click search button
    });
    
    async function filterEvents(city, country) {
        console.log(`Filtering events: City=${city}, Country=${country}`);
        
        // City-country mapping to verify city belongs to selected country
        const cityCountryMap = {
            // India
            'bengaluru': 'india',
            'mumbai': 'india',
            'delhi': 'india',
            'hyderabad': 'india',
            'chennai': 'india',
            'kolkata': 'india',
            'pune': 'india',
            'ahmedabad': 'india',
            
            // USA
            'new-york': 'usa',
            'los-angeles': 'usa',
            'chicago': 'usa',
            'houston': 'usa',
            'miami': 'usa',
            'seattle': 'usa',
            'boston': 'usa',
            'san-francisco': 'usa',
            
            // UK
            'london': 'uk',
            'manchester': 'uk',
            'birmingham': 'uk',
            'liverpool': 'uk',
            'edinburgh': 'uk',
            'glasgow': 'uk',
            'bristol': 'uk',
            'leeds': 'uk',
            
            // Australia
            'sydney': 'australia',
            'melbourne': 'australia',
            'brisbane': 'australia',
            'perth': 'australia',
            'adelaide': 'australia',
            'gold-coast': 'australia',
            'canberra': 'australia',
            'newcastle': 'australia',
            
            // Japan
            'tokyo': 'japan',
            'osaka': 'japan',
            'kyoto': 'japan',
            'yokohama': 'japan',
            'sapporo': 'japan',
            'nagoya': 'japan',
            'kobe': 'japan',
            'fukuoka': 'japan',
            
            // Singapore
            'central': 'singapore',
            'east': 'singapore',
            'north': 'singapore',
            'north-east': 'singapore',
            'west': 'singapore',
            'sentosa': 'singapore',
            'jurong': 'singapore',
            'changi': 'singapore'
        };
        
        // Get results containers
        const resultsInfo = document.getElementById('filter-results-info');
        const resultsContainer = document.getElementById('event-search-results');
        
        if (!city && !country) {
            resultsInfo.textContent = 'Please select a city and/or country to search for events';
            resultsContainer.classList.remove('has-results');
            resultsContainer.innerHTML = `
                <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
                <p class="text-gray-500">No search criteria selected</p>
                <p class="text-gray-400 text-sm mt-2">Please select at least a country or city</p>
            `;
            showAllEvents();
            return;
        }
        
        // Build search query
        const cityName = city ? getCityName(city) : '';
        const countryName = country ? getCountryName(country) : '';
        const searchQuery = `${cityName} ${countryName} fitness events`.trim();
        
        resultsInfo.textContent = `Searching for events in ${cityName}${countryName ? ', ' + countryName : ''}...`;
        
        try {
            // For demo purposes, create mock event data instead of using API
            // This simulates a successful response from the Serper API
            
            console.log('Search query:', searchQuery);
            resultsInfo.textContent = `Events found in ${cityName}${countryName ? ', ' + countryName : ''}`;
            
            // Generate mock event data based on the selected city and country
            const mockEvents = generateMockEvents(city, country, 8);
            
            // Add a class to switch layout from centered empty state to list view
            resultsContainer.classList.add('has-results');
            
            if (mockEvents.length === 0) {
                resultsContainer.classList.remove('has-results');
                resultsContainer.innerHTML = `
                    <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M9.995 15.01a7 7 0 119.39-5.5c.9 3.27-.5 6.79-3.29 8.75L12 22l-4.01-3.74z"></path>
                    </svg>
                    <p class="text-gray-600">No event links found. Try a different location.</p>
                `;
            } else {
                // Create result list with links
                let linksHtml = '<ul class="space-y-4">';
                mockEvents.forEach(event => {
                    linksHtml += `
                        <li class="border-b pb-4">
                            <a href="${event.link}" target="_blank" class="text-primary hover:text-dark font-medium text-lg">
                                ${event.title}
                            </a>
                            <p class="text-gray-600 mt-1">${event.description}</p>
                            <div class="flex flex-wrap gap-2 mt-2">
                                <span class="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                                    ${event.date}
                                </span>
                                <span class="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                                    ${event.location}
                                </span>
                            </div>
                        </li>
                    `;
                });
                linksHtml += '</ul>';
                
                resultsContainer.innerHTML = linksHtml;
            }
            
            /* 
            // Real Serper API implementation (commented out for now)
            const serperApiKey = window.FitAiConfig.apiKeys.serper;
            const serperBaseUrl = window.FitAiConfig.apiBaseUrls.serper;
            
            if (!serperApiKey) {
                throw new Error('Serper API key not found');
            }
            
            // Call Serper API to get event links
            const response = await fetch(`${serperBaseUrl}/search`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-KEY': serperApiKey
                },
                body: JSON.stringify({
                    q: searchQuery,
                    num: 10
                })
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch search results');
            }
            
            const data = await response.json();
            
            // Display search results (links only)
            resultsInfo.textContent = `Events found in ${cityName}${countryName ? ', ' + countryName : ''}`;
            
            // Extract and display links from search results
            const links = data.organic || [];
            
            if (links.length === 0) {
                resultsContainer.innerHTML = '<p class="text-gray-600">No event links found. Try a different location.</p>';
            } else {
                // Create result list with links only
                let linksHtml = '<ul class="space-y-4">';
                links.forEach(result => {
                    if (result.link) {
                        linksHtml += `
                            <li class="border-b pb-2">
                                <a href="${result.link}" target="_blank" class="text-primary hover:text-dark font-medium">
                                    ${result.title || 'Event Link'}
                                </a>
                            </li>
                        `;
                    }
                });
                linksHtml += '</ul>';
                
                resultsContainer.innerHTML = linksHtml;
            }
            */
            
        } catch (error) {
            console.error('Error searching events:', error);
            resultsInfo.textContent = 'Error searching for events. Please try again.';
            resultsContainer.innerHTML = `<p class="text-red-500">Error: ${error.message}</p>`;
        }
        
        // Hide the default event cards when showing search results
        hideAllEvents();
        
        // Animate cards after filtering
        animateFilteredCards();
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
    
    // Generate mock event data based on city and country
    function generateMockEvents(city, country, count = 8) {
        const events = [];
        const cityName = getCityName(city);
        const countryName = getCountryName(country);
        
        // Event types to randomly select from
        const eventTypes = [
            'Marathon', 'Yoga Workshop', 'CrossFit Competition',
            'Fitness Expo', 'Bodybuilding Championship', 'Wellness Retreat',
            'Running Club', 'Zumba Party', 'Nutrition Seminar',
            'HIIT Training', 'Cycling Event', 'Pilates Class',
            'Kickboxing Tournament', 'Swimming Competition', 'Triathlon'
        ];
        
        // Venues based on city
        const venues = [
            `${cityName} Community Center`,
            `${cityName} Sports Complex`,
            `${cityName} Convention Center`, 
            `${cityName} Olympic Stadium`,
            `${cityName} Beach`, 
            `${cityName} Central Park`,
            `${cityName} University`,
            `Downtown ${cityName}`
        ];
        
        // Event organizers
        const organizers = [
            'FitLife', 'Active Sports', 'PowerFit',
            'Elite Athletics', 'FitAi Club', 'Wellness Heroes',
            'Strong Community', 'FitTogether'
        ];
        
        // Generate random future dates (within next 3 months)
        function getRandomFutureDate() {
            const now = new Date();
            const futureDate = new Date();
            futureDate.setDate(now.getDate() + Math.floor(Math.random() * 90) + 1);
            
            const options = { day: 'numeric', month: 'short', year: 'numeric' };
            return futureDate.toLocaleDateString('en-US', options);
        }
        
        // Generate events
        for (let i = 0; i < count; i++) {
            const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
            const venue = venues[Math.floor(Math.random() * venues.length)];
            const organizer = organizers[Math.floor(Math.random() * organizers.length)];
            const date = getRandomFutureDate();
            
            events.push({
                title: `${cityName} ${eventType}`,
                description: `Join us for the ${eventType.toLowerCase()} organized by ${organizer} in ${cityName}, ${countryName}.`,
                link: `https://example.com/events/${country}/${city}/${eventType.toLowerCase().replace(/\s+/g, '-')}`,
                date: date,
                location: venue
            });
        }
        
        return events;
    }
    
    function getCityName(cityValue) {
        const cityNames = {
            // India
            'bengaluru': 'Bengaluru',
            'mumbai': 'Mumbai',
            'delhi': 'Delhi',
            'hyderabad': 'Hyderabad',
            'chennai': 'Chennai',
            'kolkata': 'Kolkata',
            'pune': 'Pune',
            'ahmedabad': 'Ahmedabad',
            
            // USA
            'new-york': 'New York',
            'los-angeles': 'Los Angeles',
            'chicago': 'Chicago',
            'houston': 'Houston',
            'miami': 'Miami',
            'seattle': 'Seattle',
            'boston': 'Boston',
            'san-francisco': 'San Francisco',
            
            // UK
            'london': 'London',
            'manchester': 'Manchester',
            'birmingham': 'Birmingham',
            'liverpool': 'Liverpool',
            'edinburgh': 'Edinburgh',
            'glasgow': 'Glasgow',
            'bristol': 'Bristol',
            'leeds': 'Leeds',
            
            // Australia
            'sydney': 'Sydney',
            'melbourne': 'Melbourne',
            'brisbane': 'Brisbane',
            'perth': 'Perth',
            'adelaide': 'Adelaide',
            'gold-coast': 'Gold Coast',
            'canberra': 'Canberra',
            'newcastle': 'Newcastle',
            
            // Japan
            'tokyo': 'Tokyo',
            'osaka': 'Osaka',
            'kyoto': 'Kyoto',
            'yokohama': 'Yokohama',
            'sapporo': 'Sapporo',
            'nagoya': 'Nagoya',
            'kobe': 'Kobe',
            'fukuoka': 'Fukuoka',
            
            // Singapore
            'central': 'Central Singapore',
            'east': 'East Singapore',
            'north': 'North Singapore',
            'north-east': 'North-East Singapore',
            'west': 'West Singapore',
            'sentosa': 'Sentosa',
            'jurong': 'Jurong',
            'changi': 'Changi'
        };
        return cityNames[cityValue] || cityValue;
    }
    
    function getCountryName(countryValue) {
        const countryNames = {
            'india': 'India',
            'usa': 'United States',
            'uk': 'United Kingdom',
            'australia': 'Australia',
            'japan': 'Japan',
            'singapore': 'Singapore'
        };
        return countryNames[countryValue] || countryValue;
    }
    
    // Animation for cards when the page loads
    function animateCardsOnLoad() {
        eventCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            
            // Stagger the animations
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100 * index);
        });
    }
    
    // Animation for cards after filtering
    function animateFilteredCards() {
        const visibleCards = Array.from(eventCards).filter(card => card.style.display !== 'none');
        
        visibleCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            // Stagger the animations
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100 * index);
        });
    }
});
