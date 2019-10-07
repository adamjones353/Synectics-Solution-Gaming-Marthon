
var streams = ['riotgames', 'dreamhackcs', 'monstercat', 'limmy', 'locklear', 'myth', 'mayahiga', 'xQcOW', 'DrDisrespect'];
$(document).ready(function () {
    LoadSideBarFirstTime()
    
    setInterval(RefreshSideBar, 10000);
});


function LoadSideBarFirstTime() {

    $.ajax({
        url: `https://api.twitch.tv/helix/streams?${buildStreamList(streams)}`,
        headers: {
            "Client-ID": 'ti05ygaekwg0k3e7dyuebd9ji4xhzb' // put your Client-ID here
        }
    }).done(function (response) {

        $('.Channels').empty();

        response.data.forEach(function (item,index) {

            if (index == 0) {
                LoadStream(item.user_name);
            }

            $('.Channels').append(`
                    <div id="${item.id}" data-user="${item.user_name}">
                        <img src="${GetThumnail(item.thumbnail_url)}">
                    </div>`);
        });

        $('.Channels').find('div').each(function (index, element) {
            $(element).click(GetNewStream);
        });
    });
}

function RefreshSideBar() {

    $.ajax({
        url: `https://api.twitch.tv/helix/streams?${buildStreamList(streams)}`,
        headers: {
            "Client-ID": 'ti05ygaekwg0k3e7dyuebd9ji4xhzb' // put your Client-ID here
        }
    }).done(function (response) {

        var html = '';
        response.data.forEach(function (item, index) {

           

            html += `<div id="${item.id}" data-user="${item.user_name}">
                        <img src="${GetThumnail(item.thumbnail_url)}">
                    </div>`
        });

        $('.Channels').html(html);

        $('.Channels').find('div').each(function (index, element) {
            $(element).click(GetNewStream);
        });
    });
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