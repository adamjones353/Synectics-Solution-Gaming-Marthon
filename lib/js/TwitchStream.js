

var Streams =
    [
        { platform: 'twitch', channel: 'PhxViper' },
        { platform: 'twitch', channel: 'dataoverride' },
        { platform: 'twitch', channel: 'hashbrown_' },
        { platform: 'twitch', channel: 'adamjones353' },
        { platform: 'twitch', channel: 'howtohayden' },
        { platform: 'facebook', channel: '1', url:'https://www.facebook.com/518325135/videos/10162122513700136/', name: '', title: 'Synectics Gaming Marathon. Raising money for Ruff n Ruby. Prizes donated by Overclockers.'},
    ];
var ActiveStream = '';

$(window).on('load', function () {

    LoadStream(Streams[0]);
    ActiveStream = Streams[0];
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
    if (streams.length < 1) {
        dfd.resolve(html);
        return dfd.promise();
    }
    streams.forEach(function (item,index) {

        html += `<div class="Channel" id="${item.channel}" data-user="${item.channel}">
                        <div class="StreamImg" style="background-image: url(./lib/facebook.jpg);">
                            <div class="StreamTitle">${item.title}</div>
                            <div class="StreamerName">${item.name}</div>
                        </div>
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
            console.log(item);
            html += `<div class="Channel" id="${item.user_name.replace(" ", "").toLowerCase()}" data-user="${item.user_name.replace(" ", "").toLowerCase()}">
                        <div class="StreamImg" style="background-image: url(${GetThumnail(item.thumbnail_url)});">
                            <div class="StreamTitle">${item.title}</div>
                            <div class="StreamerName">${item.user_name}</div>
                        </div>
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
    return Streams.filter(function (item) {
        return item.platform === 'twitch';
    });
}

function GetFacebookStreamsFromList() {
    return Streams.filter(function (item) {
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

    }

    if (stream.platform === 'facebook') {
        $('.Main').html(`<div class="fb-video"
             data-href="${stream.url}"
             data-width="${$('#twitch-embed').width()}"
             data-height="${$('#twitch-embed').height()}"
             data-allowfullscreen="true"
             data-autoplay="true"
             data-show-captions="true"></div>`);

        FB.XFBML.parse();
    }

    UpdateActiveStreamCss();
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
    return Streams.filter(function (item) {
        return item.channel.toLowerCase() === `${channel}`.toLowerCase();
    })[0];
}
