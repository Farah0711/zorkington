const readline = require('readline');
const readlineInterface = readline.createInterface(process.stdin, process.stdout);

function ask(questionText) {
  return new Promise((resolve, reject) => {
    readlineInterface.question(questionText, resolve);
  });
}

const rooms = {
  start: {
    description: `182 Main St.\nYou are standing on Main Street between Church and South Winooski.\nThere is a door here. A keypad sits on the handle.\nOn the door is a handwritten sign.`,
    items: ['sign'],
    connections: { east: 'foyer' },
    locked: true,
    unlockCode: 'mellon'
  },
  foyer: {
    description: `You are in the foyer. There is a key on the floor.`,
    items: ['key'],
    connections: { west: 'start' },
    locked: false
  }
};

let player = {
  currentRoom: 'start',
  inventory: []
};

// Start the game
start();

async function start() {
  console.log(rooms[player.currentRoom].description);
  await handleCommand();
}

async function handleCommand() {
  let input = await ask('> ');
  let [command, ...rest] = input.trim().toLowerCase().split(' ');
  let target = rest.join(' ');
  let room = rooms[player.currentRoom];

  switch (command) {
    case 'read':
      if (target === 'sign' && room.items.includes('sign')) {
        console.log("The sign says: 'Speak friend and enter.'");
      } else {
        console.log("There is nothing to read.");
      }
      break;

    case 'say':
      if (target === room.unlockCode) {
        room.locked = false;
        console.log("You hear a click as the door unlocks.");
      } else {
        console.log("Nothing happens.");
      }
      break;

    case 'go':
      if (room.connections[target]) {
        const nextRoomKey = room.connections[target];
        const nextRoom = rooms[nextRoomKey];
        if (nextRoom.locked) {
          console.log("The door is locked.");
        } else {
          player.currentRoom = nextRoomKey;
          console.log(nextRoom.description);
        }
      } else {
        console.log("You can't go that way.");
      }
      break;

    case 'take':
      if (room.items.includes(target)) {
        player.inventory.push(target);
        room.items = room.items.filter(i => i !== target);
        console.log(`You take the ${target}.`);
      } else {
        console.log("That item isn't here.");
      }
      break;

    case 'drop':
      if (player.inventory.includes(target)) {
        player.inventory = player.inventory.filter(i => i !== target);
        room.items.push(target);
        console.log(`You drop the ${target}.`);
      } else {
        console.log("You're not carrying that.");
      }
      break;

    case 'inventory':
      if (player.inventory.length > 0) {
        console.log("You are carrying: " + player.inventory.join(', '));
      } else {
        console.log("You are not carrying anything.");
      }
      break;

    case 'exit':
    case 'quit':
      console.log("Thanks for playing!");
      readlineInterface.close();
      return;

    default:
      console.log("I don't understand that command.");
  }

  await handleCommand(); // Keep prompting
}

async function start() {
  const welcomeMessage = `182 Main St.
You are standing on Main Street between Church and South Winooski.
There is a door here. A keypad sits on the handle.
On the door is a handwritten sign.`;
  let answer = await ask(welcomeMessage);
  console.log('Welcome to Zorkington!');
  process.exit();
}
