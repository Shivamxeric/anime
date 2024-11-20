const searchButton = document.getElementById('searchButton');
const searchBox = document.getElementById('searchBox');
const animeListContainer = document.getElementById('animeList');
const videoModal = document.getElementById('videoModal');
const closeButton = document.getElementById('closeButton');
const videoIframe = document.getElementById('videoIframe');

// Your YouTube API Key
const apiKey = "AIzaSyAFEgksxYkVvvJY_DJoE5Z7QQLRON7CNTY";

// Preloaded Anime Data
const preloadedAnime = [
    { title: "Naruto", imageUrl: "https://cloud.appwrite.io/v1/storage/buckets/672072d000342303315f/files/673e106a154c8b966a12/view?project=6720726000034bebf729&project=6720726000034bebf729", malId: "20" },
    { title: "Attack on Titan", imageUrl: "https://cloud.appwrite.io/v1/storage/buckets/672072d000342303315f/files/673e112cdd5a1930b462/view?project=6720726000034bebf729&project=6720726000034bebf729", malId: "16498" },
    { title: "One Piece", imageUrl: "https://cloud.appwrite.io/v1/storage/buckets/672072d000342303315f/files/673e10a27086822ad71d/view?project=6720726000034bebf729&project=6720726000034bebf729", malId: "21" }
];

// Display Preloaded Anime
function displayAnimeList(animeData) {
    animeListContainer.innerHTML = ''; // Clear the current list
    animeData.forEach(anime => {
        const animeCard = document.createElement('div');
        animeCard.classList.add('anime-card');
        animeCard.innerHTML = `
            <img src="${anime.imageUrl}" alt="${anime.title}" onerror="this.src='fallback-image.jpg'"> 
            <h3>${anime.title}</h3>
            <button onclick="playVideo('${anime.title}')">Play Video</button>
        `;
        animeListContainer.appendChild(animeCard);
    });
}

// Play Video (Fetch YouTube Trailer based on anime title)
function playVideo(animeTitle) {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${animeTitle} trailer&key=${apiKey}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.items && data.items.length > 0) {
                const videoId = data.items[0].id.videoId;
                openVideoModal(videoId); // Open modal with trailer video
            } else {
                alert('No trailer found for this anime.');
            }
        })
        .catch(error => {
            console.error('Error fetching YouTube video:', error);
            alert('There was an error fetching the video.');
        });
}

// Open the video modal and embed the YouTube video
function openVideoModal(videoId) {
    videoIframe.src = `https://www.youtube.com/embed/${videoId}`;
    videoModal.classList.add('show');
}

// Close the video modal
closeButton.addEventListener('click', () => {
    videoModal.classList.remove('show');
    videoIframe.src = ''; // Stop the video when closing
});

// Search Button Click Event
searchButton.addEventListener('click', () => {
    const searchQuery = searchBox.value.trim();
    if (searchQuery) {
        fetchSearchAnime(searchQuery);
    }
});

// Fetch Search Anime based on Search Query
function fetchSearchAnime(query) {
    fetch(`https://api.jikan.moe/v4/anime?q=${query}`)
        .then(response => response.json())
        .then(data => {
            if (data.data && data.data.length > 0) {
                displayAnimeList(data.data.map(anime => ({
                    title: anime.title,
                    imageUrl: anime.images?.jpg?.image_url || 'fallback-image.jpg', // Check if image exists
                    malId: anime.mal_id
                })));
            } else {
                alert('No results found for your search.');
            }
        })
        .catch(error => console.error('Error fetching anime data:', error));
}

// Initial display of preloaded anime
displayAnimeList(preloadedAnime);
