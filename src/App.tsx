import { useEffect, useState, useRef } from 'react'

import Link from '@material-ui/core/Link'
import Button from '@material-ui/core/Button'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import Checkbox from '@material-ui/core/Checkbox'
import TextField from '@material-ui/core/TextField'
import InputLabel from '@material-ui/core/InputLabel'
import Typography from '@material-ui/core/Typography'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'

import { makeStyles } from '@material-ui/core/styles'
import users from './users.json'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    margin: '0 auto',
    width: '100%',
    maxWidth: 1100,
    '& > * + *': {
      marginTop: theme.spacing(3)
    }
  },
  serverLink: {
    minWidth: 230
  },
  formControl: {
    minWidth: 200
  },
  productWrapper: {
    display: 'flex',
    flexDirection: 'column',
    '& > * + *': {
      marginTop: theme.spacing(3)
    }
  },
  serversList: {
    display: 'flex',
    flexDirection: 'column',
    '& > * + *': {
      marginTop: theme.spacing(2)
    }
  },
  server: {
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    '& > * + *': {
      marginLeft: theme.spacing(2)
    }
  },
  deployingOverlay: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: -6,
    right: -8,
    bottom: -4,
    left: -8,
    background: 'rgba(0,0,50,0.4)',
    backdropFilter: 'blur(1px)',
    borderRadius: 4,
    zIndex: 10,
    color: 'white',
    margin: '0 !important'
  },
  checkboxWrapper: {
    marginLeft: 'auto'
  }
}))

function Server({ link }: { link: string }) {
  const [user, setUser] = useState('')
  const [branch, setBranch] = useState('')
  const [tests, setTests] = useState(false)
  const [deploying, setDeploying] = useState(false)
  const [isDeployed, setIsDeployed] = useState(false)
  const classes = useStyles()

  function preventDefault(event: any) {
    event.preventDefault()
  }

  function handleChangeUser(
    event: React.ChangeEvent<{
      name?: string | undefined
      value: unknown
    }>
  ) {
    setUser(event.target.value as string)
  }

  function handleChangeBranch(
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) {
    setBranch(event.target.value)
  }

  function handleChangeTests(event: React.ChangeEvent<HTMLInputElement>) {
    setTests(event.target.checked)
  }

  function handleDeploy() {
    setIsDeployed(false)
    setDeploying(true)
  }

  const [countdownValue, setCountdownValue] = useState(9)
  const timerRef = useRef<NodeJS.Timeout | undefined>()

  useEffect(() => {
    if (deploying) {
      timerRef.current = setInterval(() => {
        setCountdownValue(state => state - 1)
      }, 1000)
    }
  }, [deploying])

  useEffect(() => {
    if (countdownValue === 0 && typeof timerRef.current !== 'undefined') {
      clearInterval(timerRef.current)
      setDeploying(false)
      setCountdownValue(9)
      setIsDeployed(true)
    }
  }, [countdownValue])

  return (
    <div className={classes.server}>
      <Link
        href={`https://${link}/`}
        variant="body1"
        className={classes.serverLink}
      >
        {link}
      </Link>

      <FormControl
        className={classes.formControl + ' select-fix'}
        variant="outlined"
      >
        <InputLabel id="demo-simple-select-label">User</InputLabel>

        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={user}
          onChange={handleChangeUser}
        >
          <MenuItem value="">
            <em>Unassign</em>
          </MenuItem>

          {users.map(user => (
            <MenuItem key={user.id} value={user.id}>
              {user.first_name} {user.last_name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        label="Branch to deploy"
        variant="outlined"
        value={branch}
        onChange={handleChangeBranch}
      />

      {isDeployed && (
        <Link href="#" variant="body1" onClick={preventDefault}>
          Link to Jenkins job
        </Link>
      )}

      <FormControlLabel
        className={classes.checkboxWrapper}
        control={
          <Checkbox
            checked={tests}
            onChange={handleChangeTests}
            name="tests"
            color="primary"
          />
        }
        label="Run tests"
      />

      <Button
        variant="contained"
        color="primary"
        disabled={!user || !branch || deploying}
        onClick={handleDeploy}
      >
        Deploy
      </Button>

      {deploying && (
        <div className={classes.deployingOverlay}>
          <Typography variant="body1">
            Deploying... 00:00:0{countdownValue}
          </Typography>
        </div>
      )}
    </div>
  )
}

export default function App() {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Typography variant="h3" gutterBottom>
        miDeployer 🚀
      </Typography>

      <div className={classes.productWrapper}>
        <Typography variant="h5">CorporateTube</Typography>

        <div className={classes.serversList}>
          <Server link="test.qa1.corporate.tube" />
          <Server link="test.qa2.corporate.tube" />
          <Server link="test.qa3.corporate.tube" />
        </div>
      </div>

      <div className={classes.productWrapper}>
        <Typography variant="h5">WebCast</Typography>

        <div className={classes.serversList}>
          <Server link="webcast-stg.movingimage.com" />
          <Server link="webcast-qa1.movingimage.com" />
        </div>
      </div>

      <div className={classes.productWrapper}>
        <Typography variant="h5">Any other product</Typography>

        <div className={classes.serversList}>
          <Server link="other.qa1.movingimage.com" />
          <Server link="other.qa2.movingimage.com" />
          <Server link="other.qa3.movingimage.com" />
        </div>
      </div>
    </div>
  )
}
