/** Can not alter ! **/
var TIMEOUT = 2000;

var c;
var out;

c = 0;

out = process.stdout;

process.on('exit', exit);

function exit() {
  out.write('1..');
  out.write(String(c));
  out.write('\n');
}

function ok(pbox, test) {
  if (arguments.length == 1) {
    clearTimeout(pbox.id);
    if (!pbox.notok) {
      out.write('ok\n');
      c++;
    }
    return;
  }

  try {
    test(ok.bind(null, pbox));
  } catch (e) {
    notok(pbox, e.stack);
  }
}

function notok(pbox, stack) {
  clearTimeout(pbox.id);
  pbox.ok = false;

  out.write('not ok ');
  
  if (stack) {
    out.write(String(stack));
  } else {
    out.write('hanger!');
  }

  out.write('\n');
  c++;
  process.exit();
}

function test(test) {
  var pbox;
  var notokid;

  pbox = {
    ok: 1,
    id: 0
  };

  pbox.id = setTimeout(notok, TIMEOUT, pbox);
  setTimeout(ok, 0, pbox, test);
}

module.exports = test;