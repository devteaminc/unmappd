var map;
function initialize() {
    var mapOptions = {
        zoom: 2,
        center: new google.maps.LatLng(0, 0),
        mapTypeId: 'terrain'
    };
   map = new google.maps.Map(document.getElementById('map'), mapOptions);
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
            var marker = new google.maps.Marker({
                position: latlng,
                map: map
            });
            var center = new google.maps.LatLng(lat, lng);
            map.panTo(center);
            map.setZoom(5);
        }
    }
});