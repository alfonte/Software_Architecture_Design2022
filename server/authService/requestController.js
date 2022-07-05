const DAO = require('./DAO.js');
const uuid = require('uuid');
var nodemailer = require('nodemailer');

const serverIp = '109.116.253.181'
const serverPort = '8888'


class RequestController{
    
    constructor(){
        this.dao = new DAO();
    }

    async login(req, res){
        console.log("Login request: "+ JSON.stringify(req.body));
        const data = await this.dao.login(req.body.userName, req.body.password);
        res.send(JSON.stringify(data));
    }

    async logout(req, res){
        console.log("Logout request: "+ JSON.stringify(req.body));
        const data = await this.dao.logout(req.body.id,req.body.token);
        res.send(JSON.stringify(data));
    }

    async register(req, res){
        console.log("Register request: "+ JSON.stringify(req.body));
        let id = uuid.v4();
        const data = await this.dao.register(req.body.userName, req.body.password, req.body.prk, req.body.puk ,req.body.email, id);
        res.send(JSON.stringify(data));
        this.sendEmail(req.body.email, data.id);
    }

    async checkToken(req, res){
        console.log("Check token request: "+ JSON.stringify(req.body));
        const data = await this.dao.checkToken(req.body.id,req.body.token);
        res.send(JSON.stringify(data));
    }

    async sendEmail(email, id){
        console.log("Sending email to: "+ email);
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            service: 'Outlook365',
            auth: {
            user: 'hermesserver@outlook.it', // generated ethereal user
            pass: 'progettoSAD', // generated ethereal password
            },
        });
        
        var mailOptions = {
            from: 'Hermes Server', // Your email here
            to: email,
            subject: 'Account activation',
            text: 'Hello,\n\n' +
            'Please click on the following link to activate your account:\n' +
            'http://' + `${serverIp}:${serverPort}/` + 'activate/' + id + '\n'
        };

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    }

    async activate(req, res){
        console.log("Activate request: "+ JSON.stringify(req.body.id));
        const data = this.dao.confirmAccount(req.params.id);
        if(data == true){
            res.send(JSON.stringify({ok:true}));
        } else {
            res.send(JSON.stringify({ok:false}));
        }
        
    }


}

module.exports = RequestController;