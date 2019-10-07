$(document).ready(function () {

    LoadStream("Monstercat")

});



function LoadStream(channelName) {

    $('#twitch-embed').empty();

    new Twitch.Embed("twitch-embed", {
        width: $('#twitch-embed').width(),
        height: $('#twitch-embed').height(),
        channel: channelName,
        theme: 'dark',
        muted: false
    });
}