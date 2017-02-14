/* mysql-live-select, MIT License ben@latenightsketches.com
   example.js - Use mysql < example.sql to get started */
var LiveMysql = require('./');

var settings = {
  host        : 'localhost',
  user        : 'root',
  password    : '!QAZ2wsx',
  database    : 'test',
  serverId    : 1,
  minInterval : 200
};

var liveConnection = new LiveMysql(settings);
  liveConnection.on('error', function(error){
    console.log('Error');
  });
  liveConnection.on('ready', function(){
    console.log('Server Ready');
  });

var table = 'test1';
var id = 11;

var svc1 = liveConnection.select(function(esc, escId){
  return (
    'select * from ' + escId(table)
    // + 'where `id`=' + esc(id)
  );
}, [ {
  table: table,
  condition: function(row, newRow){
    // Only refresh the results when the row matching the specified id is
    // changed.

    return true;

    // pjw return row.id === id
      // On UPDATE queries, newRow must be checked as well
    // pjw  || (newRow && newRow.id === id);
  }
} ]);

svc1.on('update', function(diff, data){
  // diff contains an object describing the difference since the previous update
  // data contains an array of rows of the new result set
  console.log(data);
  console.log('=========================================')
});


// stop은 있으나 다시 Resume하는 메소드는 없네
var test1 = true;
setTimeout(function () {
  console.log('call stop()');
  if(test1) {
    svc1.stop();
    test1 = false;
  }
},10000);

// active 함수는 stop인지 아닌지 확인하는 함수다
var test2 = true;
setTimeout(function(){
  console.log('call active()');
  if(test2) {
    svc1.active();
    test2 = false;
  }
},20000);
