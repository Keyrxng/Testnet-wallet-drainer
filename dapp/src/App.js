// import logo from './logo.svg';
import './App.css'
import React from 'react'
import { useMoralis, useChain } from 'react-moralis'
import { Container, Button, Box, Paper } from '@mui/material'
import BottomNav from './components/BottomNav'
import DataGrid1 from './components/TokenGrid'
import burnerABI from './burnerAbi.json'
import swal from 'sweetalert'

const App = () => {
  const {
    authenticate,
    isAuthenticated,
    user,
    logout,
    enableWeb3,
    Moralis,
    chainId,
    isWeb3EnableLoading,
    isWeb3Enabled,
  } = useMoralis()
  const { switchNetwork } = useChain()

  const burner = '0x6d3da290C8db6bD0dE83570c18457f5220C6082e'
  const IERC20 = [
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'owner',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'spender',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'value',
          type: 'uint256',
        },
      ],
      name: 'Approval',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'from',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'to',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'value',
          type: 'uint256',
        },
      ],
      name: 'Transfer',
      type: 'event',
    },
    {
      inputs: [],
      name: 'totalSupply',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'account',
          type: 'address',
        },
      ],
      name: 'balanceOf',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'to',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: 'amount',
          type: 'uint256',
        },
      ],
      name: 'transfer',
      outputs: [
        {
          internalType: 'bool',
          name: '',
          type: 'bool',
        },
      ],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'owner',
          type: 'address',
        },
        {
          internalType: 'address',
          name: 'spender',
          type: 'address',
        },
      ],
      name: 'allowance',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'spender',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: 'amount',
          type: 'uint256',
        },
      ],
      name: 'approve',
      outputs: [
        {
          internalType: 'bool',
          name: '',
          type: 'bool',
        },
      ],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'from',
          type: 'address',
        },
        {
          internalType: 'address',
          name: 'to',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: 'amount',
          type: 'uint256',
        },
      ],
      name: 'transferFrom',
      outputs: [
        {
          internalType: 'bool',
          name: '',
          type: 'bool',
        },
      ],
      stateMutability: 'nonpayable',
      type: 'function',
    },
  ]

  let values = []
  let use = []
  let tokenSets
  let usageCount
  const matic = '0x13881'
  const avax = '0xa869'
  const bsc = '0x61'

  const connectorId = window.localStorage.getItem('connectorId')
  if (isAuthenticated && !isWeb3Enabled && !isWeb3EnableLoading) {
    enableWeb3({ provider: connectorId })
    if (chainId !== '0x13881' && '0xa869' && '0x61') {
      swal('The only supported testnets right now are: MATIC, BSC, AVAX')
    } else {
      if (chainId === '0x13881' || '0xa869' || '0x61') {
        load()
        swal("Don't forget about that donate button!")
      }
    }
  }

  async function load() {
    enableWeb3({ provider: 'metamask' })
    let balances = []
    let network = chainId

    if (network === avax) {
      balances = await Moralis.Web3API.account.getTokenBalances({
        chain: `0xa869`,
      })
    }
    if (network === matic) {
      balances = await Moralis.Web3API.account.getTokenBalances({
        chain: `mumbai`,
      })
    }
    if (network === bsc) {
      balances = await Moralis.Web3API.account.getTokenBalances({
        chain: `bsc testnet`,
      })
    }

    fetchData()

    let addressz = balances.map((balances) => balances.token_address)
    let balz = balances.map((balances) => balances.balance)

    for (let i = 0; i < addressz.length; i++) {
      let formatted = Moralis.Units.Token(balz[i], '18')
      let address = addressz[i]

      if (formatted > 0) {
        values.push(formatted)
        console.log(formatted)
        use.push(address)
      }
    }
  }

  async function fetchData() {
    const sets = await Moralis.executeFunction({
      contractAddress: burner,
      functionName: 'tokenSetsDestroyed',
      abi: burnerABI,
    })
    console.log('sets: ', sets)
  }

  async function approveAll() {
    await Moralis.executeFunction({
      contractAddress: burner,
      functionName: 'approveAll',
      abi: burnerABI,
      params: {
        _tokens: use,
      },
    })
    burnTx()
  }

  async function burnTx() {
    const burnTx = await Moralis.executeFunction({
      contractAddress: burner,
      functionName: 'batchBurn',
      abi: burnerABI,
      params: {
        _tokens: use,
        _amounts: values,
      },
    })
    await burnTx.then(
      swal({
        title: 'Transaction Success',
        text: 'All of your tokens have been burned!',
        icon: 'success',
        dangerMode: false,
      }).then(() => {
        window.location.reload()
      }),
    )
  }

  if (!isAuthenticated) {
    return (
      <div
        style={{
          backgroundColor: '#E0E0E0',
          color: 'black',
          height: '100vh',
          width: '100vw',
          justifyContent: 'middle',
        }}
      >
        <Container
          style={{
            justifyContent: 'center',
            display: 'grid',
            height: '100%',
            maxWidth: '100%',
            color: 'aqua',
            fontFamily: 'sans-serif',
            backgroundColor: 'lightslategray',
            borderColor: 'white',
          }}
        >
          <div>
            <h1>Automatic ERC20 Token Burner!</h1>
            <h3>
              <big>SOLE USE-CASE</big> is for the easy burning and destruction
              of held token balances accrued during testing and development.
            </h3>
            <ul>
              <li>
                User signs a transaction allowing access to token information.
              </li>
              <li>
                Tokens are returned in a react data grid with the given
                information:
              </li>
              <ul>
                <li>
                  Id <small>(DataGrid identifier)</small>
                </li>
                <li>Token Name</li>
                <li>Token Address</li>
                <li>Token Balance</li>
              </ul>
              <li>
                User clicks 'Autodrain' and MetaMask will ask for approval for
                each token with a valid balance.
              </li>
              <ul>
                <li>
                  A single approval call will be be made for the exact balance
                  of the valid token
                </li>
              </ul>
              <li>
                The smart contract will then destory all held tokens by sending
                them to the '0x000..DeAd' address
              </li>
              <ul>
                <li>
                  Effectively burning each token but a more generalised approach
                  in case of lack of burn functionality
                </li>
              </ul>
              <li>
                Your wallet is now clean and ready for more useless demo tokens
              </li>
            </ul>

            <h3 align="left">Languages, Tools & Frameworks:</h3>
            <p>
              <a href="https://nodejs.org" target="_blank" rel="noreferrer">
                {' '}
                <img
                  src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original-wordmark.svg"
                  alt="nodejs"
                  width="60"
                  height="60"
                />{' '}
              </a>{' '}
              <a
                href="https://developer.mozilla.org/en-US/docs/Web/JavaScript"
                target="_blank"
                rel="noreferrer"
              >
                {' '}
                <img
                  src="https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg"
                  alt="javascript"
                  width="60"
                  height="60"
                />{' '}
              </a>
              <a
                href="https://docs.soliditylang.org/"
                target="_blank"
                rel="noreferrer"
              >
                {' '}
                <img
                  src="https://www.logosvgpng.com/wp-content/uploads/2018/10/solidity-logo-vector.png"
                  alt="solidity"
                  width="60"
                  height="60"
                />{' '}
              </a>
              <a
                href="https://trufflesuite.com/"
                target="_blank"
                rel="noreferrer"
              >
                {' '}
                <img
                  src="https://trufflesuite.com/assets/logo.png"
                  alt="truffle"
                  width="60"
                  height="60"
                />{' '}
              </a>
            </p>
            <h3 align="left">Current Supported Chains:</h3>
            <p>
              <a href="https://nodejs.org" target="_blank" rel="noreferrer">
                {' '}
                <img
                  src="https://bitbill.oss-accelerate.aliyuncs.com/pics/coins/bsc.svg"
                  alt="Binance Smart Chain"
                  width="60"
                  height="60"
                />{' '}
              </a>
              <a href="https://nodejs.org" target="_blank" rel="noreferrer">
                {' '}
                <img
                  src="https://research.binance.com/static/images/projects/matic-network/logo.png"
                  alt="Polygon"
                  width="60"
                  height="60"
                />{' '}
              </a>
              <a href="https://nodejs.org" target="_blank" rel="noreferrer">
                {' '}
                <img
                  src="https://cryptologos.cc/logos/avalanche-avax-logo.svg?v=022"
                  alt="Avalanche"
                  width="60"
                  height="60"
                />{' '}
              </a>
            </p>

            <Button
              style={{
                display: 'flex',
                justifyContent: 'center',
                margin: 'auto',
                backgroundColor: '#FFFFFF',
                color: 'black',
              }}
              variant="contained"
              onClick={async () =>
                authenticate({
                  signingMessage:
                    'Demo tokens, who needs em? I hope this tool helps save you time!',
                })
              }
            >
              <big>Authenticate</big>
            </Button>
          </div>
          <BottomNav />
        </Container>
      </div>
    )
  }

  return (
    <div
      className="App"
      style={{
        backgroundColor: '#E0E0E0',
        height: '100vh',
        width: '100vw',
        justifyContent: 'middle',
      }}
    >
      <Container style={{ display: 'grid' }}>
        <Button
          style={{
            marginTop: '10px',
            margin: '5px',
            backgroundColor: '#FFFFFF',
            color: 'black',
          }}
          variant="contained"
          onClick={() => logout()}
        >
          Logout
        </Button>
        <Button
          style={{ margin: '5px', backgroundColor: '#FFFFFF', color: 'black' }}
          variant="contained"
          onClick={() => approveAll()}
        >
          AutoDrain
        </Button>
        <Box>
          <div style={{ height: '100%', width: '70%', float: 'left' }}>
            {user ? <DataGrid1 user={user} /> : <DataGrid1 user={user} />}
          </div>
          <Paper
            style={{
              display: 'grid',
              height: '100%',
              marginLeft: '70%',
              maxWidth: '100%',
              color: 'aqua',
              font: 'message-box',
              backgroundColor: 'lightslategray',
              borderColor: 'white',
            }}
          >
            <h3 align="center">Network Quick Switch</h3>
            <p>
              {' '}
              <img
                src="https://bitbill.oss-accelerate.aliyuncs.com/pics/coins/bsc.svg"
                alt="Binance Smart Chain"
                width="60"
                height="60"
                padding="10px"
                margin="10px"
                onClick={() => switchNetwork(bsc)}
              />{' '}
              <img
                src="https://research.binance.com/static/images/projects/matic-network/logo.png"
                alt="Polygon"
                width="60"
                height="60"
                padding="10px"
                margin="10px"
                onClick={() => switchNetwork(matic)}
              />{' '}
              <img
                src="https://cryptologos.cc/logos/avalanche-avax-logo.svg?v=022"
                alt="Avalanche"
                width="60"
                height="60"
                padding="10px"
                margin="10px"
                onClick={() => switchNetwork(avax)}
              />{' '}
            </p>
            <Paper
              style={{
                width: '35%',
                margin: '5px',
              }}
            >
              <div>{tokenSets}</div>
            </Paper>
            <Paper
              style={{
                width: '35%',
                margin: '5px',
                align: 'right',
              }}
            >
              {usageCount}
            </Paper>
            <h1>Instructions For Use!</h1>

            <h3>1. Authenticate</h3>
            <small>
              <big>
                Authentication allows your held token information to be
                gathered. You have succeeded if you are reading this!
              </big>
            </small>
            <h3>2. Select 'Autodrain'</h3>
            <small>
              <big>
                MetaMask will run through all held tokens and ask you to sign
                the approval for each, once completed it'll approve the contract
                to destroy them.{' '}
              </big>{' '}
            </small>
            <h3>3. Further updates to come...</h3>
          </Paper>
        </Box>
        <div></div>
        <BottomNav />
      </Container>
    </div>
  )
}

export default App
