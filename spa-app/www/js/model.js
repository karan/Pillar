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


	var beginning = data[0].timeStamp;
	var end = data[data.length - 1].timeStamp;
	var span = end - beginning;
	var barWidth = brush.width() / data.length;

	var lineObj = {
		  strokeStyle: '#000',
		  strokeWidth: 6,
		  rounded: true
	};

	var drawBar = function(index, score, maxScore) {
		console.log("drawing");
		var x = barWidth / 2 + index * barWidth;
		var y = brush.height();
		var w = barWidth - 2 * barWidth / 10;
		var h = score * (brush.height() / maxScore)

		console.log(x);
		brush.drawRect({
			  fillStyle: '#ABFF9F',
			  x: x, 
			  y: y,
			  width: w,
			  height: h,
			  cornerRadius: 10
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