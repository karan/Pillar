var DataPoint = function(stamp, value) {
	var self = this;
	self.score = value;
	self.timeStamp = stamp;

	//converts to a chart applicable data point
	self.toPoint = function() {

	};
}

var Chart = function(canvas, data, timeFrame) {
	if(data.length == 0) {
		return;
	}
	console.log(timeFrame);
	//timeframe == 1 if last week, 2 if last month, 3 if last year

	//out comes drawing on canvas
	var brush = $(canvas);
	brush.attr('width', brush.width());
	brush.attr('height', brush.height());
	var padding = brush.width() / 25;

	var beginning = data[0].timeStamp;
	var end = data[data.length - 1].timeStamp;
	var span = end - beginning;
	var barWidth = (brush.width() - 2 * padding)/ data.length;

	var drawLegend = function() {
		brush.addLayer({
			type: 'line',
			  strokeStyle: '#000',
			  strokeWidth: 2,
			  x1: padding, y1: 1.5 * padding,
			  x2: padding, y2: brush.height() - padding,
		});

		brush.addLayer({
			type: 'line',
			  strokeStyle: '#000',
			  strokeWidth: 2,
			  x1: 1.5 * padding, y1: brush.height() - padding + padding / 2,
			  x2: brush.width() - padding, y2: brush.height() - padding + padding / 2,
		});

		brush.addLayer({
			type: 'ellipse',
			  fillStyle: '#ABFF9F',
			  x: padding, 
			  y: brush.height() - 0.5 * padding,
			  width: barWidth / 6, height: barWidth / 6
		});

		brush.addLayer({
			type: 'ellipse',
			  fillStyle: '#ABFF9F',
			  x: padding, 
			  y: padding,
			  width: barWidth / 6, height: barWidth / 6
		});
	};

	drawLegend();

	var lineObj = {
		type: 'line',
		  strokeStyle: '#FFF',
		  strokeWidth: 6,
		  rounded: true,
		  opacity: 0.3
	};

	var drawBar = function(index, score, maxScore) {
		var x = padding + barWidth / 2 + index * barWidth;
		var w = barWidth - 2 * barWidth / 10;
		var h = score * (brush.height() - padding - padding / 2)/ maxScore
		var y = brush.height() - h / 2 - padding;

		// Create and draw a rectangle layer
		brush.addLayer({
			type: 'rectangle',
			  layer: true,
			  name: 'bar' + index,
			  fillStyle: '#FFF',
			  x: x, y: y,
			  width: w, height: h,
			  cornerRadius: 10,
			  data: {
			  	selected: false,
			  },

			  click: function(layer) {
			  	console.log("clicked")
			  	brush.drawLayers();
			  }
		});

		drawPoint(x, y, h, barWidth);

		lineObj['x' + (index + 1)] = x;
		lineObj['y' + (index + 1)] = y - h/2;


	};

	var drawPoint = function(x, y, h, barWidth) {
		brush.addLayer({
			type: 'ellipse',
			  fillStyle: '#000',
			  x: x, 
			  y: y - h/2,
			  width: barWidth / 8, height: barWidth / 8
		});
	};

	for(i = 0; i < data.length; i++) {
		drawBar(i, data[i].score, 50);
	}
	brush.addLayer(lineObj);




	brush.drawLayers();



	
}