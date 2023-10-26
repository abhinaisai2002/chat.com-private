import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { BsGoogle } from "react-icons/bs";
import { ImCross } from "react-icons/im";
import { Checkbox } from "@/components/ui/checkbox";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { loginZod } from "@/components/zod/user";
import { useTheme } from "next-themes";
import Head from "next/head";
import Link from "next/link";
import axios from "axios";
import { useSetRecoilState } from "recoil";
import { alertDialog } from "@/components/atoms/alertDialogAtom";
function Login() {
  const [showPassword, setShowPassword] = React.useState(false);

  const { setTheme } = useTheme();

  const emailRef = React.useRef();
  const passwordRef = React.useRef();

  const [loading, setLoading] = React.useState(false);

  const setAlertDialog = useSetRecoilState(alertDialog);

  const router = useRouter();

  const [error, setError] = React.useState({
    show: false,
    message: "",
  });

  React.useEffect(() => {
    setTheme("light");
  }, [setTheme]);

  function handleSubmit(e) {
    e.preventDefault();

    setError({
      show: false,
      message: "",
    });
    setLoading(true);

    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    let results = loginZod.safeParse({ email, password });

    if (!results.success) {
      setError({
        show: true,
        message: "Ensure the details are in right format",
      });
      setLoading(false);
      return;
    }

    axios
      .post("/api/auth/signup", {
        email,
        password,
      })
      .then((res) => {
        // console.log(res);
        setAlertDialog({
          show: true,
          title: "User created successfully",
          description: "",
        });
      })
      .catch((err) => {
        setError({ show: true, message: err.response.data.message });
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function handleCheckBox() {
    setShowPassword((p) => !p);
  }

  function handleLoginGoogle() {
    signIn("google", { callbackUrl: "/" });
  }

  return (
    <div className="h-full flex flex-col justify-center items-center bg-gray-100">
      <Head>
        <title>Chat.com | Login</title>
      </Head>
      <div className="m-2 overflow:m-0">
        <h4 className="text-2xl font-bold">Chat.com</h4>
      </div>
      <div className="m-2">
        <h2 className="text-5xl tracking-tight">Welcome back</h2>
      </div>
      <div className="m-8 w-128 py-8 border-2 rounded-lg bg-white flex flex-col items-center">
        <form className="w-4/5" onSubmit={handleSubmit}>
          <div className="grid w-full mb-8  items-center ">
            <Label className="w-full text-2xl mb-2" htmlFor="email">
              Email address
            </Label>
            <Input
              ref={emailRef}
              className="w-full text-2xl py-2"
              type="text"
              id="email"
              placeholder="john.doe@example.com"
            />
          </div>
          <div className="grid w-full mb-8 items-center ">
            <Label
              className="w-full text-2xl mb-2 flex justify-between "
              htmlFor="Password"
            >
              <span>Password</span>
            </Label>

            <Input
              className=" text-2xl mb-2"
              ref={passwordRef}
              type={showPassword ? "text" : "password"}
              id="Password"
              placeholder="•••••••••••••"
            />
            <div className="flex items-center space-x-2">
              <Checkbox onClick={handleCheckBox} id="terms" />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Show password
              </label>
            </div>
          </div>
          {error.show && (
            <Alert
              variant="destructive"
              className="mb-4 bg-red-100 border-0 outline-none"
            >
              <AlertDescription className="text-red-900 font-semibold flex items-center text-xl">
                <ImCross className="mr-4" />
                {error.message}
              </AlertDescription>
            </Alert>
          )}
          <div className="grid w-full mb-8  items-center ">
            <Button className="text-1xl" disabled={loading}>
              Sign up
            </Button>
          </div>
          <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"></hr>
          <div className="grid w-full mb-8  items-center ">
            <Button
              type="button"
              className="bg-white text-1xl text-black  border-black hover:bg-gray-100"
              onClick={handleLoginGoogle}
            >
              <BsGoogle className="mr-4" />
              Sign in with Google
            </Button>
          </div>
        </form>
      </div>
      <div className="w-128 ">
        <div className="w-full flex flex-row justify-around">
          <div className="font-bold">
            <Link href="/auth/login">Sign in your account</Link>
          </div>
          <div className="font-bold">
            <Link href="/auth/verify">Verify your account</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
