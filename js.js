import * as wasm from './pkg/ddus.js';

let game;
async function run() {
  await wasm.default();
  game = wasm.new_game();
  console.log('ready');
}

run();

let peer = new Peer();
let conn = null;

let events = [];

peer.on('error', (error) => console.error(error));

const sortEvents = () => {
  events.sort((a, b) => {
    const timediff = a.timestamp - b.timestamp;
    if (timediff !== 0 ) {
      return timediff;
    }

    return a.user < b.user;
  });
}

const greet = () => {
  if (!conn) {
    return;
  }

  conn.send('connected');
};

let handleData = (data) => {
  const {timestamp, value, user} = data;
  if (timestamp) {
    events.push({timestamp:timestamp, value:value, user: user});
    sortEvents();

    if (!game) {
      return;
    }

    game.handle_event(timestamp, value, user);
  } else {
    console.log(data);
  }
};

peer.on('open', () => {
  document.getElementById('your-id').appendChild(document.createTextNode(peer.id));
});

const setupConnection = (newConn) => {
  if (!!conn) {
    conn.close();
  }

  conn = newConn;

  conn.on('open', greet);
  conn.on('data', handleData);
  conn.on('error', (error) => console.error(error));
};


peer.on('connection', setupConnection);

document.getElementById('form').onsubmit = () => {
  setupConnection(peer.connect(document.getElementById('other-id').value));
};

const keys = {
  'a': -1,
  'd': 1,
};

document.onkeypress = (k) => {
  const dir = keys[k.key];
  if (!conn || !dir) {
    return;
  }

  const evt = {
    timestamp: Date.now(),
    value: dir,
    user: peer.id,
  }

  handleData(evt);
  conn.send(evt);
};

const getValues = () => {
  if (!game) {
    return [500, 500];
  }

  const ids = game.draw(Date.now());
  if (ids.length < 2) {
    return [500, 500];
  }

  return ids;
};

let box1 = document.getElementById('p1');
let box2 = document.getElementById('p2');

const repeat = () => {
  const styler = (box, x) => {
    box.style.width = '20px';
    box.style.height = '20px';
    box.style.backgroundColor = 'red';
    box.style.marginLeft = x + 'px';
  };

  let vals = getValues();

  styler(box1, vals[0]);
  styler(box2, vals[1]);

  window.requestAnimationFrame(repeat);
}

repeat();
