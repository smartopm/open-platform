import React,{Fragment} from 'react'
import { StyleSheet, css } from 'aphrodite'
import { useQuery } from 'react-apollo'
import { Campaigns } from "../graphql/queries";


export default function CampaignList() {
    
    const {data, error, loading} = useQuery(Campaigns)

    if (loading) return <p>loading</p>
    console.log(data)

    return(
        <div>
              {data.result.map(campaign =>{
        
           
        
 <Fragment 
            // key={event.id}
            >
            <div className="container">
              <div className="row justify-content-between">
                <div className="col-xs-8">
                  {/* <span className={css(styles.logTitle)}>{visitorName}</span> */}
                <p>one</p>
                </div>
                <div className="col-xs-4">
                  <span className={css(styles.access)}>
                    {/* <strong>{accessStatus} </strong> */}
                    access
                  </span>
                  <span className={css(styles.subTitle)}>
                    {/* {dateToString(event.createdAt)} */}
                    the date 
    
                  </span>
                </div>
              </div>
              <div className="row justify-content-between">
                <div className="col-xs-8">
                  <span className={css(styles.subTitle)}>
                      reason
                      </span>
                </div>
                <div className="col-xs-4">
                  <span className={css(styles.subTitle)}>
                    {/* {dateTimeToString(new Date(event.createdAt))} */}
                    the other date
                  </span>
                </div>
              </div>
              <br />
              <div className="row justify-content-between">
                <div className="col-xs-8">
                  <span className={css(styles.subTitle)}>
                    {/* {event.actingUser && event.actingUser.name} */}
                    The title
                  </span>
                </div>
                <div className="col-xs-4">
    
                  {/* Temperature status placeholder */}
                  {/* <span className={css(styles.subTitle)}> {event.subject==='user_temp' ? 'Temperature Recorded |' + ' ' : ''}</span>
    
                  <span className={css(styles.subTitle)}>
                    {source !== 'Scan' && authState.user.userType === 'admin' && !enrolled ? (
                      <Fragment>
                        <span
                          style={{
                            cursor: 'pointer',
                            color: '#009688'
                          }}
                          onClick={() => enrollUser(event.refId)}
                        >
                          Enroll user{' '}
                        </span>
                        | {source}
                      </Fragment>
                    ) : source === 'Scan' && isDigital !== null ? (
                      `${isDigital ? 'Digital' : 'Print'} Scan`
                    ) : (
                          source
                        )}{' '}
                    |{' '}*/}
                    <span
                      style={{
                        cursor: 'pointer',
                        color: '#009688'
                      }}
                      onClick={() => {
                        routeToAction(event)
                      }}
                    > 
                      More Details
                    </span>
                  {/* </span> */}
                </div>
              </div>
              <br />
            </div>
    
            <div className="border-top my-3" />
          </Fragment>
    })}
        </div>
    )
  

    
}

const styles = StyleSheet.create({
    logTitle: {
      color: '#1f2026',
      fontSize: 16,
      fontWeight: 700
    },
    subTitle: {
      color: '#818188',
      fontSize: 14,
      letterSpacing: 0.17,
      fontWeight: 400
    },
    access: {
      color: '#1f2026',
      fontSize: 14,
      letterSpacing: 0.17,
      fontWeight: 400
    }
  })