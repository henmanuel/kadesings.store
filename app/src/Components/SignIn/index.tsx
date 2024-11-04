import React, { useState } from "react"

import '../Login/Login.css'
import { useForm } from "../../hooks/useForm";
import { useFetch } from "../../hooks/useFetch";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { Button, Checkbox, Form, Input, Typography, Flex } from "antd";

const { Text, Title } = Typography;

type FieldType = {
    email?: string;
    username?: string;
    password?: string;
    name?: string;
    lastName?: string;
    phoneNumber?: string;
};

const emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
const phoneRegex = /\+[0-9\s\-\(\)]+/;

const formValidations = {
    email: [ (value: string) => emailRegex.test(value), 'El correo no es válido'],
    username: [ (value: string) => value.length >= 1, 'El username es obligatorio'],
    password: [ (value: string) => value.length >= 8, 'La contraseña debe tener mínimo 8 caracteres'],
    name: [ (value: string) => value.length >= 1, 'El nombre es obligatorio'],
    lastName: [ (value: string) => value.length >= 1, 'El apellido es obligatorio'],
    phoneNumber: [ (value: string) => phoneRegex.test(value) && value.length >= 10, 'El número de teléfono no es válido (+57 3122064939)'],
}

export function SignIn () {

    const {formState, onInputChange, isFormValid, formValidation} = useForm<FieldType>({
        email: '',
        username: '',
        password: '',
        name: '',
        lastName: '',
        phoneNumber: ''
    }, formValidations);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const {state, postFetch} = useFetch('https://api.naturalchat.ai', 'auth/signup');
    const [isChecked, setIsChecked] = useState(false);

    const {email, password, username, name, lastName, phoneNumber} = formState;

    const handleSubmit = async () => {
        setFormSubmitted(true);
        if(!isFormValid) return;
        await postFetch(formState);
    }

    const handleChecked = (event: CheckboxChangeEvent) => {
        const {checked} = event.target;
        setIsChecked(checked);
    }

    return (
        <Flex style={{width: "100%", height: "100vh"}} justify='center' align='center' vertical={true} gap={20}>
            <img src="/logo.png" alt="logo" style={{width: "143px", height: "48px"}} />
            <Title level={3}>Crea una cuenta</Title>
            <Form
                onSubmitCapture={handleSubmit}
                name="basic"
                className="container-form"
                initialValues={{ remember: true }}
                autoComplete="off"
            >
                <Form.Item<FieldType>
                    rules={[{ required: true, message: "Please input your email!" }]}
                >
                    <Input type="email" onChange={onInputChange} name="email" placeholder="Correo electronico" value={email}/>
                    {!!formValidation.emailValid && formSubmitted ? <Text style={{color:'red'}}>{formValidation.emailValid}</Text> : null}
                </Form.Item>

                <Form.Item<FieldType>
                    rules={[{ required: true, message: "Please input your password!" }]}
                >
                    <Input.Password onChange={onInputChange} name="password" placeholder="Contraseña" value={password}/>
                    {!!formValidation.passwordValid && formSubmitted ? <Text style={{color:'red'}}>{formValidation.passwordValid}</Text> : null}
                </Form.Item>

                <Form.Item<FieldType>
                    rules={[{ required: true, message: "Please input your username!" }]}
                >
                    <Input onChange={onInputChange} name="username" placeholder="Username" value={username}/>
                    {!!formValidation.usernameValid && formSubmitted ? <Text style={{color:'red'}}>{formValidation.usernameValid}</Text> : null}
                </Form.Item>

                <Form.Item<FieldType>
                    rules={[{ required: true, message: "Please input your name!" }]}
                >
                    <Input onChange={onInputChange} name="name" placeholder="Nombre" value={name}/>
                    {!!formValidation.nameValid && formSubmitted ? <Text style={{color:'red'}}>{formValidation.nameValid}</Text> : null}
                </Form.Item>

                <Form.Item<FieldType>
                    rules={[{ required: true, message: "Please input your last name!" }]}
                >
                    <Input onChange={onInputChange} name="lastName" placeholder="Apellido" value={lastName}/>
                    {!!formValidation.lastNameValid && formSubmitted ? <Text style={{color:'red'}}>{formValidation.lastNameValid}</Text> : null}
                </Form.Item>

                <Form.Item<FieldType>
                    rules={[{ required: true, message: "Please input your phone number!" }]}
                >
                    <Input type="tel" onChange={onInputChange} name="phoneNumber" placeholder="Numero telefonico" value={phoneNumber}/>
                    {!!formValidation.phoneNumberValid && formSubmitted ? <Text style={{color:'red'}}>{formValidation.phoneNumberValid}</Text> : null}
                </Form.Item>

                <Form.Item<FieldType>>
                    <Flex style={{width: "100%"}} align="center">
                        <Checkbox onChange={handleChecked}>He leído y acepto los </Checkbox>
                        <a style={{color: "#ED612B", borderBottom: "1px solid #ED612B", fontWeight: "600"}}>términos y condiciones</a>
                    </Flex>
                    {!isChecked && formSubmitted ? <Text style={{color:'red'}}>Debe aceptar términos y condiciones</Text> : null}
                </Form.Item>
                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        style={{ width: "100%"}}
                        disabled={state.isLoading}
                    >
                        Registrarte
                    </Button>
                </Form.Item>
                <Form.Item>
                    <Flex style={{width: "100%"}} justify="space-between" align="center">
                        <div
                            className="line-item"
                        ></div>
                        <Text style={{ fontSize: "12px", color: "rgba(0, 0, 0, 0.45)" }}>
                            o Regístrate con
                        </Text>
                        <div
                            className="line-item"
                        ></div>
                    </Flex>
                </Form.Item>
                <Form.Item>
                    <Button type="default" className="button-custom"><img src="/facebook.png"/>Registrarse con Facebook</Button>
                </Form.Item>
                <Form.Item>
                    <Button type="default" className="button-custom"><img src="/google.png"/>Registrarse con Google</Button>
                </Form.Item>
            </Form>
            <Flex justify='center' align="center" style={{width: "100%"}}>¿Ya tienes una cuenta?
                <Button type="link" style={{color: "#ED612B", fontWeight: "600"}}>Inicia sesión</Button>
            </Flex>
        </Flex>
    )
}
