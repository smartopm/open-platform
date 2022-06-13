/* eslint-disable react/prop-types */
import React, {
  useState,
  useContext,
  useRef,
  useEffect,
  createRef
} from 'react'
import { Button, CircularProgress } from '@mui/material'
import { StyleSheet, css } from 'aphrodite'
import { Link, useLocation, Redirect } from 'react-router-dom'
import { useMutation, useQuery } from 'react-apollo'
import { useTranslation } from 'react-i18next'
import { loginPhoneConfirmCode, loginPhoneMutation } from '../../graphql/mutations'
import { Context as AuthStateContext } from '../../containers/Provider/AuthStateProvider'
import useTimer from '../../utils/customHooks'
import { CurrentCommunityQuery } from '../../modules/Community/graphql/community_query'
import { Spinner } from '../../shared/Loading'
import { ifNotTest, objectAccessor } from '../../utils/helpers';

const randomCodeData = [1, 2, 3, 4, 5, 6, 7]

/* istanbul ignore next */
export default function ConfirmCodeScreen({ match }) {
  const authState = useContext(AuthStateContext)
  const { id } = match.params
  const [loginPhoneComplete] = useMutation(loginPhoneConfirmCode)
  const [resendCodeToPhone] = useMutation(loginPhoneMutation)
  const { data: communityData, loading } = useQuery(CurrentCommunityQuery)
  const [error, setError] = useState(null)
  const [msg, setMsg] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const { state } = useLocation()
  const timer = useTimer(10, 1000)
  const { t } = useTranslation(['login'])

  // generate refs to use later
  // eslint-disable-next-line prefer-const
  let elementsRef = useRef(randomCodeData.map(() => createRef()))
  const submitRef = useRef(null)

  useEffect(() => {
    // force focus to just be on the first element
    // check if the refs are not null to avoid breaking the app
    if (elementsRef.current[1].current) {
      elementsRef.current[1].current.focus()
    }
  }, [])

  function resendCode() {
    setIsLoading(true)
    resendCodeToPhone({
      variables: { phoneNumber: (state && state.phoneNumber) || '' }
    })
      .then(() => {
        setIsLoading(false)
        setMsg(`We have resent the code to +${state.phoneNumber}`)
      })
      .catch(err => {
        setError(err.message)
        setIsLoading(false)
      })
  }

  function handleConfirmCode() {
    setIsLoading(true)

    // Todo: Find more efficient way of getting values from the input
    const code1 = elementsRef.current[1].current.value
    const code2 = elementsRef.current[2].current.value
    const code3 = elementsRef.current[3].current.value
    const code4 = elementsRef.current[4].current.value
    const code5 = elementsRef.current[5].current.value
    const code6 = elementsRef.current[6].current.value

    // Todo: refactor this
    const code = `${code1}${code2}${code3}${code4}${code5}${code6}`

    loginPhoneComplete({
      variables: { id, token: code },
      errorPolicy: 'none'
    })
      .then(({ data }) => {
        authState.setToken({
          type: 'update',
          token: data.loginPhoneComplete.authToken
        })
        setIsLoading(false)
      })
      .catch(err => {
        setError(err.message.replace(/GraphQL error:/, ''))
        setIsLoading(false)
      })
  }

  // Redirect once our authState.setToken does it's job
  if (authState.loggedIn) {
    return <Redirect to={state ? state.from : '/'} /> // state.from
  }

  return (
    <div style={{ height: '100vh' }}>
      <nav className={`${css(styles.navBar)} navbar`}>
        <Link to="/login">
          <i className="material-icons" data-testid="arrow_back">arrow_back</i>
        </Link>
      </nav>
      <div className="container ">
        <div
          className={`row justify-content-center align-items-center ${css(
            styles.welcomeContainer
          )}`}
        >

          { loading
            ? <Spinner />
            : (
              <p data-testid="welcome" className={css(styles.welcomeText)}>
                {t('login.welcome', { appName: communityData?.currentCommunity?.name  })}
              </p>
)
            }
        </div>
        <br />
        <br />
        <div className="row justify-content-center align-items-center">
          {randomCodeData.map((item, index) => (
            <input
              key={item}
              name={`code${item}`}
              maxLength="1"
              type="tel"
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus={ifNotTest()}
              // eslint-disable-next-line security/detect-object-injection
              ref={objectAccessor(elementsRef.current, item)}
              className={`${css(styles.newInput)} code-input-${index}`}
              onChange={() =>
                item < 6
                  ? objectAccessor(elementsRef.current, item + 1).current.focus()
                  : submitRef.current.click()}
              // hide the seventh input for the next ref to work [6]
              hidden={item === 7 && true}
              data-testid="code-input"
            />
          ))}
        </div>

        <br />
        <br />

        {error && <p className="text-center text-danger">{error}</p>}
        {msg && <p className="text-center text-primary">{msg}</p>}
        <div
          className={`row justify-content-center align-items-center ${css(
            styles.linksSection
          )}`}
        >
          <Button
            variant="contained"
            className={`${css(styles.getStartedButton)}`}
            onClick={handleConfirmCode}
            ref={submitRef}
            disabled={isLoading}
            color="primary"
            data-testid="submit_btn"
          >
            {isLoading ? (
              <CircularProgress size={25} color="primary" />
            ) : (
              <span>{t('login.login_button_text')}</span>
            )}
          </Button>
        </div>

        {/* show a button to re-send code */}
        {timer === 0 && (
          <div
            className={`row justify-content-center align-items-center ${css(
              styles.linksSection
            )}`}
          >
            <Button onClick={resendCode} disabled={isLoading}>
              {isLoading ? `${t('common:misc.loading')} ...` : t('login.resend_code')  }
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

const styles = StyleSheet.create({
  getStartedButton: {
    width: '55%',
    height: 51,
    boxShadow: 'none',
    marginTop: 80
  },
  getStartedLink: {
    textDecoration: 'none',
    color: '#FFFFFF'
  },
  linksSection: {
    marginTop: 20
  },
  navBar: {
    boxShadow: 'none',
    backgroundColor: '#fafafa'
  },
  welcomeText: {
    marginTop: 33,
    color: '#1f2026',
    fontSize: 18
  },
  flag: {
    display: 'inline-block',
    marginTop: 7
  },
  countryCode: {
    display: 'inline-block',
    marginTop: -2,
    marginLeft: 6
  },
  welcomeContainer: {
    position: 'relative',
    textAlign: 'center',
    color: 'white'
  },
  phoneCodeInput: {
    marginTop: 50
  },
  newInput: {
    width: 40,
    height: 60,
    fontSize: 27,
    textAlign: 'center',
    border: '2px solid',
    borderRadius: 2,
    borderTop: 'none',
    borderRight: 'none',
    borderLeft: 'none',
    // padding: 20,
    margin: 9
    // paddingRight: 13,
  }
})
