"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//const express = require('express');
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var axios_1 = __importDefault(require("axios"));
var telegram_url = "https://api.telegram.org/bot" + process.env.API_KEY + "/sendMessage";
var app = express_1.default();
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
var passage;
//app.use(bodyParser.json({limit: '10mb'}));
//app.use(express.static('public'));
function sendMessage(url, message, reply, res) {
    axios_1.default.post(url, { chat_id: message.chat.id,
        text: reply
    }).then(function (response) {
        console.log("Message posted");
        // return res.end("ok");
    }).catch(function (error) {
        console.log(error);
    });
}
;
app.post('/' + process.env.API_KEY, function (req, res) {
    var message = req.body.message;
    var reply = "Hi, find your passage on the Bible...";
    var myEditedMessage = message.text;
    if (myEditedMessage.toLowerCase().indexOf("/start") === 0 ||
        myEditedMessage.toLowerCase().indexOf("/help") === 0) {
        reply = "To start type something like... '/find john 3 26' ";
        sendMessage(telegram_url, message, reply, res);
    }
    else if (myEditedMessage.toLowerCase().indexOf("/oldtestament") === 0) {
        reply = "The old testament books are ";
        for (var item in OLDBOOKS) {
            //console.log(item);
            reply += OLDBOOKS[item] + " ";
        }
        sendMessage(telegram_url, message, reply, res);
    }
    else if (myEditedMessage.toLowerCase().indexOf("/newtestament") === 0) {
        reply = "The new testament books are ";
        for (var item in NEWBOOKS) {
            reply += NEWBOOKS[item] + " ";
        }
        sendMessage(telegram_url, message, reply, res);
    }
    else if (myEditedMessage.toLowerCase().indexOf("/phrases") === 0) {
        var passage_1 = RANDOM_PASSAGES;
        var rnd = generateRandomPhrase(passage_1.length, null);
        var busca = getHolyPassage(passage_1[rnd], reply);
        busca.then(function (resp) {
            reply = resp;
            //reply = reply.replace(/\\\\n\\\\t/g, '');
            //reply = reply.replace(/\<br/g, '');
            //reply = reply.replace(/\<p/g, '<pre').replace(/p\>/g, 'pre>');
            sendMessage(telegram_url, message, reply, res);
        });
    }
    else if (myEditedMessage.toLowerCase().indexOf("/find") !== -1) {
        var msg = myEditedMessage.toLowerCase().split(" ");
        var book = void 0;
        if (msg.length == 4 && !isNaN(msg[2]) && !isNaN(msg[3]) && (OLDBOOKS.map(function (bk) { return bk.toLowerCase(); }).includes(msg[1]) ||
            NEWBOOKS.map(function (bk) { return bk.toLowerCase(); }).includes(msg[1]))) {
            book = msg[1].charAt(0).toUpperCase() + msg[1].slice(1);
            passage = book + msg[2] + "." + msg[3];
        }
        else if (msg.length == 5 && !isNaN(msg[1]) && !isNaN(msg[3]) && !isNaN(msg[4]) && (OLDBOOKS.map(function (bk) { return bk.toLowerCase(); }).includes(msg[2]) ||
            NEWBOOKS.map(function (bk) { return bk.toLowerCase(); }).includes(msg[2]))) {
            book = msg[2].charAt(0).toUpperCase() + msg[2].slice(1);
            passage = msg[1] + book + msg[3] + "." + msg[4];
        }
        if (book) {
            var busca = getHolyPassage(passage, reply);
            busca.then(function (resp) {
                reply = resp;
                sendMessage(telegram_url, message, reply, res);
            });
        }
        else {
            reply = "Book informed not exist!";
            sendMessage(telegram_url, message, reply, res);
        }
    }
    return res.end();
});
var port = process.env.PORT || 3000;
app.listen(port, function () { return console.log("Telegram bot is listening on port 3000"); });
var generateRandomPhrase = function (max, exclude) {
    max = Math.ceil(max);
    var min = Math.floor(0);
    var rand = Math.floor(Math.random() * (max - min)) + min;
    if (rand === exclude) {
        return generateRandomPhrase(max, exclude);
    }
    else {
        return rand;
    }
};
var getHolyPassage = function (passage, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, axios_1.default.get("https://api.biblia.com/v1/bible/content/LEB.txt.txt?passage=" + passage + "&key=" + process.env.BOOK_KEY)
                        .then(function (retorno) {
                        if (retorno.status !== 200) {
                            reply = "Passage not found ";
                        }
                        else {
                            reply = retorno.data + " " + passage;
                        }
                    })];
            case 1:
                _a.sent();
                return [3 /*break*/, 3];
            case 2:
                err_1 = _a.sent();
                console.error(err_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/, reply];
        }
    });
}); };
var OLDBOOKS = ["Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy", "Joshua", "Judges", "Samuel", "Kings", "Chronicles", "Nehemiah", "Job", "Psalm", "Proverbs", "Ecclesiastes", "Isaiah", "Jeremiah", "Ezekiel", "Daniel", "Hosea", "Joel", "Amos", "Jonah", "Naum", "Micah", "Habakkuk", "Zephaniah", "Haggai", "Malachi"];
var NEWBOOKS = ["Matthew", "Mark", "Luke", "John", "Acts", "Romans", "Corinthians", "Galatians", "Ephesians", "Philippians", "Colossians", "Thessalonians", "Timothy", "Titus", "Hebrews", "James", "Peter", "Jude", "Revelation"];
var RANDOM_PASSAGES = ["Daniel12.3", "John1.1", "Isaiah57.18", "Acts16.31"];
