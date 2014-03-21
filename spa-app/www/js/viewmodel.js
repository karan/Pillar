

var ViewModel = function(init) {
	var self = this;
	self.user = {};
	self.formAnswers = new ko.observableArray();
	self.questionNumber = new ko.observable();
	self.answer = new ko.observable();

	var respondCanvas = function(){ 
		var w = $(window).width();
		var h = $(window).height() - $("#title").height() - $("#footing").height();
		$("#graph").css({'width' : w, 'height' : h});
	    $("#graph").attr('width', w);
	    $("#graph").attr('height', h);
	    new Chart("#graph", [new DataPoint(120120, 10), new DataPoint(120303, 20), new DataPoint(120403, 30), new DataPoint(120503, 40), new DataPoint(120603, 50)]);
	}

	var loadVM = function(data) {
		self.user = data.user;
		self.formAnswers.push({
			'prompt' : 'question one...',
			'answer' : new ko.observable(5)
		});
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

	self.nextQuestion = function() {
		self.questionNumber(self.questionNumber() + 1);
	}

	self.submitAnswers = function() {

	}

	self.drawChart = function() {
		respondCanvas();
	}

	$(window).resize(respondCanvas);
	loadVM(init);
}