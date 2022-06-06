import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';

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
            // This didn't have much effect on this meaning there is something wrong with the test
            attachments: null, 
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
                  updateStatus: {message: '', success: false },
                  handleMessageAlertClose: jest.fn()
              }}
              >
                <ProjectOverview data={taskMock} />
              </TaskContext.Provider>
            </MockedThemeProvider>
          </BrowserRouter>
        </MockedProvider>
      </Context.Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("project-information")).toBeInTheDocument();
    }, 5)
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
                  updateStatus: {message: '', success: false },
                  handleMessageAlertClose: jest.fn()
              }}
             >
               <ProjectOverview data={taskMock} />
             </TaskContext.Provider>
           </MockedThemeProvider>
         </BrowserRouter>
       </MockedProvider>
     </Context.Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('processes.no_form_data')).toBeInTheDocument();
    }, 5)
  });
});
