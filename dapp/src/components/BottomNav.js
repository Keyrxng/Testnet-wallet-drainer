import * as React from 'react'
import Box from '@mui/material/Box'
import CssBaseline from '@mui/material/CssBaseline'
import BottomNavigation from '@mui/material/BottomNavigation'
import BottomNavigationAction from '@mui/material/BottomNavigationAction'
import FavoriteIcon from '@mui/icons-material/Favorite'
import GithubIcon from '@mui/icons-material/GitHub'
import Paper from '@mui/material/Paper'
import swal from 'sweetalert'

export default function BottomNav() {
  const [value, setValue] = React.useState(0)
  const ref = React.useRef(null)

  return (
    <Box sx={{ pb: 7 }} ref={ref}>
      <CssBaseline />
      <Paper
        sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}
        elevation={3}
      >
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue)
          }}
        >
          <BottomNavigationAction
            label="Github"
            href="https://github.com/Keyrxng"
            icon={<GithubIcon />}
          />
          <BottomNavigationAction
            label="Donate"
            onClick={() =>
              swal(
                'Testnet ETH/BNB is always appreciated or buy me a coffee: 0x196Ff55Af7Ca5df332faf3A72972dDf6d5e109A4',
              )
            }
            icon={<FavoriteIcon />}
          />
        </BottomNavigation>
      </Paper>
    </Box>
  )
}
