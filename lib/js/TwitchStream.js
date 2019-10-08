
var streams = ['riotgames', 'dreamhackcs', 'monstercat', 'limmy', 'locklear', 'myth', 'mayahiga', 'xQcOW', 'DrDisrespect'];
var streamsExtra =
    [
        { platform: 'twitch', channel: 'riotgames' },
        { platform: 'twitch', channel: 'dreamhackcs' },
        { platform: 'twitch', channel: 'monstercat' },
        { platform: 'twitch', channel: 'limmy' },
        { platform: 'twitch', channel: 'locklear' },
        { platform: 'twitch', channel: 'myth' },
        { platform: 'twitch', channel: 'mayahiga' },
        { platform: 'twitch', channel: 'xQcOW' },
        { platform: 'twitch', channel: 'DrDisrespect' },
        { platform: 'facebook', channel: '1', url:'https://www.facebook.com/FacebookDevelopers/videos/10152454700553553/'},
    ];
var ActiveStream = '';

$(window).on('load', function () {

    LoadStream(streamsExtra[0]);
    ActiveStream = streamsExtra[0];
    LoadSideBar();
    LoadJustGivingElements();
    
    setInterval(LoadSideBar, 60000);
    setInterval(LoadJustGivingElements, 30000);
});

function LoadSideBar() {

    GetTwitchChannels()
        .then(GetFacebookVideos)
        .then(function (html) {
            $('.Channels').html(html);

            $('.Channels').find('div').each(function (index, element) {
                $(element).click(GetNewStream);
            });

            UpdateActiveStreamCss();
        });

}

function GetFacebookVideos(html) {
    var dfd = jQuery.Deferred();
    var streams = GetFacebookStreamsFromList();
    streams.forEach(function (item,index) {

        html += `<div id="${item.channel}" data-user="${item.channel}">
                        <img src="./lib/facebook.jpg">
                    </div>`;

        if (index >= streams.length-1) {
            dfd.resolve(html);
        }
    });
    return dfd.promise();
}

function GetTwitchChannels() {
    var dfd = jQuery.Deferred();

    CallTwitch(function (response) {

        var html = '';
        response.data.forEach(function (item, index) {

            html += `<div id="${item.user_name.replace(" ", "").toLowerCase()}" data-user="${item.user_name.replace(" ", "").toLowerCase()}">
                        <img src="${GetThumnail(item.thumbnail_url)}">
                    </div>`;
        });

        dfd.resolve(html);
    });

    return dfd.promise();
}

function CallTwitch(callback) {

    $.ajax({
        url: `https://api.twitch.tv/helix/streams?${buildStreamList(GetTwitchStreamsFromList())}`,
        headers: {
            "Client-ID": 'ti05ygaekwg0k3e7dyuebd9ji4xhzb' // put your Client-ID here
        }
    }).done(callback);

}

function GetTwitchStreamsFromList() {
    return streamsExtra.filter(function (item) {
        return item.platform === 'twitch';
    });
}

function GetFacebookStreamsFromList() {
    return streamsExtra.filter(function (item) {
        return item.platform === 'facebook';
    });
}

function GetNewStream(event) {
    LoadStream(GetStreamByChannel($(event.currentTarget).data('user')));
}

function GetThumnail(url) {
    return url.replace('{width}', 320).replace('{height}', 240);
}

function UpdateActiveStreamCss() {
    $('.Channels').find('div').each(function (index, element) {
        $(element).removeClass('ActiveChannel');
    });
    $(`#${ActiveStream.channel}`).addClass('ActiveChannel');
}

function ministream(item, index) {
    $('.Channels').append(`<div id="${index}"></div>`);

    new Twitch.Embed(`${index}`, {
        width: $(`#${index}`).width(),
        height: $(`#${index}`).width(),
        channel: item,
        theme: 'dark',
        muted: false
    });
}

function buildStreamList(streams)
{
    var output = '';
    streams.forEach(function (item, index) {
        output += `user_login=${item.channel.toLowerCase()}&`;
    });

    return output;
}

function LoadStream(stream) {

    ActiveStream = stream;

    if (stream.platform === 'twitch') {
        $('.Main').html(`<div id="twitch-embed"></div>`);
        new Twitch.Embed("twitch-embed", {
            width: $('#twitch-embed').width(),
            height: $('#twitch-embed').height(),
            channel: stream.channel.toLowerCase(),
            theme: 'dark',
            muted: false
        });

        UpdateActiveStreamCss();
    }

    if (stream.platform === 'facebook') {
        $('.Main').html(`<div class="fb-video"
             data-href="${stream.url}"
             data-width="${$('#twitch-embed').width()}"
             data-height="${$('#twitch-embed').height()}"
             data-allowfullscreen="true"
             data-autoplay="true"
             data-show-captions="true"></div>`)

    }
   
}

function LoadJustGivingElements() {
    GetJustGivingData(function(response) {
        var currentTotal = response.getElementsByTagName('amountPledged')[0].childNodes[0].nodeValue;
        var target = response.getElementsByTagName('targetAmount')[0].childNodes[0].nodeValue;
        $('.progress-bar').css("height", `${(currentTotal / target) * 100}%`);
        $('.currentAmount').html(`&#163;${currentTotal}`);
        $('.currentAmount').css('bottom', `${60 + $('.progress-bar').height()}xp`);
        $('.targetAmount').html(`&#163;${target}`);
    });
}

function GetJustGivingData(callback) {
    $.ajax({
        url: `https://api.justgiving.com/5de7a390/v1/crowdfunding/pages/synectics-solutions-gaming`,
    }).done(callback);
}

function GetStreamByChannel(channel) {
    return streamsExtra.filter(function (item) {
        return item.channel.toLowerCase() === `${channel}`.toLowerCase();
    })[0];
}
