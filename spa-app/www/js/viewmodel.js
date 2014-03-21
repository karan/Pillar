

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
		
		var data = {
				labels : ["January","February","March","April","May","June","July"],
				datasets : [
					{
						fillColor : "rgba(220,220,220,0.5)",
						strokeColor : "rgba(220,220,220,1)",
						pointColor : "rgba(220,220,220,1)",
						pointStrokeColor : "#fff",
						data : [65,59,90,81,56,55,40]
					},
					{
						fillColor : "rgba(151,187,205,0.5)",
						strokeColor : "rgba(151,187,205,1)",
						pointColor : "rgba(151,187,205,1)",
						pointStrokeColor : "#fff",
						data : [28,48,40,19,96,27,100]
					}
				]
		};


		var width = $('#graph').parent().width();
		$('#graph').attr("width",width);
		new Chart(ctx).Line(data,{});
		window.onresize = function(event){
		    var width = $('#graph').parent().width();
		    $('#graph').attr("width",width);
		    new Chart(ctx).Line(data,options);
		};
	}


	loadVM(init);
}