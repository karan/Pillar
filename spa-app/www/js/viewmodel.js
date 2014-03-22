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
	self.messagesRendered = false;

	self.currentMessage = new ko.observable('');
	self.currentReplies = new ko.observableArray();
	self.dataPoints = [];

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
		var h = $(window).height() - $("#title").height() - $("#footing").height() - 75;
		$("#graph").css({'width' : w, 'height' : h});
	    $("#graph").attr('width', w);
	    $("#graph").attr('height', h);
	    var range = parseInt($("#time-selector :radio:checked").val());
	    //user self.dataPoints here
	    new Chart("#graph", self.dataPoints, range);
	}

	var resetForm = function() {
		self.questionNumber(0);
		for(var i = 0; i < self.formAnswers().length; i++) {
			self.formAnswers()[i].answer(2);
		}
	};

	var loadPoints = function(data) {
		var result = [];
		for(var i = 0; i < data.length; i++) {
			result.push(new DataPoint((new Date(data[i].timestamp).getTime() / 1000), data[i].score || 50));
		}
		return result;
	};

	var loadVM = function(data) {
		self.user = data.user;
		self.dataPoints = loadPoints(data.user.scores || []);
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
		self.drawChart();
	};

	var calculateScore = function() {
		var sum = 0;
		for(var i = 0; i < self.formAnswers().length; i++) {
			sum += parseInt(self.formAnswers()[i].answer());
		}
		return 50 - sum;
	}

	self.goToActivity = function() {
		$("#title > h1").text("Activity");
		if (!self.messagesRendered) {
			// $.getJSON(app.server + '/allmessages', function(data) { 
			// 	console.log(data);
			// 	for (var i=0; i<data["messages"].length; i++)
			//     	self.allmessages.push(data["messages"][i]);
			// });
			self.allmessages.push({
		        "message": "this is a test",
		        "username": "testing1",
		        "_id": "532e10672587b7000040368a",
		        "replies": [],
		        "created_at": "2014-03-22T22:36:23.203Z"
	        });
	        self.allmessages.push({
	            "message": "this is another test",
		        "username": "testing1",
		        "_id": "532e108a2587b7000040368b",
		        "replies": [],
		        "created_at": "2014-03-22T22:36:58.810Z"
	        });
	        self.messagesRendered = true;
	    }
		return true;
	};

	self.selectTime = function() {
		self.drawChart();
	}

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
			self.dataPoints.push(new DataPoint(new Date().toString(), score));
			$("#record-page-link").removeClass("ui-btn-active");
			$("#record-page-link").removeClass("ui-state-persist");
			resetForm();
			self.goToMe();
			$('#me-page-link').click();
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

	self.goToMessage = function(message) {

		var messageID = message._id;
		$.getJSON(app.server + '/getmessage?messageID=' + messageID, function(data) {
			self.currentReplies.removeAll(); 
			self.currentMessage(data["message"]["message"]);
			for (var i=0; i<data["message"]["replies"].length; i++)
				self.currentReplies.push(data["message"]["replies"][i]["message"]);
		});
		return true;
	}

	$(window).resize(respondCanvas);
	loadVM(init);
}
