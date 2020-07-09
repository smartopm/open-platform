import React from 'react'
import Card from '../components/Card'
import { render,} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { BrowserRouter } from 'react-router-dom/'
import ForumIcon from '@material-ui/icons/Forum'
import { MockedProvider } from '@apollo/react-testing'

describe("Card should render",()=>{
    const authState = {
        loaded: true,
        loggedIn: true,
        setToken: jest.fn(),
        user: {
          avatarUrl: null,
          community: { name: 'Nkwashi' },
          email: '9753942',
          expiresAt: null,
          id: '11cdad78',
          imageUrl: null,
          name: 'John Doctor',
          phoneNumber: '260971500748',
          userType: 'security_guard'
        }
      }
      const card = {
        card_id: 6,
        title: 'My Messages',
        path:
          authState.user.userType === 'admin'
            ? '/messages'
            : `/message/${authState.user.id}`,
  
        clientName: authState.user.name,
        clientNumber: authState.user.phoneNumber,
        from: 'home',
        icon: <ForumIcon fontSize="large"/>,
        access: [
          'admin',
          'client',
          'security_guard',
          'prospective_client',
          'contractor',
          'resident',
          'visitor'
        ]
      }

      it('should render card',()=>{
          const{getByText} = render(
              <MockedProvider>
                  <BrowserRouter>
                  <Card 
                  key={card.card_id}
                  path={card.path}
                  title={card.title}
                  icon={card.icon}
                  from={card.from}
                  access={card.access}
                  authState={authState}
                  clientName={card.clientName}
                  clientNumber={card.clientNumber}
                  id={card.id}
                  handleClick={card.handleClick}
                  />
                  </BrowserRouter>
              </MockedProvider>

          )
          expect(getByText('My Messages')).toBeInTheDocument()
      })

})