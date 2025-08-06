const fs = require('fs');
const path = require('path');

// Function to scan the assets/sound directory and generate playlist
function generatePlaylist() {
    const soundDir = path.join(__dirname, 'public', 'assets', 'sound');
    const outputFile = path.join(__dirname, 'src', 'playlist.json');

    try {
        // Read all files in the sound directory
        const files = fs.readdirSync(soundDir);

        // Filter for audio files
        const audioExtensions = ['.mp3', '.wav', '.ogg', '.m4a', '.aac'];
        const audioFiles = files.filter(file => {
            const ext = path.extname(file).toLowerCase();
            return audioExtensions.includes(ext);
        });

        // Create playlist array with full paths
        const playlist = audioFiles.map(file => `/assets/sound/${file}`);

        // Write playlist to JSON file
        fs.writeFileSync(outputFile, JSON.stringify(playlist, null, 2));

        console.log('✅ Playlist generated successfully!');
        console.log(`📁 Found ${playlist.length} audio files:`);
        playlist.forEach((track, index) => {
            console.log(`   ${index + 1}. ${track.split('/').pop()}`);
        });

        return playlist;
    } catch (error) {
        console.error('❌ Error generating playlist:', error.message);
        return [];
    }
}

// Run the function
if (require.main === module) {
    generatePlaylist();
}

module.exports = generatePlaylist;
