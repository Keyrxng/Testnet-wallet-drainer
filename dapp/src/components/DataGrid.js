import * as React from 'react'
import { DataGrid } from '@mui/x-data-grid'
import { useMoralis, useChain } from 'react-moralis'
import swal from 'sweetalert'
import Moralis from 'moralis/types'

const TokenGrid = (user) => {
  const {
    enableWeb3,
    chainId,
    isWeb3EnableLoading,
    isWeb3Enabled,
    isAuthenticated,
  } = useMoralis()
  const [rows, setRows] = useState([])
  const [rowHeight, setRowHeight] = useState(28)
  const { switchNetwork, chain } = useChain()

  // Network ID's in hex
  const matic = '0x13881'
  const avax = '0xa869'
  const bsc = '0x61'
  // datagrid row elements
  const row = [...rows]
  // little sizing issue workaround
  React.useEffect(() => {
    if (rowHeight === 28) {
      setRowHeight(29)
    } else {
      setRowHeight(28)
    }
  }, [rowHeight, rows])

  React.useEffect(
    (e) => {
      const connectorId = window.localStorage.getItem('connectorId')
      if (isAuthenticated && !isWeb3Enabled && !isWeb3EnableLoading) {
        enableWeb3({ provider: connectorId })
        if ((chainId !== matic, avax, bsc)) {
          swal('Accepted Networks: 1.BSC 2.MATIC 3.AVAX').then(
            switchNetwork(avax),
          )
          load()
        } else {
          if (chainId === matic || avax || bsc) {
            load()
            swal(
              'Milk and two sugars if you want to buy me a coffee, hit that donate button!',
            )
          }
        }
      }

      async function load() {
        enableWeb3()
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

        let addresses = balances.map((balances) => balances.token_address)
        let bals = balances.map((balances) => balances.balance)
        let names = balances.map((balances) => balances.name)

        let values = []
        let use = []
        const vals = []

        for (let i = 0; i < addresses.length; i++) {
          let formatted = await Moralis.Units.Token(bals[i], '18')
          let address = addresses[i]
          let name = names[i]
          if (formatted > 0) {
            values.push(formatted)
            use.push(address)
          }
          let id = i
          let j = {
            id: id,
            name: name,
            address: address,
            balance: formatted,
          }

          try {
            vals.push(j)
          } catch (e) {
            console.log(e)
          }
          setRows(vals)
        }
      }
      load()
    },
    [enableWeb3, isAuthenticated, isWeb3Enabled, chain],
  )

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <DataGrid
        style={{ borderColor: 'white' }}
        rows={row}
        columns={column}
        autoHeight
        pageSize={13}
        initialState={row}
        loading
      />
    </div>
  )
}
