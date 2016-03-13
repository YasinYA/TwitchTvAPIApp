
tabHandler("#online", "#onlineTab", "#allTab", "#offlineTab");
tabHandler("#offline", "#offlineTab", "#allTab", "#onlineTab");
tabHandler("#all", "#allTab", "#onlineTab", "#offlineTab");

//this function is gonna take care the tabs
function tabHandler(el, showing, hideEl1, hideEl2) {
  $(el).click(function(){
    $(showing).show();
    $(hideEl1).hide();
    $(hideEl2).hide();
  });
}

// this function is to shorten the string
String.prototype.trunc = String.prototype.trunc ||
  function(n) {
    return this.length > n ? this.substr(0, n - 1) + '...' : this;
}; 

// angular module
var twitchApp = angular.module("twitchApp", []);

// the all users tab directive
twitchApp.directive("myUsers", function() {
	return {
		restrict: 'A',
		templateUrl: 'directives\\allUser.html'
	};
});

// the offline users tab directive
twitchApp.directive("offUsers", function() {
	return {
		restrict: 'A',
		templateUrl: 'directives\\offlineUsers.html'
	};
});

// the online users tab directive
twitchApp.directive("onUsers", function() {
	return {
		restrict: 'A',
		templateUrl: 'directives\\onlineUsers.html'
	};
});

// the variable declaration
var streamers  = ["freecodecamp", "storbeck", "terakilobyte", "medrybw", "habathcx","RobotCaleb","thomasballinger","noobs2ninjas","beohoff","test_channel","cretetion","sheevergaming","TR7K","OgamingSC2","ESL_SC2"];
var streamurl  = "https://api.twitch.tv/kraken/streams/";
var userurl    = "https://api.twitch.tv/kraken/users/";

// Controller 
twitchApp.controller("allUsersController",[ '$scope', '$http', allUsersController]);

function allUsersController($scope, $http) {
	// the scope variables 
	$scope.userData = [];
	$scope.onlineStreamers = [];
	$scope.offlineStreamers = [];

	// the first API call
	function activateStream() {
		streamers.forEach(function(streamer){
			var userUrl = "https://api.twitch.tv/kraken/users/" + streamer;
			var req = {
				method : 'GET',
				url: userUrl
			};
			$http(req).then(function(httpResult) {
				var result = httpResult.data;
				$scope.userData.push(result);
				getStreams(result);
			});// the main then callback

		});// the forEach loop
	}

	//second API call
	function getStreams(user){
		// console.log(user);
		var streamUrl = "https://api.twitch.tv/kraken/streams/" + user.display_name;
		$http({
			method: 'GET',
			url:  streamUrl
		}).then(function(httpResponse){
			var data =  httpResponse.data;
			$scope.userData.map(function(u){
				if(user.display_name == u.display_name){
					u.streams = data;
					u.streamerStatus = data.stream;
					$scope.image     = "http://fit.ie/fitnew/wp-content/uploads/2014/11/no-profile-image.jpg";
					if(u.streams.stream === null) {
						u.offlineuser = "Offline";
						$scope.offlineStreamers.push(user);
					}else if(u.streams.stream !== null) {
						$scope.onlineStreamers.push(user);
					}
				}

			});
		});
	}
	$scope.activateStream = activateStream;
	$scope.streamerList = activateStream();
}