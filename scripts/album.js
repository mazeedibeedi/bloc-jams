var createSongRow = function(songNumber, songName, songLength) {
    var template =
        '<tr class="album-view-song-item">'
    +   '   <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
    +   '   <td class="song-item-title">' + songName + '</td>'
    +   '   <td class="song-item-duration">' + songLength + '</td>'
    +   '</tr>'
    ;
    
    var $row = $(template);
    
    var clickHandler = function() {
        var songNumber = parseInt($(this).attr('data-song-number'));
        var songFromAlbum = currentAlbum.songs[songNumber - 1];
        if (currentlyPlayingSongNumber === null) {
            $(this).html(pauseButtonTemplate);
            setSong(songNumber);
            updatePlayerBarSong();
            currentSoundFile.play();
        } else if (currentlyPlayingSongNumber === songNumber) {
            if (currentSoundFile.isPaused()) {
                currentSoundFile.play();
                $(this).html(pauseButtonTemplate);
                $('.main-controls .play-pause').html(playerBarPauseButton);
            } else {
                currentSoundFile.pause();
                $(this).html(playButtonTemplate);
                $('.main-controls .play-pause').html(playerBarPlayButton);
            }
        } else if (currentlyPlayingSongNumber !== songNumber) {
            var $currentlyPlayingSongElement = getSongNumberCell(currentlyPlayingSongNumber);
            $currentlyPlayingSongElement.html($currentlyPlayingSongElement.attr('data-song-number'));
            $(this).html(pauseButtonTemplate);
            setSong(songNumber);
            updatePlayerBarSong();
            currentSoundFile.play();
        }
    };
    
    var onHover = function(event) {
        if ($(this).hasClass('album-view-song-item')) {
            var $songItem = $(this).find('.song-item-number');
            var songNumber = parseInt($songItem.attr('data-song-number'));
            
            if (songNumber !== currentlyPlayingSongNumber) {
                $songItem.html(playButtonTemplate);
                
            }
        }
    };
    
    var offHover = function(event) {
        var $songItem = $(this).find('.song-item-number');
        var songNumber = parseInt($songItem.attr('data-song-number'));
            
        if (songNumber !== currentlyPlayingSongNumber) {
            $songItem.html(songNumber);
        }
    };
    
    $row.find('.song-item-number').click(clickHandler);
    $row.hover(onHover, offHover);
    return $row;
};

var setCurrentAlbum = function(album) {
    currentAlbum = album;
    var $albumTitle = $('.album-view-title');
    var $albumArtist = $('.album-view-artist');
    var $albumReleaseInfo = $('.album-view-release-info');
    var $albumImage = $('.album-cover-art');
    var $albumSongList = $('.album-view-song-list');
    
    $albumTitle.text(album.title);
    $albumArtist.text(album.artist);
    $albumReleaseInfo.text(album.year + ' ' + album.label);
    $albumImage.attr('src', album.albumArtUrl);
    
    $albumSongList.empty();
    
    for (var i = 0; i < album.songs.length; i++) {
        var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
        $albumSongList.append($newRow);
    }
};

var trackIndex = function(album, song) {
    return album.songs.indexOf(song);
}

var updatePlayerBarSong = function() {
    $('.song-name').text(currentSongFromAlbum.title);
    $('.artist-name').text(currentAlbum.artist);
    $('.artist-song-mobile').text(currentSongFromAlbum.title + ' - ' + currentAlbum.artist);
    $('.main-controls .play-pause').html(playerBarPauseButton);
};

var nextSong = function() {
    var nextIndex = trackIndex(currentAlbum, currentSongFromAlbum) + 1;
    if (nextIndex >= currentAlbum.songs.length) {
        nextIndex = 0;
    }
    var $currentlyPlayingSongElement = getSongNumberCell(currentlyPlayingSongNumber);
    $currentlyPlayingSongElement.html(currentlyPlayingSongNumber);
    setSong(nextIndex + 1);
    currentSoundFile.play();
    updatePlayerBarSong();
    $currentlyPlayingSongElement = getSongNumberCell(currentlyPlayingSongNumber);
    $currentlyPlayingSongElement.html(pauseButtonTemplate);
    
};

var previousSong = function() {
    var previousIndex = trackIndex(currentAlbum, currentSongFromAlbum) - 1;
    if (previousIndex < 0) {
        previousIndex = currentAlbum.songs.length - 1;
    }
    var $currentlyPlayingSongElement = getSongNumberCell(currentlyPlayingSongNumber);
    $currentlyPlayingSongElement.html(currentlyPlayingSongNumber);
    setSong(previousIndex + 1);
    currentSoundFile.play();
    updatePlayerBarSong();
    $currentlyPlayingSongElement = getSongNumberCell(currentlyPlayingSongNumber);
    $currentlyPlayingSongElement.html(pauseButtonTemplate);
    
};

var setSong = function(songNumber) {
    if (currentSoundFile) {
        currentSoundFile.stop();
    }
    
    currentlyPlayingSongNumber = parseInt(songNumber);
    currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
    
    currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
        formats: [ 'mp3' ],
        preload: true
    });
    
    setVolume(currentVolume);
    
};

var setVolume = function(volume) {
    if (currentSoundFile) {
        currentSoundFile.setVolume(volume);
    }
};

var getSongNumberCell = function(number) {
    return $('.song-item-number[data-song-number="' + number + '"]');
};

var togglePlayFromPlayerBar = function() {
    if (currentSoundFile.isPaused()) {
        getSongNumberCell(currentlyPlayingSongNumber).html(pauseButtonTemplate);
        $(this).html(playerBarPauseButton);
        currentSoundFile.play();
    } else if (currentSoundFile) {
        getSongNumberCell(currentlyPlayingSongNumber).html(playButtonTemplate);
        $(this).html(playerBarPlayButton);
        currentSoundFile.pause();
    }
}

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentSoundFile = null;
var currentVolume = 80;

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');
var $playPause = $('.main-controls .play-pause');

$(document).ready(function() {
    setCurrentAlbum(albumPicasso);
    $previousButton.click(previousSong);
    $nextButton.click(nextSong);
    $playPause.click(togglePlayFromPlayerBar);
});

