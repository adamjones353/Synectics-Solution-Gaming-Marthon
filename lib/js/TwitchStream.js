
var streams = ['riotgames', 'dreamhackcs', 'monstercat', 'limmy', 'locklear', 'myth', 'mayahiga', 'xQcOW', 'DrDisrespect'];
var streamsExtra =
    [
        { id: 1, platform: 'twitch', channle: 'riotgames' },
        { id: 2, platform: 'twitch', channle: 'dreamhackcs' },
        { id: 3, platform: 'twitch', channle: 'monstercat' },
        { id: 4, platform: 'twitch', channle: 'limmy' },
        { id: 5, platform: 'twitch', channle: 'locklear' },
        { id: 6, platform: 'twitch', channle: 'myth' },
        { id: 7, platform: 'twitch', channle: 'mayahiga' },
        { id: 8, platform: 'twitch', channle: 'xQcOW' },
        { id: 9, platform: 'twitch', channle: 'DrDisrespect' },
        { id: 10, platform: 'Facebook', channle: 'riotgames' },
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

    CallTwitch(function (response) {

        var html = '';
        response.data.forEach(function (item, index) {

            html += `<div id="${item.user_name.replace(" ", "").toLowerCase()}" data-user="${item.user_name}">
                        <img src="${GetThumnail(item.thumbnail_url)}">
                    </div>`;
        });

        $('.Channels').html(html);

        $('.Channels').find('div').each(function (index, element) {
            $(element).click(GetNewStream);
        });

        UpdateActiveStreamCss();
    });
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

function GetNewStream(event) {
    LoadStream($(event.currentTarget).data('user'));
}

function GetThumnail(url) {
    return url.replace('{width}', 320).replace('{height}', 240);
}

function UpdateActiveStreamCss() {
    $('.Channels').find('div').each(function (index, element) {
        $(element).removeClass('ActiveChannel');
    });
    $(`#${ActiveStream.id}`).addClass('ActiveChannel');
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
    streams.forEach(function (item, index){
        output += `user_login=${item}&`;
    });
    return output;
}

function LoadStream(stream) {

    ActiveStream = stream;

    if (stream.platform === 'twitch') {
        $('#twitch-embed').empty();

        new Twitch.Embed("twitch-embed", {
            width: $('#twitch-embed').width(),
            height: $('#twitch-embed').height(),
            channel: stream.channle,
            theme: 'dark',
            muted: false
        });

        UpdateActiveStreamCss();
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