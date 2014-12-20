// Free to distribute.
// Green dice images created by me, other dice images as referenced from https://github.com/morval/Descent-Second-Edition-Dice-for-Roll20

// Usage: !d2e dicetoroll
// Where dice are a string with one letter per die.
// Attacking dice are first letter of the color, lowercase: bryg
// Defending dice are first letter (last for black), uppercase: BGK

// An example attack roll would be !d2e brG
// An attribute test is: !d2e GK

var D2E = {
  COMMAND : "!d2",
  COMMAND_DEBUG : "!d2debug",

  DICE : { // X: Miss, n: Range, d: Damage, s: Surge, S: Shield
    'b' : ["X", "nndds", "nnndd", "nnnndd", "nnnnnd", "nnnnnnds"],
    'r' : ["d",  "dd", "dd",  "dd", "ddd", "ddds"],
    'y' : ["ns", "nd", "nnd", "ds", "dd",  "dds"],
    'g' : ["d",  "s",  "ds",  "nd", "ns",  "nds"],

    'B' : ["", "",   "",   "S",  "S",   "SS"],
    'G' : ["", "S",  "S",  "S",  "SS",  "SSS"],
    'K' : ["", "SS", "SS", "SS", "SSS", "SSSS"]
  },

  DICEGFX : {
    // http://i.imgur.com/XXXXXXX.jpg
    'b' : ["NQzQX9O", "3tJnFkm", "HrANNCa", "G31lrYI", "vEe8aCz", "oG0iyuW"],
    'r' : ["TgWWCHD", "JgkNETH", "JgkNETH", "JgkNETH", "W8Mj4df", "3ccGAAC"],
    'y' : ["QaqiNPP", "rrgtxLg", "pwsMA2M", "7d6J5wP", "8Y5PfIb", "v0Tp4gH"],
    'g' : ["FV1PINKb","QLos2XTb","8ygsNOGb","LtJA7ADb","Pxes5fIb","TIxTZLwb"],
    'B' : ["EgDD7GQ", "EgDD7GQ", "EgDD7GQ", "Q5DQDdM", "Q5DQDdM", "alB8co8"],
    'G' : ["2kYkg7r", "p09XoyC", "p09XoyC", "p09XoyC", "6SYfN9m", "3nTbmZe"],
    'K' : ["gvf1A3J", "wipCzxj", "wipCzxj", "wipCzxj", "fmcImHZ", "sWc18QA"]
  },

  ICONS : {
    // http://i.imgur.com/XXXXXXX.jpg
    'X' : "aCkmmkc", 'd' : "ycOgTiP", 's' : "ZRODaNF", 'S' : "47ebIC5"
  }
};

on("chat:message", function(msg) {
  d2eHandle(msg.content, msg.who);
});

function d2eHandle(command, who) {
  var argv = command.split(" ");

  if (argv[0] === D2E.COMMAND) {
    var dice = d2eRoll(argv[1]);
    var icons = d2eRenderDice(dice);
    var score = d2eScore(dice);
    sendChat(who, "/em Rolls the dice...");
    sendChat("", "/direct " + icons + "<br>" + score);
  }

  if (argv[0] === D2E.COMMAND_DEBUG) {
    ["b","r","y","g","B","G","K"].map(function(color) {
      var sides = [0,1,2,3,4,5].map(function(side) {
        return d2eImage(D2E.DICEGFX[color][side], 20);
      }).join("");
      sendChat("", "/direct " + sides);
    });
  }
}

function d2eRoll(argv) {
  return argv.split("").map(function(die) {
    return [die, Math.floor((Math.random() * 6))];
  });
}

function d2eRenderDice(dice) {
  return dice.map(function(die) {
    return d2eImage(D2E.DICEGFX[die[0]][die[1]], 35);
  }).join("");
}

function d2eScore(dice) {
  var miss   = d2eCount(dice, "X");
  var range  = d2eCount(dice, "n");
  var damage = d2eCount(dice, "d");
  var surge  = d2eCount(dice, "s");
  var shield = d2eCount(dice, "S");

  var hit = "";
  if (miss > 0) { hit = "MISS! "; }

  return hit + range + " " +
    d2eIconize(damage-shield, 'd') +
    d2eIconize(shield-damage, 'S') +
    d2eIconize(surge, 's');
}

function d2eCount(ary, char) {
  var count = 0;
  ary.map(function(die) {
    D2E.DICE[die[0]][die[1]].split("").map(function(c) {
      if (c === char) {
        count += 1;
      }
    });
  });
  return count;
}

function d2eIconize(count, char) {
  if (count < 1) { return ""; }

  var image = d2eImage(D2E.ICONS[char], 12);
  return new Array(count+1).join(image);
}

function d2eImage(file, size) {
  return '<img src="http://i.imgur.com/'+file+'.jpg" height="'+size+'" width="'+size+'">'
}
