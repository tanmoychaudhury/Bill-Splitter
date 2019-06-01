'use strict'
billapp.service('authService', [function(){
	this.apiKey = undefined;
	this.firstname = undefined;
	this.lastname = undefined;
	this.userType = undefined;
	this.clear = clear;

	Object.defineProperty(this, "apiKey", {
		get: function() { return sessionStorage.getItem("apiKey") },
		set: function(key) { sessionStorage.setItem("apiKey", key) }
	});

	Object.defineProperty(this, "firstname", {
		get: function() { return sessionStorage.getItem("firstname") },
		set: function(key) { sessionStorage.setItem("firstname", key) }
	});
	Object.defineProperty(this, "lastname", {
		get: function() { return sessionStorage.getItem("lastname") },
		set: function(key) { sessionStorage.setItem("lastname", key) }
	});
	Object.defineProperty(this, "userType", {
		get: function() { return sessionStorage.getItem("userType") },
		set: function(key) { sessionStorage.setItem("userType", key) }
	});
	function clear(){
		sessionStorage.removeItem("apiKey");
		sessionStorage.removeItem("firstname");
		sessionStorage.removeItem("lastname");
		sessionStorage.removeItem("userType");
	}
}]);