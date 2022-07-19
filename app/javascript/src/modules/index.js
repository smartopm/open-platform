// all modules should be imported in here
import Payments from './Payments';
import Users, { Logout, Profile, MyAccount } from './Users';
import Dashboard from './Dashboard';
import Community from './Community';
import MyForms from './Forms/UserForms';
import Plots, { Maps } from './Plots';
import Communication from './Communication';
import CustomerJourney from './CustomerJourney';
import UserJourneyStats from './CustomerJourney/stats';
import ActionFlows from './ActionFlows';
import TimeCard from './TimeCard';
import LogBook from './LogBook';
import Portal from './Portal'; // thebe portal
import Properties from './Plots/Properties';
import UserPayments from './Payments/UserPayments';
import MakeAPayment from './Payments/TransactionLogs';
import MyMessages from './Messages/MyMessages';
import Search from './Search';
import Processes from './Tasks/Processes';
import Leads from './Users/LeadManagement/Leads';
import ManageForms from './Forms/ManageForms';
import myGuest from './LogBook/GuestInvitation';

// and exported back here
export default [
  Dashboard,
  MyAccount,
  Search,
  Profile,
  MyMessages,
  MyForms,
  myGuest,
  Plots,
  Communication,
  LogBook,
  Payments,
  MakeAPayment,
  UserPayments,
  Leads,
  Processes,
  CustomerJourney,
  UserJourneyStats,
  Users,
  Properties,
  ManageForms,
  Community,
  Portal,
  ActionFlows,
  TimeCard,
  Maps,
  Logout
];
