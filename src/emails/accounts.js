const sgmail =  require('@sendgrid/mail')
sgmail.setApiKey(process.env.SGMAIL)
// const SENDGRID_API_KEY = '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'   
// console.log(SENDGRID_API_KEY);
sgmail.setApiKey(process.env.SGMAIL)


const sendWelcome = (email,name) => {
        sgmail.send({
            to: email,
            from:'hiren.solanki.kevit@gmail.com',
            subject: 'testing email',
            text: `Hi ${name} welcome to joinging`
        })
}
const sendCencle  = (email,name) => {
    sgmail.send({
        to: email,
        from:'hiren.solanki.kevit@gmail.com',
        subject: `Goodbye ${name}`,
        text: `Hi ${name} this is a goodbye email nice to work with you`

    })
}


module.exports = {
    sendWelcome,
    sendCencle
}
// sgmail.send({
//     to:'hiren.solanki.kevit@gmail.com',
//     from:'hiren.solanki.kevit@gmail.com',
//     subject:'Sending email for test',
//     text:'i hope it is working'
// })