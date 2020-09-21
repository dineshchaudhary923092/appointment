var string = require('./string');
class email extends string {
    constructor() {
        super();
        this.sender = 'smtp://' + encodeURI(this.setting.email_hostname)
            //		this.sender = 'smtp://' + encodeURI("smtp.stackmail.com")
        this.nodeMailer = require("nodemailer");
        const QueryBuilder = require('node-querybuilder');
        this.pool = new QueryBuilder(this.setting, 'mysql', 'pool');
        this.selected_email = this.setting.email_usermail;
        this.transporter = this.nodeMailer.createTransport({
            host: this.setting.smtp_host,
            port: 465,
            secure: true,
            auth: {
                user: this.setting.email_userid,
                pass: this.setting.email_password
            }
        });
        if (typeof this.OneSignal == "undefined") {
            this.OneSignal = require('onesignal')('ZGJkMmExNmEtYjE2Mi00YjJlLTgzMTEtZDBlNzJmMjIxZWU1', '6b501ad6-d70c-4877-b807-7c1f5d537720', true);
        }

    }
    async send_notification(to, from = "", activity = "", notification, notification_id = "") {
        var ids = new Array()
        ids.push(to);
        notification.image = this.setting.base_url + notification.image;
        notification.desc = this.check_var(notification.desc) ? notification.desc : "";
        var message = {
            app_id: "6b501ad6-d70c-4877-b807-7c1f5d537720",
            include_player_ids: ids,

            contents: {
                "en": notification.desc,
            },
            headings: {
                "en": notification.title,
            },
            data: {
                "name": this.setting.app_name,
            },
            large_icon: notification.image,
            small_icon: notification.image,
            android_led_color: this.setting.color_background,
            android_accent_color: this.setting.color_background,
            big_picture: notification.image
        };
        if (this.check_var(notification.url)) {
            message.url = notification.url;
        }
        console.log(message)
        if (typeof to == "string") {
            this.OneSignal.createNotification(message, message.data, to).then(console.log, console.log).catch(console.log);
        }
    }
    select_sql(data) {
        var promise = new Promise((resolve, reject) => {
            var mysql = require('mysql');
            if (data.condition == "" || typeof data.condition == 'undefined') {
                data.condition = {
                    "1": "1"
                };
            }
            var sql_database = mysql.createConnection(this.setting);
            var sql = "";
            if (this.check_var(data.raw)) {
                sql = data.raw;
            } else if (this.check_var(data.get) && this.check_var(data.table)) {
                sql = "SELECT " + data.get + " FROM `" + data.table + "`";
                if (this.check_var(data.condition)) {
                    sql += " WHERE " + data.condition
                }
            }
            sql_database.query(sql, (err, response) => {
                var data_from_db = {};
                if (err) {
                    data_from_db.msg = "Uh oh! Couldn't get results: " + err;
                    data_from_db.data = sql;
                    data_from_db.error = 0;
                    reject(data_from_db);
                } else {
                    response = JSON.parse(JSON.stringify(response));
                    data_from_db.data = Object.keys(response).length == 1 ? (response) : response;
                    data_from_db.data.length = Object.keys(response).length;
                    data_from_db.error = 1;
                    data_from_db.msg = "Please check the data";
                    //					console.log(data_from_db);
                    resolve(data_from_db);
                }
                sql_database.end()
            });
        });
        return promise;
    }
    async insert(data) {
        var promise = new Promise((resolve, reject) => {
            this.pool.get_connection(qb => {
                this.database = qb;
                console.log(data);
                this.database.insert(data.table, data.data, (err, response) => {
                    qb.release();
                    var data_from_db = {};
                    if (err) {
                        data_from_db.msg = "Uh oh! Couldn't insert data: " + err;
                        data_from_db.data = "";
                        data_from_db.error = 0;
                        reject(data_from_db);
                    } else {
                        response = JSON.parse(JSON.stringify(response));
                        data_from_db.data = response.insert_id;
                        data_from_db.error = 1;
                        data_from_db.msg = "Inserted Successfullly";
                        resolve(data_from_db);
                    }
                });
            });
        });
        var result = await promise;

        return result;
    }
    async sendmail(data) {
        var email = this.check_var(data.email) ? email : this.setting.test_email;
        if (data.mail_type == "content") {
            var buffer = (Buffer.from(camp.data[i].content));
            var html = decodeURIComponent(buffer.toString());
            var info = await this.transporter.sendMail({
                from: '"' + this.setting.app_name + '" <' + this.selected_email + '>', // sender address
                to: email, // list of receivers
                subject: data.subject.replace('{app_name}', this.setting.app_name), // Subject line
                html: html, // html body
                replyTo: this.setting.test_email
            })
            console.log(info);
            return true;
        } else {
            var nodeMailer = require("nodemailer");
            var Email = require('email-templates');
            var transporter = nodeMailer.createTransport({
                host: this.setting.email_hostname,
                port: 465,
                secure: true,
                auth: {
                    user: encodeURI(this.setting.email_usermail),
                    pass: this.setting.email_password
                }
            });
            var email = new Email({
                send: true,
                transport: transporter,
                views: {
                    options: {
                        extension: 'ejs' // <---- HERE
                    }
                },
                preview: true,

            });
            var data_merged = Object.assign(data, this.setting);
            console.log('../views/email/' + data_merged.content_id);
            email.send({
                    transport: transporter,
                    template: '../views/email/' + data_merged.content_id,
                    to: email,
                    from: this.setting.email_usermail,
                    subject: data.subject,
                    message: {
                        to: data.email,
                        from: this.setting.email_usermail,
                        subject: data.subject.replace('{app_name}', this.setting.app_name),
                    },
                    locals: data_merged,
                })
                .then(console.log, console.log)
                .catch(console.log);
        }

    }
    check_var(data) {
        if (typeof data == "object") {
            return data && Object.keys(data).length > 0;
        } else if (typeof data == "number") {
            return data;
        } else {
            return typeof data != "undefined" && data.toString().length > 0;
        }
    }
}
module.exports = new email();