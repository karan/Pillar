

var ViewModel = function(init) {
	var self = this;
	self.user = {};

	var loadVM = function(data) {
		self.user = data.user;
	};

	self.goToHome = function() {
		$("#title > h1").text("Home");
		return true;
	};

	self.goToForms = function() {
		$("#title > h1").text("Input");
		return true;
	};

	self.goToStats = function() {
		$("#title > h1").text("Statistics");
		self.drawChart();
		return true;
	};

	self.drawChart = function() {
		var ctx = $("#graph").get(0).getContext("2d");
	}


	loadVM(init);
}