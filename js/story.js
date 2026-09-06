// Story cards for the Orbit Tour, in silent-film title-card voice.
// Zones are matched to campaign.js by id. Edit freely.
export const STORY = {
  "prologue": [
    "Orbit Station. The departure gate. A ticket in your hand, punched once.",
    "The Projectionist's master reel is missing. Seven frames. Seven Keepers.",
    "One other ticket was punched tonight. Cyril Spool. Collector. He is already aboard.",
    "Collect the frames. Restore the Grand Premiere. Mind the gap."
  ],
  "epilogue": [
    "The Grand Premiere runs once. Seven frames, one loop, no marquee needed.",
    "The lamp dims. Spool leaves the gloves on the bench. Somebody else will need them.",
    "Down the iron stairs. The departure gate. The clock has moved one minute.",
    "A ticket in your hand, punched twice. The train is boarding. Where to, this time?"
  ],
  "zones": [
    {
      "id": "inkwell",
      "name": "Inkwell Alley",
      "place": "A crooked lane where the ink never quite dries.",
      "tagline": "Out of the inkwell, into the tour.",
      "keeper": {
        "name": "Ada Inkpen",
        "title": "Head Animator",
        "intro": "Ada Inkpen. Head Animator. Draws six things at once and finishes none of them.",
        "taunt": "I drew every chip in your hand. I know where the lines are weak.",
        "beaten": "Well drawn. Take the frame. Mind the wet edge."
      },
      "spar": {
        "name": "Smudge",
        "line": "Draw me again. I liked the last one."
      },
      "challenges": [
        {
          "name": "Bouncing Ball",
          "kicker": "NOTHING FANCY. FOLLOW ALONG.",
          "opponent": "Inky Della",
          "line": "Every chip I play is a note. Keep up."
        },
        {
          "name": "Pen and Eraser",
          "kicker": "NO POWERS. JUST POINTS.",
          "opponent": "The Eraser",
          "line": "Whatever you draw, I undraw."
        }
      ],
      "arrive": [
        "Inkwell Alley. The walls drip. Somewhere a pen scratches.",
        "A roadster idles at the curb. White gloves on the wheel. 'Cyril Spool. Collector.'",
        "'Seven frames. One binder. Race you.' He does not wait for an answer."
      ],
      "midway": [
        "Ada Inkpen's studio is up the stairs. The stairs are still being drawn.",
        "Every chip you play here leaves a smudge on the wall. The wall keeps score."
      ],
      "beforeKeeper": [
        "The top floor. Ink to the ceiling. A frame pinned above the desk, still wet."
      ],
      "afterKeeper": [
        "Frame One. A clown climbs out of a bottle, mid-wave.",
        "The alley dries behind you. Onward, to salt water."
      ]
    },
    {
      "id": "docks",
      "name": "Sweethaven Docks",
      "place": "A harbour town that smells of tar, spinach and trouble.",
      "tagline": "Strong to the finish.",
      "keeper": {
        "name": "Captain Marlin Gale",
        "title": "Harbourmaster",
        "intro": "Captain Marlin Gale. Harbourmaster. Sank four ships and blames the sea for each.",
        "taunt": "Tide's against you, sprout. Tide's always against you.",
        "beaten": "Blow me down. Take the frame. Keep it dry."
      },
      "spar": {
        "name": "Deckhand Dory",
        "line": "Lose to me all you like. The tide keeps no score."
      },
      "challenges": [
        {
          "name": "Spinach Rations",
          "kicker": "ONE BLUE. MAKE IT COUNT.",
          "opponent": "First Mate Brine",
          "line": "One tin per crew. Choose your sailor."
        },
        {
          "name": "Rough Water",
          "kicker": "BACK ROW PAYS. HOLD ON.",
          "opponent": "The Sea Cook",
          "line": "Deck's pitching. Chips at the stern hold best."
        }
      ],
      "arrive": [
        "Sweethaven Docks. Gulls, ropes, a foghorn clearing its throat.",
        "Frame One rides in your pocket. It is warm. That is odd, for a frame.",
        "No sign of the roadster. Salt air does the gloves no favours."
      ],
      "midway": [
        "The Captain's frame is in the lighthouse. The lighthouse is on a boat. The boat is out.",
        "Two wins buys a rowboat. Three buys the oars."
      ],
      "beforeKeeper": [
        "The lighthouse lamp swings round. It lights a door, a ladder, a captain."
      ],
      "afterKeeper": [
        "Frame Two. A sailor's forearm, mid-swell. Two frames warm in the pocket.",
        "A telegram waits at the pier. 'KOUNTY IS MINE. STOP. SPOOL.'"
      ]
    },
    {
      "id": "kounty",
      "name": "Kokonino Kounty",
      "place": "Mesa, moon, and a mouse with a brick.",
      "tagline": "Duck.",
      "keeper": {
        "name": "Offissa Pupp",
        "title": "Kounty Lawman",
        "intro": "Offissa Pupp. Kounty Lawman. Jails one mouse nightly. The mouse always makes bail.",
        "taunt": "Law's the law, stranger. And I am the law until suppertime.",
        "beaten": "Fair and square. Now, about that frame. About that I have bad news."
      },
      "spar": {
        "name": "Tumbleweed Tess",
        "line": "Blow in, roll out. I go where the wind loses."
      },
      "challenges": [
        {
          "name": "Brick Weather",
          "kicker": "EVERY STEAL COUNTS DOUBLE.",
          "opponent": "Deputy Dust",
          "line": "Round here a brick is a love letter. Duck."
        },
        {
          "name": "Jailhouse Rules",
          "kicker": "NO SWAPS. NO MERCY.",
          "opponent": "Warden Wick",
          "line": "Mine is the only cell with a view. You'll see it."
        }
      ],
      "arrive": [
        "Kokonino Kounty. A brick sails past. Then another. Nobody flinches.",
        "Fresh tyre tracks in the sand. They go where you are going.",
        "The jailhouse is empty. The cell door swings. The sign says BACK SOON."
      ],
      "midway": [
        "Every wall in the Kounty has a brick-shaped hole. So does the mood.",
        "A note tacked to a cactus. 'Frame's spoken for. Pleasant trip. C.S.'"
      ],
      "beforeKeeper": [
        "Offissa Pupp on the jailhouse porch. He looks at his boots. He looks at you. He sighs."
      ],
      "afterKeeper": [
        "Pupp hands over Frame Three. Beside it, a brick. Painted to look like one. Signed C.S.",
        "Spool tried the fake on him at dawn. Pupp is no fool. Spool left in a hurry. The brick stays with you.",
        "Three frames warm. One brick heavy. The road bends toward bed."
      ]
    },
    {
      "id": "slumber",
      "name": "Slumberland",
      "place": "Where the beds are boats and the floor has opinions.",
      "tagline": "The rules bend here. So does the bed.",
      "keeper": {
        "name": "King Nodd",
        "title": "Regent of Slumberland",
        "intro": "King Nodd. Regent of Slumberland. Rules by yawning. Has never once been awake.",
        "taunt": "You cannot beat a dream, child. You can only wake up.",
        "beaten": "Ah. Then wake. Take the frame before it changes its mind."
      },
      "spar": {
        "name": "Pillow",
        "line": "Rest between rounds. That is the whole round."
      },
      "challenges": [
        {
          "name": "Upside Down",
          "kicker": "FRONT IS BACK. BACK IS FRONT.",
          "opponent": "The Bedpost",
          "line": "Turn your lineup over. The floor is the ceiling."
        },
        {
          "name": "Five More Minutes",
          "kicker": "LAST PLAYED WINS BIG.",
          "opponent": "Nurse Nightlight",
          "line": "Hush now. The last chip down is the one that dreams."
        }
      ],
      "arrive": [
        "Slumberland. The bed grows legs and walks you in.",
        "The brick in your pocket snores softly. Bricks should not do that.",
        "Spool is here. His gloves are off. He is looking at his hands."
      ],
      "midway": [
        "A dream plays on the palace wall. The Grand Premiere. A marquee with no name on it.",
        "Spool is in the front row of the dream, younger. The picture cuts. He is gone.",
        "'They cut me out,' he says to nobody. 'I only want to know if I was ever in.'"
      ],
      "beforeKeeper": [
        "The Projectionist is in the dream too. Scissors in hand. Smiling. Then you wake.",
        "King Nodd's throne room. The throne is a mattress. The King is the pillow on it."
      ],
      "afterKeeper": [
        "Frame Four. A boy falling out of bed, halfway down. Warmer than the others.",
        "Spool is gone again. On the pillow, one glove, folded. He left it on purpose."
      ]
    },
    {
      "id": "lot",
      "name": "The Studio Lot",
      "place": "Stage Three, 1928. Paint drying, cameras cranking, a rabbit on the roof.",
      "tagline": "Quiet on the set. Not you, the rabbit.",
      "keeper": {
        "name": "Vance Klapper",
        "title": "Director, Stage Three",
        "intro": "Vance Klapper. Director. Shouts ACTION at breakfast. Has never once shouted CUT.",
        "taunt": "You call that a lineup? I have seen better blocking from a lamppost.",
        "beaten": "Cut. Print. Take the frame. That was the take we keep."
      },
      "spar": {
        "name": "Stand-In Stanley",
        "line": "I take the falls so the stars don't have to."
      },
      "challenges": [
        {
          "name": "Take Two",
          "kicker": "SAME DECK. NEW LUCK.",
          "opponent": "Script Girl Sal",
          "line": "Same lines, different faces. That is the pictures."
        },
        {
          "name": "Pie Fight",
          "kicker": "NO SILVER. GET MESSY.",
          "opponent": "Props Man Pudge",
          "line": "Forty pies on the cart. Lose one and you sweep."
        }
      ],
      "arrive": [
        "The Studio Lot. Painted sky on a flat. A real cloud stops to admire it.",
        "Spool's roadster sits on blocks. Spool sits on an apple crate. He has lost five times.",
        "'Klapper plays the back row,' he says, not looking up. 'Every time. Take it or leave it.'"
      ],
      "midway": [
        "Stage Three is closed for a pie fight. Stage Two is closed for the same pie fight.",
        "You and Spool walk the lot in silence. Four frames warm. One brick. One glove."
      ],
      "beforeKeeper": [
        "The red lamp over the stage door goes on. Klapper's voice through it. 'ACTION.'"
      ],
      "afterKeeper": [
        "Frame Five. A rabbit, mid-leap, one ear up. Klapper says nothing. That is the review.",
        "Spool waits by the gate. 'The Funny Pages want two of us. Editor's rules.'"
      ]
    },
    {
      "id": "funnies",
      "name": "The Funny Pages",
      "place": "Sunday morning, four colours, a deadline that never moves.",
      "tagline": "Extra, extra.",
      "keeper": {
        "name": "Maude Deadline",
        "title": "Sunday Editor",
        "intro": "Maude Deadline. Sunday Editor. Cuts a joke to three panels and a picture to one.",
        "taunt": "I've killed better strips than you before breakfast. Show me a punchline.",
        "beaten": "That's the last panel. Hold the presses. Take your frame. Take his too."
      },
      "spar": {
        "name": "Paperboy Pip",
        "line": "Extra, extra. You beat me again."
      },
      "challenges": [
        {
          "name": "Four Panels",
          "kicker": "FOUR CHIPS. NO MORE.",
          "opponent": "Copy Boy Crumb",
          "line": "Four panels to the strip. Make the last one land."
        },
        {
          "name": "Sunday Colour",
          "kicker": "MATCH YOUR COLOURS OR LOSE.",
          "opponent": "Miss Halftone",
          "line": "Grey is for weekdays. Show me colour."
        }
      ],
      "arrive": [
        "The Funny Pages. The ground is newsprint. Your footprints come out in four colours.",
        "Spool walks beside you now. He keeps to the gutters between panels. Old habit."
      ],
      "midway": [
        "The editor prints nothing without two sources. One collector is a rumour. Two is news.",
        "Spool holds out the racing form he lost the roadster on. 'One source is a rumour. Now you have two.'"
      ],
      "beforeKeeper": [
        "Maude Deadline's office. A clock with no hands. A red pencil the size of an oar."
      ],
      "afterKeeper": [
        "Frame Six. A tall man, a short man, a racing form. Six frames warm. The brick stays. Souvenir.",
        "One frame left. The Projectionist's own. Spool goes quiet. Then, 'Together or not at all.'"
      ]
    },
    {
      "id": "station",
      "name": "Orbit Station",
      "place": "Back where the ticket was punched. Up the stairs, behind the little square window.",
      "tagline": "The last reel.",
      "keeper": {
        "name": "The Projectionist",
        "title": "Keeper of the Reel",
        "intro": "The Projectionist. Keeper of the Reel. Threads every picture. Watches none of them.",
        "taunt": "Six frames in your pocket. The seventh is in mine. Come and cut it out.",
        "beaten": "There. The seventh frame. Hold it to the light. Tell me what you see."
      },
      "spar": {
        "name": "The Usher",
        "line": "Any seat you like. I have seen this one before."
      },
      "challenges": [
        {
          "name": "Reel Change",
          "kicker": "MID-MATCH SWAP. NO WARNING.",
          "opponent": "The Rewind Man",
          "line": "We reach the end. Then we go again."
        },
        {
          "name": "Full House",
          "kicker": "EVERY SOCKET. EVERY CHIP.",
          "opponent": "The Balcony",
          "line": "Up here we see everything. Play like we're watching."
        }
      ],
      "arrive": [
        "Orbit Station. Same gate, same clock. The clock has moved one minute.",
        "Up the iron stairs. The Projection Room hums. A little square of light on the far wall.",
        "Spool takes off the other glove. He folds the pair together. He does not put them away."
      ],
      "midway": [
        "Six frames on the bench, warm in a row. The gap where the seventh goes is frame-shaped.",
        "The Projectionist threads nothing. He waits. He has waited since the ticket was punched."
      ],
      "beforeKeeper": [
        "'I cut it,' he says. 'A premiere with no audience is a rehearsal. Somebody had to walk.'",
        "'Six frames are the story. The seventh is who came back to tell it.' He leaves the booth."
      ],
      "afterKeeper": [
        "Frame Seven. Hold it to the light. A front row. Two seats. Both taken.",
        "The reel is whole. The lamp warms. The little square of light opens into a picture.",
        "Spool, in the front row of the picture, laughs. The one beside you does not look away."
      ]
    }
  ]
};
