var DataPoint = function(stamp, value) {
	var self = this;
	self.score = value;
	self.timeStamp = stamp

	//converts to a chart applicable data point
	self.toPoint = function() {

	};
}

var Chart = function(canvas, data) {
	//out comes drawing on canvas
	var brush = $(canvas);
	brush.attr('width', brush.width());
	brush.attr('height', brush.height());

	var axes_padding = 50;

	var beginning = data[0].timeStamp;
	var end = data[data.length - 1].timeStamp;
	var span = end - beginning;
	var barWidth = (brush.width() - axes_padding)/ data.length;


	var lineObj = {
		  strokeStyle: '#FFF',
		  strokeWidth: 6,
		  rounded: true,
		  opacity: 0.3
	};

	var drawBar = function(index, score, maxScore) {
		console.log("drawing");
		var x = axes_padding + barWidth / 2 + index * barWidth;
		var w = barWidth - 2 * barWidth / 10;
		var h = score * (brush.height() - axes_padding - axes_padding / 2)/ maxScore
		var y = brush.height() - h / 2 - axes_padding;


		console.log(x);
		brush.drawRect({
			  fillStyle: 'FFF',
			  x: x, 
			  y: y,
			  width: w,
			  height: h,
			  cornerRadius: 10,
			  click: function(layer) {
			  	$(this).animateLayer(0, {
			  		fillStyle: '#ABFF9F'
			  	});
			  }
		});

		brush.drawEllipse({
			  fillStyle: '#000',
			  x: x, 
			  y: y - h/2,
			  width: 25, height: 25
		});

		lineObj['x' + (index + 1)] = x;
		lineObj['y' + (index + 1)] = y - h/2;
	};



	for(i = 0; i < data.length; i++) {
		drawBar(i, data[i].score, 50);
	}

	brush.drawLine(lineObj);


	
}