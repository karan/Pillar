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

	self.allmessages = new ko.observableArray();

	self.currentMessage = new ko.observable('');
	self.currentMessageID = new ko.observable('');
	self.currentReplies = new ko.observableArray();
	self.dataPoints = [];
	self.prayer = new ko.observable('');
	self.showPrayer = new ko.observable(false);
	self.toggleReplyMessage = new ko.observable(false);
	self.inboxMessages = new ko.observableArray();
	self.showHotLine = new ko.observable(false);


	self.rating = ko.computed(function() {
		if(typeof self.formAnswers()[self.questionNumber()] != 'undefined') {
			var val = self.formAnswers()[self.questionNumber()].answer();
			if(val == 1) {
				return "Never";
			} else if(val == 2) {
				return "Rarely";
			} else if(val == 3) {
				return "Sometimes";
			} else if(val == 4) {
				return "Mostly";
			} else if(val == 5) {
				return "Always";
			}
		}
		return "";
	});

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
		var h = $(window).height() - $("#footing").height() - 75;
		$("#graph").css({'width' : w, 'height' : h});
	    $("#graph").attr('width', w);
	    $("#graph").attr('height', h);
	    var range = parseInt($("#time-selector :radio:checked").val());
	    //user self.dataPoints here
	    new Chart("#graph", self.dataPoints, range);
	};

	var resetForm = function() {
		self.showHotLine(false);
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

	var loadUser = function(data) {
		self.user = data;
		self.dataPoints = loadPoints(data.scores || []);
	};

	var loadMessages = function() {
		$.getJSON(app.server + '/allmessages', function(data) {
			for(var i = 0; i < data.messages.length; i++) {
				self.allmessages.push(data.messages[i]);
			}
		});
	};

	var loadVM = function(data) {
		loadUser(data.user);
		loadMessages();
		self.getInboxMessages();
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
		self.formAnswers.push({
			'prompt' : 'Have you had thoughts that life is not worth living?',
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

	self.prettyDate = function(data) {
		var date = new Date(data);

		return (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();
	};

	self.goToActivity = function() {
		return true;
	};

	self.selectTime = function() {
		self.drawChart();
	}

	self.goToForms = function() {
		resetForm();
		return true;
	};

	self.goToMe = function() {
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
			loadUser(data.user);
			if(self.formAnswers()[9].answer() > 2) {
				self.showHotLine(true);
			} else {
				$("#record-page-link").removeClass("ui-btn-active");
				$("#record-page-link").removeClass("ui-state-persist");
				resetForm();
				self.goToMe();
				$('#me-page-link').click();
			}
		}, "json");
	};

	self.addMessage = function() {
		var message = $('#newMessage').val();
		$.post(app.server + '/addmessage', {'message' : message}, function(data) {
			//self.allmessages.unshift(data.message);
			$('#newMessage').val('');
			$("#me-page-link").removeClass("ui-btn-active");
			$("#me-page-link").removeClass("ui-state-persist");
			$("#activity-page-link").addClass("ui-btn-active");
			$("#activity-page-link").addClass("ui-state-persist");
		}, "json");

		return true;
	};

	self.generatePrayer = function() {
		$.get(app.server + '/getquote', function(data) {
			self.prayer(data.quote.preview + " ~" + data.quote.title);
			self.showPrayer(true);
		});
	};

	self.showAddMessage = function() {
		self.toggleReplyMessage(!self.toggleReplyMessage());
	};

	self.removePrayer = function() {
		self.prayer('');
		self.showPrayer(false);
	};

	self.drawChart = function() {
		respondCanvas();
	};

	self.sendSupport = function() {
		console.log(self.currentMessage());
		if(self.toggleReplyMessage() && $("#reply-message").val() != '') {
			$.post(app.server + '/sendmessage', {'messageID' : self.currentMessageID(), 'message' : $("#reply-message").val()}, function(data) {
				$("#reply-message").val('');
				self.toggleReplyMessage(false);
				$("#me-page-link").removeClass("ui-btn-active");
				$("#me-page-link").removeClass("ui-state-persist");
				$("#activity-page-link").addClass("ui-btn-active");
				$("#activity-page-link").addClass("ui-state-persist");
			}, "json");
		}
		if(self.showPrayer() && self.prayer() != '') {
			$.post(app.server + '/sendmessage', {'messageID' : self.currentMessageID(), 'message' : self.prayer()}, function(data) {
				self.prayer('');
				self.showPrayer(false);
				$("#me-page-link").removeClass("ui-btn-active");
				$("#me-page-link").removeClass("ui-state-persist");
				$("#activity-page-link").addClass("ui-btn-active");
				$("#activity-page-link").addClass("ui-state-persist");
			}, "json");
		}
		return true;
	};

	self.getInboxMessages = function() {
		self.inboxMessages.removeAll();
		$.getJSON(app.server + '/mymessages', function(data) {
			for(var i = 0; i < data.messages.length; i++) {
				self.inboxMessages.push(data.messages[i]);
			}
		});
	};

	self.goToMessage = function(message) {
		var messageID = message._id;
		self.currentMessageID(messageID);
		$.getJSON(app.server + '/getmessage?messageID=' + messageID, function(data) {
			self.currentReplies.removeAll(); 
			self.currentMessage(data["message"]["message"]);
			for (var i=0; i<data["message"]["replies"].length; i++)
				self.currentReplies.push(data["message"]["replies"][i]["message"]);
			$("#me-page-link").removeClass("ui-btn-active");
			$("#me-page-link").removeClass("ui-state-persist");
			$("#activity-page-link").addClass("ui-btn-active");
			$("#activity-page-link").addClass("ui-state-persist");
		});
		return true;
	};

	$(window).resize(respondCanvas);
	loadVM(init);
}
