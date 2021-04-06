// all modules should be imported in here
import Payments from './Payments';
import Users from './Users';
import Dashboard from './Dashboard';
import Community from './Community';
import Forms from './Forms';
import Plots from './Plots';
import Communication from './Communication';
import CustomerJourney from './CustomerJourney';
import UserJourneyStats from './CustomerJourney/stats';
import ActionFlows from './ActionFlows';
import TimeCard from './TimeCard';
import LogBook from './LogBook';
import Portal from './Portal'; // thebe portal
import Properties from './Plots/Properties';
import UserPayments from './Payments/UserPayments';

// and exported back here
export default [
  Dashboard,
  Plots,
  Communication,
  LogBook,
  Payments,
  UserPayments,
  Forms,
  CustomerJourney,
  UserJourneyStats, 
  Users,
  Properties,
  Community,
  Portal,
  ActionFlows,
  TimeCard,
];