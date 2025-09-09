import React, { FC, useEffect, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from "yup";
import { FcGoogle } from 'react-icons/fc';
import { AiOutlineEye, AiOutlineEyeInvisible, AiFillGithub } from 'react-icons/ai';
import { styles } from '../../styles/styles';
import { useRegisterMutation } from '@/redux/features/auth/authApi';
import toast from 'react-hot-toast';


type Props = {
  setRoute: (route: string) => void;
}

const schema = Yup.object().shape({
  name: Yup.string().required("Please Enter Your Name"),
  email: Yup.string().email("Invalid email!").required("Please enter your email"),
  password: Yup.string().required("Please enter your password!").min(8)
})

const SignUp: FC<Props> = ({ setRoute }) => {

  const [show, setShow] = useState(false);
  const [register, { data, error, isSuccess }] = useRegisterMutation();

  useEffect(() => {
    if (isSuccess) {
      const message = data?.message || "Registration Successfully";
      toast.success(message);
      setRoute("Verfication");
    }

    if (error && typeof error === "object" && "data" in error) {
      const err = error as { data?: { message?: string } };
      const errorMessage = err.data?.message || "Something went wrong";
      toast.error(errorMessage);
    }
  }, [isSuccess, error]);

  const formik = useFormik({
    initialValues: { name: "", email: "", password:"" },
    validationSchema: schema,
    onSubmit: async ({ name, email, password }) => {
      const data = {
        name, email, password
      };
      await register(data)
    },
  })

  const { errors, touched, values, handleChange, handleSubmit } = formik;


  return (
    <div className='w-full'>
      <h1 className={`${styles.title}`}>
        Join to E-Learning
      </h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className={`${styles.label}`} htmlFor="name">
            Enter Your Name
          </label>
          <input
            type="text"
            name="name"
            value={values.name}
            onChange={handleChange}
            id="name"
            placeholder="Jhone Doe"
            className={`${errors.name && touched.name && "border-red-500"} ${styles.input
              }`}
          />
          {errors.name && touched.name && (
            <span className="text-red-500 pt-2 block">{errors.name}</span>
          )}
        </div>

        <label
          className={`${styles.label}`}
          htmlFor='email'
        >
          Enter your email
        </label>
        <input
          type="email"
          name="email"
          value={values.email}
          onChange={handleChange}
          id="email"
          placeholder="Enter you email"
          className={`${errors.email && touched.email && "border-red-500"} ${styles.input
            }`}
        />
        {errors.email && touched.email && (
          <span className="text-red-500 pt-2 block">{errors.email}</span>
        )}
        <div className='w-full mt-5 relative mb-1'>
          <label className={`${styles.label}`} htmlFor="email">
            Enter Your Password
          </label>
          <input
            type={!show ? "password" : "text"}
            name="password"
            value={values.password}
            onChange={handleChange}
            id="password"
            placeholder="Enter your password"
            className={`${errors.password && touched.password && "border-red-500"
              } ${styles.input}`}
          />
          {!show ? (
            <AiOutlineEyeInvisible
              className="absolute bottom-3 right-2 z-1 cursor-pointer"
              size={20}
              onClick={() => setShow(true)}
            />
          ) : (
            <AiOutlineEye
              className="absolute bottom-3 right-2 z-1 cursor-pointer"
              size={20}
              onClick={() => setShow(false)}
            />
          )}
          {errors.password && touched.password && (
            <span className="text-red-500 pt-2 block">{errors.password}</span>
          )}
        </div>


        <div className="w-full mt-5">
          <input type="submit" value="Sign-Up" className={`${styles.button}`} />
        </div>

        <h5 className="text-center pt-4 font-Poppins text-[14px] text-black dark:text-white">
          Or Join With
        </h5>
        <div className="flex items-center justify-center my-3 ">
          <FcGoogle
            className="cursor-pointer mr-2"
            size={30}
          // onClick={() => signIn("google")}
          />
          <AiFillGithub
            className="cursor-pointer mr-2"
            size={30}
          // onClick={() => signIn("github")}
          />
        </div>
        <h5 className="text-center pt-4 font-Poppins text-[14px]">
          Already have an account?{" "}
          <span
            className="text-[#2190ff] pl-1 cursor-pointer"
            onClick={() => setRoute("Login")}
          >
            Sign-In
          </span>
        </h5>

      </form>
    </div>
  )
}


export default SignUp