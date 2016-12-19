/**
 * scripts.js
 *
 * Computer Science 50
 * Final Project
 *
 * Global JavaScript.
 */

// get DOM node in which grid will be instantiated
var grid = $("#grid");
    
// Constants
const MAX_DIM = 9;
const MAX_DEPTH = 6;
const MACHINE_PLAYER  = 1;

// Global variables
var grid_size = 3;
var game_on = false;
var total_moves = 0;
var max_depth = 6;

// machine player best move
var best_row = -1000;
var best_col = -1000;

// X goes first
var current_player = -1; 
var symbol = "X";

// array to hold representation of board
var board = [];

// execute when the DOM is fully loaded
$(function() {
    // draw grid
    draw_grid(grid_size);
});

/**
 * Draws Grid
 */
function draw_grid()
{
    // remove previous divs
    grid.empty();
    
    // get grid size
    var selectBox = document.getElementById("grid_drop_down");
    grid_size = selectBox.options[selectBox.selectedIndex].value;

    if (grid_size > 3) max_depth = 4;
    if (grid_size > 5) max_depth = 3;
    if (grid_size > 7) max_depth = 2;
    
    // create divs for grid
    for (var i = 0; i < grid_size * grid_size; i++) {
        // create div with event listeners
        var div = $("<div></div>", { 
            class: "cell",
            id: "sq" + i,
            onmouseover: "cell_hover($(this))",
            onmouseout: "cell_nohover($(this))",
            onclick: "move($(this))"
        }).text("");
        
        // add div to DOM
        grid.append(div);

        // adjust css for div
        // first row
        if (i < grid_size) {
            div.css("border-top-style", "none");
        }
        // last row
        if (i >= grid_size * (grid_size - 1)) {
            div.css("border-bottom-style", "none");
        }
        // left side
        if (i % grid_size == 0) {
            div.css("border-left-style", "none");
        }
        // right side
        if ((i + 1) % grid_size == 0) {
            div.css("border-right-style", "none");
        }
    }
    // adjust css for divs
    var cell_size = grid.width() / grid_size;
    $(".cell").css("width", cell_size + "px");
    $(".cell").css("height", cell_size + "px");
    $(".cell").css("line-height", cell_size + "px");
    $(".cell").css("font-size", (cell_size / 2) + "px");
}

/**
 * Starts game
 */
function start_game(){
    // set game_on to true
    game_on = true;
    // hide start button
    $(".start").fadeOut();
    // hide grid size label and drop down
    $(".difficulty").fadeOut();
    // show human prompt
    $("#human").fadeIn();

    // initialize array to hold representation of board
    for (var i=0; i < grid_size; i++) {
        board[i] = [grid_size];
       for (var j=0; j < grid_size; j++) {
          board[i][j] = 0;
       }
    }
}


/**
 * reStarts game
 */
function restart_game(){
    location.reload();
}

/**
 * called when player clicks on square.
 */
function move(cell){
    // if game has not started yet
    if (!game_on) return;

    // if not your turn
    if (current_player == 1) return;
    
    // if cell is occupied
    if(cell.hasClass("occupied")) return;
    
    // put symbol in cell
    cell.html(symbol);
    cell.css({
        color : symbol == "X" ? "green" : "red",
        opacity : "1.0"
    });
    cell.addClass("occupied");
    
    // update board
    var cell_num = cell.attr("id").substring(2);
    cell_num.parseInt;
    var row = parseInt(cell_num / grid_size, 10);
    var col = parseInt(cell_num % grid_size, 10);
    board[row][col] = current_player;
    total_moves++;
    
    // update max_depth
    if (grid_size > 7) {
    if (total_moves > 16) max_depth = 3;
    if (total_moves > 40) max_depth = 4;
    if (total_moves > 60) max_depth = 5;
    }
    else if (grid_size > 6) {
    if (total_moves > 12) max_depth = 3;
    if (total_moves > 20) max_depth = 4;
    if (total_moves > 30) max_depth = 5;
    }
    else if (grid_size > 5) {
    if (total_moves > 7) max_depth = 4;
    if (total_moves > 15) max_depth = 5;
    if (total_moves > 24) max_depth = 6;
    }
    else if (grid_size > 3){
        if (total_moves > 5) max_depth = 5;
        if (total_moves > 11) max_depth = 6;
    }

    // check for winner
    if (check_winner(board) != 0){
        handle_winner();
        return;
    }
    // check for a tie
    if (check_tie()) return;

    // hide human prompt
    $("#human").fadeOut("fast", function(){
        // show ai prompt
        $("#ai").fadeIn("fast", function(){
            // call AI
            AI_move();
        });
    });
}

/**
 * make move for AI
 */
function AI_move()
{
    // switch player
    current_player *= -1;
    symbol = current_player == -1 ? "X" : "O";

    // call miniMax function to find best move
    miniMax(board, current_player, true, 0);
    board[best_row][best_col] = current_player;
    // put symbol in cell
    var sq = (best_row * grid_size) + best_col;
    var cell = $("#sq" + sq);
    cell.html(symbol);
    cell.css({
        color : symbol == "X" ? "green" : "red",
        opacity : "1.0"
    });
    cell.addClass("occupied");
    total_moves++;

    // check for winner
    if (check_winner(board) != 0){
        handle_winner();
        return;
    }
    // check for a tie
    if (check_tie()) return;
    
    // switch player
    current_player *= -1;
    symbol = current_player == -1 ? "X" : "O";

    // hide ai prompt
    $("#ai").fadeOut("fast", function(){
        // show human prompt
        $("#human").fadeIn("fast", function(){
            // back to wait for human
            return;
        });
    });
}

/**
 * miniMax function for AI decision.
 */
function miniMax(hb, player, mymove, depth) {
    var i, j, score;
    
    // if we have gone too deep, return;
    if (depth > max_depth)
        return 0;
        
    // see if someone has won
    var win = check_winner(hb);
    if (win != 0) 
    {
        return win;
    }

    var move_row = -1;
    var move_col = -1;
    //Losing moves are preferred to no move
    if (mymove)
        score = -2; 
    else
        score = 2;
        
    // For all possible locations (moves),
    for(i = 0; i < grid_size; i++)
    {
        for(j = 0; j < grid_size; j++) {
            // If this is a legal move,
            if(hb[i][j] == 0) {
                // Try the move
                hb[i][j] = player; 
                var thisScore = miniMax(hb, -1 * player, !mymove, depth + 1);

                // my move, so maximize the score          
                if (mymove) {  
                    // randomize equal moves          
                    if(thisScore == score && Math.floor(Math.random() * 20) == 1) {
                        move_row = i;
                        move_col = j;
                    }
                    if(thisScore > score) {
                        score = thisScore;
                        move_row = i;
                        move_col = j;
                    }
                }
                else {
                    // not my move, so minimize the score
                    if(thisScore < score) {
                        score = thisScore;
                        move_row = i;
                        move_col = j;
                    }
                }
                // Reset board after try
                hb[i][j] = 0;
            }
        }
    }
    // no valid moves, so it is a tie.
    if(move_row == -1) return 0;  
    // save best move
    best_row = move_row;
    best_col = move_col;
    return score;
}


/**
 *  check for winner
 */
function check_winner(hyp_board)
{
    var first_cell, winner, i ,j;
    for (i = 0; i < grid_size; i++){
        
        // check each row
        first_cell = hyp_board[i][0];
        for (j = 1; j < grid_size; j++){
            winner = hyp_board[i][j];
            if (first_cell != winner){
                winner = 0;
                break;
            }
        }
        if (winner != 0) return winner;
        
        // check each colum
        first_cell =  hyp_board[0][i];
        for (j = 1; j < grid_size; j++){
            winner = hyp_board[j][i];
            if (first_cell != winner){
                winner = 0;
                break;
            }
        }
        if (winner != 0) return winner;
        
        // check diagonals
        first_cell = hyp_board[0][0];
        for (j = 1; j < grid_size; j++){
            winner = hyp_board[j][j];
            if (first_cell != winner){
                winner = 0;
                break;
            }
        }
        if (winner != 0) return winner;
        
        first_cell = hyp_board[0][grid_size - 1];
        for (j = 1; j < grid_size; j++){
            winner = hyp_board[j][grid_size - 1 - j];
            if (first_cell != winner){
                winner = 0;
                break;
            }
        }
        if (winner != 0) return winner;
    }
    return winner;
}

/**
 *  check tie
 */
function check_tie()
{
    // check tie
    if (total_moves == grid_size * grid_size){
        // end game
        game_on = false;
        // hide human/ai prompt
        $((current_player == 1 ? "#ai" : "#human")).fadeOut("fast", function(){
            // show draw
            $("#draw").fadeIn("fast", function(){
                $("#restart").fadeIn("fast");
            });
        });
        return true;
    }
    return false;
}

/**
 *  handle winner
 */
function handle_winner()
{
    // end game
    game_on = false;

    // hide human/ai prompt
    $(current_player == 1 ? "#ai" : "#human").fadeOut("fast", function(){
        // show won/lost
        $(current_player == 1 ? "#lost" : "#won").fadeIn("fast");
        $("#restart").fadeIn("fast");
    });

}

/**
 * Creates ghostly symbol while you are deciding
 */
function cell_hover(cell)
{
    if (!game_on) return;
    if (cell.hasClass("occupied")) return;
    cell.text(symbol);
    cell.css({
        color : symbol == "X" ? "green" : "red",
        opacity : "0.1"
    });
}

/**
 * Removes ghostly symbol when mouse moves
 */
function cell_nohover(cell)
{
    if (!game_on) return;
    if (cell.hasClass("occupied")) return;
    cell.html("");
    cell.css("opacity", "1.0");
}
