var express = require('express');
var app = express();
var natural = require('natural');
var metaphone = natural.Metaphone;
var tokenizer = new natural.WordTokenizer();

var setup = function () {
    setup_routes();
    app.enable("jsonp callback");
    app.listen(5002);
    console.log("Listening on port 5002");
}

var setup_routes = function () {

    app.use('/', express.static(__dirname + '/public'));

    app.post('/resolve/', function(req, res) {
       if(req.param('raw')) {
           res.type('application/json');
           var cmds = get_commands(req.param('raw'));
           if(cmds) {
               res.jsonp(cmds);
           } else {
               res.jsonp({});
           }
       }
    });

    app.post('/interrupt/', function(req, res) {
        if(req.param('raw')) {
            res.type('application/json');
            if (is_interrupt(req.param('raw'))) {
                halt_commands();
                res.jsonp(true);
            } else {
                res.jsonp(false);
            }
        }
    });

}

var get_commands = function(str) {
    var commands = [];
    var tokens = tokenizer.tokenize(str);

    if(tokens.length % 2 != 0){
        tokens.pop();
    }

    for(var i = 0; i < tokens.length; i+=2) {
        var cmd = refine_command(tokens[i], tokens[i+1]);
        if (cmd) {
            commands.push(cmd);
        }
    }

    return commands;
}

var refine_command = function(cmd, arg) {
    var cmds = ['grow', 'shrink', 'move', 'stop'];
    var args = ['up', 'down', 'left', 'right', 'all', 'now'];
    var closest_cmd = cmd, closest_arg = arg;
    var cmd_dist = Infinity, arg_dist = Infinity;

    // find the closest match for the arg
    for(var i = 0; i < cmds.length; i++) {
        var distance = natural.LevenshteinDistance(cmd, cmds[i]);
        if(distance < cmd_dist) {
            cmd_dist = distance;
            closest_cmd = cmds[i];
        }
    }

    // do the same for args
    for(var i = 0; i < args.length; i++) {
        var distance = natural.LevenshteinDistance(arg, args[i]);
        if(distance < arg_dist) {
            arg_dist = distance;
            closest_arg = args[i];
        }
    }

    var command = {
        cmd: cmd
    ,   cmd_dist: cmd_dist
    ,   closest_cmd: closest_cmd
    ,   arg: arg
    ,   arg_dist: arg_dist
    ,   closest_arg: closest_arg
    ,   sane: false
    };

    command.sane = check_command_sanity(command, false);

    return command;
}

var check_command_sanity = function (command, phonetics) {
    var metaphone = natural.Metaphone;
    var cmd_score = 0, arg_score = 0;

    // check phonetics
    if (phonetics) {
        if (!metaphone.compare(command.cmd, command.closest_cmd)
            || !metaphone.compare(command.arg, command.closest_arg)) {
            return false;
        }
    }

    // check distances 
    if (command.cmd_dist >= command.closest_cmd.length
        || command.arg_dist >= command.closest_arg.length) {
        return false;
    }
    return true;
}

var is_interrupt = function (transcript) {
    words = transcript.split(' ');
    for(var i in words) {
        if (metaphone.compare("stop", words[i]) 
                || natural.LevenshteinDistance("stop", words[i]) <= 2) {
            console.log("Received an interrupt!");
            return true;
        }
    }
    return false;
}

var halt_commands = function () {

};

setup();
