var mapAll;
var mapDet;

function textReplacements(tweettext){

    // Make the name of the beer bold
    var regExp = /Drinking a(.*)by/;
    var matches = regExp.exec(tweettext);

    if(matches !== null){
        var replacement = '<strong> '+matches[1]+' </strong>';
        tweettext = tweettext.replace(matches[1],replacement);
    }

    // Make the name of the badge bold
    var regExps = /I just earned the(.*)badge/;
    var match = regExps.exec(tweettext);

    if(match !== null){
        var replacer = '<strong> '+match[1]+' </strong>';
        tweettext = tweettext.replace(match[1],replacer);
    }
    return tweettext;
}

function initialize() {
    var mapAllOptions = {
        zoom: 1,
        draggable: false,
        scrollwheel: false,
        center: new google.maps.LatLng(20, 0),
        disableDefaultUI: true,
        styles: [{"stylers":[{"hue":"#ff1a00"},{"invert_lightness":true},{"saturation":-100},{"lightness":33},{"gamma":0.5}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#2D333C"}]}]
    };

    var mapDetOptions = {
        zoom: 2,
        draggable: false,
        scrollwheel: false,
        center: new google.maps.LatLng(0, 0),
        disableDefaultUI: true,
        styles: [{"stylers":[{"hue":"#ff1a00"},{"invert_lightness":true},{"saturation":-100},{"lightness":33},{"gamma":0.5}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#2D333C"}]}]
    };
   
   mapAll = new google.maps.Map(document.getElementById('mapAll'), mapAllOptions);
   mapDet = new google.maps.Map(document.getElementById('mapDet'), mapDetOptions);
}
initialize();

// socket code
var published = [];
var socket = io.connect('http://'+location.hostname);
socket.on('stream', function(tweet){
    var twid = tweet.id;
    if(published.indexOf( twid ) == -1){

        // format twitter specific elements in string - e.g. usernames, links and hashtags
        var tweettext = tweetFormatter(tweet.text);

        published.push(twid);
        var place = '';
        if(tweet.geo !== null){
            var p = tweet.geo.coordinates;
            var lat = p[0];
            var lng = p[1];
            var latlng = new google.maps.LatLng(lat, lng);
            var marker1 = new google.maps.Marker({
                position: latlng,
                map: mapAll,
                title: tweet.text
            });

            var marker2 = new google.maps.Marker({
                position: latlng,
                map: mapDet,
                title: tweet.text
            });
            var center = new google.maps.LatLng(lat, lng);
            mapDet.panTo(center);
            mapDet.setZoom(5);

            place = '<small class="text-muted"> '+tweet.place.full_name+' <span class="glyphicon glyphicon-pushpin"></span></small>';
        }

        tweettext = textReplacements(tweettext);

        $('<li class="left clearfix" style="display: none;"><span class="pull-left"><img src="'+tweet.user.profile_image_url+'" alt="User Avatar" class="img-circle profile"></span><div class="beertweets-body clearfix"><div class="header"><strong class="primary-font">'+tweet.user.name+''+place+'</strong><small class="pull-right text-muted"><span data-livestamp="'+tweet.created_at+'"></span> <span class="glyphicon glyphicon-time"></span></small></div><p class="tweettext">'+tweettext+'</p></div></li>')
            .hide()
            .prependTo('#beertweets')
            .show('fast'); 
        $("#beertweets .tweettext a[href^='http://']").attr("target","_blank");
    }
});