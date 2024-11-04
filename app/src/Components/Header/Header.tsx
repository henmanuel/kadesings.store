import './Header.css';
import {Login} from '../Login';
import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import img from '../../static/img/logos.json';

export function Header() {
    const navigate = useNavigate();
    const [goHome, setGoHome] = useState(false);
    const session = !!Object.keys(JSON.parse(localStorage.getItem('session') || '{}')).length;
    const rightBTN = session ? <i className={'small material-icons header__login'}>arrow_drop_down</i> : <p>Iniciar</p>;

    const toHome = () => {
        setGoHome(true);
    };

    if (goHome) {
        navigate('/');
        return null;
    }

    return (
        <header>
            <img className={'header__logo'} src="/logo.png" alt="logo" style={{width: "143px", height: "48px"}} onClick={toHome}/>
            {rightBTN}
        </header>
    )
}
