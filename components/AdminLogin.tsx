import Link from "next/link";
import { useEffect } from "react";
import { fr } from 'date-fns/locale'
import { addDays, subDays, format } from 'date-fns';
import { useAppActions, useAppState } from "../store";
import { useRouter } from "next/router";
import { EventType, UserType } from "../store/store.model";
import * as Yup from 'yup';
import { ErrorMessage, Field, FieldArray, Form, Formik } from "formik";

interface AdminLoginType {
}

const initialValues = {
    email: '',
    password: '',
}

const loginSchema = Yup.object().shape({
    email: Yup.string().trim().email('Email Invalide').required('Requis'),
    password: Yup.string(),
})

const AdminLogin = ({ }: AdminLoginType) => {
    const changeIsAdmin = useAppActions(actions => actions.changeIsAdmin)
    return (
        <div 
            className={`card-drop-shadow w-5/6 md:w-1/2 self-center flex flex-col items-center bg-white rounded-2xl`}
        >
        <Formik
            initialValues={initialValues}
            onSubmit={(values, { setSubmitting }) => {
                const emails = ['coordinationepm.republique@gmail.com', 'prattjames4@gmail.com']
                const passwords = ['epmcoordination', 'test']
                if (emails.includes(values.email) && passwords.includes(values.password)) {
                    changeIsAdmin(true)
                }
            }}
            validationSchema={loginSchema}
        >
            {({ 
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting,
            }) => (
                <Form className="w-full flex flex-col px-10 pb-10 space-y-4">
                    <p className="w-full flex items-center align-middle text-title-orange font-extrabold text-xl pt-5 mb-6">
                        Se connecter
                    </p>
                    <div className="flex flex-col space-y-4">
                        <div className="flex flex-col">
                            <label className="text-gray-500 font-bold text-sm ml-2" htmlFor={`email`}>Email</label>
                            <Field className="bg-input-orange h-11 rounded-lg pl-4" type="email" name={`email`} placeholder="martin@gmail.com" />
                            <ErrorMessage className="text-tag-orange" component="span" name={`email`} />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-gray-500 font-bold text-sm ml-2" htmlFor={`password`}>Mot de passe</label>
                            <Field className="bg-input-orange h-11 rounded-lg pl-4" type="password" name={`password`} placeholder="******" />
                            <ErrorMessage className="text-tag-orange" component="span" name={`password`} />
                        </div>
                    </div>
                    <button className="urbanist suggest font-black text-white py-2 rounded-lg mb-6" type="submit" disabled={isSubmitting}>
                        CONNEXION
                    </button>
                </Form>
            )}
        </Formik>
        </div>
    )
}

export default AdminLogin;