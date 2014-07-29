var TimerJob = require('timer-jobs');

var someTimer = new TimerJob({interval: 600000}, function(done) {
  console.log(new Date());
  done();
});

console.log(new Date());
someTimer.start();