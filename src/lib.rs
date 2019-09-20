use std::cmp::*;
use std::vec::*;

use wasm_bindgen::prelude::*;
use wasm_bindgen::JsValue;

#[wasm_bindgen]
pub fn new_game() -> Game {
  Game{
    players: Vec::new(),
    events: Vec::new(),
  }
}

#[wasm_bindgen]
impl Game {
  pub fn handle_event(&mut self, timestamp: i32, value: i8, user: String) {
    self.register_player(&user);
    self.events.push(Event{
      timestamp: timestamp,
      value: value,
      user: user,
    });

    self.events.sort_by(|a, b| {
      let diff = a.timestamp.partial_cmp(&b.timestamp).unwrap();
      match diff {
        Ordering::Equal => a.user.partial_cmp(&b.user).unwrap(),
        _ => diff,
      }
    });
  }

  pub fn draw(&self, now: i32) -> Vec<i32> {
    let players = self.players.iter();
    players.map(|id| {
      let mut evts = self.events.iter().filter(|evt| &evt.user == id);

      let first_evt = evts.next();
      if first_evt.is_none() {
        return 500;
      }

      let (last_evt, x) = evts.fold((first_evt.unwrap(), 500), |(prev_evt, x), evt| (evt, x + (prev_evt.value as i32) * (evt.timestamp - prev_evt.timestamp) / 40));
      (x + (last_evt.value as i32) * (now - last_evt.timestamp) / 40)
    }).collect()
  }

  fn register_player(&mut self, id: &String) {
    if !self.players.contains(id) {
      self.players.push(id.clone());
    }
  }
}

#[wasm_bindgen]
#[derive(Debug)]
struct Event {
  timestamp: i32,
  value: i8,
  user: String,
}

#[wasm_bindgen]
pub struct Game {
  players: Vec<String>,
  events: Vec<Event>,
}
