//LIBRERIAS//
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.get('/', function(request, response) {
	response.sendFile(__dirname + '/views/index.html');
});
app.listen(3000, () => console.log(`FUNCIONAMIENTO CORRECTO`));
//LIBRERIAS//

//-------------------------------------------//

const Monitor = require('ping-monitor');

const logger = require('njs-logger')

const Discord = require('discord.js')

const client = new Discord.Client()

const { Client, MessageEmbed, Guild } = require('discord.js');

const { BOT } = require('./src/config.js');

const fs = require('fs');
 //Definimos fs
let { readdirSync } = require('fs'); //Definimos readdirSync que también lo necesitamos
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./comandos').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	
	const command = require(`./comandos/${file}`);client.commands.set(command.name, command);
}
//-------------PRESENCIA DEL BOT----------------//
client.on("ready", () => {
   function presence() {
   client.user.setPresence({
     status: 'on',
     activity: {
     name: 'Trick X Human server',
     type: 'WATCHING'
     }
   })
   }
   presence();
   console.log(`INICIADO COMO BOT: ${client.user.tag}`); 
});

//---------------------------- CODIGO DEL BOT ----------------------------//

//---------------evento monitor---------------//
  const myMonitor = new Monitor({
    website: 'https://trick-x-human-bot2.elsicopata.repl.co/',
    title: 'Raging Flame',
    interval: 0.1 // minutes
});
  
  let estatus = "";
myMonitor.on('up', function (res, state) {
 estatus = "Online",
 console.log(estatus + ' ' + state.totalRequests + ' ' + ' ' + state.totalDownTimes)
 fs.writeFileSync('estadoserver/estado.js', `${estatus}`)
	fs.writeFileSync('estadoserver/online.js', state.totalRequests)
});

myMonitor.on('down', function (res, state) {
  estatus = "Offline",
  console.log(estatus + state.totalRequests + state.totalDownTimes + state.lastRequest)
  fs.writeFileSync('estadoserver/estado.js', `${estatus}`)
	fs.writeFileSync('estadoserver/offline.js', state.totalDownTimes)
  
});
myMonitor.on('stop', function (website) {
    console.log(website + ' monitor has stopped.');
});


myMonitor.on('error', function (error) {
    console.log(error);
});

//---------------------------------------------//

  const serestado = fs.readFileSync('estadoserver/estado.js')
	const totalup = fs.readFileSync('estadoserver/online.js')
	const totaldown = fs.readFileSync('estadoserver/offline.js')
	const tu = `${totalup}`;
	const td = `${totaldown}`;
	const uptime = parseFloat(`${totalup}`) + parseFloat(`${totaldown}`)
	const uptimepor = totalup * 100 / uptime;
  const a = `${serestado}` ;


//------------------------------------//

client.on('message', async (message) => {

  let prefix = '!th'

  if(message.author.bot) return;
  
  if(!message.content.startsWith(prefix)) return;


  let usuario = message.mentions.members.first() || message.member;
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  let cmd = client.commands.find((c) => c.name === command || c.alias && c.alias.includes(command));
  if(cmd){
    cmd.execute(client, message, args)
  }
  
  let serestado = fs.readFileSync('estadoserver/estado.js')
	let totalup = fs.readFileSync('estadoserver/online.js')
	let totaldown = fs.readFileSync('estadoserver/offline.js')
	let tu = `${totalup}`;
	let td = `${totaldown}`;
	let uptime = parseFloat(`${totalup}`) + parseFloat(`${totaldown}`)
	let uptimepor = totalup * 100 / uptime;
  const a = `${serestado}` ;

	const enviar = "1";
	
	if(command === "estado"){	
 console.log(`${uptime} ` + `${tu} ` + `${td}` + `${uptimepor}`)

 const channelAduit = client.channels.cache.get(883355269827022859);

 const serveroff = new Discord.MessageEmbed()
 .setTitle("ESTADO DEL SERVIDOR")
 .setDescription('El servidor se encuentra ' + serestado + '<a:emoji:882746346761748480>')
 .setTimestamp()
 .setColor("RED")
 .setFooter("TRICK X HUMAN SERVER")
.setThumbnail("https://media.discordapp.net/attachments/842485298993954867/881795896403173466/images.jpeg%22")

		const serveron = new Discord.MessageEmbed()
 .setTitle("ESTADO DEL SERVIDOR")
 .setDescription('El servidor se encuentra ' + serestado + '<a:emoji:882747122225668116>' + uptimepor)
 .setTimestamp()
 .setColor("BLUE")
 .setFooter("TRICK X HUMAN SERVER")
.setThumbnail("https://media.discordapp.net/attachments/842485298993954867/881795896403173466/images.jpeg%22")

const estados = {
Online: serveron,
Offline: serveroff
};
const msg = await message.channel.send(serveroff)

setInterval(() => {
      msg.edit(estados[a]);
}, 5000);
																
                              // add error handling here
}
	
})
		
	



client.login(BOT.token);