import { Game } from "./game.js";
import { GUI } from "./gui.js";
import "./style.css";

const game = Game();

const gui = GUI(game);
gui.drawShips();
gui.drawGameboard();
gui.drawGuesses();



// TODO(miha): Need Game factory (for playing game, simulating player)
// TODO(miha): Need State factory for saving state (i.e. which ship is selected for placing down)
