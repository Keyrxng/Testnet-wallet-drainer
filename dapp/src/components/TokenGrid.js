import React, { useState, useEffect } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import { useMoralis, useChain } from 'react-moralis'

const DataGrid1 = (user) => {
  const {
    enableWeb3,
    Moralis,
    chainId,
    isWeb3Enabled,
    isAuthenticated,
  } = useMoralis()
  const [rows, setRows] = useState([])
  const [rowHeight, setRowHeight] = useState(28)
  const { chain } = useChain()

  useEffect(() => {
    if (rowHeight === 28) {
      setRowHeight(29)
    } else {
      setRowHeight(2)
    }
  }, [rowHeight, rows])

  const matic = '0x13881'
  const avax = '0xa869'
  const bsc = '0x61'

  useEffect(
    (e) => {
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
        let addressz = balances.map((balances) => balances.token_address)
        let balz = balances.map((balances) => balances.balance)
        let namez = balances.map((balances) => balances.name)

        let values = []
        let use = []
        const vals = []

        for (let i = 0; i < addressz.length; i++) {
          let formatted = Moralis.Units.Token(balz[i], '18')
          let address = addressz[i]
          let namep = namez[i]
          if (formatted > 0) {
            values.push(formatted)
            use.push(address)
          }
          let id = i
          let j = { id: id, name: namep, address: address, balance: formatted }

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
    [
      Moralis.Units,
      Moralis.Web3API.account,
      enableWeb3,
      isAuthenticated,
      isWeb3Enabled,
      chain,
      chainId,
    ],
  )

  const row = [...rows]

  const column = [
    { field: 'id', headerName: 'id', flex: 1 },
    { field: 'name', headerName: 'name', flex: 1 },
    { field: 'address', headerName: 'address', flex: 1 },
    { field: 'balance', headerName: 'balance', flex: 1 },
  ]

  useEffect(() => {
    setTimeout(() => {}, 3000)
  }, [])

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <DataGrid
        style={{ borderColor: 'white' }}
        rows={row}
        columns={column}
        autoHeight
        pageSize={15}
        loading
      />
    </div>
  )
}

export default DataGrid1
