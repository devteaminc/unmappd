var mapAll;
var mapDet;

function initialize() {
    var mapAllOptions = {
        zoom: 1,
        center: new google.maps.LatLng(20, 0),
        mapTypeId: 'terrain',
        disableDefaultUI: true
    };

    var mapDetOptions = {
        zoom: 2,
        center: new google.maps.LatLng(0, 0),
        mapTypeId: 'terrain',
        disableDefaultUI: true
    };
   
   mapAll = new google.maps.Map(document.getElementById('mapAll'), mapAllOptions);
   mapDet = new google.maps.Map(document.getElementById('mapDet'), mapDetOptions);
}
initialize();

// socket code
var published = [];
var socket = io.connect('http://localhost:5000');
socket.on('stream', function(tweet){
    var twid = tweet.id;
    if(published.indexOf( twid ) == -1){
        published.push(twid);
        $('<li class="left clearfix" style="display: none;"><span class="beertweets-img pull-left"><img src="'+tweet.user.profile_image_url+'" alt="User Avatar" class="img-circle"></span><div class="beertweets-body clearfix"><div class="header"><strong class="primary-font">'+tweet.user.name+'</strong> <small class="pull-right text-muted"><span class="glyphicon glyphicon-time"></span><span data-livestamp="'+tweet.created_at+'"></span></small></div><p>'+tweetFormatter(tweet.text)+'</p></div></li>').hide().prependTo('#beertweets').show('fast');
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
        }
    }
});