import { autoEffect, store } from '@risingstack/react-easy-state';
import { matchPath } from 'react-router';
import UserStore, { getStoredValue } from './user';

const GameStore = store({
  game: null,
  level: getStoredValue('level', 'game-stores') || 0,
  messageHistory: getStoredValue('messageHistory', 'game-stores') || [],
  messageContent: getStoredValue('messageContent', 'game-stores'),
  left: getStoredValue('left', 'game-stores') || [],
  sendMessage: (msg, who = null, reply = false, r = null, c = null) => {
    const chatBox = document.querySelector('#msgBox');

    //
    //
    // Find data
    //
    //

    const page = matchPath(window.location.pathname, '/rooms/:name').params;
    console.log('%cGame Store - Page', 'font-weight: 700; color: cyan;', page);

    const localGame = GameStore.game;

    const room = localGame.ChatRooms.find(
      (_) => _.Name === decodeURI(page.name)
    );
    console.log('%cGame Store - Room', 'font-weight: 700; color: cyan;', room);

    // If it's a game message, only send, don't process
    if (reply) {
      setTimeout(() => {
        GameStore.messageHistory.push({
          From: who,
          Message: msg,
          Room: r,
          Colour: c,
        });
        setTimeout(() => {
          chatBox.scrollTo({ behavior: 'smooth', top: chatBox.scrollHeight });
        }, 500);
      }, 900);
      return;
    }

    const playable = room.PuzzlePaths.filter(
      (_) => _.LevelRequirement === GameStore.level
    ).sort((a, b) => (b.Weight > a.Weight ? 1 : -1));
    console.log(
      `%cGame Store - PuzzlePaths (Matching Level & Sorted) ${playable.length}`,
      'font-weight: 700; color: cyan;',
      playable
    );

    if (playable.length === 0) {
      console.log(
        `%cGame Store - No playable paths found, odd... User is level ${GameStore.level}`,
        'font-weight: 700; color: red;'
      );
      return;
    }

    // If it isn't a game message handle the message first
    if (!who) {
      // Check level
      // Get game step
      let name = UserStore.name;

      GameStore.messageHistory.push({
        From: name,
        Message: msg,
        Room: r,
        Colour: UserStore.colour,
      });
      GameStore.messageContent = '';
      setTimeout(() => {
        chatBox.scrollTo({ behavior: 'smooth', top: chatBox.scrollHeight });
      }, 500);
    }

    //
    //
    //

    const message = msg.toLowerCase();

    const puzzles = playable;

    console.log('Using Puzzle set', puzzles);
    const logStyle = 'font-weight: 700; color: cyan;';

    //
    //
    // Puzzle Logic
    //
    //

    //
    // Always loop through all puzzles available for the level
    //

    puzzles.forEach((puzzle, puzzleIndex) => {
      let shouldMatchNext = true;

      //
      // Sort the responses workload by weight, lowest (0) will be last
      //

      const sortedResponses = puzzle.Responses.sort((a, b) =>
        b.Weight > a.Weight ? 1 : -1
      ).filter((res) => {
        if (!res.RequiresChatters) return true;

        const remainingChatters = res.RequiresChatters.filter((_) => {
          console.log('Checking for', _);
          const inLeft =
            GameStore.left.findIndex((l) => {
              console.log('in left check', l, l.Name, l.Room);
              return l.Name === _ && l.Room === room.Name;
            }) !== -1;
          console.log(_, 'in left?', inLeft);
          return !inLeft;
        });
        console.log('Remaining chatters', remainingChatters);
        if (remainingChatters.length === 0) return false;
        return true;
      });

      //
      // Loop through all responses requirements
      //

      sortedResponses.forEach((response, i) => {
        //
        // If there is a response that is fully matched, don't try the next one
        //

        if (!shouldMatchNext) {
          console.log(
            `Not trying this match ${puzzleIndex}, already matched previous`
          );
          return;
        }

        // This needs to match the length of "Matching" array for a successful response match
        let matchCount = 0;

        //
        // Check requirements for response to be sent
        //

        response.Matching.forEach((toMatch, matchIndex) => {
          let matches = false;

          const logKey = `${puzzleIndex}:${i}:${matchIndex}`;

          console.log('');
          console.log('');
          console.log(`--- Puzzle: ${puzzleIndex} | Matching: ${i} ---`);
          console.log(`%c${logKey} Raw`, logStyle, toMatch);
          console.log(
            `%c${logKey} Match Type (${i})`,
            logStyle,
            toMatch.MatchType
          );
          console.log(
            `%c${logKey} Match Words (${i})`,
            logStyle,
            toMatch.MatchWords
          );
          let shouldExit = false;

          if (toMatch.MatchType === 'Always') {
            matches = true;
            shouldExit = true;
            console.log('Matches always, should exit');
          }

          toMatch.MatchWords.forEach((word) => {
            console.log('');
            console.log('Exit?', shouldExit ? 'Yes' : 'No');
            if (shouldExit) return;

            console.log(`%c${logKey} Trying to match word "${word}"`, logStyle);

            let foundWithin = false;

            if (message.indexOf(word.toLowerCase()) !== -1) {
              foundWithin = true;
            }

            console.log(
              `%c${logKey} Word found in message? ${
                foundWithin ? 'Yes' : 'No'
              }`,
              logStyle
            );

            if (toMatch.MatchType === 'OneOf' && foundWithin) {
              matches = true;
              shouldExit = true;
              console.log('Matches one of the requirements, should exit');
              return;
            }

            if (toMatch.MatchType === 'AllOf' && foundWithin) {
              matches = true;
              shouldExit = false;
              console.log('Satisfys one condition of AllOf, should not exit');
              return;
            }

            if (toMatch.MatchType === 'AllOf' && !foundWithin) {
              matches = false;
              shouldExit = true;
              console.log('Does not satisfy AllOf, should exit');
              return;
            }
          });

          console.log(`${logKey} Matched?`, matches ? 'Yes' : 'No');

          // If Matches none, shouldMatchNext = true
          if (matches) {
            matchCount += 1;
          }
        });

        console.log(
          'Matched',
          matchCount,
          'required',
          response.Matching.length
        );
        if (matchCount === response.Matching.length) {
          GameStore.level = response.LevelReward;

          console.log(
            `%c${puzzleIndex} Rewarding user with level ${response.LevelReward}`,
            'font-weight: 700; color: orange;'
          );
          shouldMatchNext = false;

          response.Messages.forEach((toSend, i) => {
            console.log('Sending message', toSend.Message);
            setTimeout(() => {
              GameStore.sendMessage(
                toSend.Message,
                toSend.From,
                true,
                room.Name,
                toSend.Colour
              );
            }, 700 * (i + 1));
          });

          if (response.Leaves && response.Leaves.length) {
            response.Leaves.forEach((person, i) => {
              setTimeout(() => {
                GameStore.sendMessage(
                  `<strong>${(
                    localGame.LeaveMessage || '::user has left.'
                  ).replace('::user', person)}</strong>`,
                  '',
                  true,
                  room.Name,
                  'red'
                );
              }, 1000 * (i + (1 + response.Messages.length)));
            });
            setTimeout(() => {
              GameStore.left = GameStore.left.concat(
                response.Leaves.map((_) => {
                  return { Name: _, Room: room.Name };
                })
              );
            }, 1000 * (i + (1 + response.Messages.length) + 1));
          }
          return;
        }
      });
    });

    if (!who) {
    }
  },
});

autoEffect(() =>
  localStorage.setItem('game-stores', JSON.stringify(GameStore))
);

export default GameStore;
