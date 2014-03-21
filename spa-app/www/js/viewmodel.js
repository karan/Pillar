ko.bindingHandlers.slider = {
    init: function (element, valueAccessor) {
        // use setTimeout with 0 to run this after Knockout is done
        setTimeout(function () {
            // $(element) doesn't work as that has been removed from the DOM
            var curSlider = $('#' + element.id);
            // helper function that updates the slider and refreshes the thumb location
            function setSliderValue(newValue) {
                curSlider.val(newValue).slider('refresh');
            }
            // subscribe to the bound observable and update the slider when it changes
            valueAccessor().subscribe(setSliderValue);
            // set up the initial value, which of course is NOT stored in curSlider, but the original element :\
            setSliderValue($(element).val());
            // subscribe to the slider's change event and update the bound observable
            curSlider.bind('change', function () {
                valueAccessor()(curSlider.val());
            });
        }, 0);
    }
};

var ViewModel = function(init) {
	var self = this;
	self.user = {};
	self.formAnswers = new ko.observableArray();
	self.questionNumber = new ko.observable(0);
	self.answer = new ko.observable();

    self.currentQuestion = ko.computed(function() {
        return self.formAnswers()[self.questionNumber()];
    });

    self.showNext = ko.computed(function() {
        return self.questionNumber() < self.formAnswers().length - 1;
    });

    self.showPrevious = ko.computed(function() {
        return self.questionNumber() > 0;
    });

	var respondCanvas = function(){ 
		var w = $(window).width();
		var h = $(window).height() - $("#title").height() - $("#footing").height();
		$("#graph").css({'width' : w, 'height' : h});
	    $("#graph").attr('width', w);
	    $("#graph").attr('height', h);
	    new Chart("#graph", [new DataPoint(120120, 10), new DataPoint(120303, 40), new DataPoint(120403, 30), new DataPoint(120503, 20), new DataPoint(120603, 50)]);
	}

	var loadVM = function(data) {
		self.drawChart();
		self.user = data.user;
		self.formAnswers.push({
			'prompt' : 'question one...',
			'answer' : new ko.observable(5)
		});
		self.formAnswers.push({
			'prompt' : 'question two...',
			'answer' : new ko.observable(5)
		});
		self.formAnswers.push({
			'prompt' : 'question three...',
			'answer' : new ko.observable(5)
		});
		self.formAnswers.push({
			'prompt' : 'question four...',
			'answer' : new ko.observable(5)
		});
		self.formAnswers.push({
			'prompt' : 'question five...',
			'answer' : new ko.observable(5)
		});
		self.formAnswers.push({
			'prompt' : 'question six...',
			'answer' : new ko.observable(5)
		});
		self.formAnswers.push({
			'prompt' : 'question seven...',
			'answer' : new ko.observable(5)
		});
		self.formAnswers.push({
			'prompt' : 'question eight...',
			'answer' : new ko.observable(5)
		});
		self.formAnswers.push({
			'prompt' : 'question nine...',
			'answer' : new ko.observable(5)
		});
		self.formAnswers.push({
			'prompt' : 'question ten...',
			'answer' : new ko.observable(5)
		});
		self.formAnswers.push({
			'prompt' : 'question eleven...',
			'answer' : new ko.observable(5)
		});
	};

	var calculateScore = function() {
		return 0;
	}

	self.goToActivity = function() {
		$("#title > h1").text("Activity");
		return true;
	};

	self.goToForms = function() {
		$("#title > h1").text("New Entry");
		return true;
	};

	self.goToMe = function() {
		$("#title > h1").text("Me");
		self.drawChart();
		return true;
	};

	self.nextQuestion = function() {
		self.questionNumber(self.questionNumber() + 1);
		$("#answer").val(self.currentQuestion().answer()).slider('refresh');
	};

	self.previousQuestion = function() {
		self.questionNumber(self.questionNumber() - 1);
		$("#answer").val(self.currentQuestion().answer()).slider('refresh');
	};

	self.submitAnswers = function() {
		/*var score = calculateScore();
		$.post(app.server + '/addscore', {'score' : score}, function() {

		}, "json");*/
	};

	self.addMessage = function() {
		/*var score = "";
		$.post(app.server + '/addmessage', {'message' : message}, function() {

		}, "json"); */
	};

	self.drawChart = function() {
		respondCanvas();
	};

	$(window).resize(respondCanvas);
	loadVM(init);
}