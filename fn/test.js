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

function ok(pbox) {
  clearTimeout(pbox.notokid);
  if (pbox.ok) {
    out.write('ok\n');
    c++;
  }
  return;
}

function run(pbox, test) {
  try {
    pbox.test(ok.bind(null, pbox));
  } catch (e) {
    pbox.stack = e.stack.replace(/^\s+/gmi, ' ');
    notok(pbox);
  }
}

function notok(pbox) {
  clearTimeout(pbox.notokid);
  pbox.ok = false;

  out.write('not ok ');

  if (pbox.stack) {
    out.write(String(pbox.stack));
  } else {
    out.write('hanger:\n');
    out.write(pbox.test.toString().replace(/^/gmi, ' '));
  }

  out.write('\n');
  c++;
  process.exit();
}

function test(test) {
  var pbox;

  pbox = {
    ok: 1,
    notokid: 0,
    test: test,
    stack: null
  };

  pbox.notokid = setTimeout(notok, TIMEOUT, pbox);
  setTimeout(run, 0, pbox);
}

module.exports = test;