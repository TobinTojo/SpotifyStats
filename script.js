const clientId = import.meta.env.VITE_SPOTIFY_API_KEY; // Replace with your Spotify Client ID
const redirectUri = 'https://statspotify.netlify.app'; // Replace with your Redirect URI

// URL to redirect the user to Spotify's authentication page
function getSpotifyAuthUrl() {
    const scopes = [
        'user-read-private',
        'user-read-email',
        'user-top-read' // Added scope to read user's top tracks
    ];

    const authUrl = new URL('https://accounts.spotify.com/authorize');
    authUrl.searchParams.append('client_id', clientId);
    authUrl.searchParams.append('response_type', 'token');
    authUrl.searchParams.append('redirect_uri', redirectUri);
    authUrl.searchParams.append('scope', scopes.join(' '));

    return authUrl.toString();
}

// Parse the URL hash to extract the access token
function getAccessTokenFromUrl() {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.substring(1));
    return params.get('access_token');
}

// Fetch top tracks from Spotify
async function fetchTopTracks(token, time_range, limit) {
    const url = `https://api.spotify.com/v1/me/top/tracks?${new URLSearchParams({
        time_range,
        limit, // Optional: Adjust the limit as needed
    })}`;

    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch top tracks.');
    }

    return response.json();
}

// Fetch top artists from Spotify
async function fetchTopArtists(token, time_range, limit) {
    const url = `https://api.spotify.com/v1/me/top/artists?${new URLSearchParams({
        time_range,
        limit, // Optional: Adjust the limit as needed
    })}`;

    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch top artists.');
    }

    return response.json();
}


// Fetch user profile data from Spotify
async function fetchUserProfile(token) {
    const response = await fetch('https://api.spotify.com/v1/me', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch user profile.');
    }

    return response.json();
}

document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('login-button');
    const userInfo = document.getElementById('user-info');
    const signOutButton = document.getElementById('sign-out-button');
    const interactionContainer = document.getElementById('interaction-container');
    const submitButton = document.getElementById('submit-button');
    const timeRangeDropdown = document.getElementById('time-range'); // Dropdown for time range
    const trackLimitDropdown = document.getElementById('track-limit'); // Dropdown for track limit
    const tracksContainer = document.getElementById('tracks-container');
    const loginContainer = document.getElementById('login-container'); // Get the login-container element
    const headerTitle = document.querySelector('#login-container h1'); // Get the <h1> tag
    const accessToken = getAccessTokenFromUrl();

    loginButton.addEventListener('click', () => {
        window.location.href = getSpotifyAuthUrl();
    });

    // Handle sign-out button click
    signOutButton.addEventListener('click', () => {
        // Clear the access token and redirect to home or login page
        window.location.hash = ''; // Clear the hash (access token)
        localStorage.removeItem('access_token'); // Remove from localStorage if you are storing it there
        window.location.href = '/'; // Redirect to the home or login page
    });

    if (accessToken) {
        window.location.hash = ''; // Clear the URL hash

        fetchUserProfile(accessToken)
            .then(profile => {
                userInfo.innerHTML = `Welcome, <strong>${profile.display_name}</strong>`;
                loginButton.style.display = 'none';
                interactionContainer.style.display = 'block';
                signOutButton.style.display = 'inline-block'; // Show the sign-out button

                // Change the <h1> text to "Spotify Stats"
                headerTitle.textContent = 'Spotify Stats'; 
            })
            .catch(error => {
                userInfo.textContent = 'Error loading profile. Please try again.';
            });

            const validateDropdowns = () => {
                const statTypeValue = document.getElementById('stat-type').value;
                const timeRangeValue = timeRangeDropdown.value;
                const trackLimitValue = trackLimitDropdown.value;
                submitButton.disabled = !statTypeValue || !timeRangeValue || !trackLimitValue;
            };
            
            document.getElementById('stat-type').addEventListener('change', validateDropdowns);
            timeRangeDropdown.addEventListener('change', validateDropdowns);
            trackLimitDropdown.addEventListener('change', validateDropdowns);

            submitButton.addEventListener('click', async () => {
                try {
                    const statType = document.getElementById('stat-type').value;
                    const timeRange = timeRangeDropdown.value;
                    const limit = parseInt(trackLimitDropdown.value, 10);
            
                    if (!statType) {
                        tracksContainer.textContent = 'Please select a Stat Type.';
                        return;
                    }
            
                    if (statType === 'tracks') {
                        const topTracks = await fetchTopTracks(accessToken, timeRange, limit);
                        tracksContainer.innerHTML = topTracks.items.map((track, index) => `
                            <a href="${track.external_urls.spotify}" target="_blank" rel="noopener noreferrer" class="track-item">
                                <div class="track-number">${index + 1}.</div>
                                <img class="track-image" src="${track.album.images[2].url}" alt="${track.name}">
                                <div class="track-info">
                                    <strong>${track.name}</strong><br>
                                    <span>by ${track.artists.map(artist => artist.name).join(', ')}</span><br>
                                    <span>Popularity: ${track.popularity}</span>
                                </div>
                            </a>
                        `).join('');
                    } else if (statType === 'artists') {
                        const topArtists = await fetchTopArtists(accessToken, timeRange, limit);
                        tracksContainer.innerHTML = topArtists.items.map((artist, index) => `
                            <a href="${artist.external_urls.spotify}" target="_blank" rel="noopener noreferrer" class="artist-item">
                                <div class="artist-number">${index + 1}.</div>
                                <img class="artist-image" src="${artist.images[2]?.url || ''}" alt="${artist.name}">
                                <div class="artist-info">
                                    <strong>${artist.name}</strong><br>
                                    <span>Followers: ${artist.followers.total.toLocaleString()}</span><br>
                                    <span>Popularity: ${artist.popularity}</span>
                                </div>
                            </a>
                        `).join('');
                    }
                } catch (error) {
                    tracksContainer.textContent = 'Error fetching data. Please try again.';
                }
            });            
            
            
    }
});

