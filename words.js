// Snowman v1.4: Learn to Readle's reviewed answers.js is the single source of secret words.
// This file stores only Snowman-specific clue overrides and adapts the shared word bank.
(() => {
  'use strict';

  const clueOverrides = {
    'BEAR': 'A large furry animal',
    'BIRD': 'An animal with feathers',
    'BOOK': 'Something you read',
    'CAKE': 'A sweet birthday treat',
    'CAMP': 'Sleep outside in a tent',
    'DUCK': 'A bird that likes water',
    'FISH': 'An animal that swims',
    'FROG': 'A green animal that hops',
    'GAME': 'Something you play',
    'GOAT': 'A farm animal',
    'KITE': 'You fly it in the wind',
    'LION': 'A big cat with a mane',
    'MOON': 'You can see it at night',
    'RAIN': 'Water that falls from clouds',
    'SHIP': 'A large boat',
    'SHOE': 'You wear it on your foot',
    'STAR': 'It twinkles in the night sky',
    'TREE': 'A tall plant with a trunk',
    'WAVE': 'Moving water at the beach',
    'WOLF': 'A wild animal related to dogs',
    'APPLE': 'A crunchy fruit',
    'BEACH': 'A sandy place by the water',
    'BREAD': 'You might use it for a sandwich',
    'CLOUD': 'A fluffy shape in the sky',
    'DANCE': 'Move your body to music',
    'EARTH': 'The planet we live on',
    'GRAPE': 'A small round fruit',
    'HORSE': 'An animal people can ride',
    'JUICE': 'A fruity drink',
    'MOUSE': 'A small animal with a long tail',
    'NIGHT': 'The time when it is dark',
    'OCEAN': 'A huge body of salt water',
    'PANDA': 'A black-and-white bear',
    'PIZZA': 'A cheesy food cut into slices',
    'PLANT': 'A living thing that grows',
    'ROBOT': 'A machine that can do tasks',
    'SHEEP': 'A farm animal with wool',
    'SMILE': 'What your face does when you are happy',
    'TRAIN': 'A vehicle that travels on tracks',
    'WHALE': 'A very large ocean animal',
    'ANIMAL': 'A living creature',
    'BANANA': 'A long yellow fruit',
    'BUBBLE': 'A round pocket of air in soapy water',
    'CASTLE': 'A large home for kings and queens',
    'COOKIE': 'A small sweet baked treat',
    'DRAGON': 'A make-believe fire-breathing creature',
    'FLOWER': 'A colorful part of a plant',
    'FOREST': 'A place with many trees',
    'GARDEN': 'A place where plants are grown',
    'KITTEN': 'A baby cat',
    'MONKEY': 'An animal that can climb and swing',
    'ORANGE': 'A fruit and a color',
    'PENCIL': 'You use it to write or draw',
    'PUPPET': 'A toy you can make move',
    'RABBIT': 'An animal with long ears',
    'ROCKET': 'A vehicle that can travel to space',
    'SCHOOL': 'A place where children learn',
    'SPIDER': 'A creature with eight legs',
    'TURTLE': 'An animal with a shell',
    'WINTER': 'The coldest season',
    'BALLOON': 'A colorful object filled with air',
    'BEDROOM': 'A room where you sleep',
    'CHICKEN': 'A farm bird',
    'DOLPHIN': 'A smart ocean animal',
    'DRAWING': 'A picture made with a pencil or crayon',
    'FIREMAN': 'A person who helps put out fires',
    'GIRAFFE': 'A very tall animal with a long neck',
    'HAMSTER': 'A small furry pet',
    'KITCHEN': 'A room where food is prepared',
    'LADYBUG': 'A small red beetle with spots',
    'LIBRARY': 'A place full of books',
    'PENGUIN': 'A black-and-white bird that cannot fly',
    'RAINBOW': 'Colors that can appear after rain',
    'SANDBOX': 'A box where kids can play with sand',
    'SNOWMAN': 'A person-shaped figure made of snow',
    'SUNSHINE': 'Bright light from the sun',
    'TRICYCLE': 'A three-wheeled ride',
    'VOLCANO': 'A mountain that can erupt',
    'PANCAKE': 'A round breakfast food cooked on a griddle',
    'POPCORN': 'A crunchy snack made from corn',
    'AIRPLANE': 'A vehicle that flies in the sky',
    'BASEBALL': 'A sport played with a bat and ball',
    'BIRTHDAY': 'The day you celebrate getting one year older',
    'DINOSAUR': 'An ancient animal that lived long ago',
    'ELEPHANT': 'A huge animal with a trunk',
    'FOOTBALL': 'A sport played with an oval ball',
    'KANGAROO': 'An animal that hops and has a pouch',
    'MOUNTAIN': 'Very high land',
    'NOTEBOOK': 'A book of blank pages for writing',
    'PLAYROOM': 'A room for toys and games',
    'SANDWICH': 'Food between slices of bread',
    'SEAHORSE': 'A tiny ocean animal shaped a bit like a horse',
    'SNOWBALL': 'A ball made of packed snow',
    'SQUIRREL': 'A furry animal that likes nuts',
    'SUNLIGHT': 'Light that comes from the sun',
    'TREASURE': 'Something valuable that might be hidden',
    'UMBRELLA': 'You hold it over your head in the rain',
    'VACATION': 'Time away from school or work',
    'RAINCOAT': 'A coat worn in wet weather',
  };

  if (!window.ANSWER_WORDS || typeof window.ANSWER_WORDS !== 'object') {
    window.SNOWMAN_WORDS = [];
    window.SNOWMAN_WORD_SOURCE_ERROR = true;
    return;
  }

  const words = [];
  for (let length = 4; length <= 8; length++) {
    const shared = Array.isArray(window.ANSWER_WORDS[String(length)])
      ? window.ANSWER_WORDS[String(length)]
      : (Array.isArray(window.ANSWER_WORDS[length]) ? window.ANSWER_WORDS[length] : []);
    for (const rawWord of shared) {
      const word = String(rawWord).trim().toUpperCase();
      if (!/^[A-Z]+$/.test(word) || word.length !== length) continue;
      words.push({
        word,
        clue: clueOverrides[word] || 'No clue for this word yet — try a letter!'
      });
    }
  }

  window.SNOWMAN_WORDS = words;
  window.SNOWMAN_WORD_SOURCE = 'Learn to Readle reviewed answer bank';
})();
