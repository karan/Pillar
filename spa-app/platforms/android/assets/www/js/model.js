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
	console.log(barWidth)

	var drawBar = function(index, score, maxScore) {
		console.log("drawing");
		var x = index * barWidth;
		console.log(x);
		brush.drawRect({
			  fillStyle: '#000',
			  x: index * barWidth, 
			  y: brush.height(),
			  width: barWidth,
			  height: score * (brush.height() / maxScore)
		});
	};

	for(i = 0; i < data.length; i++) {
		drawBar(i, data[i].score, 50);
	}


	
}