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
	self.allmessages = new ko.observableArray();

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
	    new Chart("#graph", [new DataPoint(120120, 10), new DataPoint(120303, 40), new DataPoint(120403, 30), new DataPoint(120503, 20), new DataPoint(120603, 50), new DataPoint(120703, 35)]);
	}

	var resetForm = function() {
		for(var i = 0; i < self.formAnswers().length; i++) {
			self.formAnswers()[i].answer(2);
		}
	};

	var loadVM = function(data) {
		self.drawChart();
		self.user = data.user;
		self.formAnswers.push({
			'prompt' : 'Have you felt low in spirits or sad?',
			'answer' : new ko.observable(2)
		});
		self.formAnswers.push({
			'prompt' : 'Have you lost interest in your daily activities?',
			'answer' : new ko.observable(2)
		});
		self.formAnswers.push({
			'prompt' : 'Have you felt lacking in energy and strength?',
			'answer' : new ko.observable(2)
		});
		self.formAnswers.push({
			'prompt' : 'Have you felt less self-confident?',
			'answer' : new ko.observable(2)
		});
		/*
		self.formAnswers.push({
			'prompt' : ' Have you felt that life wasn\'t worth living?',
			'answer' : new ko.observable(5)
		});*/
		self.formAnswers.push({
			'prompt' : 'Have you had difficulty in concentrating?',
			'answer' : new ko.observable(2)
		});
		self.formAnswers.push({
			'prompt' : 'Have you felt very restless?',
			'answer' : new ko.observable(2)
		});
		self.formAnswers.push({
			'prompt' : 'Have you felt subdued?',
			'answer' : new ko.observable(2)
		});
		self.formAnswers.push({
			'prompt' : 'Have you had trouble sleeping at night?',
			'answer' : new ko.observable(2)
		});
		self.formAnswers.push({
			'prompt' : 'Have you suffered from reduced appetite?',
			'answer' : new ko.observable(2)
		});
	};

	var calculateScore = function() {
		var sum = 0;
		for(var i = 0; i < self.formAnswers().length; i++) {
			sum += self.formAnswers()[i].answer();
		}
		return 50 - sum;
	}

	self.goToActivity = function() {
		$("#title > h1").text("Activity");
		// $.getJSON(app.server + '/allmessages', function(data) { 
		// 	console.log(data);
		// 	for (var i=0; i<data["messages"].length; i++)
		//     	self.allmessages.push(data["messages"][i]);
		// });
		self.allmessages.push({
            "message": "o thou art",
            "username": "tu",
            "_id": "532d7f7b0ae6fd58f7dc129a",
            "__v": 0,
            "created_at": "2014-03-22T12:18:03.217Z"
        });
        self.allmessages.push({
            "message": "\"hello world\"",
            "username": "tu",
            "_id": "532d7f710ae6fd58f7dc1299",
            "__v": 0,
            "created_at": "2014-03-22T12:17:53.550Z"
        });
        console.log(self.allmessages);
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
		var score = calculateScore();
		$.post(app.server + '/addscore', {'score' : score}, function(data) {
			self.goToMe();
			$("#record-page-link").removeClass("ui-btn-active");
			$("#record-page-link").removeClass("ui-state-persist");
			$("#me-page-link").addClass("ui-btn-active");
			$("#me-page-link").addClass("ui-state-persist");
			$("#record-page").hide();
			$("#me-page").show();
			resetForm();
		}, "json");
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
