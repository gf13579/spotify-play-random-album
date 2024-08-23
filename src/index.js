/**
 * This script interacts with the Spotify API to play a random album from the user's library.
 * It fetches the user's saved albums, selects one at random, and starts playback.
 * 
 * The script assumes it's running in the browser's JavaScript console when on open.spotify.com
 * 
 * After running the code once in the browser's JavaScript Console, repeat the call to playRandomAlbum() as required
 * 
 * todo: support queuing another x albums
 */

const variables = encodeURIComponent(JSON.stringify({ 'filters': ['Albums'], 'order': null, 'textFilter': '', 'limit': 1000, 'offset': 0, 'flatten': false, 'expandedFolders': [], 'folderUri': null, 'includeFoldersWhenFlattening': true }));
const extensions = encodeURIComponent(JSON.stringify({ 'persistedQuery': { 'version': 1, 'sha256Hash': 'e25e473b160efdd4ababa7d98aa909ce0e5ab9c49c81f6d040da077a09e34ab3' } }));

function getAccessToken() {
    try {
        return JSON.parse(document.querySelector('#session').textContent).accessToken;
    } catch (error) {
        console.error('Failed to get access token:', error);
        throw new Error('Unable to retrieve access token');
    }
}

async function playAlbum(albumUri, accessToken) {
    try {
        const response = await fetch('https://api.spotify.com/v1/me/player/play', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                context_uri: albumUri
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        console.log('Album is now playing');
    } catch (error) {
        console.error('Failed to play album:', error);
        throw error;
    }
}

async function playRandomAlbum() {
    try {
        const accessToken = getAccessToken();
        const response = await fetch('https://api-partner.spotify.com/pathfinder/v1/query?operationName=libraryV3&variables=' + variables + '&extensions=' + extensions, {
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const albums = data.data.me.libraryV3.items;

        if (!albums || albums.length === 0) {
            throw new Error('No albums found in the library');
        }

        console.log(`albums.length is ${albums.length}`);
        const album = albums[Math.floor(Math.random() * albums.length)];

        console.log(`Picked random album: ${album.item.data.name}`);
        await playAlbum(album.item.data.uri, accessToken);
    } catch (error) {
        console.error('Error in playRandomAlbum:', error);
    }
}

// playRandomAlbum();

// Find the SVG element of the Spotify logo
const svgElement = document.querySelector('svg[data-encore-id="logoSpotify"]');

// Repurpose it as a button to trigger playRandomAlbum()
const parentElement = svgElement.parentElement.addEventListener('click', playRandomAlbum);
