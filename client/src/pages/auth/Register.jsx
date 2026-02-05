import React, { useState } from "react";
import "./Auth.scss";
import {
  Card,
  Input,
  Button,
  Typography,
  Spinner,
} from "@material-tailwind/react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import appLogo from "../../assets/icons/logo.png";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";

const APP_SERVER = import.meta.env.VITE_APP_SERVER;

const Register = () => {
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(false);
  const [inputNameError, setNameError] = useState(false);
  const [inputEmailError, setEmailError] = useState(false);

  const navigate = useNavigate();

  const handleInput = (e, setter) => {
    setter(e.target.value);
    if (e.target.value) {
      setEmailError(false);
      setNameError(false);
    }
  };

  const validateInput = () => {
    if (!email.includes("@")) {
      toast("Please enter a valid email!", { icon: "⚠️" });
      setEmailError(true);
      return false;
    }

    if (userName.length < 4) {
      toast("Username should be at least 4 characters", { icon: "⚠️" });
      setNameError(true);
      return false;
    }

    return true;
  };

  const handleRegistration = async (e) => {
    e.preventDefault();
    if (!validateInput()) return;

    setLoading(true);

    try {
      const checkResp = await Axios.post(
 //       `${APP_SERVER}/api/auth/check`,
          `${APP_SERVER}/auth/check`,
        { email }
      );

      if (checkResp.data.status) {
        toast("User already exists", { icon: "⚠️" });
        setLoading(false);
        return;
      }

      const registerResp = await Axios.post(
      //  `${APP_SERVER}/api/auth/register`,
        `${APP_SERVER}/auth/register`,
        { email, userName }
      );

      if (registerResp.status === 201) {
        toast.success("Registration Successful");
        navigate("/login");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong!"
      );
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <Toaster />

      <div className="auth-con">
        <div className="left-con">
          <img
            src={appLogo}
            alt="logo"
            className="w-24 lg:w-30 self-start cursor-pointer"
            onClick={() => navigate("/")}
          />

          <Card color="transparent" shadow={false}>
            <Typography variant="h4" color="blue-gray">
              Sign Up
            </Typography>

            <Typography color="gray" className="mt-1">
              Enter your details to register.
            </Typography>

            <form
              className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96"
              onSubmit={handleRegistration}
            >
              <div className="mb-4 flex flex-col gap-6">
                <Input
                  size="lg"
                  label="Name"
                  error={inputNameError}
                  onChange={(e) => handleInput(e, setUserName)}
                />

                <Input
                  size="lg"
                  label="Email"
                  error={inputEmailError}
                  onChange={(e) => handleInput(e, setEmail)}
                />
              </div>

              <Button
                className="mt-6 bg-cblack hover:shadow-sd flex justify-center"
                fullWidth
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <Spinner color="white" className="h-4 w-4" />
                ) : (
                  "Sign up"
                )}
              </Button>

              <Typography
                color="gray"
                className="mt-4 text-center font-normal"
              >
                Already have an account?{" "}
                <span
                  className="font-medium text-blue-500 cursor-pointer hover:text-blue-700"
                  onClick={() => navigate("/login")}
                >
                  Log In
                </span>
              </Typography>
            </form>
          </Card>

          <p className="text-center text-gray-500 text-xs">
            &copy;2024 Insta Lern
          </p>
        </div>

        <div className="right-con" />
      </div>
    </motion.div>
  );
};

export default Register;
