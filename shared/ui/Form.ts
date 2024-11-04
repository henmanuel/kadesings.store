import React, {useEffect, useState} from 'react';
import {Utils} from '../clases/Utils.class';

export const UseForm = (validator: any, callback: Function, updateOrder: any = () => {
}, current: number = 0) => {
    const formData: any = {};
    const [values, setValues] = useState(formData);
    const [errors, setErrors] = useState(formData);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (Object.keys(errors).length === 0 && isSubmitting) {
            callback(values, errors, updateOrder, current);
            setIsSubmitting(false);
        }
    }, [callback, errors, isSubmitting]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        if (event) {
            event.preventDefault();
        }

        setErrors(validator(values));
        setIsSubmitting(true);
    };


    const handleChange = (event: any) => {
        if (Utils.isFunction(event.persist)) {
            event.persist();
        }

        setValues((values: any) => ({...values, [event.target.name]: event.target.value}));
        setIsSubmitting(false);
    };

    return {
        values,
        errors,
        setValues,
        setErrors,
        handleChange,
        handleSubmit,
        isSubmitting
    }
};
