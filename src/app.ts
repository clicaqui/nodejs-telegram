import './util/module-alias';
import './util/config';
import {Server} from '@overnightjs/core';
import bodyParser from 'body-parser';
import { Application } from 'express';
import { PassageControler } from './controller/passage';

export class ServerSetup extends Server {
    constructor(private port:any = 3000) {
        super(process.env.NODE_ENV === 'development');
    }
    public init():void {
        //this.port = process.env.PORT;
        this.setUpExpress();
        this.setUpControllers();
    }
    private setUpExpress():void {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended: true}));
    }
    private setUpControllers():void {
        const passageController = new PassageControler('');
        this.addControllers([passageController]);
    }
    public getApp():Application {
       return this.app;
    }
    public start():void{
        this.port = process.env.PORT ? process.env.PORT : this.port;
        this.app.listen(this.port, () =>  {
            console.info('Servidor ouvindo na porta', this.port);
        });
    }
}


