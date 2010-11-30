/*
  global.js - Stuff to handle things. Handles general avatar stuff.
*/

var canvas;
var width;
var height;
var myid;
var timerid;

var moves = new Array()
var old_moves = new Array()

var handlers = {};

function setId() {
    myid = arguments[0]['id'];
}

function addmove(move) {
    moves.push(move)
    
}

function isin(value, list) {
    for (i = 0; i < list.length; i++) {
	if (value == list[i]) {
	    return true;
	}
    }
    return false;
}

function checkmove() {

    for (i in moves) {
	var move = moves[i];
	if (!(isin(move, old_moves))) {
	    console.log('MOVE ' + move);
	    ws.send(JSON.stringify(["Action", {action: "Move", params: [move]}]));
	}
    }

    for (i in old_moves) {
	var move = old_moves[i];
	if (!(isin(move, moves))) {
	    console.log('STOP ' + move);
	    ws.send(JSON.stringify(["Action", {action: "Stop", params: [move]}]));
	}
    }

    old_moves = moves.slice(0);
    moves = new Array();
}


//Obsolete:
function Door(id) {
    this.id = id;
    this.locked = false;
    this.opened = false;

    this.mouseClicked = function() {
	if (this.locked) {
	    console.log('Door is locked')
	} else {
	    this.opened = !this.opened
	    console.log('Door is now ' + this.opened)

	    // Get the corresponding GLGE Collada object
	    var object;
	    var children = scene.getChildren();
	    var i = 0;
	    for (i; i < children.length; i++) {
		if (children[i].id == this.id) {
		    object = children[i];
		    break
		}
	    }
	}
	console.log(object);
	updateObject(id, {locked: this.locked, opened: this.opened, position: [object.getLocX(), object.getLocY(), object.getLocX()]});
    }
    this.mouseHover = function() {
	console.log(this + ' is locked: ' + this.locked + ' and is opened: ' + this.opened);

    }
}

function sendSignal(signal) {
    var action = signal.split(':')[0];
    var id = signal.split(':')[1];
    console.log('sending: ' + action + ' to ' + id);

    
    
}

function connectHandler(signal, id) {
    handlers[signal] = handlers[signal] || [];
    handlers[signal].push(id);
}
