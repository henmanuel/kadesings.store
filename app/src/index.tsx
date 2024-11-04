import { ConfigProvider } from 'antd';
import ReactDOM from 'react-dom/client';
import { Route } from 'react-router-dom';
import { App } from './Components/app/App';
import React, { lazy, Suspense } from 'react';
import * as serviceWorker from './serviceWorker';
import { SkeletonHeader } from './Components/Header/skeleton/SkeletonHeader';

const Home = lazy(() => import('./Components/Home/Home').then(({ Home }) => ({ default: Home })));
const NotFound = lazy(() => import('./Components/NotFound').then(({ NotFound }) => ({ default: NotFound })));
const Customer = lazy(() => import('./Components/Customer/Customer').then(({ Customer }) => ({ default: Customer })));
const Dashboard = lazy(() => import('./Components/Dashboard/Dashboard').then(({ Dashboard }) => ({ default: Dashboard })));
const Conversations = lazy(() => import('./Components/Conversations/Conversations').then(({ Conversations }) => ({ default: Conversations })));
const Personality = lazy(() => import('./Components/Personality/Personality').then(({ Personality }) => ({ default: Personality })));
const Flows = lazy(() => import('./Components/Flows/Flows').then(({ Flows }) => ({ default: Flows })));
const Training = lazy(() => import('./Components/Training/Training').then(({ Training }) => ({ default: Training })));
const Channels = lazy(() => import('./Components/Channels/Channels').then(({ Channels }) => ({ default: Channels })));
const Chatbot = lazy(() => import('./Components/Chatbot/Chatbot').then(({ Chatbot }) => ({ default: Chatbot })));
const Users = lazy(() => import('./Components/Users/Users').then(({ Users }) => ({ default: Users })));
const Login = lazy(() => import('./Components/Login/Login').then(({ Login }) => ({ default: Login })));
const SignIn = lazy(() => import('./Components/SignIn').then(({ SignIn }) => ({ default: SignIn })));

const container: any = document.getElementById('root');
const root = ReactDOM.createRoot(container);

root.render(
    <Suspense fallback={<SkeletonHeader />}>
        <ConfigProvider
            theme={{
                components: {
                    Button: {
                        colorPrimary: '#1f2023',
                        algorithm: true,
                    },
                },
            }}
        >
            <App>
                <Route path="/" element={<Home />} />
                <Route path="customer" element={<Customer />}>
                    <Route index element={<Dashboard />} />
                    <Route path="metrics" element={<Dashboard />} />
                    <Route path="conversations" element={<Conversations />} />
                    <Route path="settings/personality" element={<Personality />} />
                    <Route path="settings/flows" element={<Flows />} />
                    <Route path="settings/training" element={<Training />} />
                    <Route path="settings/channels" element={<Channels />} />
                    <Route path="settings/users" element={<Users />} />
                </Route>
                <Route
                    path="chat/:chatbotId"
                    element={
                        <Chatbot wsUrl={'wss://wcm5yje1j4.execute-api.us-east-1.amazonaws.com/staging/'} />
                    }
                />
                <Route path="login" element={<Login />} />
                <Route path="signin" element={<SignIn />} />
                <Route path="*" element={<NotFound />} />
            </App>
        </ConfigProvider>
    </Suspense>
);

serviceWorker.unregister();
