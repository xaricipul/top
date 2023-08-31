var students = [];
var nameTimer;
var lastWinner;
var lastWinnerName;
var addName = function () {
  var names = [
    'John',
    'Emily',
    'Michael',
    'Sophia',
    'David',
    'Olivia',
    'Daniel',
    'Emma',
    'Matthew',
    'Ava'
  ];

  var randomIndex = Math.floor(Math.random() * names.length);
  var name = names[randomIndex];

  students.push({ name: name, image: 'https://content.presspage.com/uploads/2170/1920_sadfaceemoji.jpg' });
  console.log(name + ' added to students array.');

  // Update the wheel
  wheel.update();
};

var countdown = function () {
  var counter = 10;
  var countdownTimer = setInterval(function () {
    console.log(counter);
    counter--;

    var counterElement = document.getElementById('counter');

    counterElement.innerHTML = "Oyunun başlamasına son " + counter--  + " saniyə";

    if (counter <= 0) {
      clearInterval(countdownTimer);
      counterElement.innerHTML =  "Oyun başladı";

      // Stop adding names
      clearInterval(nameTimer);
      console.log('Name addition stopped.');

      wheel.spin();

      setTimeout(function () {
        var winnerIndex = Math.floor(Math.random() * wheel.segments.length);

        // Reset everything after 3 seconds
        setTimeout(function () {
          // Clear students array
          students = [];

          // Reset wheel
          wheel.segments = [];
          wheel.angleCurrent = 0;
          wheel.draw();
          console.log('Wheel reset.');

          // Restart countdown
          countdown();
        }, 3000); // Wait 3 seconds before resetting everything
      }, 5000); // Wait 5 seconds after wheel stops spinning to determine the winner
    }
  }, 1000);

  // Automatically add names every 2 seconds during the countdown
  nameTimer = setInterval(addName, 2000);
};

countdown();

// Rest of the code remains the same...


var shuffle = function (o) {
  for (var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
  return o;
};

var hashCode = function (string) {
  // See http://www.cse.yorku.ca/~oz/hash.html
  var hash = 5381;
  for (i = 0; i < string.length; i++) {
    var char = string.charCodeAt(i);
    hash = ((hash << 5) + hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
};

var mod = function (a, b) {
  return ((a % b) + b) % b;
};

$(function () {
  var studentContainer = $('#students ul');
  students.forEach(function (student) {
    var name = student.name;
    studentContainer.append(
      $(document.createElement('li')).append(
        $(document.createElement('input')).attr({
          id: 'student-' + name,
          name: name,
          value: name,
          type: 'checkbox',
          checked: true
        }).change(function () {
          var cbox = $(this)[0];
          var segments = wheel.segments;
          var i = segments.indexOf(cbox.value);

          if (cbox.checked && i == -1) {
            segments.push(cbox.value);

          } else if (!cbox.checked && i != -1) {
            segments.splice(i, 1);
          }

          segments.sort();
          wheel.update();
        })
      ).append(
        $(document.createElement('label')).attr({
          'for': 'student-' + name
        }).text(name)));
  });

  $('#students ul>li').tsort('input', {
    attr: 'value'
  });

  var segments = [];
  $.each($('#students input:checked'), function (key, cbox) {
    segments.push(cbox.value);
  });

  wheel.segments = segments;
  wheel.init();
  wheel.update();

  // Hide the address bar (for mobile devices)!
  setTimeout(function () {
    window.scrollTo(0, 1);
  }, 0);
});
var wheelSpinning = false;
var wheel = {
  angleCurrent: 0,
  angleDelta: 0,
  canvasContext: null,
  centerX: 300,
  centerY: 300,
  colorCache: [],
  downTime: 2000,
  frames: 0,
  maxSpeed: Math.PI / 16,
  segments: [],
  size: 290,
  spinStart: 0,
  timerDelay: 33,
  timerHandle: 0,
  upTime: 1000,

  spin: function () {
    // Start the wheel only if it's not already spinning
    if (wheel.timerHandle === 0) {
      wheel.spinStart = new Date().getTime();
      wheel.maxSpeed = Math.PI / (16 + Math.random() * 10); // Randomly vary how hard the spin is
      wheel.frames = 0;
      wheel.timerHandle = setInterval(wheel.onTimerTick, wheel.timerDelay);
    }
  },
  determineWinner: function () {
    var segments = wheel.segments;
    var index = wheel.segments.length - Math.floor((wheel.angleCurrent / (Math.PI * 2)) * wheel.segments.length) - 1;
    var winner = segments[index];
    var centerX = wheel.centerX;
    var centerY = wheel.centerY;
    var ctx = wheel.canvasContext;
    lastWinner = students[index].image;
    lastWinnerName = students[index].name;
    
    var counterElement = document.getElementById('counter');
    console.log('Segment: ' + index + ' | Winner: ' + winner);
    counterElement.innerHTML = "Oyunun qalibi " + lastWinnerName;
    var imageRadius = 60; // Resim daire çapı için yarıçap değeri (ayarlamak istediğiniz boyuta göre değiştirin)
    var x = centerX - imageRadius;
    var y = centerY - imageRadius;
  
    // Resmi çiz
    var winnerImage = new Image();
    winnerImage.src = lastWinner;
    winnerImage.onload = function () {
      drawCircularImage(ctx, winnerImage, x, y, imageRadius);
    };
     // Function to draw a circular image on the canvas
     function drawCircularImage(context, image, x, y, radius) {
      context.save(); // Save the current context state
      context.beginPath();
      context.arc(x + radius, y + radius, radius, 0, Math.PI * 2, true); // Create a circular path
      context.closePath();
      context.clip(); // Clip the context to the circular path
    
      context.drawImage(image, x, y, radius * 2, radius * 2); // Draw the image within the circular path
    
      context.restore(); // Restore the previous context state
    }
  },
  
 
  
  
  
  onTimerTick: function () {
    wheel.frames++;
    wheel.draw();

    var duration = (new Date().getTime() - wheel.spinStart);
    var progress = 0;
    var finished = false;

    if (duration < wheel.upTime) {
      progress = duration / wheel.upTime;
      wheel.angleDelta = wheel.maxSpeed * Math.sin(progress * Math.PI / 2);
    } else {
      progress = duration / wheel.downTime;
      wheel.angleDelta = wheel.maxSpeed * Math.sin(progress * Math.PI / 2 + Math.PI / 2);
      if (progress >= 1) {
        finished = true;
      }
    }

    wheel.angleCurrent += wheel.angleDelta;
    while (wheel.angleCurrent >= Math.PI * 2)
      // Keep the angle in a reasonable range
      wheel.angleCurrent -= Math.PI * 2;

      if (finished) {
        clearInterval(wheel.timerHandle);
        wheel.timerHandle = 0;
        wheel.angleDelta = 0;
    
        $('#counter').html((wheel.frames / duration * 1000) + ' FPS');
    
        // Kazananı belirle ve ekrana yazdır
        wheel.determineWinner();
      }
  },

  init: function (optionList) {
    try {
      wheel.initWheel();
      wheel.initCanvas();
      wheel.draw();
      $.extend(wheel, optionList);
    } catch (exceptionData) {
      alert('Wheel is not loaded ' + exceptionData);
    }
  },

  initCanvas: function () {
    var canvas = $('#wheel #canvas').get(0);
    canvas.addEventListener('click', wheel.spin, false);
    wheel.canvasContext = canvas.getContext('2d');
  },

  initWheel: function () {
    shuffle(spectrum);
  },

  update: function () {
    var segments = [];
    for (var i = 0; i < students.length; i++) {
      segments.push(students[i].name);
    }

    var len = segments.length;
    var colorLen = spectrum.length;

    // Calculate start angles for segments
    var angle = (2 * Math.PI) / len;
    var startAngle = (3 * Math.PI) / 2 - angle / 2;

    var colorCache = [];
    for (var i = 0; i < len; i++) {
      var color = spectrum[mod(hashCode(segments[i]), colorLen)];
      colorCache.push(color);
    }
    wheel.colorCache = colorCache;
    wheel.segments = segments;
    wheel.angleCurrent = startAngle; // Update the start angle
    wheel.draw();
  },

  draw: function () {
    wheel.clear();
    wheel.drawWheel();
    wheel.drawNeedle();
  },

  clear: function () {
    var ctx = wheel.canvasContext;
    ctx.clearRect(0, 0, 1000, 800);
  },

  drawNeedle: function () {
    var ctx = wheel.canvasContext;
    var centerX = wheel.centerX;
    var centerY = wheel.centerY;
    var size = wheel.size;

    ctx.lineWidth = 1;
    ctx.strokeStyle = '#000000';
    ctx.fillStyle = '#ffffff';

    ctx.beginPath();
    ctx.moveTo(centerX + size - 40, centerY);
    ctx.lineTo(centerX + size + 20, centerY - 10);
    ctx.lineTo(centerX + size + 20, centerY + 10);
    ctx.closePath();

    ctx.stroke();
    ctx.fill();

    if (wheelSpinning) {
      // Determine the segment being pointed to
      var i = wheel.segments.length - Math.floor((wheel.angleCurrent / (Math.PI * 2)) * wheel.segments.length) - 1;

      // Draw the winning name
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#000000';
      ctx.font = '2em Arial';
      ctx.fillText(wheel.segments[i], centerX + size + 25, centerY);
    } else {
      // Draw the last winner's image
      var imageRadius = 60; // Adjust the radius value based on the desired size of the circular image

      var x = centerX - imageRadius;
      var y = centerY - imageRadius;

      var winnerImage = new Image();
      winnerImage.src = lastWinner;
      winnerImage.onload = function () {
        drawCircularImage(ctx, winnerImage, x, y, imageRadius);
      };

      function drawCircularImage(context, image, x, y, radius) {
        context.save();
        context.beginPath();
        context.arc(x + radius, y + radius, radius, 0, Math.PI * 2, true);
        context.closePath();
        context.clip();
        context.drawImage(image, x, y, radius * 2, radius * 2);
        context.restore();
      }
    }
  },
  drawSegment: function (key, lastAngle, angle) {
    var ctx = wheel.canvasContext;
    var centerX = wheel.centerX;
    var centerY = wheel.centerY;
    var size = wheel.size;
    var value = wheel.segments[key];

    ctx.save();
    ctx.beginPath();

    // Start in the centre
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, size, lastAngle, angle, false); // Draw an arc around the edge
    ctx.lineTo(centerX, centerY); // Now draw a line back to the center
    // Clip anything that follows to this area
    // ctx.clip(); // It would be best to clip, but we can double performance without it
    ctx.closePath();

    ctx.fillStyle = wheel.colorCache[key];
    ctx.fill();
    ctx.stroke();

    // Now draw the text
    ctx.save(); // The save ensures this works on Android devices
    ctx.translate(centerX, centerY);
    ctx.rotate((lastAngle + angle) / 2);

    ctx.fillStyle = '#000000';
    ctx.fillText(value.substr(0, 20), size / 2 + 20, 0);
    ctx.restore();

    ctx.restore
  },

  drawWheel: function () {
    var ctx = wheel.canvasContext;

    var angleCurrent = wheel.angleCurrent;
    var lastAngle = angleCurrent;

    var len = wheel.segments.length;

    var centerX = wheel.centerX;
    var centerY = wheel.centerY;
    var size = wheel.size;

    var PI2 = Math.PI * 2;

    ctx.lineWidth = 1;
    ctx.strokeStyle = '#000000';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.font = '1.4em Arial';

    for (var i = 1; i <= len; i++) {
      var angle = PI2 * (i / len) + angleCurrent;
      wheel.drawSegment(i - 1, lastAngle, angle);
      lastAngle = angle;
    }

    // Draw a center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 60, 0, PI2, false); // Yarıçap 60 olarak değiştirildi
    ctx.closePath();

    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#000000';
    ctx.fill();
    ctx.stroke();

    // Draw the outer circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, size, 0, PI2, false);
    ctx.closePath();

    ctx.lineWidth = 10;
    ctx.strokeStyle = '#000000';
    ctx.stroke();
  }
};

var spectrum = ['#A2395B', '#A63552', '#AA3149', '#AE2D40', '#B22937', '#A23A53', '#924B6F', '#825C8B', '#6F6DA7', '#A63570', '#AC2F5A', '#B22944', '#B8232E', '#C11C17', '#A72A37', '#8D3857', '#734677', '#575597', '#A6358C', '#B43B6A', '#C24148', '#D04726', '#DE5003', '#B84D24', '#924A45', '#6C4766', '#434187', '#A650A0', '#B55A80', '#C46460', '#D36E40', '#E27A1D', '#B26331', '#824C45', '#523559', '#1F1D6D', '#A660AC', '#B67288', '#C68464', '#D69640', '#E6AA19', '#BC892E', '#926843', '#684758', '#3B256D', '#A670B8', '#B8878E', '#CA9E64', '#DCB53A', '#EFCE10', '#C8A628', '#A17E40', '#7A5658', '#502E72', '#80529A', '#98777A', '#B09C5A', '#C8C13A', '#E0E61A', '#C8C13A', '#B09C5A', '#98777A', '#80529A', '#502E72', '#675860', '#7E824E', '#95AC3C', '#ACD62A', '#ABBD4D', '#AAA470', '#A98B93', '#A670B8', '#3B256D', '#4C4D60', '#5D7553', '#6E9D46', '#80C837', '#89AE54', '#929471', '#9B7A8E', '#A660AC', '#1F1D6D']
