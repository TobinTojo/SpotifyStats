const clientId = import.meta.env.VITE_SPOTIFY_API_KEY; // Replace with your Spotify Client ID
const redirectUri = 'http://localhost:5173'; // Replace with your Redirect URI

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

    if (accessToken) {
        window.location.hash = ''; // Clear the URL hash

        fetchUserProfile(accessToken)
            .then(profile => {
                userInfo.innerHTML = `Welcome, <strong>${profile.display_name}</strong>`;
                loginButton.style.display = 'none';
                interactionContainer.style.display = 'block';

                // Change the <h1> text to "Spotify Stats"
                headerTitle.textContent = 'Spotify Stats'; 
            })
            .catch(error => {
                userInfo.textContent = 'Error loading profile. Please try again.';
            });

        // Enable submit button only if both dropdowns have valid selections
        const validateDropdowns = () => {
            const timeRangeValue = timeRangeDropdown.value;
            const trackLimitValue = trackLimitDropdown.value;
            submitButton.disabled = !timeRangeValue || !trackLimitValue;
        };

        timeRangeDropdown.addEventListener('change', validateDropdowns);
        trackLimitDropdown.addEventListener('change', validateDropdowns);

        submitButton.addEventListener('click', async () => {
            try {
                const timeRange = timeRangeDropdown.value;
                const trackLimit = parseInt(trackLimitDropdown.value, 10);

                const topTracks = await fetchTopTracks(accessToken, timeRange, trackLimit);
                tracksContainer.innerHTML = topTracks.items.map((track, index) => `
                    <div class="track-item">
                        <div class="track-number">${index + 1}.</div>
                        <img class="track-image" src="${track.album.images[2].url}" alt="${track.name}">
                        <div class="track-info">
                            <strong>${track.name}</strong><br>
                            <span>by ${track.artists.map(artist => artist.name).join(', ')}</span>
                        </div>
                    </div>
                `).join('');
            } catch (error) {
                tracksContainer.textContent = 'Error fetching top tracks. Please try again.';
            }
        });
    }
});

