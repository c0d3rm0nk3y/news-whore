var TimerJob = require('timer-jobs');

var someTimer = new TimerJob({interval: 60000}, function(done) {
  console.log(new Date());
  done();
});

someTimer.start();