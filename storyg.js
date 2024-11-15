const inputEl = document.getElementById('userInput');
const storyPrompt = document.getElementById('storyPrompt');
const buttonContainer = document.getElementById('buttonContainer');
const endingsCounter = document.getElementById('endingsCounter');
const endingsModal = document.getElementById('endingsModal');
const endingsList = document.getElementById('endingsList');
const closeModal = document.getElementById('closeModal');

inputEl.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        const inputValue = inputEl.value.trim();
        if (inputValue) {
            inputEl.value = '';
            handleStory(inputValue);
        }
    }
});

let currentStep = 0;
let playerName = "";
let pathChoice = "";
let gameOver = false;
let reachedEndings = new Set();

closeModal.onclick = function () {
    endingsModal.style.display = "none";
};

function handleStory(input) {
    if (gameOver) {
        if (input.toLowerCase() === "yes") {
            resetGame();
        } else if (input.toLowerCase() === "no") {
            storyPrompt.innerText = "Thanks for playing!";
            gameOver = true;
        } else {
            storyPrompt.innerText = "Would you like to try again? Please answer 'yes' or 'no'.";
        }
        return;
    }

    switch (currentStep) {
        case 0:
            if (!playerName) {
                playerName = input;
            }
            storyPrompt.innerText = `Hello ${playerName}, do you want to play? (yes or no)`;
            displayOptions(["Yes", "No"]);
            showInputBox(false);
            currentStep++;
            break;

        case 1:
            if (input.toLowerCase() === "yes") {
                storyPrompt.innerText = "You woke up to find yourself in a bare room, with only the bed that you're on. The only light source is what's shining from the cracks in the ceiling. Do you want to open the door, or stay in the bed?"
                displayOptions(["Open the door", "Stay in bed"]);
                currentStep++;
            } else if (input.toLowerCase() === "no") {
                storyPrompt.innerText = "Please say yes :(";
            } else {
                storyPrompt.innerHTML = `Hello ${playerName}, do you want to play? (yes or no)<br><br>Answer with 'yes' or 'no'.`;
            }
            break;

        case 2:
            if (input.toLowerCase() === "open the door") {
                storyPrompt.innerText = "The door creaks open, the smell of dust filling the room. You appear to be in a hallway. Do you go left or right?"
                pathChoice = "door";
                currentStep++;
                displayOptions(["Go left", "Go right"]);
            } else if (input.toLowerCase() === "stay in bed") {
                storyPrompt.innerText = "You stay in bed, feeling uneasy. You feel something moving underneath the blanket. Do you want to look?";
                pathChoice = "bed";
                currentStep++;
                displayOptions(["Yes", "No"]);
            } else {
                storyPrompt.innerHTML = "Do you want to open the door, or stay in the bed?<br><br>Answer with 'open' or 'stay'.";
            }
            break;

        case 3:
            if (pathChoice === "door") {
                if (input.toLowerCase() === "go left") {
                    storyPrompt.innerText = "Running your hands along the walls to guide yourself through the dark hallway, your feet suddenly kick something. Looking closely, you see it's a person. Do you help them wake up?"
                    pathChoice = "wake";
                    currentStep++;
                    displayOptions(["Yes", "No"]);
                } else if (input.toLowerCase() === "go right") {
                    storyPrompt.innerText = "Going to the right, you find a dimly lit room with a gun on the table, filling you with dread. 'Why would anyone need a gun? Is there something dangerous here?' you wonder. Before you could reach for the gun, you felt a presence behind you. You felt a knife go through your throat, and you collapsed. Would you like to try again? (yes or no)";
                    gameOver = true;
                    addEnding("Right isn't always right!");
                    updateEndingsCounter();
                    displayEndingsModal();
                    displayOptions(["Yes", "No"]);
                } else {
                    storyPrompt.innerHTML = "You appear to be in a hallway. Do you go left or right?<br><br>Answer with 'left' or 'right'.";
                }
            } else if (pathChoice === "bed") {
                if (input.toLowerCase() === "yes") {
                    storyPrompt.innerText = "You find a hoard of spiders. You scream in terror, jumping out of the bed. Surprised by your sudden movement, a spider bit you out of fear. You leave the room in a haste, collapsing on the floor. Do you wait, or try to find a safe place?"
                    pathChoice = "wait";
                    currentStep++;
                    displayOptions(["Wait", "Find a safe place"]);
                } else if (input.toLowerCase() === "no") {
                    storyPrompt.innerText = "You suddenly feel numerous bites along your body. You feel nauseous, your vision quickly fading. Would you like to try again? (yes or no)";
                    gameOver = true;
                    addEnding("Maybe it would be smart to try to escape..");
                    updateEndingsCounter();
                    displayEndingsModal();
                    displayOptions(["Yes", "No"]);
                } else {
                    storyPrompt.innerHTML = "You feel something moving underneath the blanket. Do you want to look?<br><br>Answer with 'yes' or 'no'.";
                }
            }
            break;

        case 4:
            if (pathChoice === "wake") {
                if (input.toLowerCase() === "yes") {
                    storyPrompt.innerText = "The mysterious person woke up in a panic, begging you not to hurt them. You assured them you wouldn't, and after they calmed down, you asked if they knew where this place is. Like you, they suddenly woke up in this strange place and wanted to escape. But when they went to search for an exit, they heard a bloodcurdling scream and passed out from fear. Do you want to search for an exit together?"
                    pathChoice = "searchTogether";
                    currentStep++;
                    displayOptions(["Yes", "No"]);
                } else if (input.toLowerCase() === "no") {
                    storyPrompt.innerText = "You don't know where you are or who this person is, so you decide to leave alone. You walk past them and find light shining through a crack in a door. Do you go in?";
                    pathChoice = "exitAlone";
                    currentStep++;
                    displayOptions(["Yes", "No"]);
                } else {
                    storyPrompt.innerHTML = "Looking closely, you see it's a person. Do you help them wake up?<br><br>Answer with 'yes' or 'no'.";
                }
            }

            else if (pathChoice === "wait") {
                if (input.toLowerCase() === "wait") {
                    storyPrompt.innerText = "The spiders crawled through the cracks in the door, crawling along your body and biting you. You feel nauseous, your vision quickly fading. Would you like to try again? (yes or no)"
                    gameOver = true;
                    addEnding("You tried, but nature always wins..");
                    updateEndingsCounter();
                    displayEndingsModal();
                    displayOptions(["Yes", "No"]);
                } else if (input.toLowerCase() === "find a safe place") {
                    storyPrompt.innerText = "You tried to find safety, but you were already bitten. You collapse to the floor, your vision fading. Would you like to try again? (yes or no)";
                    gameOver = true;
                    addEnding("Maybe in your next life you can become the next Spider-Man?");
                    updateEndingsCounter();
                    displayEndingsModal();
                    displayOptions(["Yes", "No"]);
                } else {
                    storyPrompt.innerHTML = "Do you wait, or try to find a safe place?<br><br>Answer with 'wait' or 'safe'.";
                }
                break;
            }
            break;

        case 5:
            if (pathChoice === "searchTogether") {
                if (input.toLowerCase() === "yes") {
                    storyPrompt.innerText = "You cautiously explore the strange building together. You find a gun, but who should have it? Do you keep the gun for yourself?"
                    pathChoice = "myGun";
                    currentStep++;
                    displayOptions(["Yes", "No"]);
                } else if (input.toLowerCase() === "no") {
                    storyPrompt.innerText = "You refused to travel together, and the person silently stared at you with a blank face. As you turn around, they tackled you and strangled your throat. Would you like to try again? (yes or no)";
                    gameOver = true;
                    addEnding("Geez, talk about anger issues..");
                    updateEndingsCounter();
                    displayEndingsModal();
                    displayOptions(["Yes", "No"]);
                } else {
                    storyPrompt.innerHTML = "Do you want to search for an exit together?<br><br>Answer with 'yes' or 'no'.";
                }
            } else if (pathChoice === "exitAlone") {
                if (input.toLowerCase() === "yes") {
                    storyPrompt.innerText = "You immediately gag upon opening the door, the stench of blood and rotting flesh filling your nose. As your eyes adjust to the light, you see piles of corpses, both humans and animals alike. Suddenly, you hear a scream from outside the room, and it all goes silent for a few seconds. The sound of heavy footsteps start to approach the door, as well as the sound of something being dragged across the floor. Do you run out of the room, or hide?"
                    pathChoice = "hideOrRun";
                    currentStep++;
                    displayOptions(["Run", "Hide"]);
                } else if (input.toLowerCase() === "no") {
                    storyPrompt.innerText = "You had a bad feeling about that room for some reason.. As you think about if you should enter, you hear a scream behind you. You turn around, seeing the corpse of the person you had just ignored. As you go to check them out, a figure appears from the shadows, grabbing your neck and crushing it. Would you like to try again? (yes or no)";
                    gameOver = true;
                    addEnding("Curiosity killed the cat, but that cat wasn't trapped in a strange building.");
                    updateEndingsCounter();
                    displayEndingsModal();
                    displayOptions(["Yes", "No"]);
                } else {
                    storyPrompt.innerHTML = "You walk past them and find light shining through a crack in a door. Do you go in?<br><br>Answer with 'yes' or 'no'.";
                }
                break;
            }

            break;

        case 6:
            if (pathChoice === "myGun") {
                if (input.toLowerCase() === "yes") {
                    storyPrompt.innerText = "You take the gun and lead the way. The door to the room where you woke up suddenly flew open, a hoard of spiders crawling out. Do you kill them with the gun, or run away?"
                    pathChoice = "runAwayOrKill";
                    currentStep++;
                    displayOptions(["Kill", "Run"]);
                } else if (input.toLowerCase() === "no") {
                    storyPrompt.innerText = "You let the other person take the gun and they lead the way. As you turn the corner in the hallway, you see a door with DO NOT ENTER written in bold letters. Do you enter?";
                    pathChoice = "doNotEnterTogether";
                    currentStep++;
                    displayOptions(["Yes", "No"]);
                } else {
                    storyPrompt.innerHTML = "You find a gun, but who should have it? Do you keep the gun for yourself?<br><br>Answer with 'yes' or 'no'.";
                }

            } else if (pathChoice === "hideOrRun") {
                if (input.toLowerCase() === "run") {
                    storyPrompt.innerText = "You run out of the room, but the footsteps quickly catch up to you. You felt a heavy blow to your head, then everything went black. Would you like to try again? (yes or no)"
                    gameOver = true;
                    addEnding("Maybe a skill issue?");
                    updateEndingsCounter();
                    displayEndingsModal();
                    displayOptions(["Yes", "No"]);
                } else if (input.toLowerCase() === "hide") {
                    storyPrompt.innerText = "You quickly hide among the numerous corpses. Peeking through the gaps, a large figure walks in, dragging the lifeless body of the person you had just seen. The strange figure throws the body on top of you, then walks out of the room. A few minutes pass. Do you wait, or leave the room?";
                    pathChoice = "waitOrLeave";
                    currentStep++;
                    displayOptions(["Wait", "Leave"]);
                } else {
                    storyPrompt.innerHTML = "Do you run out of the room, or hide?<br><br>Answer with 'run' or 'hide'.";
                }
                break;
            }

            break;

        case 7:
            if (pathChoice === "runAwayOrKill") {
                if (input.toLowerCase() === "kill") {
                    storyPrompt.innerText = "You obviously couldn't shoot all the spiders with a gun. The spiders swarmed your body, entering your mouth and ears. Would you like to try again? (yes or no)"
                    gameOver = true;
                    addEnding("Maybe try to use your head next time..");
                    updateEndingsCounter();
                    displayEndingsModal();
                    displayOptions(["Yes", "No"]);
                } else if (input.toLowerCase() === "run") {
                    storyPrompt.innerText = "You run away together, finding a door with DO NOT ENTER written in bold letters. Do you enter?";
                    pathChoice = "goInMyGun";
                    currentStep++;
                    displayOptions(["Yes", "No"]);
                } else {
                    storyPrompt.innerHTML = "Do you kill them with the gun, or run away<br><br>Answer with 'run' or 'kill'.";
                }
            } else if (pathChoice === "doNotEnterTogether") {
                if (input.toLowerCase() === "yes") {
                    storyPrompt.innerText = "You enter the room together, a figure appearing in front of you. Your partner aims the gun at the figure, but in a panic, shoots you instead. Would you like to try again? (yes or no)"
                    gameOver = true;
                    addEnding("Uh oh, your partner can't use a gun!");
                    updateEndingsCounter();
                    displayEndingsModal();
                    displayOptions(["Yes", "No"]);
                } else if (input.toLowerCase() === "no") {
                    storyPrompt.innerText = "You do as the sign says and don't enter. You search for an exit for days, but when you finally found it, you needed a key. Unable to fight on any longer, you and your partner starved to death. Would you like to try again? (yes or no)";
                    gameOver = true;
                    addEnding("Guess you gotta be a rule breaker..");
                    updateEndingsCounter();
                    displayEndingsModal();
                    displayOptions(["Yes", "No"]);
                } else {
                    storyPrompt.innerHTML = "You see a door with DO NOT ENTER written in bold letters. Do you enter?<br><br>Answer with 'yes' or 'no'.";
                }

                break;
            } else if (pathChoice === "waitOrLeave") {
                if (input.toLowerCase() === "wait") {
                    storyPrompt.innerText = "Too scared to move, you decided to wait. The large figure comes back to grab the newly deceased body, but pauses and sniffs the air. It stops moving before jumping towards you at an incredible speed. Before you knew what happened, everything went black.. Would you like to try again? (yes or no)"
                    gameOver = true;
                    addEnding("Don't be a coward! Get in the robot Shinji!");
                    updateEndingsCounter();
                    displayEndingsModal();
                    displayOptions(["Yes", "No"]);
                } else if (input.toLowerCase() === "leave") {
                    storyPrompt.innerText = "You don't want to risk your chances of that thing coming back. You quickly leave the room, but as you open the door, you're greeted with a face full of maggots. Before you could even scream, the monster's jaw unhinged, biting your head.. Would you like to try again? (yes or no)";
                    gameOver = true;
                    addEnding("Even if you're not a coward you die..");
                    updateEndingsCounter();
                    displayEndingsModal();
                    displayOptions(["Yes", "No"]);
                } else {
                    storyPrompt.innerHTML = "Do you wait, or leave the room?<br><br>Answer with 'wait' or 'leave'.";
                }

                break;
            }

            break;

        case 8:
            if (pathChoice === "goInMyGun") {
                if (input.toLowerCase() === "yes") {
                    storyPrompt.innerText = "You enter the room together, a figure appearing in front of you. You react quickly and shoot it. The strange figure collapses to the floor. As you look closely, you see a key attached to a necklace on the corpse. Take the key?"
                    pathChoice = "takeKey";
                    currentStep++;
                    displayOptions(["Yes", "No"]);
                } else if (input.toLowerCase() === "no") {
                    storyPrompt.innerText = "You do as the sign says and don't enter. You search for an exit for days, but when you finally found it, you needed a key. Unable to fight on any longer, you and your partner starved to death. Would you like to try again? (yes or no)";
                    gameOver = true;
                    addEnding("Guess you gotta be a rule breaker.");
                    updateEndingsCounter();
                    displayEndingsModal();
                    displayOptions(["Yes", "No"]);
                } else {
                    storyPrompt.innerHTML = "you see a door with DO NOT ENTER written in bold letters. Do you enter?<br><br>Answer with 'yes' or 'no'.";
                }
            }


            break;

        case 9:
            if (pathChoice === "takeKey") {
                if (input.toLowerCase() === "yes") {
                    storyPrompt.innerText = "As you take the key, the corpse suddenly lunges at you. You and your partner run out of the room, slamming the door shut. You run upstairs in a panic, and once you've both calmed down, you see a first aid kid with some medicine. Take the medicine?"
                    pathChoice = "takeMedicine";
                    currentStep++;
                    displayOptions(["Yes", "No"]);
                } else if (input.toLowerCase() === "no") {
                    storyPrompt.innerText = "You were too scared to get close to the corpse and didn't take the key. You search for an exit for days, but when you finally found it, you needed that key. If only you weren't such a coward.. Would you like to try again? (yes or no)";
                    gameOver = true;
                    addEnding("It's a corpse, it's not like it can move.. Right?");
                    updateEndingsCounter();
                    displayEndingsModal();
                    displayOptions(["Yes", "No"]);
                } else {
                    storyPrompt.innerHTML = "You see a key attached to a necklace on the corpse. Take the key?<br><br>Answer with 'yes' or 'no'.";
                }
            }


            break;

        case 10:
            if (pathChoice === "takeMedicine") {
                if (input.toLowerCase() === "yes") {
                    storyPrompt.innerText = "You take the medicine. You're not sure what you could use it for, but it's good to have just in case. Continuing onwards, you find a cat that seems to be in pain. Give it the medicine?"
                    pathChoice = "giveCatMedicine";
                    currentStep++;
                    displayOptions(["Yes", "No"]);
                } else if (input.toLowerCase() === "no") {
                    storyPrompt.innerText = "You didn't want to take suspicious looking medicine, so you left it. Continuing onwards, you find a cat that seems to be in pain. The cat lunges at your partner, biting them. They collapse to the floor and you run away. While running away, you find a door leading outside. Go outside?";
                    pathChoice = "noPartner";
                    currentStep++;
                    displayOptions(["Yes", "No"]);
                } else {
                    storyPrompt.innerHTML = "You see a first aid kid with some medicine. Take the medicine?<br><br>Answer with 'yes' or 'no'.";
                }

                break;
            }

            break;

        case 11:
            if (pathChoice === "giveCatMedicine") {
                if (input.toLowerCase() === "yes") {
                    storyPrompt.innerText = "You carefully give the medicine to the cat. It seems to feel better and rubs against your leg, as if it's saying thank you. You, your partner, and the cat travel together, until you stumble upon a door leading outside. Go outside?"
                    pathChoice = "goOutside";
                    currentStep++;
                    displayOptions(["Yes", "No"]);
                } else if (input.toLowerCase() === "no") {
                    storyPrompt.innerText = "You felt bad for the poor cat, but you couldn't trust it. You and your partner continued traveling together, until you stumble upon a door leading outside. Go outside?";
                    pathChoice = "noCatOutside";
                    currentStep++;
                    displayOptions(["Yes", "No"]);
                } else {
                    storyPrompt.innerHTML = "You find a cat that seems to be in pain. Give it the medicine?<br><br>Answer with 'yes' or 'no'.";
                }
            } else if (pathChoice === "noPartner") {
                if (input.toLowerCase() === "yes") {
                    storyPrompt.innerText = "You go outside, happy to finally smell some fresh air, but anxious to be alone. In the distance, you see a gate. You quickly open the gate with the key, excited to finally leave this place. A monster suddenly appears and your limbs were ripped off one by one. It ate your body parts as if it was the most delicious meal it's ever had.. Would you like to try again? (yes or no)";
                    gameOver = true;
                    addEnding("Maybe you need a friend to help..");
                    updateEndingsCounter();
                    displayEndingsModal();
                    displayOptions(["Yes", "No"]);
                } else if (input.toLowerCase() === "no") {
                    storyPrompt.innerText = "You didn't go outside. You, your partner, and the cat explored the building for days, but eventually died due to starvation and monster attacks. If you want to escape, going outside seems like a pretty reasonable answer.. Would you like to try again? (yes or no)";
                    gameOver = true;
                    addEnding("Do you actually have a brain, or is your skull just for decoration?");
                    updateEndingsCounter();
                    displayEndingsModal();
                    displayOptions(["Yes", "No"]);
                } else {
                    storyPrompt.innerHTML = "While running away, you find a door leading outside. Go outside?<br><br>Answer with 'yes' or 'no'.";
                }

                break;
            }

            break;

        case 12:
            if (pathChoice === "goOutside") {
                if (input.toLowerCase() === "yes") {
                    storyPrompt.innerText = "You go outside, happy to finally smell some fresh air. In the distance, you see a gate. As you approach the gate, the cat suddenly hisses. Do you open the gate with the key?"
                    pathChoice = "getCloser";
                    currentStep++;
                    displayOptions(["Yes", "No"]);
                } else if (input.toLowerCase() === "no") {
                    storyPrompt.innerText = "You didn't go outside. You, your partner, and the cat explored the building for days, but eventually died due to starvation and monster attacks. If you want to escape, going outside seems like a pretty reasonable answer.. Would you like to try again? (yes or no)";
                    gameOver = true;
                    addEnding("Do you actually have a brain, or is your skull just for decoration?");
                    updateEndingsCounter();
                    displayEndingsModal();
                    displayOptions(["Yes", "No"]);
                } else {
                    storyPrompt.innerHTML = "You, your partner, and the cat travel together, until you stumble upon a door leading outside. Go outside?<br><br>Answer with 'yes' or 'no'.";
                }
            } else if (pathChoice === "noCatOutside") {
                if (input.toLowerCase() === "yes") {
                    storyPrompt.innerText = "You go outside, you and your partner happy to finally smell some fresh air. In the distance, you see a gate. You and your partner quickly open the gate with the key, excited to finally leave this place, but a monster appears. It bites into your partner before lunging towards you, biting your leg. You shoot the gun at the monster, grabbing your partner and running away together. You and your partner feel sick, and you remember you found medicine. But who should have it? Do you use the medicine on yourself?"
                    pathChoice = "useMedicineSelf";
                    currentStep++;
                    displayOptions(["Yes", "No"]);
                } else if (input.toLowerCase() === "no") {
                    storyPrompt.innerText = "You didn't go outside. You and your partner explored the building for days, but eventually died due to starvation and monster attacks. If you want to escape, going outside seems like a pretty reasonable answer.. Would you like to try again? (yes or no)";
                    gameOver = true;
                    addEnding("Do you actually have a brain, or is your skull just for decoration?");
                    updateEndingsCounter();
                    displayEndingsModal();
                    displayOptions(["Yes", "No"]);
                } else {
                    storyPrompt.innerHTML = "You stumble upon a door leading outside. Go outside?<br><br>Answer with 'yes' or 'no'.";
                }
            }

            break;

        case 13:
            if (pathChoice === "getCloser") {
                if (input.toLowerCase() === "yes") {
                    storyPrompt.innerText = "You ignored the cat and opened the gate, and a large figure came running towards you. It grabbed the head of your partner, ripping it off with ease. Terrified, you tried to run away, but it was no use. Your limbs were ripped off one by one. The cat, furious that it had killed you, fought the monster. With its agility, it was able to evade the monster's attacks, and eventually win the battle. The cat walked towards you, meowing sadly. It licked your cheek before going through the gate, achieving freedom, but all alone.. Would you like to try again? (yes or no)"
                    gameOver = true;
                    addEnding("Cats always know best!");
                    updateEndingsCounter();
                    displayEndingsModal();
                    displayOptions(["Yes", "No"]);
                } else if (input.toLowerCase() === "no") {
                    storyPrompt.innerText = "You stopped, feeling like the cat was trying to tell you something. The cat jumped on top of the gate, then quickly jumped down. You heard a deep growl, and a monster appeared on the opposite side of the gate. The cat was able to defeat it with ease. After the battle was over, the cat looked at you, meowing happily, almost as if telling you to join it. Open the gate?";
                    pathChoice = "catWinOpenGate";
                    currentStep++;
                    displayOptions(["Yes", "No"]);
                } else {
                    storyPrompt.innerHTML = "Do you open the gate with the key?<br><br>Answer with 'yes' or 'no'.";
                }
            } else if (pathChoice === "useMedicineSelf") {
                if (input.toLowerCase() === "yes") {
                    storyPrompt.innerText = "You used the medicine on yourself, watching as the life left your partner's eyes. You held their hand, sobbing, but there was nothing else you could have done. If only one of you could live, of course you would choose yourself.. Would you like to try again? (yes or no)"
                    gameOver = true;
                    addEnding("There was no other choice.. Right?");
                    updateEndingsCounter();
                    displayEndingsModal();
                    displayOptions(["Yes", "No"]);
                } else if (input.toLowerCase() === "no") {
                    storyPrompt.innerText = "You used the medicine on your partner with what little strength you had left. Your partner tried to refuse the medicine, but you believed that if only one of you could live, they deserve life more than you do. Your partner held onto your hand, sobbing, asking why you would do this. You couldn't answer, but had a smile on your face. What a good person you are.. Would you like to try again? (yes or no)";
                    gameOver = true;
                    addEnding("What a hero!");
                    updateEndingsCounter();
                    displayEndingsModal();
                    displayOptions(["Yes", "No"]);
                } else {
                    storyPrompt.innerHTML = "Do you use the medicine on yourself?<br><br>Answer with 'yes' or 'no'.";
                }
            }
            break;

        case 14:
            if (pathChoice === "catWinOpenGate") {
                if (input.toLowerCase() === "yes") {
                    storyPrompt.innerText = `You successfully opened the gate with the key, your partner cheering and the cat meowing happily. You all escaped to freedom, unsure of what that place was or what those monsters were, but just happy to be alive.. Congratulations  ${playerName} ! You escaped with the perfect ending! Play again? (yes or no)`
                    gameOver = true;
                    addEnding("Everyone's a happy family!");
                    updateEndingsCounter();
                    displayEndingsModal();
                    displayOptions(["Yes", "No"]);
                } else if (input.toLowerCase() === "no") {
                    storyPrompt.innerText = "You didn't open the gate. The cat and your partner stared at you, confused. But you didn't open the gate. Why didn't you open the gate? Are you stupid? Unwilling to give the key to your partner, you all died. Would you like to try again? (yes or no)";
                    gameOver = true;
                    addEnding("You're not the brightest, huh..");
                    updateEndingsCounter();
                    displayEndingsModal();
                    displayOptions(["Yes", "No"]);
                } else {
                    storyPrompt.innerHTML = "Open the gate?<br><br>Answer with 'yes' or 'no'.";
                }
                break;
            }
    }
}


function resetGame() {
    currentStep = 1;
    pathChoice = "";
    gameOver = false;
    inputEl.style.display = "none";
    buttonContainer.style.display = "none";
    storyPrompt.innerText = `Hello ${playerName}, do you want to play again? (yes or no)`;
    displayOptions(["Yes", "No"]);

    endingsModal.style.display = "none";
    endingsList.innerHTML = '';
}

function showInputBox(show) {
    if (show) {
        inputEl.style.display = "block";
    } else {
        inputEl.style.display = "none";
    }
}

function displayOptions(options) {
    inputEl.style.display = "none";
    buttonContainer.style.display = "block";
    buttonContainer.innerHTML = "";

    options.forEach(option => {
        const button = document.createElement("button");
        button.innerText = option;
        button.onclick = () => handleStory(option.toLowerCase());
        buttonContainer.appendChild(button);
    });
}

let latestEndingReached = '';

function updateEndingsCounter() {
    const totalEndings = 23;
    endingsCounter.innerText = `Endings Reached: ${reachedEndings.size}/${totalEndings}`;
}

function addEnding(ending) {
    reachedEndings.add(ending);
    latestEndingReached = ending;
    updateEndingsCounter();
}

function displayEndingsModal() {
    endingsList.innerHTML = '';

    if (latestEndingReached) {
        const listItem = document.createElement('li');
        listItem.textContent = latestEndingReached;
        endingsList.appendChild(listItem);
    }


    endingsModal.style.display = "block";
}