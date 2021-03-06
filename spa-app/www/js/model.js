var DataPoint = function(stamp, value) {
	var self = this;
	self.score = value;
	self.timeStamp = stamp;

	//converts to a chart applicable data point
	self.toPoint = function() {

	};
}

var Chart = function(canvas, data, timeFrame, sample) {
	if(data.length == 0) {
		console.log("uh oh")
		return;
	}

	console.log(data);

	//out comes drawing on canvas
	var brush = $(canvas);
	brush.removeLayers();
	brush.attr('width', brush.width());
	brush.attr('height', brush.height());
	var padding = brush.width() / 25;

	var numBars = Math.max(5, data.length);
	/*var beginning = data[0].timeStamp;
	var end = data[data.length - 1].timeStamp;
	var span = end - beginning;*/
	var span = timeFrame;
	var barWidth = (brush.width() - 2 * padding)/ numBars;

	if(sample) {
		var opc = 0.5;
		brush.addLayer({
			type: 'text',
			name: 'hint',
			strokeStyle: '#000',
			strokeWidth: 2,
			text: 'Start recording your mood to see your data here.',
			x: padding + barWidth / 2,
			y: 1.5 * padding,
			fromCenter: false,
			fontSize: barWidth / 6,
			fontFamily: 'sans-serif'
		});

	} else {
		var opc = 1;
	}

	var drawLegend = function() {
		brush.addLayer({
			type: 'line',
			  strokeStyle: '#000',
			  strokeWidth: 2,
			  x1: padding, y1: 1.5 * padding,
			  x2: padding, y2: brush.height() - padding,
			  opacity: opc,
		});

		brush.addLayer({
			type: 'line',
			  strokeStyle: '#000',
			  strokeWidth: 2,
			  x1: 1.5 * padding, y1: brush.height() - padding + padding / 2,
			  x2: brush.width() - padding, y2: brush.height() - padding + padding / 2,
			  opacity: opc,
		});

		var faceSize = Math.max(0.75 * padding, 20);

		brush.addLayer({
			type: 'image',
			source: 'face.png',
			x: padding,
			y: brush.height() - 0.5 * padding,
			width: faceSize, height: faceSize,
			opacity: opc,
		})

		brush.addLayer({
			type: 'image',
			source: 'face2.png',
			x: padding,
			y: padding,
			width: faceSize, height: faceSize,
			opacity: opc,
		})
	};

	drawLegend();

	var lineObj = {
		type: 'line',
		  strokeStyle: '#FFF',
		  strokeWidth: 6,
		  rounded: true,
		  opacity: 0.3
	};

	var drawBar = function(index, score, maxScore, timeStamp) {
		var x = padding + barWidth / 2 + index * barWidth;
		var w = barWidth - 2 * barWidth / 10;
		var h = score * (brush.height() - padding - padding / 2)/ maxScore
		var y = brush.height() - h / 2 - padding;

		var date = new Date(timeStamp * 1000);

		var turnWhite = function(layers) {
			for(var i = 0; i < layers.length; i++) {
				if(layers[i].name != null && layers[i].fillStyle != 'rgb(255,255,255)') {
			  		brush.animateLayer(layers[i], {
			  			fillStyle: '#FFFFFF',
			  		}, 125);					
				}
			}
		};
		var toggle = function(layer) 
		{

			var layers = brush.getLayers();
			if(layer.fillStyle != 'rgb(255,255,255)') {
				var alreadyGreen = true;
			} else {
				var alreadyGreen = false;
			}
			turnWhite(layers);
			if(!alreadyGreen) {
				brush.removeLayer('label');
				brush.removeLayer('date');
		  		$(this).animateLayer(layer, {
		  			fillStyle: '#ABFF9F',
		  		}, 125);
		  		brush.drawText({
		  			layer: true,
					name: 'label',
					fillStyle: '#000000',
					fontSize: brush.height() / 15,
					x: x,
					y: y - h / 2 - brush.height() / 15,
					strokeWidth: 2,
					text: "" + score,
					opacity: opc,
				});
				brush.drawText({
		  			layer: true,
					name: 'date',
					fillStyle: '#000000',
					fontSize: Math.max(barWidth / 4, 20),
					x: x,
					y: y,
					strokeWidth: 2,
					text: (date.getMonth() + 1) + "/" + date.getDate(),
					opacity: opc,
				});
				brush.drawLayers();
				
			} else {
				brush.removeLayer('label');
				brush.removeLayer('date');
			}

		};

		// Create and draw a rectangle layer
		brush.addLayer({
			type: 'rectangle',
			  layer: true,
			  name: 'bar' + index,
			  fillStyle: '#FFFFFF',
			  x: x, y: y,
			  width: w, height: h,
			  opacity: opc,

			  click: toggle
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
			  width: barWidth / 8, height: barWidth / 8,
			  opacity: opc,
		});
	};
	var now = new Date();
	if(timeFrame == 1) {
		now.setDate(now.getDate() - 7);
	} else if (timeFrame == 2) {
		now.setMonth(now.getMonth() - 1); 
	} else {
		now.setYear(now.getYear() - 1);
	}
	var L = now.getTime() / 1000;

	var rangeData = []
	for(i = 0; i < data.length; i++) {
		if(data[i].timeStamp >= L) {
			rangeData.push(data[i]);
		}
	}

	for(i = 0; i < rangeData.length; i++) {
		drawBar(i, data[i].score, 50, data[i].timeStamp);
	}

	brush.addLayer(lineObj);

	brush.drawLayers();



	
}
