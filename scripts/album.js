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
            currentlyPlayingSongNumber = songNumber;
            currentSongFromAlbum = songFromAlbum;
            updatePlayerBarSong();
        } else if (currentlyPlayingSongNumber === songNumber) {
            $(this).html(playButtonTemplate);
            $('.main-controls .play-pause').html(playerBarPlayButton);
            currentlyPlayingSongNumber = null;
            currentSongFromAlbum = null;
        } else if (currentlyPlayingSongNumber !== songNumber) {
            var $currentlyPlayingSongElement = $(document).find('[data-song-number="' + currentlyPlayingSongNumber + '"]');
            $currentlyPlayingSongElement.html($currentlyPlayingSongElement.attr('data-song-number'));
            $(this).html(pauseButtonTemplate);
            currentlyPlayingSongNumber = songNumber;
            currentSongFromAlbum = songFromAlbum;
            updatePlayerBarSong();
        }
    };
    
    var onHover = function(event) {
        if ($(this).hasClass('album-view-song-item')) {
            var $songItem = $(this).find('.song-item-number');
            
            if (parseInt($songItem.attr('data-song-number')) !== currentlyPlayingSongNumber) {
                $songItem.html(playButtonTemplate);
            }
        }
    };
    
    var offHover = function(event) {
        var $songItem = $(this).find('.song-item-number');
        var songNumber = parseInt($(this).attr('data-song-number'));
            
        if (parseInt($songItem.attr('data-song-number')) !== currentlyPlayingSongNumber) {
            $songItem.html($songItem.attr('data-song-number'));
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
    if (nextIndex === currentAlbum.songs.length) {
        nextIndex = 0;
    }
    currentSongFromAlbum = currentAlbum.songs[nextIndex];
    updatePlayerBarSong();
    var $currentlyPlayingSongElement = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
    $currentlyPlayingSongElement.html(currentlyPlayingSongNumber);
    currentlyPlayingSongNumber = nextIndex + 1;
    $currentlyPlayingSongElement = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
    $currentlyPlayingSongElement.html(pauseButtonTemplate);
    
};

var previousSong = function() {
    var previousIndex = trackIndex(currentAlbum, currentSongFromAlbum) - 1;
    if (previousIndex < 0) {
        previousIndex = currentAlbum.songs.length - 1;
    }
    currentSongFromAlbum = currentAlbum.songs[previousIndex];
    updatePlayerBarSong();
    var $currentlyPlayingSongElement = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
    $currentlyPlayingSongElement.html(currentlyPlayingSongNumber);
    currentlyPlayingSongNumber = previousIndex + 1;
    $currentlyPlayingSongElement = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
    $currentlyPlayingSongElement.html(pauseButtonTemplate);
    
};


var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');

$(document).ready(function() {
    setCurrentAlbum(albumPicasso);
    $previousButton.click(previousSong);
    $nextButton.click(nextSong);
});

