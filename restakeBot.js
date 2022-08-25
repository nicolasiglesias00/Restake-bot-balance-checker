
const fetch = require("node-fetch");
let blockchainsArray = ''
let exceptions = ['terra', 'terra2', , 'bitcanna',]
const arrayOfEmptyWallets = [];
require('dotenv').config({ path: './.env' })
const DiscordToken = process.env.WEBHOOK


const all = async () => {
  console.log('Comenzando...')
  let linkPrueba = "https://raw.githubusercontent.com/eco-stake/validator-registry/master/stakely/chains.json";

  let res = await fetch(linkPrueba);
  res = await res.json();
  res = res.chains
  //console.log(res)
  for (const i in res) {
    if (res[i].name === 'agoric') {
      res[i].rpc = "https://agoric-lcd.stakely.io"
      res[i].zeros = 0.000001
      res[i].ticker = 'bld'
      res[i].multiplier = '0.000001'
      res[i].restake.minimum_reward = 0.000491

    } else if (res[i].name === 'bitcanna') {
      res[i].rpc = "https://rest.cosmos.directory/bitcanna"
      res[i].zeros = 0.000001
      res[i].ticker = 'ubcna'
      res[i].restake.minimum_reward = 0.000491
    } else if (res[i].name === 'cosmoshub') {
      res[i].rpc = "https://cosmoshub-lcd.stakely.io"
      res[i].zeros = 0.000001
      res[i].ticker = 'uatom'
      res[i].restake.minimum_reward = 0.01622366
    } else if (res[i].name === 'cryptoorgchain') {
      res[i].rpc = "https://lcd-crypto-org.keplr.app"
      res[i].zeros = 0.00000001
      res[i].ticker = 'basecro'
      res[i].restake.minimum_reward = 0.00205802
    } else if (res[i].name === 'desmos') {
      res[i].rpc = "https://rest.cosmos.directory/desmos"
      res[i].zeros = 0.000001
      res[i].ticker = 'udsm'
      res[i].restake.minimum_reward = 0.026425
    } else if (res[i].name === 'evmos') {
      res[i].rpc = "https://lcd-evmos.keplr.app"
      res[i].zeros = 0.000000000000000001
      res[i].ticker = 'aevmos'
      res[i].restake.minimum_reward = 0.1663743066
    } else if (res[i].name === 'juno') {
      res[i].rpc = "https://juno-lcd.stakely.io"
      res[i].zeros = 0.000001
      res[i].ticker = 'ujuno'
      res[i].restake.minimum_reward = 0.0002363333
    } else if (res[i].name === 'lumnetwork') {
      res[i].rpc = "https://rest.cosmos.directory/lumnetwork"
      res[i].zeros = 0.000001
      res[i].ticker = 'ulum'
      res[i].restake.minimum_reward = 0.232039
    } else if (res[i].name === 'osmosis') {
      res[i].rpc = "https://lcd.osmosis.zone"
      res[i].zeros = 0.000001
      res[i].ticker = 'uosmo'
      res[i].restake.minimum_reward = 0.02510933
    } else if (res[i].name === 'regen') {
      res[i].rpc = "https://rest.cosmos.directory/regen"
      res[i].zeros = 0.000001
      res[i].ticker = 'uregen'
      res[i].restake.minimum_reward = 0.02399366
    } else if (res[i].name === 'secretnetwork') {
      res[i].rpc = "https://rest.cosmos.directory/secretnetwork"
      res[i].zeros = 0.000001
      res[i].ticker = 'uscrt'
      res[i].restake.minimum_reward = 0.00203
    } else if (res[i].name === 'sifchain') {
      res[i].rpc = "https://lcd-sifchain.keplr.app"
      res[i].zeros = 0.000000000000000001
      res[i].ticker = 'rowan'
      res[i].restake.minimum_reward = 0.30
    } else if (res[i].name === 'terra2') {
      res[i].rpc = "https://phoenix-lcd.terra.dev"
      res[i].zeros = 0.000001
      res[i].ticker = 'uluna'
    } else if (res[i].name === 'crescent') {
      res[i].rpc = "https://rest.cosmos.directory/crescent"
      res[i].zeros = 0.000001
      res[i].ticker = 'ucre',
        res[i].restake.minimum_reward = 0.012507
    }
  }

  blockchainsArray = res

  for (const i in exceptions) {
    blockchainsArray = blockchainsArray.filter((item) => item.name !== exceptions[i])
  }

  for (const blockchain of blockchainsArray) {
    let balance, minimumBalance
    let Link = blockchain.rpc + "/cosmos/bank/v1beta1/balances/" + blockchain.restake.address;
    let res = await fetch(Link);
    res = await res.json();
    if (res.balances.length == 0) {
      balance = 0
    }
    //console.log(res.balances)
    console.log('balances recibidos')
    if (res.balances.length === 0) {
      arrayOfEmptyWallets.push(blockchain.name);
    }

    for (const coins of res.balances) {
      if (coins.denom === blockchain.ticker) {
        balance = coins.amount * blockchain.zeros;
        //console.log(balance)
        minimumBalance = blockchain.restake.minimum_reward * blockchain.zeros;


        if (balance <= minimumBalance) {
          arrayOfEmptyWallets.push(blockchain.name);
        }
      }
    }

    //{   "content": "🚨  Rellenar faucet de 🚨 \n- Agoric",   "embeds": null,   "username": "Faucet Intern Bot",   "avatar_url": "https://img.freepik.com/free-vector/copper-water-faucet-with-dripping-water-realistic-isolated-object-retro-style-isolated_1284-62290.jpg?w=2000",   "attachments": [] }
  }
  console.log(arrayOfEmptyWallets)

  let text = `🚨 Rellenar Faucet de 🚨 \n`;

  for (const element of arrayOfEmptyWallets) {
    text = text + "- " + element + "\n";
  }
  console.log(text)
  //await bot.sendMessage('ChatId', text);

  await fetch(DiscordToken, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      "content": text,
      "embeds": null,
      "username": "Faucet Intern Bot",
      "avatar_url": "https://img.freepik.com/free-vector/copper-water-faucet-with-dripping-water-realistic-isolated-object-retro-style-isolated_1284-62290.jpg?w=2000",
      "attachments": []
    })
  })
};

all();



