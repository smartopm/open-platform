// all modules should be imported in here
import Payments from './Payments';
import Users, { Logout, Profile } from './Users';
import Dashboard from './Dashboard';
import Community from './Community';
import Forms from './Forms';
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
import MyMessages from './Messages/MyMessages'
import Search from './Search';
import Processes from './Tasks/Processes'
import Leads from './Users/LeadManagement/Leads'

// and exported back here
export default [
  Dashboard,
  Search,
  Profile,
  MyMessages,
  Plots,
  Communication,
  LogBook,
  Payments,
  UserPayments,
  Leads,
  Processes,
  Forms,
  CustomerJourney,
  UserJourneyStats,
  Users,
  Properties,
  Community,
  Portal,
  ActionFlows,
  TimeCard,
  Maps,
  Logout
];