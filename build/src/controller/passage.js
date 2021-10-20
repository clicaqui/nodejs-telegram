"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PassageControler = void 0;
const core_1 = require("@overnightjs/core");
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const passage_1 = require("../service/passage");
const message_1 = require("@src/service/message");
const oldbooks_1 = require("../util/oldbooks");
const newbooks_1 = require("@src/util/newbooks");
let PassageControler = class PassageControler {
    constructor(passage) {
        this.passage = passage;
        this.generateRandomPhrase = (max) => {
            max = Math.ceil(max);
            const min = Math.floor(0);
            const rand = Math.floor(Math.random() * (max - min)) + min;
            return rand;
        };
        this.RANDOM_PASSAGES = [
            'Deuteronomy5.33',
            'Ezekiel34.12',
            '1Chronicles29.5',
            '1Corinthians8.9',
            'John1.1',
            'John5.12',
            'John6.35',
            'John9.5',
            'John11.26',
            '1John2.17',
            '1John3.18',
            'Romans5.10',
            'Romans8.32',
            'Isaiah26.4',
            'Isaiah32.2',
            'Isaiah43.25',
            'Isaiah57.18',
            'Acts16.31',
            'Psalm1.6',
            'Psalm7.10',
            'Psalm27.14',
            'Psalm34.7',
            'Psalm48.14',
            'Psalm72.4',
            'Psalm92.12',
            'Luke21.32',
            'Luke22.26',
            'Psalm2.8',
            'Psalm6.9',
            'Psalm23.4',
            'Psalm118.6',
            'Psalm119.67',
            'Deuteronomy31.6',
            'Proverbs1.10',
            'Revelation3.19',
            'James5.8',
            'Matthew6.33',
            'Matthew11.28',
            'Matthew11.29',
            'Matthew24.35',
        ];
    }
    async getActionPassage(req, res) {
        const OLDBOOKS = Object.entries(oldbooks_1.OldBooks);
        const NEWBOOKS = Object.entries(newbooks_1.NewBooks);
        let reply = 'Hi, find your passage on the Bible...';
        const { message } = req.body;
        const myEditedMessage = message.text.toLowerCase();
        const service = new message_1.MessageService(axios_1.default);
        if (myEditedMessage.indexOf('/start') === 0 ||
            myEditedMessage.indexOf('/help') === 0) {
            reply = "To start type something like... '/find john 3 26' ";
        }
        else if (myEditedMessage.indexOf('/oldtestament') === 0) {
            reply = 'The old testament books are ';
            for (const item in OLDBOOKS) {
                reply += OLDBOOKS[item] + ' ';
            }
        }
        else if (myEditedMessage.indexOf('/newtestament') === 0) {
            reply = 'The new testament books are ';
            for (const item in NEWBOOKS) {
                reply += NEWBOOKS[item] + ' ';
            }
        }
        else if (myEditedMessage.indexOf('/phrases') === 0) {
            const randomPassage = this.RANDOM_PASSAGES;
            const nuRandom = this.generateRandomPhrase(randomPassage.length);
            this.passage = randomPassage[nuRandom];
            const passageService = new passage_1.PassageService(axios_1.default);
            const response = await passageService.findPassage(this.passage, reply);
            reply = response;
        }
        else if (myEditedMessage.indexOf('/find') !== -1 || myEditedMessage.indexOf('/encontre') !== -1) {
            const msg = myEditedMessage.split(' ');
            let book;
            if (msg.length == 4 &&
                !isNaN(msg[2]) &&
                !isNaN(msg[3])) {
                book = OLDBOOKS.find((bk, rk) => {
                    if (bk == msg[1].charAt(0).toUpperCase() + msg[1].slice(1) ||
                        rk == msg[1].charAt(0).toUpperCase() + msg[1].slice(1))
                        bk;
                });
                this.passage = book + msg[2] + '.' + msg[3];
            }
            else if (msg.length == 5 &&
                !isNaN(msg[1]) &&
                !isNaN(msg[3]) &&
                !isNaN(msg[4])) {
                book = OLDBOOKS.find((bk, rk) => {
                    if (bk == msg[2].charAt(0).toUpperCase() + msg[2].slice(1) ||
                        rk == msg[2].charAt(0).toUpperCase() + msg[2].slice(1))
                        bk;
                });
                this.passage = msg[1] + book + msg[3] + '.' + msg[4];
            }
            if (book) {
                console.info(book);
                const passageService = new passage_1.PassageService(axios_1.default);
                const response = await passageService.findPassage(this.passage, reply);
                reply = response;
            }
            else {
                reply = 'Book informed not exist!';
            }
        }
        res.json(reply);
    }
};
__decorate([
    core_1.Post(`${process.env.API_KEY}`),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PassageControler.prototype, "getActionPassage", null);
PassageControler = __decorate([
    core_1.Controller(''),
    __metadata("design:paramtypes", [String])
], PassageControler);
exports.PassageControler = PassageControler;
//# sourceMappingURL=passage.js.map