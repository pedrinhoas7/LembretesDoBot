const TelegramBot = require(`node-telegram-bot-api`)
const $ = require("jquery");
const Lembrete = require("./model/lembrete");




const TOKEN = `1938200707:AAFP2NKuXhEyBLYtZRn-V-Xa0Y0DVd3bTXc`
var [emojiList,emojiDel,emojiEdit,emojiSave,emojiRobot,emojiHeart,emojiLemb,emojiTime]=["\u{1F4C3}","\u{274C}","\u{270F}","\u{2705}","\u{1F916}","\u{1F60D}","\u{1F4CC}","\u{1F551}"]


const bot = new TelegramBot(TOKEN, { polling: true })

bot.onText(/\/start/, (msg, match) => {
    console.log('aq')
    saudacoes(msg, true)
});

bot.onText(/\/lembrete/, (msg, match) => {
    const chatId = msg.chat.id;
    const resp = match[1];
    bot.sendMessage(chatId, `${emojiRobot} O BOT foi programado para reconhecer um comando:
        \n*funções para lembrete
        \n${emojiList} /allLembrete
        \n${emojiList} /getLembreteId id
        \n${emojiDel} /deleteLembreteId id
        \n${emojiEdit} /updateLembrete id, nome,descricao, hora 
        \n${emojiSave} /createLembrete nome, descricao, horas`);  
});

bot.onText(/\/allLembrete/,(msg, match) => {
    const chatId = msg.chat.id;
    /* criaLembrete('pedro',horas,'Estudar Programação') */
    lembreteGetAll(chatId)
})

bot.onText(/\/getLembreteId/,(msg, match) => {
    const chatId = msg.chat.id;
    const resp = match[1];
    var id = msg.text.toString().toLowerCase().substr(14,100)
    parseInt(id)
    if(id>0){
        lembreteGetById(chatId,id)
    }else{
        bot.sendMessage(chatId, `Id invalido ou inexistente ${emojiDel}`)
    }   
});


bot.onText(/\/deleteLembreteId/,(msg, match) => {
    const chatId = msg.chat.id;
    const resp = match[1];
    var id = msg.text.toString().toLowerCase().substr(17,100)
    parseInt(id)
    if(id>0){
        lembreteDestroy(chatId,id)
    }else{
        bot.sendMessage(chatId, `Id invalido ou inexistente ${emojiDel}`)
    }   
});

bot.onText(/\/createLembrete/,(msg, match) => {
    obj = msg.text.toString().toLowerCase().substr(15,100)
    var re = /\s*,\s*/;
    var lembrete = obj.split(re);
    nome = lembrete[0]
    descricao = lembrete[1]
    horas = lembrete[2]
    const chatId = msg.chat.id;
    const resp = match[1];
    lembreteSave(chatId,nome,descricao,horas)   
});

bot.onText(/\/updateLembrete/,(msg, match) => {
    const chatId = msg.chat.id;
    const resp = match[1];
    obj = msg.text.toString().toLowerCase().substr(15,100)
    var re = /\s*,\s*/;
    var lembrete = obj.split(re);
    id = parseInt(lembrete[0])
    nome = lembrete[1]
    descricao = lembrete[2]
    hora = lembrete[3]
    lembreteUpdate(id,nome, descricao, hora, chatId)
});


function saudacoes(msg, status){
    var [boa, bom, dia, tarde, noite, oi, ola, tchau, start] = ["boa", "bom", "dia", "tarde", "noite", "oi", "olá", "tchau","start"]
    /* START */
    if (status) {
        if(bot.sendMessage(msg.chat.id, "Bem vindo  " + msg.from.first_name + emojiHeart)){
            defaultMensage(msg.chat.id)
        }
    }
    /* OI */
    if (msg.text.toString().toLowerCase().indexOf(oi) === 0) {
        if(bot.sendMessage(msg.chat.id, "Oi  " + msg.from.first_name + emojiHeart)){
            defaultMensage(msg.chat.id)
        }
    }
    /* OLA */
    if (msg.text.toString().toLowerCase().indexOf(ola) === 0) {
        if(bot.sendMessage(msg.chat.id, "Olá " + msg.from.first_name + emojiHeart)){
            defaultMensage(msg.chat.id)
        }
    }
    /* BOM */
    if (msg.text.toString().toLowerCase().indexOf(bom) === 0) {
        /* DIA */
        if ((msg.text.toString().toLowerCase().indexOf(dia) === 4)) {
            if(bot.sendMessage(msg.chat.id, "Bom dia  " + msg.from.first_name + emojiHeart)){
                defaultMensage(msg.chat.id)
            }
        }
    }
    /* BOA */
    if (msg.text.toString().toLowerCase().indexOf(boa) === 0) {
        /* TARDE */
        if ((msg.text.toString().toLowerCase().indexOf(tarde) === 4)) {
            if(bot.sendMessage(msg.chat.id, "Boa Tarde  " + msg.from.first_name + emojiHeart)){
                defaultMensage(msg.chat.id)
            } 
        }
        /* NOITE */
        if ((msg.text.toString().toLowerCase().indexOf(noite) === 4)) {
            if(bot.sendMessage(msg.chat.id, "Boa Noite  " + msg.from.first_name + emojiHeart)){
                defaultMensage(msg.chat.id)
            } 

        }

    }
    /* TCHAU */
    if (msg.text.toString().toLowerCase().indexOf(tchau) === 0) {
        bot.sendMessage(msg.chat.id, "Tchau  " + msg.from.first_name + emojiHeart)
    }
}
async function lembreteDestroy(chatId,id){
    try{
        const lembrete = await Lembrete.findByPk(id);
        await lembrete.destroy();
        bot.sendMessage(chatId, "Lembrete excluido" + emojiDel)

    }catch(e){
        bot.sendMessage(chatId, `Erro, verifique se os dados existem` + emojiDel);
    }
    
}
async function lembreteGetById(chatId,id){
    try{
        const lembrete = await Lembrete.findByPk(id);
        JSON.stringify(lembrete)
        bot.sendMessage(chatId, `${emojiLemb} ${lembrete.id}
            \n${lembrete.nome}
            \n${lembrete.descricao}
            \n${emojiTime} ${lembrete.hora}`);
    }catch(e){
        bot.sendMessage(chatId, `Lembrete não existe` + emojiDel);
    }
        
}

async function lembreteGetAll(chatId){
    try{
        const lembretes = await Lembrete.findAll({
            where: {
              chatId: chatId
            }
          });
        console.log(lembrete)
        lembretes.map(l => {
            id = l.id
            nome = l.nome
            descricao = l.descricao
            hora = l.hora
            bot.sendMessage(chatId, `${emojiLemb} ${id}
                \n${nome}
                \n${descricao}
                \n${emojiTime} ${hora}`);
        });
    }catch(e){
        bot.sendMessage(chatId, `Não existe nenhum lembrete` + emojiDel);
    }
    
}
async function lembreteUpdate(id,nome, descricao, hora, chatId) {
    try{
        await Lembrete.update({ nome: nome, descricao: descricao, hora: hora }, {
            where: {
              id: id
            }
          });
          bot.sendMessage(chatId, `Lembrete Atualizado ${emojiSave}`);
    }catch(e){
          bot.sendMessage(chatId, `Erro Interno ${emojiRobot}`);
    }

}

function lembreteSave(chatId,nome, descricao, hora) {
    (async () => {
        const database = require('./db.js');
        const Lembrete = require('./model/lembrete');
        try {
            const resultado = await database.sync();
            const resultadoCreate = await Lembrete.create({
                chatId: chatId,
                nome: nome,
                hora: hora,
                descricao: descricao
            })
            bot.sendMessage(chatId, `Lembrete salvo ${emojiSave}`);
        } catch (error) {
            bot.sendMessage(chatId, `Erro Interno ${emojiRobot}`);
        }
    })();
}
function defaultMensage(msgChatId) {
    bot.sendMessage(msgChatId, `${emojiRobot}O BOT foi programado para reconhecer um comando:
    \n${emojiLemb} LEMBRETE:  /lembrete`);
}


/* VERIFICA SE TEM ALGUM LEMBRETE AGENDADO */
setInterval(async () => {
    date = new Date()
    str = `${date}`
    hora = str.substr(16, 5)
    try{
        const lembrete = await Lembrete.findAll({
            where: {
              hora: hora
            }
          });
          lembrete.map(l => {
            id = l.id
            chatId = l.chatId
            nome = l.nome
            descricao = l.descricao
            hora = l.hora
            
            bot.sendMessage(chatId, `${emojiLemb} ${id}
                \n${nome}
                \n${descricao}
                \n${emojiTime} ${hora}`);

            bot.sendMessage(chatId, `Passando aqui para te lembrar \u{261D}...`);
        }); 
        
    }catch(e){
        console.log(e)

    }
    
}, 60000);