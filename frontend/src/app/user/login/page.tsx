"use client"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

import { useState, useEffect } from "react"

export default function UserLoginPage(){

    const [signupButtonDisabled, setSignupButtonDisabled] = useState<boolean>(true)
    

    const [signupFullName, setSignupFullName] = useState<string>("");
    const [signupEmail, setSignupEmail] = useState<string>("");
    const [signupPassword, setSignupPassword] = useState<string>("");
    const [signupConfirmPassword, setSignupConfirmPassword] = useState<string>("");
    const [signupPhone, setSignupPhone] = useState<string>("");

    useEffect(()=>{
        if(signupFullName.trim()!="" && signupEmail.trim()!="" && signupPhone.trim() !="" && signupPassword.trim()!="" && signupConfirmPassword.trim()!="" && signupPassword==signupConfirmPassword){
            setSignupButtonDisabled(false);
        }
        else{
            setSignupButtonDisabled(true);
        }

    },[signupFullName,signupEmail,signupPassword, signupConfirmPassword, signupPhone])

    const [loginButtonDisabled, setLoginButtonDisabled] = useState<boolean>(true)
    


    const [loginEmail, setLoginEmail] = useState<string>("");
    const [loginPassword, setLoginPassword] = useState<string>("");

    useEffect(()=>{
        if(loginEmail.trim()!="" && loginPassword.trim()!=""){
            setLoginButtonDisabled(false);
        }
        else{
            setLoginButtonDisabled(true);
        }

    },[loginEmail,loginPassword])

    async function handleSignup(){

        setSignupButtonDisabled(true);
        
        const payload = {
            customer_full_name: signupFullName,
            customer_email: signupEmail,
            customer_password: signupPassword,
            customer_phone: signupPhone
        }


        try{
            const response = await fetch('/api/user/signup', {
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(payload)
            })


            const data = await response.json()

            if(data.error){
                console.log(data.error);
                alert(data.error)
            }

            else if(data.success){
                alert("Signup Successful");
                window.location.href = '/user/home'
            }
        }
        catch(error){
            console.log(error);
            alert(error);
        }
        finally{
            setSignupButtonDisabled(false)
        }

    }

    async function handleLogin(){
        setLoginButtonDisabled(true);
        
        const payload = {
            customer_email: loginEmail,
            customer_password: loginPassword,
        }


        try{
            const response = await fetch('/api/user/login', {
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(payload)
            })

            console.log(response)

            const data = await response.json()

            if(data.error){
                console.log(data.error);
                alert(data.error)
            }

            else if(data.success){
                alert("Login Successful");
                window.location.href = '/user/home'
            }
        }
        catch(error){
            console.log(error);
            alert(error);
        }
        finally{
            setLoginButtonDisabled(false)
        }
    }



    return(
        <>
            <div className="border border-black w-full min-h-full flex justify-center items-center" style={{minHeight:"calc(100vh - 5rem)"}}>
                <Tabs defaultValue="account" className="w-[400px]">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="signup">Signup</TabsTrigger>
                        <TabsTrigger value="login">Login</TabsTrigger>
                    </TabsList>
                    <TabsContent value="signup">
                        <Card>
                        <CardHeader>
                            <CardTitle>Signup</CardTitle>
                            <CardDescription>
                                Signup by filling the following information
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="space-y-1">
                            <Label htmlFor="signup_full_name">Full Name</Label>
                            <Input id="signup_full_name" value={signupFullName} onChange={(e)=>setSignupFullName(e.target.value)} placeholder="First Middle Last" />
                            </div>
                            <div className="space-y-1">
                            <Label htmlFor="signup_email">Email</Label>
                            <Input id="signup_email" type="email" value={signupEmail} onChange={(e)=>setSignupEmail(e.target.value)} placeholder="example@domain.com" />
                            </div>
                            <div className="space-y-1">
                            <Label htmlFor="signup_phone">Phone No.</Label>
                            <Input id="signup_phone" type="email" value={signupPhone} onChange={(e)=>setSignupPhone(e.target.value)} placeholder="Enter Phone No." />
                            </div>

                            <div className="space-y-1">
                            <Label htmlFor="signup_password">Password</Label>
                            <Input id="signup_password" type="password" value={signupPassword} onChange={(e)=>setSignupPassword(e.target.value)} placeholder="Insert Secure Password Here" />
                            </div>
                            <div className="space-y-1">
                            <Label htmlFor="signup_confirm_password">Confirm Password</Label>
                            <Input id="signup_confirm_password" type="password" value={signupConfirmPassword} onChange={(e)=>setSignupConfirmPassword(e.target.value)} placeholder="Insert the above password" />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button disabled={signupButtonDisabled} onClick={async (e)=>{await handleSignup()}}>Signup</Button>
                        </CardFooter>
                        </Card>
                    </TabsContent>
                    <TabsContent value="login">
                        <Card>
                        <CardHeader>
                            <CardTitle>Login</CardTitle>
                            <CardDescription>
                                Login by filling the following information
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="space-y-1">
                            <Label htmlFor="login_email">Email</Label>
                            <Input id="login_email" type="email" value={loginEmail} onChange={(e)=>setLoginEmail(e.target.value)} placeholder="example@domain.com" />
                            </div>
                            <div className="space-y-1">
                            <Label htmlFor="login_password">Password</Label>
                            <Input id="login_password" type="password" value={loginPassword} onChange={(e)=>setLoginPassword(e.target.value)} placeholder="Enter Password here" />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button disabled={loginButtonDisabled} onClick={handleLogin}>Login</Button>
                        </CardFooter>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </>

    )

}