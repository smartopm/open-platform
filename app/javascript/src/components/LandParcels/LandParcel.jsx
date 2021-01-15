/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react'
import { useQuery, useLazyQuery } from 'react-apollo'
import { Grid, Typography, Container } from '@material-ui/core'
import { useHistory } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import { ParcelQuery, LandParcel } from '../../graphql/queries'
import Loading from '../Loading'
import ErrorPage from '../Error'
import ParcelItem from './LandParcelItem'
import CreateLandParcel from './CreateLandParcel'
import LandParcelModal from './LandParcelModal'

export default function LandParcelPage() {
  const limit = 20
  const [offset, setOffset] = useState(0)
  const [open, setDetailsModalOpen] = useState(false)
  /* eslint-disable no-unused-vars */
  const [selectedLandParcel, setSelectedLandParcel] = useState({})
  const history = useHistory()

  const { loading, error, data, refetch } = useQuery(ParcelQuery, {
    variables: { limit, offset }
  })


  const [loadParcel, { loading: parcelDataLoading, error: parcelDataError, data: parcelData }] = useLazyQuery(LandParcel,
    {
      fetchPolicy: 'cache-and-network'
    })

  useEffect(() => {
    const pathName = window.location.pathname
    const paths = pathName.match(/^\/land_parcels\/((?!new)\w+)/)
    if (paths) {
      const urlInfo = pathName.split('/')
      loadParcel({ variables: { id: urlInfo[urlInfo.length - 1] } })
      setSelectedLandParcel(parcelData?.landParcel || {})
      setDetailsModalOpen(true)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, parcelData])

  function handleNextPage() {
    setOffset(offset + limit)
  }

  function handlePreviousPage() {
    if (offset < limit) {
      return
    }
    setOffset(offset - limit)
  }

  function onParcelClick(landParcel) {
    setSelectedLandParcel(landParcel)
    history.push(`/land_parcels/${landParcel.id}`)
    setDetailsModalOpen(true)
  }

  function handleDetailsModalClose() {
    history.push('/land_parcels')
    setDetailsModalOpen(false)
  }

  if (loading || parcelDataLoading) return <Loading />

  if (error) {
    return <ErrorPage title={error.message} />
  }

  if (parcelDataError) {
    return <ErrorPage title={parcelDataError.message} />
  }

  return (
    <>
      <Container>
        <LandParcelModal
          open={open}
          handelClose={handleDetailsModalClose}
          modalType="details"
          landParcel={selectedLandParcel}
        />
        <CreateLandParcel refetch={refetch} />
        <ParcelPageTitle />
        <br />
        {data?.fetchLandParcel.map(parcel => (
          <ParcelItem
            key={parcel.id}
            parcel={parcel}
            onParcelClick={onParcelClick}
          />
        ))}
        <div className="d-flex justify-content-center">
          <nav aria-label="center Page navigation">
            <ul className="pagination">
              <li className={`page-item ${offset < limit && 'disabled'}`}>
                <a className="page-link" onClick={handlePreviousPage} href="#">
                  Previous
                </a>
              </li>
              <li
                className={`page-item ${data.fetchLandParcel.length < limit &&
                  'disabled'}`}
              >
                <a className="page-link" onClick={handleNextPage} href="#">
                  Next
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </Container>
    </>
  )

  function ParcelPageTitle() {
    // eslint-disable-next-line no-use-before-define
    const classes = useStyles()
    return (
      <Grid container spacing={0} className={classes.labelTitle}>
        <Grid xs={2} item>
          <Typography
            variant="subtitle2"
            data-testid="label-name"
            className={classes.label}
          >
            Parcel Number
          </Typography>
        </Grid>
        <Grid xs={2} item>
          <Typography
            variant="subtitle2"
            data-testid="label-name"
            style={{ paddingLeft: '30px' }}
          >
            Address1
          </Typography>
        </Grid>
        <Grid xs={2} item>
          <Typography
            variant="subtitle2"
            data-testid="label-name"
            style={{ paddingLeft: '30px' }}
          >
            Address2
          </Typography>
        </Grid>
        <Grid xs={2} item>
          <Typography
            variant="subtitle2"
            data-testid="label-name"
            style={{ paddingLeft: '15px' }}
          >
            city
          </Typography>
        </Grid>
        <Grid xs={1} item>
          <Typography
            variant="subtitle2"
            data-testid="label-name"
            style={{ paddingRight: '15px' }}
          >
            Postal Code
          </Typography>
        </Grid>
        <Grid xs={1} item>
          <Typography
            variant="subtitle2"
            data-testid="label-name"
            style={{ paddingRight: '15px' }}
          >
            State Province
          </Typography>
        </Grid>
        <Grid xs={1} item>
          <Typography
            variant="subtitle2"
            data-testid="label-name"
            style={{ paddingLeft: '10px' }}
          >
            Country
          </Typography>
        </Grid>
        <Grid xs={1} item>
          <Typography
            variant="subtitle2"
            data-testid="label-name"
            style={{ paddingRight: '15px' }}
          >
            Parcel Type
          </Typography>
        </Grid>
      </Grid>
    )
  }
}

const useStyles = makeStyles(() => ({
  labelTitle: {
    marginTop: '5%'
  }
}))
