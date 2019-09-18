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

  start = Date.now();
  conn.send('connected');
};

const dataDiv = document.getElementById('data');

let handleData = (data) => {
  const {timestamp, value, user} = data;
  if (timestamp) {
    events.push({timestamp:timestamp, value:value, user: user});
    sortEvents();
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

  conn = newConn

  conn.on('open', greet);
  conn.on('data', handleData);
  conn.on('error', (error) => console.error(error));
};


peer.on('connection', setupConnection);

const otherSubmit = () => {
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

const getValue = () => {
  events.push({timestamp: Date.now()});
  let x = 500;
  let lastEvt;
  events.forEach((evt) => {
    if (!lastEvt) {
      lastEvt = evt;
      return;
    }

    let vel = lastEvt.value * (evt.timestamp - lastEvt.timestamp) / 40;
    x += vel;

    lastEvt = evt;
  });
  events.pop();

  return x;
};

let box = document.getElementById('box');

const repeat = () => {
  box.style.width = '20px';
  box.style.height = '20px';
  box.style.backgroundColor = 'red';
  box.style.marginLeft = getValue() + 'px';

  window.requestAnimationFrame(repeat);
}

repeat();