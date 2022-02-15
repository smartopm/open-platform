import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/react-testing';
import { Context } from '../../../../containers/Provider/AuthStateProvider';
import authState from '../../../../__mocks__/authstate';
import { TaskContext } from '../../Context';
import MockedThemeProvider from '../../../__mocks__/mock_theme';
import taskMock from '../../__mocks__/taskMock'
import ProjectOverview from '../Components/ProjectOverview';
import { UserFormPropertiesQuery } from '../../../Forms/graphql/forms_queries';


jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());
describe('Project Processes Split View', () => {
  const mocks = [
    {
      request: {
        query: UserFormPropertiesQuery,
        variables: {
          userId: authState.user.id,
          formUserId: taskMock.id
        }
      },
      result: {
       data: {
        formUserProperties:[
          {
            formProperty: {
              fieldName: 'Project Developer',
              fieldType: 'text',
              fieldValue: [
                {
                  value: "",
                  label: ""
                }
              ],
              id: '3145c47e-1279-47b0-9dac-dc4a7e30562e',
              groupingId: '3145c47e-1279-47b0-9dac',
              adminUse: false,
              order: '1'
            },
            value: 'Development Co.',
            imageUrl: 'https://image.com',
            fileType: null,
            fileName: 'img.jpg',
            createdAt: "2020-10-07T09:37:03Z",
            user: {
              name: authState.user.name
            }
          },
        ]
        }
      }
    }
  ];

  it('should render correctly', async () => {
    render(
      <Context.Provider value={authState}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <BrowserRouter>
            <MockedThemeProvider>
              <TaskContext.Provider
                value={{
                  authState,
                  updateStatus: {},
                  handleMessageAlertClose: jest.fn
              }}
              >
                <ProjectOverview data={taskMock} />
              </TaskContext.Provider>
            </MockedThemeProvider>
          </BrowserRouter>
        </MockedProvider>
      </Context.Provider>
    );

    expect(screen.getByTestId("project-information")).toBeInTheDocument();
  });

  it('should render No Project Information', async () => {
   render(
     <Context.Provider value={authState}>
       <MockedProvider mocks={[]} addTypename={false}>
         <BrowserRouter>
           <MockedThemeProvider>
             <TaskContext.Provider
               value={{
                  authState,
                  updateStatus: {},
                  handleMessageAlertClose: jest.fn
              }}
             >
               <ProjectOverview data={taskMock} />
             </TaskContext.Provider>
           </MockedThemeProvider>
         </BrowserRouter>
       </MockedProvider>
     </Context.Provider>
    );

    expect(screen.getByText('processes.no_form_data')).toBeInTheDocument();
  });
});
