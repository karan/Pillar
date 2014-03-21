

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
		new Chart("#graph", [new DataPoint(120120, 20), new DataPoint(120303, 10), new DataPoint(120403, 12), new DataPoint(120503, 18), new DataPoint(120603, 9)]);
	}


	loadVM(init);
}