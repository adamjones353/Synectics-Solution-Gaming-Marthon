
var streams = ['riotgames', 'dreamhackcs', 'monstercat', 'limmy', 'locklear', 'myth', 'mayahiga', 'xQcOW', 'DrDisrespect'];

$(document).ready(function () {
    LoadSideBar();
    LoadJustGivingElements();
    LoadStream(streams[0]);
    setInterval(LoadSideBar, 10000);
});

function LoadSideBar() {

    CallTwitch(function (response) {

        var html = '';
        response.data.forEach(function (item, index) {

            html += `<div id="${item.id}" data-user="${item.user_name}">
                        <img src="${GetThumnail(item.thumbnail_url)}">
                    </div>`;
        });

        $('.Channels').html(html);

        $('.Channels').find('div').each(function (index, element) {
            $(element).click(GetNewStream);
        });
    });
}

function CallTwitch(callback) {

    $.ajax({
        url: `https://api.twitch.tv/helix/streams?${buildStreamList(streams)}`,
        headers: {
            "Client-ID": 'ti05ygaekwg0k3e7dyuebd9ji4xhzb' // put your Client-ID here
        }
    }).done(callback);

}

function GetNewStream(event) {
    LoadStream($(event.currentTarget).data('user'));
}

function GetThumnail(url) {
    return url.replace('{width}', $('.Channels').width() - 30).replace('{height}', 100);
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

function LoadJustGivingElements() {
    GetJustGivingData(function(response) {
        console.log(response);

        var currentTotal = response.getElementsByTagName('amountPledged')[0].childNodes[0].nodeValue;
        var target = response.getElementsByTagName('targetAmount')[0].childNodes[0].nodeValue;

        $('.progress-bar').css("height", `${(currentTotal / target) * 100}%`);
        $('.currentAmount').html(`&#163;${currentTotal}`);
        $('.targetAmount').html(`&#163;${target}`);
    });
}

function GetJustGivingData(callback) {
    $.ajax({
        url: `https://api.justgiving.com/5de7a390/v1/crowdfunding/pages/synectics-solutions-gaming`,
    }).done(callback);
}