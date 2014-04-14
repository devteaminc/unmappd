var mapAll;
var mapDet;

function initialize() {
    var mapAllOptions = {
        zoom: 1,
        center: new google.maps.LatLng(20, 0),
        mapTypeId: 'terrain'
    };

    var mapDetOptions = {
        zoom: 2,
        center: new google.maps.LatLng(0, 0),
        mapTypeId: 'terrain'
    };
   
   mapAll = new google.maps.Map(document.getElementById('mapAll'), mapAllOptions);
   mapDet = new google.maps.Map(document.getElementById('mapDet'), mapDetOptions);
}
initialize();

// socket code
// 
var published = [];
var socket = io.connect('http://localhost:1337');
socket.on('stream', function(tweet){
    var twid = tweet.id;
    if(published.indexOf( twid ) == -1){
        published.push(twid);
        $("#beertweets dd").removeClass("lead").addClass("text-muted");
        $("#beertweets dd img").hide();
        $('#beertweets').prepend('<dd class="lead"><img src="'+tweet.user.profile_image_url+'" class="img-rounded" /> '+tweet.text+'</dd>').fadeIn();
        if(tweet.geo != null){
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