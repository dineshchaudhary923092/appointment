//sam
var mail = require('./common');

function validateEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(String(email).toLowerCase());
}
async function init_email() {
    var camp = await mail.select_sql({
        raw: "SELECT user.name,user.email,user.id as u_id,send_mail.*,email_campaign.subject,email_campaign.type as mail_type,email_campaign.content_id FROM send_mail,email_campaign,user WHERE send_mail.campaign_id = email_campaign.id AND send_mail.receiver=user.id AND send_mail.status = 'pending' LIMIT 5 "
    }).catch(console.log);
    var camp_id = "";
    var s_Email;
    if (mail.check_var(camp) && camp.error == 1) {
        for (var i = 0; i < camp.data.length; i++) {
            await mail.select_sql({
                raw: "UPDATE send_mail SET status = 'sent' WHERE id = '" + camp.data[i]['id'] + "' "
            }).catch(console.log);
            if (validateEmail(camp.data[i].email)) {
                console.log(camp.data[i]['u_id'], camp.data[i]['email']);
                camp.data[i].verify_url = mail.get_token('get-password', camp.data[i]['u_id'], camp.data[i]['email']);
                await mail.sendmail(camp.data[i]).catch(console.log);
            }
        }
    }
}
async function init_notification() {
    var camp = await mail.select_sql({
        raw: "SELECT *,heading as title FROM notification WHERE	push = 'n' LIMIT 5 "
    }).catch(console.log);
    if (mail.check_var(camp) && camp.error == 1) {
        for (var i = 0; i < camp.data.length; i++) {
            var buffer = (Buffer.from(camp.data[i].content));
            var bufferBase64 = decodeURIComponent(buffer.toString());
            var users = await mail.select_sql({
                raw: "SELECT firebase.firebase FROM firebase,user WHERE user.id=firebase.user_id AND  user.id ='" + camp.data[i]['to_user'] + "' LIMIT 20"
            }).catch(console.log);
            if (users.length < 1) {
                await mail.select_sql({
                    raw: "UPDATE notification SET push = 'y' WHERE id = '" + camp.data[i]['id'] + "' "
                }).catch(console.log);
            }
            if (mail.check_var(users) && users.error == 1) {
                for (var j = 0; j < users.data.length; j++) {
                    var notification = {...camp.data[i] };
                    mail.send_notification(users.data[j].firebase, "2", "", notification).catch(console.log);
                }
            }
        }
    }
}
async function send_test() {
    var camp = await mail.select_sql({
        raw: "SELECT * FROM email_camp WHERE status = 't' and admin='" + mail.admin + "'  LIMIT 5 "
    }).catch(console.log);
    if (mail.check_var(camp) && camp.error == 1) {
        for (var i = 0; i < camp.data.length; i++) {
            var buffer = (Buffer.from(camp.data[i].content));
            var bufferBase64 = decodeURIComponent(buffer.toString());
            await mail.select_sql({
                raw: "UPDATE email_camp SET status = 'p' WHERE id = '" + camp.data[i]['id'] + "' "
            }).catch(console.log);
            mail.sendmail(camp.data[i].subject, bufferBase64.replace('{row_id}', '98476'), mail.setting.test_email);
        }
    }
}
async function send_test_notification() {
    var camp = await mail.select_sql({
        raw: "SELECT * FROM notification_camp WHERE status = 't' and admin='" + mail.admin + "'  LIMIT 5 "
    }).catch(console.log);
    var test_users = await mail.select_sql({
        raw: "SELECT firebase.firebase FROM firebase,user WHERE user.id=firebase.user_id AND (user.email= '" + mail.setting.test_email + "' OR user.email= 'sharmahimanshu0405@gmail.com' ) "
    }).catch(console.log);
    if (mail.check_var(camp) && camp.error == 1) {
        for (var i = 0; i < camp.data.length; i++) {
            camp.data[i].image = mail.check_var(camp.data[i].image) ? camp.data[i].image : "https://app.hostsweb.net/sam/assets/images/login.png";
            await mail.select_sql({
                raw: "UPDATE notification_camp SET status = 'p' WHERE id = '" + camp.data[i]['id'] + "' "
            }).catch(console.log);
            console.log(test_users)
            if (mail.check_var(test_users) && test_users.error == 1) {
                for (var j = 0; j < test_users.data.length; j++) {
                    //					console.log(camp.data[i]);
                    var notification = {...camp.data[i]
                    };
                    mail.send_notification(test_users.data[j].firebase, "2", "", notification).catch(console.log);
                }
            }
        }
    }
}
init_email();
setInterval(init_email, 5000);
setInterval(init_notification, 2000);