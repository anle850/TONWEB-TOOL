# Installation
```
npm install
```

# Configuration
copy `.env.example` to `.env` and modify your variables

```
MNEMONIC
24 secret phase for your wallet

JETTON_MASTER_ADDRESS
Jetton master address


TON_CENTER_API_KEY
TonCenter API key. Obtained here https://toncenter.com/

```

# Available tools

### Bulk transfer

Copy `receiver.json` to anywhere you want `/tmp/receiver.json` and start adding the list of receipient

Command
```
node bulk_transfer.mjs /tmp/receiver.json
```
