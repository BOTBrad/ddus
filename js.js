let peer = new Peer();
let conn = null;

const greet = () => {
  if (!conn) {
    return;
  }

  conn.send('connected');
};

const dataDiv = document.getElementById('data');

let handleData = (data) => {
  dataDiv.appendChild(document.createTextNode(''+data));
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
};

a
peer.on('connection', setupConnection);

const otherSubmit = () => {
  setupConnection(peer.connect(document.getElementById('other-id').value));
};

document.onkeypress = (k) => {
  if (conn) {
    key = k.key;
    handleData(key)
    conn.send(key);
  }
}; 