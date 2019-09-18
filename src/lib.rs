use std::cmp::*;
use std::vec::*;

use wasm_bindgen::prelude::*;
use wasm_bindgen::JsValue;

#[wasm_bindgen]
pub fn new_game() -> Game {
  Game{
    events: Vec::new(),
  }
}

#[wasm_bindgen]
impl Game {
  pub fn handle_event(&mut self, timestamp: i32, value: i8, user: String) {
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

  pub fn draw(&self) -> JsValue {
    format!("{:?}", self.events).into()
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
  events: Vec<Event>,
}